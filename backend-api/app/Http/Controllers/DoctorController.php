<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DoctorController extends Controller
{
    /**
     * Mock doctor data for demonstration
     */
    private function getMockDoctors()
    {
        return [
            [
                'id' => 1,
                'name' => 'Dr. Sarah Johnson',
                'specialty' => 'Dermatology',
                'qualifications' => 'MD, FAAD',
                'experience_years' => 15,
                'rating' => 4.8,
                'address' => '123 Medical Plaza, New York, NY 10001',
                'phone' => '+1 (555) 123-4567',
                'email' => 'dr.johnson@dermatology.com',
                'availability' => 'Mon-Fri: 9AM-5PM',
                'accepts_new_patients' => true,
                'languages' => ['English', 'Spanish'],
                'distance_km' => 2.5,
            ],
            [
                'id' => 2,
                'name' => 'Dr. Michael Chen',
                'specialty' => 'Dermatology & Oncology',
                'qualifications' => 'MD, PhD',
                'experience_years' => 20,
                'rating' => 4.9,
                'address' => '456 Health Center, New York, NY 10002',
                'phone' => '+1 (555) 234-5678',
                'email' => 'dr.chen@skincare.com',
                'availability' => 'Mon-Thu: 8AM-6PM',
                'accepts_new_patients' => true,
                'languages' => ['English', 'Mandarin'],
                'distance_km' => 3.2,
            ],
            [
                'id' => 3,
                'name' => 'Dr. Emily Rodriguez',
                'specialty' => 'Pediatric Dermatology',
                'qualifications' => 'MD, FAAP, FAAD',
                'experience_years' => 12,
                'rating' => 4.7,
                'address' => '789 Children\'s Hospital, New York, NY 10003',
                'phone' => '+1 (555) 345-6789',
                'email' => 'dr.rodriguez@pediatricderm.com',
                'availability' => 'Tue-Sat: 10AM-4PM',
                'accepts_new_patients' => false,
                'languages' => ['English', 'Spanish', 'French'],
                'distance_km' => 4.1,
            ],
            [
                'id' => 4,
                'name' => 'Dr. James Williams',
                'specialty' => 'Dermatology & Cosmetic Surgery',
                'qualifications' => 'MD, FAAD, ASDS',
                'experience_years' => 18,
                'rating' => 4.6,
                'address' => '321 Wellness Avenue, New York, NY 10004',
                'phone' => '+1 (555) 456-7890',
                'email' => 'dr.williams@dermclinic.com',
                'availability' => 'Mon-Wed-Fri: 9AM-6PM',
                'accepts_new_patients' => true,
                'languages' => ['English'],
                'distance_km' => 5.8,
            ],
            [
                'id' => 5,
                'name' => 'Dr. Priya Patel',
                'specialty' => 'Dermatology',
                'qualifications' => 'MD, FAAD',
                'experience_years' => 10,
                'rating' => 4.9,
                'address' => '567 Medical Tower, New York, NY 10005',
                'phone' => '+1 (555) 567-8901',
                'email' => 'dr.patel@skinspecialist.com',
                'availability' => 'Mon-Fri: 8AM-5PM, Sat: 9AM-1PM',
                'accepts_new_patients' => true,
                'languages' => ['English', 'Hindi', 'Gujarati'],
                'distance_km' => 1.9,
            ],
        ];
    }

    /**
     * Search for doctors based on criteria
     */
    public function search(Request $request)
    {
        try {
            $doctors = $this->getMockDoctors();

            // Filter by specialty if provided
            if ($request->has('specialty')) {
                $specialty = strtolower($request->specialty);
                $doctors = array_filter($doctors, function($doctor) use ($specialty) {
                    return stripos(strtolower($doctor['specialty']), $specialty) !== false;
                });
            }

            // Filter by availability
            if ($request->has('accepts_new_patients')) {
                $acceptsNew = filter_var($request->accepts_new_patients, FILTER_VALIDATE_BOOLEAN);
                $doctors = array_filter($doctors, function($doctor) use ($acceptsNew) {
                    return $doctor['accepts_new_patients'] === $acceptsNew;
                });
            }

            // Filter by rating
            if ($request->has('min_rating')) {
                $minRating = floatval($request->min_rating);
                $doctors = array_filter($doctors, function($doctor) use ($minRating) {
                    return $doctor['rating'] >= $minRating;
                });
            }

            // Sort by distance
            if ($request->has('sort_by') && $request->sort_by === 'distance') {
                usort($doctors, function($a, $b) {
                    return $a['distance_km'] <=> $b['distance_km'];
                });
            }

            // Sort by rating
            if ($request->has('sort_by') && $request->sort_by === 'rating') {
                usort($doctors, function($a, $b) {
                    return $b['rating'] <=> $a['rating'];
                });
            }

            return response()->json([
                'success' => true,
                'doctors' => array_values($doctors),
                'total' => count($doctors),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Doctor search failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get specific doctor by ID
     */
    public function getDoctor($id)
    {
        try {
            $doctors = $this->getMockDoctors();
            $doctor = collect($doctors)->firstWhere('id', intval($id));

            if (!$doctor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Doctor not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'doctor' => $doctor,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve doctor information',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
