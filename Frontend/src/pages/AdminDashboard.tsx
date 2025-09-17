import {
    ArrowLeft,
    DollarSign,
    Edit,
    Eye,
    LogOut,
    Package,
    Plus,
    Save,
    ShoppingCart,
    Trash2,
    TrendingUp,
    Upload,
    UserPlus,
    Users,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Admin, deleteAdmin, getAllAdmins, registerAdmin, updateAdmin } from '../api/adminService';
import { getAllOrders } from '../api/orderService';
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '../api/productService';
import { getAllCustomers } from '../api/profileApi';
import { useAuth } from '../contexts/AuthContext';
import { categories, Product } from '../data/products';

interface DashboardStats {
    totalCustomers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
}

interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    paymentMethod?: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
}



const AdminDashboard: React.FC = () => {
    const { currentUser, logout, role } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'products' | 'orders' | 'admins'>('overview');
    const [viewMode, setViewMode] = useState<'list' | 'view' | 'edit' | 'create'>('list');
    const [selectedItem, setSelectedItem] = useState<any>(null); // dropdown logic not needed, but keep for item selection
    const [stats, setStats] = useState<DashboardStats>({
        totalCustomers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
    });
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser && role !== 'admin') {
            navigate('/');
        } else if (!currentUser) {
            navigate('/login?role=admin');
        }
        if (currentUser && role === 'admin') {
            const loadDashboardData = async () => {
                try {
                    setLoading(true);
                    // Fetch all customers
                    const fetchedCustomers = await getAllCustomers();
                    setCustomers(fetchedCustomers);
                    // Fetch all products
                    const fetchedProducts = await getAllProducts();
                    setProducts(fetchedProducts);
                    // Fetch all orders
                    const fetchedOrders = await getAllOrders();
                    // Calculate total revenue from orders
                    const totalRevenue = fetchedOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
                    // Fetch all admins
                    const fetchedAdmins = await getAllAdmins();
                    setAdmins(fetchedAdmins);
                    // Set stats from real data
                    setStats({
                        totalCustomers: fetchedCustomers.length,
                        totalProducts: fetchedProducts.length,
                        totalOrders: fetchedOrders.length,
                        totalRevenue: totalRevenue
                    });
                } catch (error) {
                    console.error('Error loading dashboard data:', error);
                    toast.error('Failed to load dashboard data');
                } finally {
                    setLoading(false);
                }
            };
            loadDashboardData();
        }
    }, [currentUser, role, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleBackToList = () => {
        setViewMode('list');
        setSelectedItem(null);
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleView = (item: any) => {
        setSelectedItem(item);
        setViewMode('view');
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setViewMode('edit');
    };

    const handleCreate = () => {
        setSelectedItem(null);
        setViewMode('create');
    };

    const handleDelete = async (tab: string, item: any) => {
        try {
            if (tab === 'products') {
                await deleteProduct(item.id);
                setProducts(products.filter(p => p.id !== item.id));
            } else if (tab === 'admins') {
                await deleteAdmin(item.id);
                setAdmins(admins.filter(a => a.id !== item.id));
            }
            toast.success('Deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(amount);
    };

    if (!currentUser || role !== 'admin') {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh'
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    const renderHeader = () => (
        <div style={{
            background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
            borderBottom: '1px solid #cbd5e1',
            padding: '1.5rem 2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '1.875rem',
                        fontWeight: '700',
                        color: '#1e293b',
                        marginBottom: '0.25rem',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                        Admin Dashboard
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        Welcome back, {currentUser?.firstName || currentUser?.name || 'Admin'}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={handleBackToHome}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#64748b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#475569'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#64748b'}
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );

    const renderNavigation = () => (
        <div style={{
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            borderBottom: '1px solid #cbd5e1',
            padding: '0 2rem'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', overflowX: 'auto' }}>
                    {[
                        { key: 'overview', label: 'Overview', icon: TrendingUp },
                        { key: 'customers', label: 'Customers', icon: Users },
                        { key: 'products', label: 'Products', icon: Package },
                        { key: 'orders', label: 'Orders', icon: ShoppingCart },
                        { key: 'admins', label: 'Admins', icon: UserPlus }
                    ].map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => {
                                setActiveTab(key as any);
                                setViewMode('list');
                                setSelectedItem(null);
                            }}
                            style={{
                                padding: '1rem 1.5rem',
                                border: 'none',
                                backgroundColor: activeTab === key ? '#3b82f6' : 'transparent',
                                color: activeTab === key ? 'white' : '#64748b',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                borderRadius: activeTab === key ? '0.5rem 0.5rem 0 0' : '0',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseOver={(e) => {
                                if (activeTab !== key) {
                                    e.currentTarget.style.backgroundColor = '#e2e8f0';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (activeTab !== key) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderBackButton = () => {
        if (viewMode === 'list') return null;

        return (
            <button
                onClick={handleBackToList}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#64748b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '1.5rem',
                    transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#475569'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#64748b'}
            >
                <ArrowLeft size={16} />
                Back to List
            </button>
        );
    };

    const renderOverview = () => (
        <div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    padding: '2rem',
                    borderRadius: '1rem',
                    border: '1px solid #bfdbfe',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '500' }}>Total Customers</p>
                            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b' }}>{stats.totalCustomers}</p>
                        </div>
                        <div style={{
                            width: '4rem',
                            height: '4rem',
                            backgroundColor: '#3b82f6',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Users size={24} style={{ color: 'white' }} />
                        </div>
                    </div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    padding: '2rem',
                    borderRadius: '1rem',
                    border: '1px solid #bbf7d0',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '500' }}>Total Products</p>
                            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b' }}>{stats.totalProducts}</p>
                        </div>
                        <div style={{
                            width: '4rem',
                            height: '4rem',
                            backgroundColor: '#10b981',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Package size={24} style={{ color: 'white' }} />
                        </div>
                    </div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                    padding: '2rem',
                    borderRadius: '1rem',
                    border: '1px solid #fde68a',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '500' }}>Total Orders</p>
                            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b' }}>{stats.totalOrders}</p>
                        </div>
                        <div style={{
                            width: '4rem',
                            height: '4rem',
                            backgroundColor: '#f59e0b',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ShoppingCart size={24} style={{ color: 'white' }} />
                        </div>
                    </div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
                    padding: '2rem',
                    borderRadius: '1rem',
                    border: '1px solid #fca5a5',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '500' }}>Total Revenue</p>
                            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b' }}>{formatCurrency(stats.totalRevenue)}</p>
                        </div>
                        <div style={{
                            width: '4rem',
                            height: '4rem',
                            backgroundColor: '#ef4444',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <DollarSign size={24} style={{ color: 'white' }} />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                padding: '2rem',
                borderRadius: '1rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={24} />
                    Quick Actions
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <button
                        onClick={() => {
                            setActiveTab('products');
                            handleCreate();
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '1rem 1.5rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                    >
                        <Plus size={20} />
                        Add Product
                    </button>
                    <button
                        onClick={() => setActiveTab('customers')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '1rem 1.5rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                    >
                        <Users size={20} />
                        View Customers
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab('admins');
                            handleCreate();
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '1rem 1.5rem',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
                    >
                        <UserPlus size={20} />
                        Create Admin
                    </button>
                </div>
            </div>
        </div>
    );

    const renderCustomerDetails = () => {
        if (!selectedItem) return null;

        return (
            <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                padding: '2rem',
                borderRadius: '1rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem', color: '#1e293b' }}>
                    Customer Details
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Full Name
                            </label>
                            <p style={{ fontSize: '1.125rem', color: '#1e293b', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                {selectedItem.firstName} {selectedItem.lastName}
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Email
                            </label>
                            <p style={{ fontSize: '1.125rem', color: '#1e293b', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                {selectedItem.email}
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Payment Method
                            </label>
                            <p style={{ fontSize: '1.125rem', color: '#1e293b', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                {selectedItem.paymentMethod || 'N/A'}
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Full Address
                            </label>
                            <p style={{ fontSize: '1.125rem', color: '#1e293b', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                {selectedItem.address}<br />
                                {selectedItem.city}, {selectedItem.province}<br />
                                {selectedItem.postalCode}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderProductDetails = () => {
        if (!selectedItem) return null;

        return (
            <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                padding: '2rem',
                borderRadius: '1rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem', color: '#1e293b' }}>
                    Product Details
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div>
                        <img src={selectedItem.image} alt={selectedItem.name} style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem' }} />
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Name
                            </label>
                            <p style={{ fontSize: '1.125rem', color: '#1e293b', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                {selectedItem.name}
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Description
                            </label>
                            <p style={{ fontSize: '1.125rem', color: '#1e293b', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                {selectedItem.description}
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Price
                            </label>
                            <p style={{ fontSize: '1.125rem', color: '#1e293b', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                {formatCurrency(selectedItem.price)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderAdminDetails = () => {
        if (!selectedItem) return null;

        return (
            <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                padding: '2rem',
                borderRadius: '1rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem', color: '#1e293b' }}>
                    Admin Details
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Full Name
                            </label>
                            <p style={{ fontSize: '1.125rem', color: '#1e293b', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                {selectedItem.firstName} {selectedItem.lastName}
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Email
                            </label>
                            <p style={{ fontSize: '1.125rem', color: '#1e293b', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                {selectedItem.email}
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Role
                            </label>
                            <p style={{ fontSize: '1.125rem', color: '#1e293b', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                {selectedItem.role}
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Created At
                            </label>
                            <p style={{ fontSize: '1.125rem', color: '#1e293b', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                {selectedItem.createdAt}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ProductForm: React.FC = () => {
        // Use ES6 import for categories
        // Import at top: import { categories } from '../data/products';
        const [formData, setFormData] = useState(selectedItem || {
            name: '',
            description: '',
            price: 0,
            image: '',
            category: categories[0].id
        });

        const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    setFormData({ ...formData, image: ev.target?.result as string });
                };
                reader.readAsDataURL(file);
            }
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                if (viewMode === 'create') {
                    const created = await createProduct(formData);
                    setProducts([...products, created]);
                    toast.success('Product created successfully!');
                } else {
                    const updated = await updateProduct({ ...formData, id: selectedItem.id });
                    setProducts(products.map(p => p.id === updated.id ? updated : p));
                    toast.success('Product updated successfully!');
                }
                setViewMode('list');
            } catch (err) {
                console.error('Error saving product:', err);
                toast.error('Failed to save product. Check console for details.');
            }
        };

        return (
            <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                padding: '3rem 2.5rem',
                borderRadius: '1.5rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 6px 24px rgba(30,41,59,0.10)',
                maxWidth: 1100,
                margin: '0 auto',
            }}>
                <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2.5rem', color: '#1e293b', letterSpacing: '-0.01em' }}>
                    {viewMode === 'create' ? 'Add New Product' : 'Edit Product'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '1rem', fontWeight: '700', color: '#374151', marginBottom: '0.75rem' }}>
                                    Image
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    {formData.image && (
                                        <img src={formData.image} alt="Preview" style={{ width: '5rem', height: '5rem', objectFit: 'cover', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(59,130,246,0.10)' }} />
                                    )}
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.7rem',
                                        padding: '0.9rem 1.5rem',
                                        backgroundColor: '#2563eb',
                                        color: 'white',
                                        borderRadius: '0.7rem',
                                        cursor: 'pointer',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        boxShadow: '0 2px 8px rgba(59,130,246,0.10)'
                                    }}>
                                        <Upload size={18} />
                                        Upload Image
                                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '1rem', fontWeight: '700', color: '#374151', marginBottom: '0.75rem' }}>
                                    Name
                                </label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '1rem', border: '1.5px solid #e2e8f0', borderRadius: '0.7rem', fontSize: '1.1rem', fontWeight: 600, background: '#f8fafc', marginBottom: 0 }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '1rem', fontWeight: '700', color: '#374151', marginBottom: '0.75rem' }}>
                                    Price
                                </label>
                                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} style={{ width: '100%', padding: '1rem', border: '1.5px solid #e2e8f0', borderRadius: '0.7rem', fontSize: '1.1rem', fontWeight: 600, background: '#f8fafc', marginBottom: 0 }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '1rem', fontWeight: '700', color: '#374151', marginBottom: '0.75rem' }}>
                                    Category
                                </label>
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '1rem', border: '1.5px solid #e2e8f0', borderRadius: '0.7rem', fontSize: '1.1rem', fontWeight: 600, background: '#f8fafc', marginBottom: 0 }} required>
                                    {categories.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '1rem', fontWeight: '700', color: '#374151', marginBottom: '0.75rem' }}>
                                Description
                            </label>
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={8} style={{ width: '100%', padding: '1rem', border: '1.5px solid #e2e8f0', borderRadius: '0.7rem', fontSize: '1.1rem', fontWeight: 500, background: '#f8fafc', resize: 'vertical', minHeight: '8rem' }} required />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
                        <button type="button" onClick={handleBackToList} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.9rem 2.2rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '0.7rem', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(71,85,105,0.10)' }}>
                            <X size={18} />
                            Cancel
                        </button>
                        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.9rem 2.2rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.7rem', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(16,185,129,0.10)' }}>
                            <Save size={18} />
                            {viewMode === 'create' ? 'Create Product' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        );
    };



    const AdminForm: React.FC = () => {
        // Explicitly type formData as Admin
        const [formData, setFormData] = useState<Admin>(
            selectedItem ? {
                id: selectedItem.id,
                firstName: selectedItem.firstName,
                lastName: selectedItem.lastName,
                email: selectedItem.email,
                role: selectedItem.role,
                password: '' // Initialize as empty string for edit mode
            } : {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                role: 'Admin'
            }
        );

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                let updatedAdmins: Admin[];
                if (viewMode === 'create') {
                    const newAdmin = await registerAdmin(formData);
                    updatedAdmins = [...admins, newAdmin];
                    toast.success('Admin created successfully!');
                } else {
                    // Explicitly type updateData as Admin
                    const updateData: Admin = { id: selectedItem.id, ...formData };
                    if (!updateData.password) {
                        delete updateData.password; // Safe to delete since password is optional in Admin interface
                    }
                    const updated = await updateAdmin(updateData);
                    updatedAdmins = admins.map(a => a.id === updated.id ? updated : a);
                    toast.success('Admin updated successfully!');
                }
                setAdmins(updatedAdmins);
                setViewMode('list');
                setSelectedItem(null);
            } catch (err) {
                console.error('Error saving admin:', err);
                toast.error('Failed to save admin. Check console for details.');
            }
        };

        return (
            <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                padding: '2rem',
                borderRadius: '1rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem', color: '#1e293b' }}>
                    {viewMode === 'create' ? 'Create New Admin' : 'Edit Admin'}
                </h3>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem'
                                    }}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem'
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem'
                                    }}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                    Password {viewMode === 'edit' ? '(leave blank to keep current)' : ''}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem'
                                    }}
                                    required={viewMode === 'create'}
                                />
                            </div>

                            {/* Role is always Admin, dropdown removed */}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <button
                            type="button"
                            onClick={handleBackToList}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={16} />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            <Save size={16} />
                            {viewMode === 'create' ? 'Create Admin' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    const renderDataTable = (data: any[], columns: string[], actions: boolean = true) => (
        <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            padding: '2rem',
            borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                </h3>
                <button
                    onClick={handleCreate}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                    <Plus size={16} />
                    Add {activeTab.slice(0, -1)}
                </button>
            </div>

            <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                        {columns.map((column) => (
                            <th key={column} style={{
                                padding: '1rem',
                                textAlign: 'left',
                                fontWeight: '600',
                                color: '#374151',
                                borderBottom: '1px solid #e2e8f0'
                            }}>
                                {column}
                            </th>
                        ))}
                        {actions && (
                            <th style={{
                                padding: '1rem',
                                textAlign: 'left',
                                fontWeight: '600',
                                color: '#374151',
                                borderBottom: '1px solid #e2e8f0'
                            }}>
                                Actions
                            </th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item, index) => (
                        <tr key={item.id} style={{
                            borderBottom: index < data.length - 1 ? '1px solid #f3f4f6' : 'none',
                            transition: 'background-color 0.2s ease'
                        }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            {columns.map((column) => (
                                <td key={column} style={{ padding: '1rem', color: '#1f2937' }}>
                                    {column === 'Price' || column === 'Revenue' ?
                                        formatCurrency(item[column.toLowerCase()]) :
                                        column === 'Stock' ? (
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '1rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    backgroundColor: item.stock > 20 ? '#dcfce7' : item.stock > 0 ? '#fef3c7' : '#fee2e2',
                                                    color: item.stock > 20 ? '#166534' : item.stock > 0 ? '#92400e' : '#991b1b'
                                                }}>
                          {item.stock}
                        </span>
                                            ) :
                                            item[column.toLowerCase().replace(' ', '')] || item[column.toLowerCase()]
                                    }
                                </td>
                            ))}
                            {actions && (
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleView(item)}
                                            style={{
                                                padding: '0.5rem',
                                                border: 'none',
                                                backgroundColor: '#3b82f6',
                                                color: 'white',
                                                borderRadius: '0.375rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            style={{
                                                padding: '0.5rem',
                                                border: 'none',
                                                backgroundColor: '#10b981',
                                                color: 'white',
                                                borderRadius: '0.375rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(activeTab, item)}
                                            style={{
                                                padding: '0.5rem',
                                                border: 'none',
                                                backgroundColor: '#ef4444',
                                                color: 'white',
                                                borderRadius: '0.375rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderContent = () => {
        if (viewMode !== 'list') {
            if (activeTab === 'customers' && viewMode === 'view') {
                return renderCustomerDetails();
            }
            if (activeTab === 'products' && viewMode === 'view') {
                return renderProductDetails();
            }
            if (activeTab === 'products' && (viewMode === 'create' || viewMode === 'edit')) {
                return <ProductForm />;
            }

            if (activeTab === 'admins' && viewMode === 'view') {
                return renderAdminDetails();
            }
            if (activeTab === 'admins' && (viewMode === 'create' || viewMode === 'edit')) {
                return <AdminForm />;
            }
        }

        switch (activeTab) {
            case 'overview':
                return renderOverview();
            case 'customers':
                return renderDataTable(customers, ['First Name', 'Last Name', 'Email', 'Payment Method']);
            case 'products':
                return renderDataTable(products, ['Name', 'Price']);

            case 'admins':
                return renderDataTable(admins, ['First Name', 'Last Name', 'Email', 'Role', 'Created At']);
            case 'orders':
                return (
                    <div style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        padding: '3rem',
                        borderRadius: '1rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>
                            Orders Management
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
                            Orders management feature coming soon...
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}>
            {renderHeader()}
            {renderNavigation()}

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
                {renderBackButton()}
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;