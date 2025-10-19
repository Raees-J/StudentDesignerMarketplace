import {
    ArrowLeft,
    Banknote,
    CreditCard,
    DollarSign,
    Edit,
    Eye,
    Globe,
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
import { useNavigate } from 'react-router-dom';
import { Admin, deleteAdmin, getAllAdmins, registerAdmin, updateAdmin } from '../api/adminService';
import { getAllOrders } from '../api/orderService';
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '../api/productService';
import { getAllCustomers } from '../api/profileApi';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
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
    const { showError, showSuccess } = useNotification();
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
    const [orders, setOrders] = useState<any[]>([]);

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
                    // Fetch all products
                    const fetchedProducts = await getAllProducts();
                    setProducts(fetchedProducts);
                    // Fetch all orders
                    const fetchedOrders = await getAllOrders();
                    setOrders(fetchedOrders);
                    
                    // Enhance customers with payment method information from their order history
                    const enhancedCustomers = fetchedCustomers.map((customer: any) => {
                        // Find the most recent order for this customer
                        const customerOrders = fetchedOrders.filter((order: any) => 
                            order.customerID === customer.customerID || 
                            order.customerId === customer.customerID ||
                            order.customerEmail === customer.email
                        );
                        
                        // Get the most recent payment method
                        let paymentMethod = 'Not specified';
                        if (customerOrders.length > 0) {
                            // Sort by date to get the most recent order
                            const sortedOrders = customerOrders.sort((a: any, b: any) => {
                                const dateA = new Date(a.date || a.createdAt || a.orderDate);
                                const dateB = new Date(b.date || b.createdAt || b.orderDate);
                                return dateB.getTime() - dateA.getTime();
                            });
                            
                            const mostRecentOrder = sortedOrders[0];
                            paymentMethod = mostRecentOrder.paymentMethod || 
                                           mostRecentOrder.payment_method || 
                                           'Card'; // Default to Card if not specified
                        } else {
                            // For demonstration purposes, assign random payment methods to customers without orders
                            const methods = ['Cash', 'Card', 'Online'];
                            const hash = customer.email.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
                            paymentMethod = methods[hash % methods.length];
                        }
                        
                        return {
                            ...customer,
                            paymentMethod: paymentMethod
                        };
                    });
                    
                    setCustomers(enhancedCustomers);
                    
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
                    showError('Failed to load dashboard data');
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

    const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            // Since we don't have an updateOrder API endpoint yet, we'll update the local state
            // In a real implementation, you'd call an API endpoint here
            const updatedOrders = orders.map(order => 
                order.id === orderId || order.orderId === orderId 
                    ? { ...order, status: newStatus } 
                    : order
            );
            setOrders(updatedOrders);
            showSuccess(`Order status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating order status:', error);
            showError('Failed to update order status');
        }
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
            showSuccess('Deleted successfully!');
        } catch (error) {
            showError('Failed to delete');
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
            category: categories[0].id,
            inStock: true,
            sizes: [],
            colors: [],
            features: []
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
                    showSuccess('Product created successfully!');
                } else {
                    const updated = await updateProduct({ ...formData, id: selectedItem.id });
                    setProducts(products.map(p => p.id === updated.id ? updated : p));
                    showSuccess('Product updated successfully!');
                }
                setViewMode('list');
            } catch (err) {
                console.error('Error saving product:', err);
                showError('Failed to save product. Check console for details.');
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
                maxHeight: '90vh',
                overflowY: 'auto'
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
                            <div>
                                <label style={{ display: 'block', fontSize: '1rem', fontWeight: '700', color: '#374151', marginBottom: '0.75rem' }}>
                                    Stock Status
                                </label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: '500', cursor: 'pointer' }}>
                                        <input 
                                            type="radio" 
                                            name="stockStatus"
                                            checked={formData.inStock === true} 
                                            onChange={() => setFormData({ ...formData, inStock: true })} 
                                            style={{ width: '1.1rem', height: '1.1rem' }}
                                        />
                                        <span style={{ color: '#10b981' }}>In Stock</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: '500', cursor: 'pointer' }}>
                                        <input 
                                            type="radio" 
                                            name="stockStatus"
                                            checked={formData.inStock === false} 
                                            onChange={() => setFormData({ ...formData, inStock: false })} 
                                            style={{ width: '1.1rem', height: '1.1rem' }}
                                        />
                                        <span style={{ color: '#ef4444' }}>Out of Stock</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '1rem', fontWeight: '700', color: '#374151', marginBottom: '0.75rem' }}>
                                Description
                            </label>
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={8} style={{ width: '100%', padding: '1rem', border: '1.5px solid #e2e8f0', borderRadius: '0.7rem', fontSize: '1.1rem', fontWeight: 500, background: '#f8fafc', resize: 'vertical', minHeight: '8rem' }} required />
                        </div>
                    </div>
                    
                    {/* Additional Product Options */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '1rem', fontWeight: '700', color: '#374151', marginBottom: '0.75rem' }}>
                                Available Sizes (comma-separated)
                            </label>
                            <input 
                                type="text" 
                                value={formData.sizes?.join(', ') || ''} 
                                onChange={(e) => setFormData({ 
                                    ...formData, 
                                    sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                                })} 
                                placeholder="S, M, L, XL, XXL"
                                style={{ width: '100%', padding: '1rem', border: '1.5px solid #e2e8f0', borderRadius: '0.7rem', fontSize: '1rem', fontWeight: 500, background: '#f8fafc' }} 
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '1rem', fontWeight: '700', color: '#374151', marginBottom: '0.75rem' }}>
                                Available Colors (comma-separated)
                            </label>
                            <input 
                                type="text" 
                                value={formData.colors?.join(', ') || ''} 
                                onChange={(e) => setFormData({ 
                                    ...formData, 
                                    colors: e.target.value.split(',').map(c => c.trim()).filter(c => c) 
                                })} 
                                placeholder="Black, White, Red, Blue"
                                style={{ width: '100%', padding: '1rem', border: '1.5px solid #e2e8f0', borderRadius: '0.7rem', fontSize: '1rem', fontWeight: 500, background: '#f8fafc' }} 
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '1rem', fontWeight: '700', color: '#374151', marginBottom: '0.75rem' }}>
                                Key Features (comma-separated)
                            </label>
                            <input 
                                type="text" 
                                value={formData.features?.join(', ') || ''} 
                                onChange={(e) => setFormData({ 
                                    ...formData, 
                                    features: e.target.value.split(',').map(f => f.trim()).filter(f => f) 
                                })} 
                                placeholder="Durable, Waterproof, Lightweight"
                                style={{ width: '100%', padding: '1rem', border: '1.5px solid #e2e8f0', borderRadius: '0.7rem', fontSize: '1rem', fontWeight: 500, background: '#f8fafc' }} 
                            />
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
                    showSuccess('Admin created successfully!');
                } else {
                    // Explicitly type updateData as Admin
                    const updateData: Admin = { id: selectedItem.id, ...formData };
                    if (!updateData.password) {
                        delete updateData.password; // Safe to delete since password is optional in Admin interface
                    }
                    const updated = await updateAdmin(updateData);
                    updatedAdmins = admins.map(a => a.id === updated.id ? updated : a);
                    showSuccess('Admin updated successfully!');
                }
                setAdmins(updatedAdmins);
                setViewMode('list');
                setSelectedItem(null);
            } catch (err) {
                console.error('Error saving admin:', err);
                showError('Failed to save admin. Check console for details.');
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
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            padding: '2.5rem',
            borderRadius: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 style={{ 
                        fontSize: '2rem', 
                        fontWeight: '800', 
                        color: '#1e293b',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '1rem' }}>
                        Manage and monitor your {activeTab.toLowerCase()} efficiently
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem 1.5rem',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontSize: '0.95rem',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                    }}
                >
                    <Plus size={18} />
                    Add {activeTab.slice(0, -1)}
                </button>
            </div>

            <div style={{ 
                overflowX: 'auto', 
                backgroundColor: 'white', 
                borderRadius: '1rem', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ 
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                    }}>
                    <tr>
                        {columns.map((column) => (
                            <th key={column} style={{
                                padding: '1.25rem 1rem',
                                textAlign: 'left',
                                fontWeight: '700',
                                color: '#374151',
                                borderBottom: '2px solid #e2e8f0',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {column}
                            </th>
                        ))}
                        {actions && (
                            <th style={{
                                padding: '1.25rem 1rem',
                                textAlign: 'center',
                                fontWeight: '700',
                                color: '#374151',
                                borderBottom: '2px solid #e2e8f0',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
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
                            transition: 'all 0.3s ease'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                e.currentTarget.style.transform = 'scale(1.002)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {columns.map((column) => (
                                <td key={column} style={{ 
                                    padding: '1.25rem 1rem', 
                                    color: '#1f2937',
                                    fontSize: '0.95rem',
                                    fontWeight: '500'
                                }}>
                                    {column === 'Image' ? (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <img 
                                                src={item.image || item.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiByeD0iMTIiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTIwIDIwTDQwIDQwTDIwIDQwVjIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSI0IiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjMwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOUNBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPHN2Zz4K'} 
                                                alt={item.name || 'Product'} 
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                                    border: '2px solid #e2e8f0'
                                                }}
                                                onError={(e) => {
                                                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiByeD0iMTIiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTIwIDIwTDQwIDQwTDIwIDQwVjIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSI0IiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjMwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOUNBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPHN2Zz4K';
                                                }}
                                            />
                                        </div>
                                    ) :
                                    column === 'Name' && activeTab === 'products' ? (
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.25rem'
                                        }}>
                                            <span style={{ fontWeight: '700', color: '#1f2937' }}>
                                                {item.name}
                                            </span>
                                            {item.description && (
                                                <span style={{ 
                                                    fontSize: '0.75rem', 
                                                    color: '#64748b',
                                                    lineHeight: '1.2',
                                                    maxWidth: '200px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {item.description}
                                                </span>
                                            )}
                                        </div>
                                    ) :
                                    column === 'Category' ? (
                                        <span style={{
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            backgroundColor: '#f0f9ff',
                                            color: '#0284c7',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                            textTransform: 'capitalize'
                                        }}>
                                            {item.category || 'Uncategorized'}
                                        </span>
                                    ) :
                                    column === 'Price' || column === 'Revenue' ?
                                        <span style={{ fontWeight: '700', color: '#059669', fontSize: '1rem' }}>
                                            {formatCurrency(item[column.toLowerCase()])}
                                        </span> :
                                        column === 'Stock' ? (
                                                <span style={{
                                                    padding: '0.5rem 0.75rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    backgroundColor: item.inStock ? '#dcfce7' : '#fee2e2',
                                                    color: item.inStock ? '#166534' : '#991b1b',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                                            ) :
                                            column === 'Payment Method' ? (
                                                <span style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.5rem 0.75rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    backgroundColor: 
                                                        item.paymentMethod === 'Cash' ? '#fef3c7' : 
                                                        item.paymentMethod === 'Card' ? '#dbeafe' : 
                                                        item.paymentMethod === 'Online' ? '#d1fae5' : '#f3f4f6',
                                                    color: 
                                                        item.paymentMethod === 'Cash' ? '#92400e' : 
                                                        item.paymentMethod === 'Card' ? '#1e40af' : 
                                                        item.paymentMethod === 'Online' ? '#065f46' : '#374151',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}>
                                                    {item.paymentMethod === 'Cash' ? <Banknote size={14} /> :
                                                     item.paymentMethod === 'Card' ? <CreditCard size={14} /> :
                                                     item.paymentMethod === 'Online' ? <Globe size={14} /> :
                                                     <CreditCard size={14} />}
                                                    {item.paymentMethod || 'Not specified'}
                                                </span>
                                            ) :
                                            column === 'Role' ? (
                                                <span style={{
                                                    padding: '0.5rem 0.75rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    backgroundColor: item.role === 'ADMIN' ? '#dbeafe' : '#f3f4f6',
                                                    color: item.role === 'ADMIN' ? '#1e40af' : '#374151',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    {item.role || 'USER'}
                                                </span>
                                            ) :
                                            column === 'First Name' ? item.firstName :
                                            column === 'Last Name' ? item.lastName :
                                            column === 'Email' ? (
                                                <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                                                    {item.email}
                                                </span>
                                            ) :
                                            column === 'Created At' ? (
                                                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                                                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                                                </span>
                                            ) :
                                            item[column.toLowerCase().replace(' ', '')] || item[column.toLowerCase()]
                                    }
                                </td>
                            ))}
                            {actions && (
                                <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => handleView(item)}
                                            style={{
                                                padding: '0.75rem',
                                                border: 'none',
                                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                                color: 'white',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                                            }}
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            style={{
                                                padding: '0.75rem',
                                                border: 'none',
                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                color: 'white',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                                            }}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(activeTab, item)}
                                            style={{
                                                padding: '0.75rem',
                                                border: 'none',
                                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                                color: 'white',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                                            }}
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
                return renderDataTable(products, ['Image', 'Name', 'Price', 'Category', 'Stock']);

            case 'admins':
                return renderDataTable(admins, ['First Name', 'Last Name', 'Email', 'Role', 'Created At']);
            case 'orders':
                return (
                    <div style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        padding: '2rem',
                        borderRadius: '1rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: '2rem' 
                        }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                                Orders Management
                            </h3>
                            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                Total Orders: {orders.length}
                            </div>
                        </div>

                        {orders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                <ShoppingCart size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>No orders found</p>
                                <p>Orders will appear here when customers make purchases</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {orders.map((order) => {
                                    const orderId = order.orderID || order.id || order.orderId || 'N/A';
                                    const orderDate = order.date || order.createdAt || order.orderDate || '';
                                    const orderStatus = order.status || 'Pending';
                                    const orderTotal = order.total || order.amount || order.price || 0;
                                    const customerEmail = order.customerEmail || order.email || 'N/A';
                                    const productName = order.productName || 'N/A';
                                    const paymentMethod = order.paymentMethod || 'Card';
                                    const paymentStatus = order.paymentStatus || 'PENDING';

                                    const getStatusColor = (status: string) => {
                                        switch (status.toLowerCase()) {
                                            case 'delivered':
                                            case 'picked up':
                                                return '#10b981';
                                            case 'ready for pickup':
                                            case 'ready':
                                                return '#3b82f6';
                                            case 'processing':
                                                return '#f59e0b';
                                            case 'pending':
                                                return '#6b7280';
                                            case 'cancelled':
                                                return '#ef4444';
                                            default:
                                                return '#6b7280';
                                        }
                                    };

                                    const getPaymentStatusColor = (status: string) => {
                                        switch (status.toUpperCase()) {
                                            case 'COMPLETED':
                                                return '#10b981';
                                            case 'PENDING':
                                                return '#f59e0b';
                                            case 'PENDING_PICKUP':
                                                return '#3b82f6';
                                            case 'FAILED':
                                                return '#ef4444';
                                            case 'CANCELLED':
                                                return '#6b7280';
                                            default:
                                                return '#6b7280';
                                        }
                                    };

                                    const getPaymentMethodIcon = (method: string) => {
                                        switch (method.toLowerCase()) {
                                            case 'card':
                                                return '💳';
                                            case 'eft':
                                                return '🏦';
                                            case 'cash':
                                                return '💰';
                                            default:
                                                return '💳';
                                        }
                                    };

                                    return (
                                        <div key={orderId} style={{
                                            backgroundColor: 'white',
                                            padding: '1.5rem',
                                            borderRadius: '0.75rem',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                        }}>
                                            <div style={{ 
                                                display: 'grid', 
                                                gridTemplateColumns: '1fr 1fr 1fr 1fr 200px', 
                                                gap: '1rem', 
                                                alignItems: 'center' 
                                            }}>
                                                <div>
                                                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                                        Order ID
                                                    </p>
                                                    <p style={{ fontWeight: '600', color: '#1e293b' }}>
                                                        #{orderId}
                                                    </p>
                                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                                        {orderDate ? new Date(orderDate).toLocaleDateString() : 'N/A'}
                                                    </p>
                                                </div>
                                                
                                                <div>
                                                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                                        Customer
                                                    </p>
                                                    <p style={{ fontWeight: '500', color: '#1e293b' }}>
                                                        {customerEmail}
                                                    </p>
                                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                                        {productName}
                                                    </p>
                                                </div>
                                                
                                                <div>
                                                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                                        Amount
                                                    </p>
                                                    <p style={{ fontWeight: '600', color: '#1e293b', fontSize: '1.125rem' }}>
                                                        R{Number(orderTotal).toFixed(2)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                                        Payment
                                                    </p>
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: '0.5rem',
                                                        marginBottom: '0.5rem'
                                                    }}>
                                                        <span style={{ fontSize: '1rem' }}>
                                                            {getPaymentMethodIcon(paymentMethod)}
                                                        </span>
                                                        <span style={{ fontWeight: '500', color: '#1e293b' }}>
                                                            {paymentMethod}
                                                        </span>
                                                    </div>
                                                    <span style={{
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '0.375rem',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        backgroundColor: getPaymentStatusColor(paymentStatus),
                                                        color: 'white',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.025em'
                                                    }}>
                                                        {paymentStatus.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                
                                                <div>
                                                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                                        Order Status
                                                    </p>
                                                    <select
                                                        value={orderStatus}
                                                        onChange={(e) => handleUpdateOrderStatus(orderId, e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.5rem',
                                                            borderRadius: '0.5rem',
                                                            border: '1px solid #d1d5db',
                                                            backgroundColor: getStatusColor(orderStatus),
                                                            color: 'white',
                                                            fontWeight: '500',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Ready for Pickup">Ready for Pickup</option>
                                                        <option value="Picked Up">Picked Up</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
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