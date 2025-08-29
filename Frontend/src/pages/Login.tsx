
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') as 'admin' | 'user' | null;
  const [role, setRole] = useState<'admin' | 'user'>(roleParam || 'user');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { login, loading, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect appropriately
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (roleParam) {
      setRole(roleParam);
    }
  }, [roleParam]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      console.log('Submitting login form with role:', role);
      const success = await login(formData.email, formData.password, role);

      if (success) {
        console.log('Login successful, redirecting...');
        // Navigation will be handled by the useEffect above
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Login submission error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const handleRoleChange = (newRole: 'admin' | 'user') => {
    setRole(newRole);
    setFormData({ email: '', password: '' });
    setErrors({});
    navigate(`/login?role=${newRole}`, { replace: true });
  };

  return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 0'
      }}>
        <div className="container" style={{ maxWidth: '400px' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                {role === 'admin' ? (
                    <Shield size={48} style={{ color: '#3b82f6', margin: '0 auto' }} />
                ) : (
                    <User size={48} style={{ color: '#3b82f6', margin: '0 auto' }} />
                )}
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
                {role === 'admin' ? 'Admin Login' : 'Welcome Back'}
              </h1>
              <p style={{ color: '#6b7280' }}>
                {role === 'admin'
                    ? 'Sign in to manage the University Store'
                    : 'Sign in to your account to continue shopping'}
              </p>
            </div>

            {/* Role Toggle */}
            <div style={{
              display: 'flex',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.5rem',
              padding: '0.25rem',
              marginBottom: '1.5rem'
            }}>
              <button
                  type="button"
                  onClick={() => handleRoleChange('user')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: role === 'user' ? '#3b82f6' : 'transparent',
                    color: role === 'user' ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
              >
                Customer
              </button>
              <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: role === 'admin' ? '#3b82f6' : 'transparent',
                    color: role === 'admin' ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={20} style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} />
                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input"
                      style={{
                        paddingLeft: '2.5rem',
                        borderColor: errors.email ? '#ef4444' : undefined
                      }}
                      placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.email}
                    </p>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={20} style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} />
                  <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input"
                      style={{
                        paddingLeft: '2.5rem',
                        paddingRight: '2.5rem',
                        borderColor: errors.password ? '#ef4444' : undefined
                      }}
                      placeholder="Enter your password"
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af'
                      }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.password}
                    </p>
                )}
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
              >
                {loading ? 'Signing in...' : `Sign in as ${role === 'admin' ? 'Admin' : 'Customer'}`}
              </button>
            </form>

            {role === 'user' && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        style={{
                          color: '#3b82f6',
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Login;
