<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\SendOtpRequest;
use App\Http\Requests\VerifyOtpRequest;
use Illuminate\Support\Facades\Cache;
use Psy\Readline\Hoa\Console;
use Illuminate\Support\Facades\Log;
class AuthController extends Controller
{
    use ApiResponseTrait;

    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * User login
     */
    public function login(LoginRequest $request)
    {
        $result = $this->authService->login($request->validated());
        if (! $result['success']) {
            return $this->unauthorizedResponse($result['message']);
        }

        return $this->successResponse(
            $result['data'],
            $result['message']
        );
    }

    /**
     * Get authenticated user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user();

        return $this->successResponse([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'roles' => $user->getRoleNames(),
        ], 'Profile fetched successfully.');
    }

    /**
     * Logout current user
     */
    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return $this->successResponse(
            null,
            'Logged out successfully.'
        );
    }

    public function sendOtp(SendOtpRequest $request)
    {

        $validated = $request->validated();
        $mobile_or_aadhaar = $validated['mobile_or_aadhaar'];
        $user = User::where('mobile', $mobile_or_aadhaar)
            ->orWhere('aadhaar_number', $mobile_or_aadhaar)
            ->first();
         if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Mobile number or Aadhaar number is not registered.',
            ], 404);
        }
        $otp = random_int(1000, 9999);
        Cache::put('otp_' . $mobile_or_aadhaar, $otp, now()->addMinutes(5));
        // Log::info('otp for'. $user->mobile_or_aadhaar.' is '.$otp);
        // Cache::put('otp_' . $user->mobile_or_aadhaar, $otp, now()->addMinutes(5));
        Log::info('OTP for ' . $mobile_or_aadhaar . ' is ' . $otp);

          return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully.',
            'data' => [
                'otp' => $otp, // For testing purposes; remove in production
            ],
        ]);
        
    }
    public function verifyOtp(VerifyOtpRequest $request)
    {
        $input = $request->mobile_or_aadhaar;
        $otp = $request->otp;

        $cachedOtp = Cache::get('otp_' . $input);

        if (! $cachedOtp) {
            return response()->json([
                'success' => false,
                'message' => 'OTP expired or not found.',
            ], 400);
        }

        if ($cachedOtp != $otp) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP.',
            ], 400);
        }

        Cache::forget('otp_' . $input);

        $user = User::where('mobile', $input)
                    ->orWhere('aadhaar_number', $input)
                    ->first();

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'mobile' => $user->mobile,
                ],
                'roles' => $user->getRoleNames(),
            ],
        ]);
    }
    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'password' => Hash::make($validated['password']),
            'mobile' => $validated['mobile'],
            'aadhaar_number' => $validated['aadhaar_number'] ?? null,
            'ward_id' => $validated['ward_id'] ?? null,
            'dob' => $validated['dob'] ?? null,
            'gender' => $validated['gender'] ?? null,
            
            
        ]);

        $user->assignRole('user');

        return response()->json([
            'success' => true,
            'message' => 'Citizen registered successfully',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
            ],
        ], 201);
    }
}