<?php

namespace App\Services;

use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ApplicationService
{
    public function create(array $data, User $user): Application
    {
        return DB::transaction(function () use ($data, $user) {

            /*
            |--------------------------------------------------------------------------
            | 1. Create Application
            |--------------------------------------------------------------------------
            */

            $application = Application::create([
                'user_id' => $user->id,
                'service_id' => $data['service_id'],

                'applicant_name' => $data['applicant_name'],
                'aadhaar_no' => $data['aadhaar_no'],
                'mobile' => $data['mobile'],
                'email' => $data['email'] ?? null,
                'ward_no' => $data['ward_no'],
                'address' => $data['address'],

                'payment_method' => $data['payment_method'],

                'status' => 'pending',
            ]);

            /*
            |--------------------------------------------------------------------------
            | 2. Store Documents
            |--------------------------------------------------------------------------
            */

            $documents = [
                'aadhaar' => $data['aadhaar'] ?? null,
                'residence' => $data['residence'] ?? null,
                'self' => $data['self'] ?? null,
                'tax' => $data['tax'] ?? null,
            ];

            foreach ($documents as $documentType => $file) {

                if (!$file) {
                    continue;
                }

                $storedName = Str::uuid()
                    . '.'
                    . $file->getClientOriginalExtension();

                $path = $file->storeAs(
                    'applications/' . $application->id,
                    $storedName,
                    'private'
                );

                ApplicationDocument::create([
                    'application_id' => $application->id,

                    'document_type' => $documentType,

                    'original_name' => $file->getClientOriginalName(),

                    'stored_name' => $storedName,

                    'file_path' => $path,

                    'mime_type' => $file->getMimeType(),

                    'file_size' => $file->getSize(),
                ]);
            }

            return $application->load('documents');
        });
    }
}