<?php

namespace App\Http\Controllers\Api\V1\user;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Http\Resources\ApplicationResource;
class CitizenDashboardController extends Controller
{
    //
    function index(Request $request)
    {
        $user = $request->user(); // Get the authenticated user
        $stats =[
            'total_applications' => Application::where('user_id', $user->id)->count(),
            'approved_applications' => Application::where('user_id', $user->id)->where('status', 'approved')->count(),
            'pending_applications' => Application::where('user_id', $user->id)->where('status', 'pending')->count(),
            'rejected_applications' => Application::where('user_id', $user->id)->where('status', 'rejected')->count(),
        ];
        $recentApplications = $user->applications()->with('service')->latest()->take(5)->get();
        return response()->json([
            'success' => true,
            'message' => 'Citizen dashboard data retrieved successfully.',
            'user' => $user,
            'stats' => $stats,
            'recent_applications' => ApplicationResource::collection($recentApplications),
            ]);
    }
}
