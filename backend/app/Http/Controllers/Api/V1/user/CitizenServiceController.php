<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class CitizenServiceController extends Controller
{
    public function index(Request $request){
        $services = Service::where('is_active', true)->orderBy('name_mr')->get();
        return response()->json([
            'success' => true,
            'message' => 'Services retrieved successfully.',
            'services' => $services,
        ]);
    }
}
