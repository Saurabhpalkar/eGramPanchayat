<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
        'name' => 'required|string|min:3',
        'ward_id' => 'required',
        'password' => 'required|min:6|confirmed',
        'dob' => 'nullable|date',
        'gender' => 'nullable|in:male,female,other',
        'aadhaar_number' => 'required|digits:12|unique:users,aadhaar_number',
        'mobile' => 'required|digits:10|unique:users,mobile',
        'email' => 'required|email|unique:users,email',
            
    ];
    }
}
