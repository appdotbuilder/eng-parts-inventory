<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\RecordUsageRequest;
use App\Models\SparePart;
use App\Models\UsageHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsageController extends Controller
{
    /**
     * Display a listing of usage history.
     */
    public function index(Request $request)
    {
        $query = UsageHistory::with(['sparePart', 'user']);

        // Filter by spare part
        if ($request->has('spare_part_id') && $request->spare_part_id) {
            $query->where('spare_part_id', $request->spare_part_id);
        }

        // Filter by user (admin only)
        if ($request->has('user_id') && $request->user_id && auth()->user()->isAdmin()) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $usageHistory = $query->latest()->paginate(15)->withQueryString();

        // Get spare parts for filter dropdown
        $spareParts = SparePart::select('id', 'name', 'code')
                              ->orderBy('name')
                              ->get();

        return Inertia::render('usage/index', [
            'usageHistory' => $usageHistory,
            'spareParts' => $spareParts,
            'filters' => $request->only(['spare_part_id', 'user_id', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Show the form for recording usage.
     */
    public function create(Request $request)
    {
        $sparePartId = $request->get('spare_part_id');
        $sparePart = null;

        if ($sparePartId) {
            $sparePart = SparePart::findOrFail($sparePartId);
        }

        $spareParts = SparePart::where('quantity', '>', 0)
                              ->orderBy('name')
                              ->get();

        return Inertia::render('usage/create', [
            'sparePart' => $sparePart,
            'spareParts' => $spareParts,
        ]);
    }

    /**
     * Store a newly recorded usage.
     */
    public function store(RecordUsageRequest $request)
    {
        $sparePart = SparePart::findOrFail($request->spare_part_id);

        // Check if sufficient quantity is available
        if ($sparePart->quantity < $request->quantity_used) {
            return back()->withErrors([
                'quantity_used' => 'Insufficient stock. Available: ' . $sparePart->quantity
            ]);
        }

        $quantityBefore = $sparePart->quantity;
        $quantityAfter = $quantityBefore - $request->quantity_used;

        // Create usage history record
        $usage = UsageHistory::create([
            'spare_part_id' => $sparePart->id,
            'user_id' => auth()->id(),
            'quantity_used' => $request->quantity_used,
            'quantity_before' => $quantityBefore,
            'quantity_after' => $quantityAfter,
            'purpose' => $request->purpose,
            'work_order' => $request->work_order,
            'notes' => $request->notes,
        ]);

        // Update spare part quantity
        $sparePart->reduceQuantity($request->quantity_used);

        return redirect()->route('spare-parts.show', $sparePart)
            ->with('success', 'Usage recorded successfully.');
    }

    /**
     * Display the specified usage record.
     */
    public function show(UsageHistory $usage)
    {
        $usage->load(['sparePart', 'user']);

        return Inertia::render('usage/show', [
            'usage' => $usage,
        ]);
    }
}