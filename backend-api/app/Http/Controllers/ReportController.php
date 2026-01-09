<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    /**
     * Generate PDF report for diagnosis
     */
    public function generatePDF(Request $request)
    {
        try {
            $request->validate([
                'diagnosis' => 'required|array',
                'patient_name' => 'string',
            ]);

            $diagnosisData = $request->diagnosis;
            $patientName = $request->patient_name ?? 'Patient';
            
            // Prepare data for PDF
            $data = [
                'title' => 'Heal-Io Diagnostic Report',
                'date' => now()->format('F d, Y'),
                'time' => now()->format('h:i A'),
                'patient_name' => $patientName,
                'diagnosis' => $diagnosisData,
            ];

            // Generate PDF
            $pdf = Pdf::loadView('reports.diagnosis', $data);
            
            // Return PDF as download
            return $pdf->download('heal-io-diagnosis-report-' . now()->format('Y-m-d') . '.pdf');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'PDF generation failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
