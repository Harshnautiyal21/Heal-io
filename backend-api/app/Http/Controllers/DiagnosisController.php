<?php

namespace App\Http\Controllers;

use App\Models\Diagnosis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DiagnosisController extends Controller
{
    private $aiServiceUrl;

    public function __construct()
    {
        $this->aiServiceUrl = env('AI_SERVICE_URL', 'http://ai-service:8000');
    }

    /**
     * Analyze image for diagnosis
     */
    public function analyzeImage(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,jpg,png|max:10240', // 10MB
            ]);

            // Forward request to AI service
            $response = Http::timeout(120)->attach(
                'image',
                file_get_contents($request->file('image')->getRealPath()),
                $request->file('image')->getClientOriginalName()
            )->post($this->aiServiceUrl . '/api/analyze/image');

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI service error',
                    'error' => $response->json()['error'] ?? 'Unknown error',
                ], $response->status());
            }

            $aiResult = $response->json();
            
            // Save diagnosis to database if user is authenticated
            $diagnosis = null;
            if ($request->user()) {
                $diagnosis = $this->saveDiagnosis(
                    $request->user()->id,
                    'image',
                    $aiResult['diagnosis']
                );
            }

            return response()->json([
                'success' => true,
                'diagnosis' => $aiResult['diagnosis'],
                'diagnosis_id' => $diagnosis ? $diagnosis->id : null,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Image analysis error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Analysis failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Analyze symptoms for diagnosis
     */
    public function analyzeSymptoms(Request $request)
    {
        try {
            $request->validate([
                'symptoms' => 'required|array',
            ]);

            // Forward request to AI service
            $response = Http::timeout(60)
                ->post($this->aiServiceUrl . '/api/analyze/symptoms', [
                    'symptoms' => $request->symptoms,
                ]);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI service error',
                    'error' => $response->json()['error'] ?? 'Unknown error',
                ], $response->status());
            }

            $aiResult = $response->json();
            
            // Save diagnosis to database if user is authenticated
            $diagnosis = null;
            if ($request->user()) {
                $diagnosis = $this->saveDiagnosis(
                    $request->user()->id,
                    'symptoms',
                    $aiResult['diagnosis']
                );
            }

            return response()->json([
                'success' => true,
                'diagnosis' => $aiResult['diagnosis'],
                'diagnosis_id' => $diagnosis ? $diagnosis->id : null,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Symptom analysis error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Analysis failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Analyze combined (image + symptoms)
     */
    public function analyzeCombined(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,jpg,png|max:10240',
                'symptoms' => 'required|array',
            ]);

            // Forward request to AI service
            $response = Http::timeout(120)->attach(
                'image',
                file_get_contents($request->file('image')->getRealPath()),
                $request->file('image')->getClientOriginalName()
            )->post($this->aiServiceUrl . '/api/analyze/combined', [
                'symptoms' => json_encode($request->symptoms),
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI service error',
                    'error' => $response->json()['error'] ?? 'Unknown error',
                ], $response->status());
            }

            $aiResult = $response->json();
            
            // Save diagnosis to database if user is authenticated
            $diagnosis = null;
            if ($request->user()) {
                $diagnosis = $this->saveDiagnosis(
                    $request->user()->id,
                    'combined',
                    $aiResult['diagnosis']
                );
            }

            return response()->json([
                'success' => true,
                'diagnosis' => $aiResult['diagnosis'],
                'diagnosis_id' => $diagnosis ? $diagnosis->id : null,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Combined analysis error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Analysis failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get diagnosis history for authenticated user
     */
    public function getHistory(Request $request)
    {
        try {
            $diagnoses = $request->user()
                ->diagnoses()
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'diagnoses' => $diagnoses,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve history',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get specific diagnosis by ID
     */
    public function getDiagnosis(Request $request, $id)
    {
        try {
            $diagnosis = Diagnosis::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'diagnosis' => $diagnosis,
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Diagnosis not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve diagnosis',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Helper method to save diagnosis to database
     */
    private function saveDiagnosis($userId, $type, $diagnosisData)
    {
        return Diagnosis::create([
            'user_id' => $userId,
            'type' => $type,
            'disease' => $diagnosisData['disease'] ?? null,
            'confidence' => $diagnosisData['confidence'] ?? 0,
            'severity' => $diagnosisData['severity'] ?? null,
            'description' => $diagnosisData['description'] ?? null,
            'explanation' => $diagnosisData['explanation'] ?? '',
            'recommendations' => $diagnosisData['recommendations'] ?? [],
            'alternative_diagnoses' => $diagnosisData['alternative_diagnoses'] ?? [],
            'image_path' => $diagnosisData['image_path'] ?? null,
            'heatmap_path' => $diagnosisData['heatmap_path'] ?? null,
            'symptoms_data' => $diagnosisData['matched_symptoms'] ?? null,
            'analysis_method' => $diagnosisData['analysis_method'] ?? null,
        ]);
    }
}
