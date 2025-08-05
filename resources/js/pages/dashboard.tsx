import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SparePart {
    id: number;
    name: string;
    code: string;
    quantity: number;
    min_quantity: number;
    price: number;
    status: string;
    is_low_stock: boolean;
}

interface UsageRecord {
    id: number;
    quantity_used: number;
    purpose?: string;
    work_order?: string;
    created_at: string;
    spare_part: {
        name: string;
        code: string;
    };
    user: {
        name: string;
    };
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
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
    stats: {
        totalParts: number;
        lowStockParts: number;
        outOfStockParts: number;
        totalValue: number;
    };
    recentUsage: UsageRecord[];
    lowStockItems: SparePart[];
    adminData?: {
        totalUsers: number;
        recentUsers: User[];
        usageStats: Array<{
            date: string;
            count: number;
        }>;
    };
    [key: string]: unknown;
}

export default function Dashboard({ auth, stats, recentUsage, lowStockItems, adminData }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
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
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            📊 Inventory Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Welcome back, {auth.user.name} ({auth.user.role})
                        </p>
                    </div>
                    
                    <div className="flex space-x-3">
                        <Link href="/spare-parts">
                            <Button>
                                📦 View All Parts
                            </Button>
                        </Link>
                        {auth.user.role === 'admin' && (
                            <Link href="/spare-parts/create">
                                <Button variant="outline">
                                    ➕ Add New Part
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
                            <span className="text-2xl">📦</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalParts}</div>
                            <p className="text-xs text-muted-foreground">
                                Active spare parts in inventory
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                            <span className="text-2xl">⚠️</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.lowStockParts}</div>
                            <p className="text-xs text-muted-foreground">
                                Parts below minimum level
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                            <span className="text-2xl">🚫</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.outOfStockParts}</div>
                            <p className="text-xs text-muted-foreground">
                                Parts completely depleted
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                            <span className="text-2xl">💰</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
                            <p className="text-xs text-muted-foreground">
                                Current inventory value
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Usage */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>📋</span>
                                <span>Recent Usage</span>
                            </CardTitle>
                            <CardDescription>
                                Latest spare part usage records
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentUsage.length > 0 ? (
                                recentUsage.map((usage) => (
                                    <div key={usage.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">
                                                {usage.spare_part.name}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Code: {usage.spare_part.code}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Used by: {usage.user.name}
                                            </div>
                                            {usage.purpose && (
                                                <div className="text-xs text-gray-600">
                                                    Purpose: {usage.purpose}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-sm">
                                                -{usage.quantity_used}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {formatDate(usage.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No recent usage records</p>
                            )}
                            
                            <div className="text-center pt-2">
                                <Link href="/usage">
                                    <Button variant="outline" size="sm">
                                        View All Usage History
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Low Stock Alerts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>⚠️</span>
                                <span>Low Stock Alerts</span>
                            </CardTitle>
                            <CardDescription>
                                Parts that need attention
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {lowStockItems.length > 0 ? (
                                lowStockItems.map((part) => (
                                    <div key={part.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                                        <div className="flex-1">
                                            <Link 
                                                href={`/spare-parts/${part.id}`}
                                                className="font-medium text-sm hover:text-blue-600"
                                            >
                                                {part.name}
                                            </Link>
                                            <div className="text-xs text-gray-600">
                                                Code: {part.code}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-sm text-orange-600">
                                                {part.quantity} / {part.min_quantity}
                                            </div>
                                            {getStatusBadge(part.status, part.is_low_stock)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-green-600 text-center py-4">
                                    ✅ All parts have sufficient stock levels
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Admin-only section */}
                {auth.user.role === 'admin' && adminData && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <span>👥</span>
                                    <span>Users</span>
                                </CardTitle>
                                <CardDescription>
                                    Total users: {adminData.totalUsers}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {adminData.recentUsers.map((user) => (
                                    <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium text-sm">{user.name}</div>
                                            <div className="text-xs text-gray-600">{user.email}</div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                {user.role}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <span>📈</span>
                                    <span>Usage Trends</span>
                                </CardTitle>
                                <CardDescription>
                                    Daily usage activity (last 7 days)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {adminData.usageStats.length > 0 ? (
                                    <div className="space-y-2">
                                        {adminData.usageStats.map((stat) => (
                                            <div key={stat.date} className="flex justify-between items-center">
                                                <span className="text-sm">{new Date(stat.date).toLocaleDateString()}</span>
                                                <span className="font-medium">{stat.count} uses</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No usage data available</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <span>⚡</span>
                            <span>Quick Actions</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/usage/create">
                                <Button variant="outline" className="w-full h-20 flex-col">
                                    <span className="text-2xl mb-1">📝</span>
                                    <span className="text-sm">Record Usage</span>
                                </Button>
                            </Link>
                            
                            <Link href="/spare-parts?stock_status=low">
                                <Button variant="outline" className="w-full h-20 flex-col">
                                    <span className="text-2xl mb-1">⚠️</span>
                                    <span className="text-sm">Low Stock</span>
                                </Button>
                            </Link>
                            
                            <Link href="/spare-parts">
                                <Button variant="outline" className="w-full h-20 flex-col">
                                    <span className="text-2xl mb-1">🔍</span>
                                    <span className="text-sm">Search Parts</span>
                                </Button>
                            </Link>
                            
                            {auth.user.role === 'admin' && (
                                <Link href="/spare-parts/create">
                                    <Button variant="outline" className="w-full h-20 flex-col">
                                        <span className="text-2xl mb-1">➕</span>
                                        <span className="text-sm">Add Part</span>
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}