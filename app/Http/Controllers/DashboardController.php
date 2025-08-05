<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\SparePart;
use App\Models\UsageHistory;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $user = auth()->user();

        // Get basic statistics
        $totalParts = SparePart::count();
        $lowStockParts = SparePart::lowStock()->count();
        $outOfStockParts = SparePart::where('quantity', 0)->count();
        $totalValue = SparePart::selectRaw('SUM(quantity * price) as total')->value('total') ?? 0;

        // Get recent usage history
        $recentUsage = UsageHistory::with(['sparePart', 'user'])
                                  ->latest()
                                  ->take(5)
                                  ->get();

        // Get low stock items
        $lowStockItems = SparePart::lowStock()
                                 ->orderBy('quantity', 'asc')
                                 ->take(10)
                                 ->get();

        // Admin-specific data
        $adminData = [];
        if ($user->isAdmin()) {
            $adminData = [
                'totalUsers' => User::count(),
                'recentUsers' => User::latest()->take(5)->get(),
                'usageStats' => UsageHistory::selectRaw('DATE(created_at) as date, COUNT(*) as count')
                                          ->where('created_at', '>=', now()->subDays(7))
                                          ->groupBy('date')
                                          ->orderBy('date')
                                          ->get(),
            ];
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'totalParts' => $totalParts,
                'lowStockParts' => $lowStockParts,
                'outOfStockParts' => $outOfStockParts,
                'totalValue' => $totalValue,
            ],
            'recentUsage' => $recentUsage,
            'lowStockItems' => $lowStockItems,
            'adminData' => $adminData,
        ]);
    }
}