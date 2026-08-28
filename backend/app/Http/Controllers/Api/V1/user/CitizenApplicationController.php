<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use App\Http\Resources\ApplicationResource;
use App\Http\Requests\StoreApplicationRequest;
use App\Models\Application;
use App\Models\ApplicationDocument;

class CitizenApplicationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $allApplications = $user->applications()
            ->with('service', 'user')
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            // Search by application number
            ->when($request->search, function ($query, $search) {
                $query->where('application_no', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10);
        $counts = [
            'total' => $user->applications()->count(),
            'pending' => $user->applications()->where('status', 'pending')->count(),
            'approved' => $user->applications()->where('status', 'approved')->count(),
            'in_progress' => $user->applications()->where('status', 'in_progress')->count(),
            'rejected' => $user->applications()->where('status', 'rejected')->count(),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Citizen application data retrieved successfully.',
            'all_applications' => ApplicationResource::collection($allApplications),
            'counts' => $counts,
            'user' => $user,
            'pagination' => [
                'current_page' => $allApplications->currentPage(),
                'last_page' => $allApplications->lastPage(),
                'per_page' => $allApplications->perPage(),
                'total' => $allApplications->total(),
            ],

        ]);
    }
    public function store(StoreApplicationRequest $request)
    {
        $user = $request->user();

        DB::beginTransaction();

        try {

            // 1. Create application
            $application = Application::create([
                'application_no' => 'APP' . random_int(100000, 999999),
                'user_id'        => $user->id,
                'service_id'     => $request->service_id,
                'status'         => 'pending',
                'applied_date'   => now()->toDateString(),
                'due_date'       => null,
                'approved_date'  => null,
                'remarks'        => null,
            ]);

            // 2. Uploaded documents
            $documents = [
                'aadhaar'   => $request->file('aadhaar'),
                'residence' => $request->file('residence'),
                'self'      => $request->file('self'),
                'tax'       => $request->file('tax'),
            ];

            // 3. Store documents
            foreach ($documents as $documentType => $file) {

                if (!$file) {
                    continue;
                }

                // Generate unique filename
                $storedName = Str::uuid() . '.' . $file->getClientOriginalExtension();

                // Store physical file
                $filePath = $file->storeAs(
                    'applications/' . $application->id,
                    $storedName,
                    'public'
                );

                // Store document information in database
                ApplicationDocument::create([
                    'application_id' => $application->id,
                    'document_type'  => $documentType,
                    'original_name'  => $file->getClientOriginalName(),
                    'stored_name'    => $storedName,
                    'file_path'      => $filePath,
                    'mime_type'      => $file->getMimeType(),
                    'file_size'      => $file->getSize(),
                ]);
            }

            DB::commit();

            // Load documents for response
            $application->load('documents');

            return response()->json([
                'success' => true,
                'message' => 'Application submitted successfully.',
                'data' => [
                    'application' => $application,
                ],
            ], 201);
        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Application submission failed.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
