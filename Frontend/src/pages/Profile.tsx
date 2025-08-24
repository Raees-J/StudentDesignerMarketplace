import { LogOut, Package, Settings, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { changePassword, deleteAccount, getProfile, updateProfile } from '../api/profileApi'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

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

  const [orders] = useState([
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 299.99,
      items: [
        { name: 'University Hoodie', quantity: 1, price: 199.99 },
        { name: 'Campus Mug', quantity: 2, price: 50.00 }
      ]
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'Processing',
      total: 149.99,
      items: [
        { name: 'Study Chair', quantity: 1, price: 149.99 }
      ]
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'Shipped',
      total: 79.99,
      items: [
        { name: 'University T-Shirt', quantity: 1, price: 79.99 }
      ]
    }
  ])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await getProfile()
        setProfileData(data)
      } catch (err: any) {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await updateProfile(profileData)
      setSuccess('Profile updated successfully!')
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
      await changePassword(oldPassword, newPassword)
      setSuccess('Password changed successfully!')
    } catch (err: any) {
      setError('Failed to change password')
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return
    setError('')
    setSuccess('')
    try {
      await deleteAccount()
      setSuccess('Account deleted. Logging out...')
      setTimeout(() => logout(), 1500)
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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
          My Account
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage your profile, orders, and account settings
        </p>
      </div>

      <div className="grid lg:grid-cols-4" style={{ gap: '2rem' }}>
        {/* Sidebar */}
        <div>
          <div className="card" style={{ padding: '1.5rem' }}>
            {/* User Info */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                {currentUser?.displayName || 'User'}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {currentUser?.email}
              </p>
            </div>

            {/* Navigation */}
            <nav>
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      marginBottom: '0.5rem',
                      backgroundColor: activeTab === tab.id ? '#eff6ff' : 'transparent',
                      color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                )
              })}
              
              <hr style={{ margin: '1rem 0' }} />
              
              <button
                onClick={logout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: 'transparent',
                  color: '#ef4444',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ gridColumn: 'span 3' }}>
          {activeTab === 'profile' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                Profile Information
              </h2>
              {loading && <p>Loading profile...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {success && <p style={{ color: 'green' }}>{success}</p>}
              <form onSubmit={handleProfileUpdate}>
                <div className="grid md:grid-cols-2" style={{ gap: '1rem', marginBottom: '2rem' }}>
                  {/* ...existing code for input fields... */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={profileData.displayName}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="input"
                      disabled
                      style={{ backgroundColor: '#f9fafb' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Enter your address"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={profileData.city}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Enter your city"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Province
                    </label>
                    <select
                      name="province"
                      value={profileData.province}
                      onChange={handleInputChange}
                      className="input"
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
                <button type="submit" className="btn btn-primary">
                  Update Profile
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                Order History
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map((order) => (
                  <div key={order.id} className="card" style={{ padding: '1.5rem', backgroundColor: '#f9fafb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                          Order #{order.id}
                        </h3>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          backgroundColor: getStatusColor(order.status),
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {order.status}
                        </span>
                        <p style={{ fontSize: '1.125rem', fontWeight: '600', marginTop: '0.5rem' }}>
                          R{order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                      {order.items.map((item, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          marginBottom: '0.5rem',
                          fontSize: '0.875rem'
                        }}>
                          <span>{item.name} × {item.quantity}</span>
                          <span>R{item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                Account Settings
              </h2>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {success && <p style={{ color: 'green' }}>{success}</p>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Email Notifications
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" defaultChecked />
                      <span style={{ fontSize: '0.875rem' }}>Order updates and shipping notifications</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" defaultChecked />
                      <span style={{ fontSize: '0.875rem' }}>New product announcements</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" />
                      <span style={{ fontSize: '0.875rem' }}>Marketing and promotional emails</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Privacy Settings
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" defaultChecked />
                      <span style={{ fontSize: '0.875rem' }}>Allow order history to be saved</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" />
                      <span style={{ fontSize: '0.875rem' }}>Share data for personalized recommendations</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Account Actions
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-outline" onClick={handleChangePassword}>
                      Change Password
                    </button>
                    <button className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={handleDeleteAccount}>
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
