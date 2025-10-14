import { Menu, Search, ShoppingCart, User, X } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

const Header: React.FC = () => {
  const { currentUser, logout, role } = useAuth()
  const { itemCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showMaps, setShowMaps] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
      <header style={{
        backgroundColor: '#06A3D6', // CPUT blue
        borderBottom: '2px solid #0096C7',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.2rem 0',
            gap: '2rem'
          }}>
            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src="https://www.cput.ac.za/images/cput-logo-white.svg"
                  alt="CPUT"
                  width={240}
                  height={120}
                  style={{ background: 'transparent', display: 'block', maxHeight: 120, maxWidth: 320 }}
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav style={{ display: 'none' }} className="desktop-nav">
              <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                <Link to="/" style={{
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = '#3b82f6'
                        e.currentTarget.style.borderBottomColor = '#3b82f6'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = '#374151'
                        e.currentTarget.style.borderBottomColor = 'transparent'
                      }}>
                  Home
                </Link>
                <Link to="/products" style={{
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = '#3b82f6'
                        e.currentTarget.style.borderBottomColor = '#3b82f6'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = '#374151'
                        e.currentTarget.style.borderBottomColor = 'transparent'
                      }}>
                  Products</Link>
                <Link to="/contact" style={{
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = '#3b82f6'
                        e.currentTarget.style.borderBottomColor = '#3b82f6'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = '#374151'
                        e.currentTarget.style.borderBottomColor = 'transparent'
                      }}>
                        Contact</Link>
                <Link to="/about" style={{
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = '#3b82f6'
                        e.currentTarget.style.borderBottomColor = '#3b82f6'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = '#374151'
                        e.currentTarget.style.borderBottomColor = 'transparent'
                      }}>
                  About
                </Link>
                {/* Admin Panel Link - Only show for admin users */}
                {role === 'admin' && (
                    <Link to="/admin/dashboard" style={{
                      textDecoration: 'none',
                      color: '#374151',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      padding: '0.5rem 0',
                      borderBottom: '2px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.color = '#3b82f6'
                            e.currentTarget.style.borderBottomColor = '#3b82f6'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.color = '#374151'
                            e.currentTarget.style.borderBottomColor = 'transparent'
                          }}>
                      Admin Panel</Link>
                )}

              </div>
            </nav>

            {/* Search Bar and Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flex: 1,
              justifyContent: 'flex-end',
              maxWidth: '600px'
            }}>
              {/* Enhanced Search Bar */}
              <form onSubmit={handleSearch} style={{
                position: 'relative',
                flex: 1,
                maxWidth: '350px',
                minWidth: '250px'
              }}>
                <div style={{ position: 'relative' }}>
                  <Search
                      size={20}
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#6b7280',
                        zIndex: 1
                      }}
                  />
                  <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        paddingLeft: '3rem',
                        paddingRight: '1rem',
                        paddingTop: '0.75rem',
                        paddingBottom: '0.75rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '50px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        backgroundColor: '#f9fafb',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6'
                        e.currentTarget.style.backgroundColor = '#ffffff'
                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb'
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                  />
                </div>
              </form>

              {/* Cart */}
              <Link to="/cart" style={{
                position: 'relative',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                borderRadius: '50%',
                width: '2.75rem',
                height: '2.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                transition: 'all 0.2s ease'
              }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)'
                    }}>
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      borderRadius: '50%',
                      width: '1.5rem',
                      height: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      border: '2px solid white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
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
                          gap: '0.75rem',
                          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.6rem 1.2rem',
                          borderRadius: '50px',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }}
                    >
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <User size={16} />
                      </div>
                      <span>
                    {currentUser.email?.split('@')[0]}
                  </span>
                    </button>

                    {isMenuOpen && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          right: '0',
                          backgroundColor: 'white',
                          border: '2px solid #e5e7eb',
                          borderRadius: '1rem',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                          minWidth: '12rem',
                          zIndex: 50,
                          marginTop: '0.5rem',
                          overflow: 'hidden'
                        }}>
                          {/* Admin Dashboard Link - Only show for admin users */}
                          {role === 'admin' && (
                              <Link
                                  to="/admin/dashboard"
                                  onClick={() => setIsMenuOpen(false)}
                                  style={{
                                    display: 'block',
                                    padding: '1rem 1.25rem',
                                    textDecoration: 'none',
                                    color: '#3b82f6',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    borderBottom: '1px solid #f3f4f6',
                                    transition: 'background-color 0.2s ease'
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f0f9ff'
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                  }}
                              >
                                Admin Dashboard
                              </Link>
                          )}
                          <Link
                              to="/profile"
                              onClick={() => setIsMenuOpen(false)}
                              style={{
                                display: 'block',
                                padding: '1rem 1.25rem',
                                textDecoration: 'none',
                                color: '#374151',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                borderBottom: '1px solid #f3f4f6',
                                transition: 'background-color 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8fafc'
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                              }}
                          >
                            My Profile
                          </Link>
                          <button
                              onClick={() => {
                                handleLogout()
                                setIsMenuOpen(false)
                              }}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '1rem 1.25rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#ef4444',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                transition: 'background-color 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#fef2f2'
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                              }}
                          >
                            Sign Out
                          </button>
                        </div>
                    )}
                  </div>
              ) : (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link to="/login" style={{
                      textDecoration: 'none',
                      padding: '0.6rem 1.5rem',
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      borderRadius: '50px',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)'
                          }}>
                      Login
                    </Link>
                    <Link to="/register" style={{
                      textDecoration: 'none',
                      padding: '0.6rem 1.5rem',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      borderRadius: '50px',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
                          }}>
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
                      style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '600', padding: '0.5rem 0' }}
                  >
                    Home
                  </Link>
                  <Link
                      to="/products"
                      onClick={() => setIsMenuOpen(false)}
                      style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '600', padding: '0.5rem 0' }}
                  >
                    Products
                  </Link>
                  <Link
                      to="/contact"
                      onClick={() => setIsMenuOpen(false)}
                      style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '600', padding: '0.5rem 0' }}
                  >
                  Contact
                  </Link>
                  <Link
                      to="/about"
                      onClick={() => setIsMenuOpen(false)}
                      style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '600', padding: '0.5rem 0' }}
                  >
                  About
                  </Link>
                  <Link
                      to="/designer"
                      onClick={() => setIsMenuOpen(false)}
                      style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '600', padding: '0.5rem 0' }}
                  >
                    Designer
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