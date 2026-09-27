<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerifyPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'application_id' => [
                'required',
                'integer',
                'exists:applications,id',
            ],

            'razorpay_order_id' => [
                'required',
                'string',
            ],

            'razorpay_payment_id' => [
                'required',
                'string',
            ],

            'razorpay_signature' => [
                'required',
                'string',
            ],
        ];
    }
}