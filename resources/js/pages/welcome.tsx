import React from 'react';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';

interface Props {
    auth?: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    return (
        <>
            <Head title="Engineering Spare Parts Inventory" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">📦</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">PartTracker Pro</h1>
                                    <p className="text-sm text-gray-600">Engineering Inventory System</p>
                                </div>
                            </div>
                            
                            <nav className="flex items-center space-x-4">
                                {auth?.user ? (
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-700">
                                            Welcome, {auth.user.name}
                                        </span>
                                        <Link href="/dashboard">
                                            <Button>Dashboard</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Link href="/login">
                                            <Button variant="outline">Login</Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button>Get Started</Button>
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                🔧 Engineering Spare Parts
                                <span className="block text-blue-600">Inventory Management</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                                Streamline your engineering operations with our comprehensive spare parts tracking system. 
                                Monitor inventory levels, track usage, and ensure you never run out of critical components.
                            </p>
                            
                            {!auth?.user && (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/register">
                                        <Button size="lg" className="text-lg px-8 py-4">
                                            🚀 Start Managing Inventory
                                        </Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                                            🔑 Login to Your Account
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Features Grid */}
                        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                                <div className="text-4xl mb-4">📋</div>
                                <h3 className="text-xl font-semibold mb-2">Part Management</h3>
                                <p className="text-gray-600">
                                    Add, edit, and organize spare parts with detailed information including codes, quantities, and pricing.
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                                <div className="text-4xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
                                <p className="text-gray-600">
                                    Quickly find parts by name, code, category, or supplier with advanced filtering options.
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                                <div className="text-4xl mb-4">📊</div>
                                <h3 className="text-xl font-semibold mb-2">Usage Tracking</h3>
                                <p className="text-gray-600">
                                    Record and monitor part usage with detailed history, work orders, and purpose tracking.
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                                <div className="text-4xl mb-4">⚠️</div>
                                <h3 className="text-xl font-semibold mb-2">Low Stock Alerts</h3>
                                <p className="text-gray-600">
                                    Get notified when parts reach minimum levels to prevent stockouts and equipment downtime.
                                </p>
                            </div>
                        </div>

                        {/* Role-based Features */}
                        <div className="mt-20">
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                                👥 Built for Your Team
                            </h2>
                            
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="bg-white rounded-lg shadow-lg p-8">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                                            <span className="text-2xl">👨‍💼</span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">Admin Access</h3>
                                            <p className="text-red-600 font-medium">Full Control</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-center">
                                            <span className="text-green-500 mr-2">✓</span>
                                            Complete spare part management
                                        </li>
                                        <li className="flex items-center">
                                            <span className="text-green-500 mr-2">✓</span>
                                            User management and role assignment
                                        </li>
                                        <li className="flex items-center">
                                            <span className="text-green-500 mr-2">✓</span>
                                            Advanced reporting and analytics
                                        </li>
                                        <li className="flex items-center">
                                            <span className="text-green-500 mr-2">✓</span>
                                            Complete usage history access
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-white rounded-lg shadow-lg p-8">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                            <span className="text-2xl">🔧</span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">Technician Access</h3>
                                            <p className="text-blue-600 font-medium">Field Operations</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-center">
                                            <span className="text-green-500 mr-2">✓</span>
                                            View spare parts inventory
                                        </li>
                                        <li className="flex items-center">
                                            <span className="text-green-500 mr-2">✓</span>
                                            Search and filter parts
                                        </li>
                                        <li className="flex items-center">
                                            <span className="text-green-500 mr-2">✓</span>
                                            Record part usage and consumption
                                        </li>
                                        <li className="flex items-center">
                                            <span className="text-green-500 mr-2">✓</span>
                                            Link usage to work orders
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Demo Screenshot Section */}
                        <div className="mt-20">
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                                📱 Intuitive Interface
                            </h2>
                            <div className="bg-white rounded-lg shadow-2xl p-8">
                                <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">📊</div>
                                        <h3 className="text-2xl font-bold text-gray-700 mb-2">Dashboard Preview</h3>
                                        <p className="text-gray-600 max-w-md">
                                            Monitor inventory levels, track recent usage, and get alerted about low stock items 
                                            all from a centralized dashboard designed for engineering teams.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        {!auth?.user && (
                            <div className="mt-20 text-center bg-blue-600 rounded-lg py-16 px-8 text-white">
                                <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Inventory?</h2>
                                <p className="text-xl mb-8 text-blue-100">
                                    Join engineering teams who trust PartTracker Pro to manage their spare parts inventory.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/register">
                                        <Button 
                                            size="lg" 
                                            variant="secondary"
                                            className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100"
                                        >
                                            🎯 Create Your Account
                                        </Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button 
                                            size="lg" 
                                            variant="outline"
                                            className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600"
                                        >
                                            🔓 Access Existing Account
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">📦</span>
                                </div>
                                <span className="text-xl font-bold">PartTracker Pro</span>
                            </div>
                            <p className="text-gray-400">
                                Professional spare parts inventory management for engineering teams.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}