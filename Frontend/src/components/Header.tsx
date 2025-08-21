import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth()
  const { itemCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '2.5rem', 
                height: '2.5rem', 
                backgroundColor: '#3b82f6', 
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                U
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  University Store
                </h1>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                  Marketing Department
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ display: 'none' }} className="desktop-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <Link to="/" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500' }}>
                Home
              </Link>
              <Link to="/products" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500' }}>
                All Products
              </Link>
              <Link to="/products/apparel" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500' }}>
                Apparel
              </Link>
              <Link to="/products/furniture" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500' }}>
                Furniture
              </Link>
              <Link to="/products/outdoor" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500' }}>
                Outdoor
              </Link>
              <Link to="/products/accessories" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500' }}>
                Accessories
              </Link>
            </div>
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Search */}
            <button style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              color: '#6b7280'
            }}>
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link to="/cart" style={{ 
              position: 'relative', 
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              color: '#6b7280'
            }}>
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '1.25rem',
                  height: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {currentUser ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    color: '#6b7280'
                  }}
                >
                  <User size={20} />
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {currentUser.displayName || 'User'}
                  </span>
                </button>

                {isMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    minWidth: '12rem',
                    zIndex: 50,
                    marginTop: '0.25rem'
                  }}>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      style={{
                        display: 'block',
                        padding: '0.75rem 1rem',
                        textDecoration: 'none',
                        color: '#374151',
                        fontSize: '0.875rem',
                        borderBottom: '1px solid #f3f4f6'
                      }}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#ef4444',
                        fontSize: '0.875rem'
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                display: 'block',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                color: '#6b7280'
              }}
              className="mobile-menu-btn"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav style={{ 
            display: 'block',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '1rem',
            paddingBottom: '1rem'
          }} className="mobile-nav">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500', padding: '0.5rem 0' }}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                onClick={() => setIsMenuOpen(false)}
                style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500', padding: '0.5rem 0' }}
              >
                All Products
              </Link>
              <Link 
                to="/products/apparel" 
                onClick={() => setIsMenuOpen(false)}
                style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500', padding: '0.5rem 0' }}
              >
                Apparel
              </Link>
              <Link 
                to="/products/furniture" 
                onClick={() => setIsMenuOpen(false)}
                style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500', padding: '0.5rem 0' }}
              >
                Furniture
              </Link>
              <Link 
                to="/products/outdoor" 
                onClick={() => setIsMenuOpen(false)}
                style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500', padding: '0.5rem 0' }}
              >
                Outdoor
              </Link>
              <Link 
                to="/products/accessories" 
                onClick={() => setIsMenuOpen(false)}
                style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500', padding: '0.5rem 0' }}
              >
                Accessories
              </Link>
            </div>
          </nav>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: block !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-nav {
            display: none !important;
          }
        }
      `}</style>
    </header>
  )
}

export default Header
