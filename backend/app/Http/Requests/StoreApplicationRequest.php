<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'service_id' => [
                'required',
                'integer',
                'exists:services,id',
            ],

            'applicant_name' => [
                'required',
                'string',
                'max:255',
            ],

            'aadhaar_no' => [
                'required',
                'digits:12',
            ],

            'mobile' => [
                'required',
                'digits:10',
            ],

            'email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'ward_no' => [
                'required',
                'integer',
            ],

            'address' => [
                'required',
                'string',
                'max:500',
            ],
            'payment_method' => [
                'required',
                'in:UPI,NETBANKING,OFFICE_CASH',
            ],

            // Documents

            'aadhaar' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,pdf',
                'max:2048',
            ],

            'residence' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,pdf',
                'max:2048',
            ],

            'self' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,pdf',
                'max:2048',
            ],

            'tax' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,pdf',
                'max:2048',
            ],

        ];
    }
}
