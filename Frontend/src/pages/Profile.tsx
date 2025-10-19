
import { Bell, CreditCard, Edit3, LogOut, MapPin, Package, Settings, Shield, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../api/orderService';
import { getAllProducts } from '../api/productService';
import { changePassword, deleteAccount, getProfile, updateProfile } from '../api/profileApi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth()
  const { itemCount } = useCart()
  const [activeTab, setActiveTab] = useState('profile')

  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState("")
  const [products, setProducts] = useState<any[]>([]) // To get product names

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        if (currentUser?.email) {
          const data = await getProfile(currentUser.email)
          setProfileData(data)
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        // If profile API fails, populate with current user data
        if (currentUser) {
          setProfileData({
            displayName: currentUser.name || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'User',
            email: currentUser.email || '',
            phone: '',
            address: '',
            city: '',
            province: '',
            postalCode: ''
          })
        }
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    
    if (currentUser) {
      fetchProfile()
    }
  }, [currentUser])

  // Fetch orders for current user
  useEffect(() => {
    const fetchOrdersAndProducts = async () => {
      if (!currentUser) return;
      
      setOrdersLoading(true)
      setOrdersError("")
      try {
        // Fetch products first to get product names
        const allProducts = await getAllProducts()
        console.log('Products from API:', allProducts);
        setProducts(allProducts)
        
        // If API products are empty, use static products as fallback
        if (!allProducts || allProducts.length === 0) {
          const { products: staticProducts } = await import('../data/products');
          console.log('Using static products as fallback:', staticProducts);
          setProducts(staticProducts);
        }
        
        // Then fetch orders
        const allOrders = await getAllOrders()
        console.log('All orders fetched:', allOrders); // Debug log
        console.log('Current user:', currentUser); // Debug log
        console.log('All products:', allProducts); // Debug log
        
        // Filter orders for current user - try multiple field combinations
        const userOrders = allOrders.filter((order: any) => {
          console.log('Checking order:', order); // Debug log
          
          // Primary match: customerID from backend Order entity
          if (order.customerID && currentUser?.id) {
            return order.customerID.toString() === currentUser.id.toString()
          }
          
          // Fallback matches for different field names
          if (order.customerId && currentUser?.id) {
            return order.customerId.toString() === currentUser.id.toString()
          }
          if (order.userId && currentUser?.id) {
            return order.userId.toString() === currentUser.id.toString()
          }
          if (order.customerEmail && currentUser?.email) {
            return order.customerEmail.toLowerCase() === currentUser.email.toLowerCase()
          }
          if (order.email && currentUser?.email) {
            return order.email.toLowerCase() === currentUser.email.toLowerCase()
          }
          return false
        })
        
        console.log('Filtered user orders:', userOrders); // Debug log
        setOrders(userOrders)
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setOrdersError('Failed to load orders')
      } finally {
        setOrdersLoading(false)
      }
    }
    
    fetchOrdersAndProducts()
  }, [currentUser])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      if (currentUser?.email) {
        await updateProfile(currentUser.email, profileData)
        setSuccess('Profile updated successfully!')
      }
    } catch (err: any) {
      setError('Failed to update profile')
    }
  }

  const handleChangePassword = async () => {
    const oldPassword = prompt('Enter your current password:')
    const newPassword = prompt('Enter your new password:')
    if (!oldPassword || !newPassword) return
    setError('')
    setSuccess('')
    try {
      if (currentUser?.email) {
        await changePassword(currentUser.email, oldPassword, newPassword)
        setSuccess('Password changed successfully!')
      }
    } catch (err: any) {
      setError('Failed to change password')
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return
    setError('')
    setSuccess('')
    try {
      if (currentUser?.email) {
        await deleteAccount(currentUser.email)
        setSuccess('Account deleted. Logging out...')
        setTimeout(() => logout(), 1500)
      }
    } catch (err: any) {
      setError('Failed to delete account')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#10b981'
      case 'shipped':
        return '#3b82f6'
      case 'processing':
        return '#f59e0b'
      default:
        return '#6b7280'
    }
  }

  const getStatusGradient = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      case 'shipped':
        return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
      case 'processing':
        return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
      case 'pending':
        return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
      default:
        return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
    }
  }

  const tabs = [
    { id: 'profile', label: 'Personal Info', icon: User, color: '#3b82f6' },
    { id: 'orders', label: 'Order History', icon: Package, color: '#8b5cf6' },
    { id: 'settings', label: 'Settings', icon: Settings, color: '#06b6d4' }
  ]

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 0'
      }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Profile Avatar */}
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: '700',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
            }}>
              {(profileData.displayName || currentUser?.name)?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
            </div>
            
            {/* User Details */}
            <div style={{ flex: 1 }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '800', 
                color: '#1f2937', 
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {profileData.displayName || currentUser?.name || 'Welcome Back'}
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '1rem' }}>
                {profileData.email || currentUser?.email}
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  Verified Account
                </span>
                <span style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  color: '#8b5cf6',
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {orders.length} Orders
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '1rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '1rem 1.5rem',
                    background: isActive 
                      ? `linear-gradient(135deg, ${tab.color}15 0%, ${tab.color}25 100%)`
                      : 'transparent',
                    color: isActive ? tab.color : '#64748b',
                    border: isActive ? `2px solid ${tab.color}30` : '2px solid transparent',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: isActive ? `0 8px 25px ${tab.color}30` : 'none'
                  }}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Area */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          minHeight: '500px'
        }}>
          {activeTab === 'profile' && (
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '2rem' 
              }}>
                <h2 style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <User size={24} />
                  Personal Information
                </h2>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                }}>
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              </div>

              {loading && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #e2e8f0',
                    borderTop: '3px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                  }}></div>
                  Loading profile...
                </div>
              )}

              {error && (
                <div style={{
                  background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '1rem',
                  borderRadius: '12px',
                  marginBottom: '2rem',
                  fontSize: '0.875rem'
                }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  border: '1px solid #bbf7d0',
                  color: '#059669',
                  padding: '1rem',
                  borderRadius: '12px',
                  marginBottom: '2rem',
                  fontSize: '0.875rem'
                }}>
                  {success}
                </div>
              )}

              <form onSubmit={handleProfileUpdate}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.75rem', 
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={profileData.displayName}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.8)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.75rem', 
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled
                      style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        background: '#f9fafb',
                        color: '#6b7280'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.75rem', 
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.8)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.75rem', 
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                      style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.8)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.75rem', 
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={profileData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.8)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.75rem', 
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      Province
                    </label>
                    <select
                      name="province"
                      value={profileData.province}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.8)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select Province</option>
                      <option value="EC">Eastern Cape</option>
                      <option value="FS">Free State</option>
                      <option value="GP">Gauteng</option>
                      <option value="KZN">KwaZulu-Natal</option>
                      <option value="LP">Limpopo</option>
                      <option value="MP">Mpumalanga</option>
                      <option value="NC">Northern Cape</option>
                      <option value="NW">North West</option>
                      <option value="WC">Western Cape</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
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
                  Save Changes
                </button>
              </form>
            </div>
          )}

            {activeTab === 'orders' && (
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '2rem' 
                }}>
                  <h2 style={{ 
                    fontSize: '2rem', 
                    fontWeight: '700', 
                    color: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <Package size={24} />
                    Order History
                  </h2>
                  <div style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    color: '#8b5cf6',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {orders.length} Total Orders
                  </div>
                </div>

                {ordersLoading && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '3px solid #e2e8f0',
                      borderTop: '3px solid #8b5cf6',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 1rem'
                    }}></div>
                    Loading orders...
                  </div>
                )}

                {ordersError && (
                  <div style={{
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '1rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    fontSize: '0.875rem'
                  }}>
                    {ordersError}
                  </div>
                )}

                {!ordersLoading && !ordersError && orders.length === 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '4rem 2rem',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderRadius: '20px',
                    border: '2px dashed #cbd5e1'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                      opacity: 0.8
                    }}>
                      <Package size={40} color="white" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
                      No orders yet
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>
                      Your order history will appear here once you make your first purchase.
                    </p>
                    <button style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem 2rem',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                    }}>
                      Start Shopping
                    </button>
                  </div>
                )}

                {!ordersLoading && !ordersError && orders.length > 0 && (
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {orders.map((order: any, index) => {
                      // Map backend Order entity fields to UI fields
                      const orderId = order.orderID || order.id || order.orderId || 'N/A';
                      const orderDate = order.date || order.createdAt || order.orderDate || new Date().toISOString();
                      const orderStatus = order.status || order.paymentStatus || 'Pending';
                      const paymentMethod = order.paymentMethod || 'Card';
                      const paymentStatus = order.paymentStatus || 'PENDING';
                      const orderTotal = order.total || 0;
                      const productId = order.productID || order.productId;
                      const quantity = order.quantity || 1;
                      
                      console.log(`Order ${index}:`, {
                        orderId,
                        productId,
                        productIdType: typeof productId,
                        quantity,
                        orderTotal
                      });
                      
                      // Find product name by ID - handle both string and number types
                      const product = products.find(p => 
                        p.id === productId || 
                        p.id?.toString() === productId?.toString() ||
                        p.id === parseInt(productId) ||
                        p.id === productId?.toString()
                      );
                      console.log('Looking for product with ID:', productId, 'Found:', product);
                      console.log('Available products:', products.map(p => ({ id: p.id, name: p.name })));
                      const productName = product ? product.name : `Product #${productId}`;
                      
                      // For single product orders (which is what the backend supports)
                      const items = [{
                        name: productName,
                        quantity: quantity,
                        price: orderTotal / quantity
                      }];
                      
                      return (
                        <div key={orderId} style={{
                          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '20px',
                          padding: '2rem',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          {/* Decorative gradient */}
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)'
                          }}></div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                            <div>
                              <h3 style={{ 
                                fontSize: '1.25rem', 
                                fontWeight: '700', 
                                marginBottom: '0.5rem',
                                color: '#1f2937'
                              }}>
                                Order #{orderId}
                              </h3>
                              <p style={{ 
                                color: '#64748b', 
                                fontSize: '0.95rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}>
                                <MapPin size={16} />
                                Placed on {orderDate ? new Date(orderDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                }) : 'N/A'}
                              </p>
                            </div>
                            <span style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '12px',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              background: getStatusGradient(orderStatus),
                              color: 'white',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                            }}>
                              {orderStatus}
                            </span>
                          </div>

                          <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ 
                              fontWeight: '600', 
                              marginBottom: '1rem',
                              color: '#374151',
                              fontSize: '1.05rem'
                            }}>
                              Order Items:
                            </h4>
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                              {items.map((item, index) => (
                                <div key={index} style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '1rem',
                                  background: 'rgba(255, 255, 255, 0.7)',
                                  borderRadius: '12px',
                                  border: '1px solid #f1f5f9'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                      width: '8px',
                                      height: '8px',
                                      background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                                      borderRadius: '50%'
                                    }}></div>
                                    <span style={{ fontWeight: '500', color: '#374151' }}>
                                      {item.name} × {item.quantity}
                                    </span>
                                  </div>
                                  <span style={{ 
                                    fontWeight: '600', 
                                    color: '#1f2937',
                                    fontSize: '1.05rem'
                                  }}>
                                    R{Number(item.price).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Payment Information Section */}
                          <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ 
                              fontWeight: '600', 
                              marginBottom: '1rem',
                              color: '#374151',
                              fontSize: '1.05rem'
                            }}>
                              Payment Information:
                            </h4>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: '1rem',
                              padding: '1rem',
                              background: 'rgba(255, 255, 255, 0.7)',
                              borderRadius: '12px',
                              border: '1px solid #f1f5f9'
                            }}>
                              <div>
                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Payment Method:</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                  <span style={{ fontSize: '1rem' }}>
                                    {paymentMethod === 'Card' ? '💳' : paymentMethod === 'EFT' ? '🏦' : paymentMethod === 'Cash' ? '💰' : '💳'}
                                  </span>
                                  <span style={{ fontWeight: '500', color: '#374151' }}>{paymentMethod}</span>
                                </div>
                              </div>
                              <div>
                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Payment Status:</span>
                                <div style={{ marginTop: '0.25rem' }}>
                                  <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    backgroundColor: 
                                      paymentStatus === 'COMPLETED' ? '#10b981' :
                                      paymentStatus === 'PENDING' ? '#f59e0b' :
                                      paymentStatus === 'PENDING_PICKUP' ? '#3b82f6' :
                                      paymentStatus === 'FAILED' ? '#ef4444' : '#6b7280',
                                    color: 'white'
                                  }}>
                                    {paymentStatus.replace('_', ' ')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            paddingTop: '1rem',
                            borderTop: '2px solid #f1f5f9'
                          }}>
                            <div style={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}>
                              <CreditCard size={20} color="#3b82f6" />
                              <span style={{ 
                                fontWeight: '700', 
                                fontSize: '1.25rem',
                                color: '#1f2937'
                              }}>
                                Total: R{Number(orderTotal).toFixed(2)}
                              </span>
                            </div>
                            <button style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.75rem 1.5rem',
                              background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                              border: '1px solid #cbd5e1',
                              borderRadius: '12px',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              color: '#475569',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}>
                              <Bell size={16} />
                              Track Order
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '2rem' 
                }}>
                  <h2 style={{ 
                    fontSize: '2rem', 
                    fontWeight: '700', 
                    color: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <Settings size={24} />
                    Account Settings
                  </h2>
                </div>

                {error && (
                  <div style={{
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '1rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    fontSize: '0.875rem'
                  }}>
                    {error}
                  </div>
                )}

                {success && (
                  <div style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    border: '1px solid #bbf7d0',
                    color: '#059669',
                    padding: '1rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    fontSize: '0.875rem'
                  }}>
                    {success}
                  </div>
                )}

                <div style={{ display: 'grid', gap: '2rem' }}>
                  {/* Email Notifications */}
                  <div style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Bell size={20} color="white" />
                      </div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                        Email Notifications
                      </h3>
                    </div>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        cursor: 'pointer'
                      }}>
                        <input 
                          type="checkbox" 
                          defaultChecked 
                          style={{
                            width: '20px',
                            height: '20px',
                            accentColor: '#06b6d4'
                          }}
                        />
                        <div>
                          <span style={{ fontSize: '1rem', fontWeight: '500', color: '#374151' }}>
                            Order updates and shipping notifications
                          </span>
                          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                            Get notified about your order status and delivery updates
                          </p>
                        </div>
                      </label>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        cursor: 'pointer'
                      }}>
                        <input 
                          type="checkbox" 
                          defaultChecked 
                          style={{
                            width: '20px',
                            height: '20px',
                            accentColor: '#06b6d4'
                          }}
                        />
                        <div>
                          <span style={{ fontSize: '1rem', fontWeight: '500', color: '#374151' }}>
                            New product announcements
                          </span>
                          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                            Be the first to know about new products and collections
                          </p>
                        </div>
                      </label>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        cursor: 'pointer'
                      }}>
                        <input 
                          type="checkbox" 
                          style={{
                            width: '20px',
                            height: '20px',
                            accentColor: '#06b6d4'
                          }}
                        />
                        <div>
                          <span style={{ fontSize: '1rem', fontWeight: '500', color: '#374151' }}>
                            Marketing and promotional emails
                          </span>
                          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                            Receive special offers, discounts, and promotional content
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Shield size={20} color="white" />
                      </div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                        Privacy Settings
                      </h3>
                    </div>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        cursor: 'pointer'
                      }}>
                        <input 
                          type="checkbox" 
                          defaultChecked 
                          style={{
                            width: '20px',
                            height: '20px',
                            accentColor: '#8b5cf6'
                          }}
                        />
                        <div>
                          <span style={{ fontSize: '1rem', fontWeight: '500', color: '#374151' }}>
                            Allow order history to be saved
                          </span>
                          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                            Save your order history for easy reordering and support
                          </p>
                        </div>
                      </label>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        cursor: 'pointer'
                      }}>
                        <input 
                          type="checkbox" 
                          style={{
                            width: '20px',
                            height: '20px',
                            accentColor: '#8b5cf6'
                          }}
                        />
                        <div>
                          <span style={{ fontSize: '1rem', fontWeight: '500', color: '#374151' }}>
                            Share data for personalized recommendations
                          </span>
                          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                            Help us improve your shopping experience with personalized suggestions
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Settings size={20} color="white" />
                      </div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                        Account Actions
                      </h3>
                    </div>
                    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                      <button 
                        onClick={handleChangePassword}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.75rem',
                          padding: '1rem 1.5rem',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
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
                        <Shield size={18} />
                        Change Password
                      </button>
                      <button 
                        onClick={handleDeleteAccount}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.75rem',
                          padding: '1rem 1.5rem',
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                        }}
                      >
                        <Edit3 size={18} />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sign Out Section */}
                <div style={{
                  marginTop: '2rem',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                  border: '1px solid #fecaca',
                  borderRadius: '16px',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
                    Need to sign out?
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                    You'll be redirected to the login page and will need to sign in again.
                  </p>
                  <button
                    onClick={logout}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem 2rem',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                    }}
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
