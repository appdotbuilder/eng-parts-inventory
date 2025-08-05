import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SparePart {
    id: number;
    name: string;
    code: string;
    quantity: number;
    min_quantity: number;
    price: number;
    description?: string;
    location?: string;
    supplier?: string;
    category?: string;
    status: string;
    is_low_stock: boolean;
    created_at: string;
}

interface PaginationData {
    data: SparePart[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url?: string;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    spareParts: PaginationData;
    categories: string[];
    filters: {
        search?: string;
        category?: string;
        stock_status?: string;
    };
    lowStockCount: number;
    [key: string]: unknown;
}

export default function SparePartsIndex({ auth, spareParts, categories, filters, lowStockCount }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [stockStatus, setStockStatus] = useState(filters.stock_status || '');

    const handleFilter = () => {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (category) params.category = category;
        if (stockStatus) params.stock_status = stockStatus;

        router.get('/spare-parts', params, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('');
        setStockStatus('');
        router.get('/spare-parts', {}, { preserveState: true });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getStatusBadge = (status: string, isLowStock: boolean) => {
        if (status === 'Out of Stock') {
            return <Badge variant="destructive">Out of Stock</Badge>;
        } else if (isLowStock) {
            return <Badge variant="secondary">Low Stock</Badge>;
        } else {
            return <Badge variant="default">In Stock</Badge>;
        }
    };

    return (
        <AppShell>
            <Head title="Spare Parts Inventory" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            📦 Spare Parts Inventory
                        </h1>
                        <p className="text-gray-600">
                            {spareParts.total} total parts
                            {lowStockCount > 0 && (
                                <span className="text-orange-600 ml-2">
                                    • {lowStockCount} low stock alerts
                                </span>
                            )}
                        </p>
                    </div>
                    
                    <div className="flex space-x-3">
                        <Link href="/usage/create">
                            <Button variant="outline">
                                📝 Record Usage
                            </Button>
                        </Link>
                        {auth.user.role === 'admin' && (
                            <Link href="/spare-parts/create">
                                <Button>
                                    ➕ Add New Part
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">🔍 Search & Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <Input
                                    placeholder="Search parts..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>
                            
                            <div>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Categories</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div>
                                <Select value={stockStatus} onValueChange={setStockStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Stock Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Status</SelectItem>
                                        <SelectItem value="in_stock">In Stock</SelectItem>
                                        <SelectItem value="low">Low Stock</SelectItem>
                                        <SelectItem value="out">Out of Stock</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="flex space-x-2">
                                <Button onClick={handleFilter} className="flex-1">
                                    Filter
                                </Button>
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Parts Grid */}
                {spareParts.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {spareParts.data.map((part) => (
                            <Card key={part.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <Link 
                                                href={`/spare-parts/${part.id}`}
                                                className="text-lg font-semibold hover:text-blue-600"
                                            >
                                                {part.name}
                                            </Link>
                                            <p className="text-sm text-gray-600 font-mono">
                                                {part.code}
                                            </p>
                                        </div>
                                        {getStatusBadge(part.status, part.is_low_stock)}
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Quantity</p>
                                            <p className="font-semibold">
                                                {part.quantity} 
                                                <span className="text-sm text-gray-500 ml-1">
                                                    (min: {part.min_quantity})
                                                </span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Price</p>
                                            <p className="font-semibold">{formatCurrency(part.price)}</p>
                                        </div>
                                    </div>
                                    
                                    {part.category && (
                                        <div>
                                            <p className="text-sm text-gray-600">Category</p>
                                            <p className="text-sm">{part.category}</p>
                                        </div>
                                    )}
                                    
                                    {part.location && (
                                        <div>
                                            <p className="text-sm text-gray-600">Location</p>
                                            <p className="text-sm">{part.location}</p>
                                        </div>
                                    )}
                                    
                                    {part.description && (
                                        <div>
                                            <p className="text-sm text-gray-600">Description</p>
                                            <p className="text-sm line-clamp-2">{part.description}</p>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between items-center pt-3 border-t">
                                        <Link href={`/spare-parts/${part.id}`}>
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                        </Link>
                                        
                                        {part.quantity > 0 && (
                                            <Link href={`/usage/create?spare_part_id=${part.id}`}>
                                                <Button size="sm">
                                                    Record Usage
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold mb-2">No spare parts found</h3>
                            <p className="text-gray-600 mb-6">
                                Try adjusting your search criteria or add new parts to get started.
                            </p>
                            {auth.user.role === 'admin' && (
                                <Link href="/spare-parts/create">
                                    <Button>
                                        ➕ Add Your First Part
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {spareParts.last_page > 1 && (
                    <div className="flex justify-center">
                        <nav className="flex space-x-2">
                            {spareParts.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                    disabled={!link.url}
                                    className={`px-3 py-2 text-sm rounded-md ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : link.url
                                            ? 'bg-white text-gray-700 hover:bg-gray-50 border'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </AppShell>
    );
}