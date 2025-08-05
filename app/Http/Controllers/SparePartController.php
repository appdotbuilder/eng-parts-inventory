<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSparePartRequest;
use App\Http\Requests\UpdateSparePartRequest;
use App\Models\SparePart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SparePartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = SparePart::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('supplier', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Filter by stock status
        if ($request->has('stock_status') && $request->stock_status) {
            switch ($request->stock_status) {
                case 'low':
                    $query->lowStock();
                    break;
                case 'out':
                    $query->where('quantity', 0);
                    break;
                case 'in_stock':
                    $query->where('quantity', '>', 0)
                          ->whereColumn('quantity', '>', 'min_quantity');
                    break;
            }
        }

        $spareParts = $query->latest()->paginate(12)->withQueryString();

        // Get categories for filter dropdown
        $categories = SparePart::whereNotNull('category')
                              ->distinct()
                              ->pluck('category')
                              ->sort()
                              ->values();

        // Get low stock count for notifications
        $lowStockCount = SparePart::lowStock()->count();

        return Inertia::render('spare-parts/index', [
            'spareParts' => $spareParts,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'stock_status']),
            'lowStockCount' => $lowStockCount,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Only administrators can create spare parts.');
        }

        return Inertia::render('spare-parts/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSparePartRequest $request)
    {
        $sparePart = SparePart::create($request->validated());

        return redirect()->route('spare-parts.show', $sparePart)
            ->with('success', 'Spare part created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(SparePart $sparePart)
    {
        $sparePart->load(['usageHistory.user']);

        return Inertia::render('spare-parts/show', [
            'sparePart' => $sparePart,
            'recentUsage' => $sparePart->usageHistory()
                                     ->with('user')
                                     ->latest()
                                     ->take(10)
                                     ->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SparePart $sparePart)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Only administrators can edit spare parts.');
        }

        return Inertia::render('spare-parts/edit', [
            'sparePart' => $sparePart,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSparePartRequest $request, SparePart $sparePart)
    {
        $sparePart->update($request->validated());

        return redirect()->route('spare-parts.show', $sparePart)
            ->with('success', 'Spare part updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SparePart $sparePart)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Only administrators can delete spare parts.');
        }

        $sparePart->delete();

        return redirect()->route('spare-parts.index')
            ->with('success', 'Spare part deleted successfully.');
    }
}