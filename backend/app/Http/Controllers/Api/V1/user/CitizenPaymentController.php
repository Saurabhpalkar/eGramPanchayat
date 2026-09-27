<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentsOrderRequest;
use App\Http\Requests\VerifyPaymentRequest;
use App\Models\Application;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Razorpay\Api\Api;

class CitizenPaymentController extends Controller
{
    public function createOrder(PaymentsOrderRequest $request)
    {
        $user = $request->user();

        /*
        |--------------------------------------------------------------------------
        | 1. Find application belonging to logged-in user
        |--------------------------------------------------------------------------
        */

        $application = Application::with('service')
            ->where('id', $request->application_id)
            ->where('user_id', $user->id)
            ->first();

        if (! $application) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found.',
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Check whether payment already exists
        |--------------------------------------------------------------------------
        */

        $existingPayment = $application->payment;

        if ($existingPayment && $existingPayment->status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Payment has already been completed for this application.',
            ], 409);
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Get amount from service
        |--------------------------------------------------------------------------
        */

        $serviceFees = (float) $application->service->fee;
        $portalFees = 10;
        $amount  = $serviceFees + $portalFees;
        if ($amount <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid service fee.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | 4. Convert rupees to paise
        |--------------------------------------------------------------------------
        */

        $amountInPaise = (int) round($amount * 100);

        /*
        |--------------------------------------------------------------------------
        | 5. Create Razorpay order
        |--------------------------------------------------------------------------
        */

        $api = new Api(
            config('services.razorpay.key'),
            config('services.razorpay.secret')
        );

        $razorpayOrder = $api->order->create([
            'receipt' => $application->application_no,
            'amount' => $amountInPaise,
            'currency' => 'INR',
        ]);

        /*
        |--------------------------------------------------------------------------
        | 6. Save payment in database
        |--------------------------------------------------------------------------
        */

        if ($existingPayment) {

            $payment = $existingPayment;

            $payment->update([
                'amount' => $amount,
                'gateway' => 'razorpay',
                'order_id' => $razorpayOrder['id'],
                'status' => 'created',
            ]);
        } else {

            $payment = Payment::create([
                'application_id' => $application->id,
                'amount' => $amount,
                'gateway' => 'razorpay',
                'order_id' => $razorpayOrder['id'],
                'status' => 'created',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | 7. Return order information to frontend
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,
            'message' => 'Payment order created successfully.',
            'data' => [
                'payment' => [
                    'id' => $payment->id,
                    'application_id' => $payment->application_id,
                    'amount' => $payment->amount,
                    'gateway' => $payment->gateway,
                    'order_id' => $payment->order_id,
                    'status' => $payment->status,
                ],
                'breakdown' => [
                    "service_fee" => $serviceFees,
                    "portal_fee" => $portalFees,
                    "total" => $amountInPaise,
                ],
                'razorpay' => [
                    'key' => config('services.razorpay.key'),
                    'order_id' => $razorpayOrder['id'],
                    'amount' => $amountInPaise,
                    'currency' => 'INR',
                ],

                'application' => [
                    'id' => $application->id,
                    'application_no' => $application->application_no,
                ],
            ],
        ], 201);
    }
  public function verifyPayment(VerifyPaymentRequest $request)
{
    $user = $request->user();

    DB::beginTransaction();

    try {

        // 1. Get only the logged-in user's application
        $application = $user->applications()
            ->with('service')
            ->findOrFail($request->application_id);

        // 2. Find the payment created for this Razorpay order
        $payment = Payment::where('application_id', $application->id)
            ->where('order_id', $request->razorpay_order_id)
            ->firstOrFail();

        // 3. Generate Razorpay signature
        $generatedSignature = hash_hmac(
            'sha256',
            $request->razorpay_order_id . '|' . $request->razorpay_payment_id,
            config('services.razorpay.secret')
        );

        // 4. Verify signature
        if (!hash_equals(
            $generatedSignature,
            $request->razorpay_signature
        )) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed.',
            ], 400);
        }

        // 5. Prevent duplicate verification
        if ($payment->status === 'paid') {

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment already verified.',
                'data' => [
                    'application' => $application,
                    'payment' => $payment,
                ],
            ]);
        }

        // 6. Update payment
        $payment->update([
            'payment_id' => $request->razorpay_payment_id,
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        DB::commit();

        // 7. Reload latest data
        $application->load('service');

        return response()->json([
            'success' => true,
            'message' => 'Payment verified successfully.',
            'data' => [
                'application' => $application,
                'payment' => $payment,
            ],
        ], 200);

    } catch (\Throwable $e) {

        DB::rollBack();

        return response()->json([
            'success' => false,
            'message' => 'Payment verification failed.',
            'error' => $e->getMessage(),
        ], 500);
    }
}
}
