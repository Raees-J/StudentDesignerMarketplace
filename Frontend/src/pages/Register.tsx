import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
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
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const success = await register(formData.firstName, formData.lastName, formData.email, formData.password);
      if (success) {
        navigate('/'); // redirect after registration
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      background: 'linear-gradient(to right, #eff6ff, #f9fafb)',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Create Account
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            Fill in your details to sign up
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          {/* First Name */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.4rem',
              fontWeight: 600,
              color: '#374151'
            }}>
              First Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: '0.5rem',
                  border: `1px solid ${errors.firstName ? '#ef4444' : '#d1d5db'}`,
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            {errors.firstName && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.4rem',
              fontWeight: 600,
              color: '#374151'
            }}>
              Last Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: '0.5rem',
                  border: `1px solid ${errors.lastName ? '#ef4444' : '#d1d5db'}`,
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            {errors.lastName && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.4rem',
              fontWeight: 600,
              color: '#374151'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: '0.5rem',
                  border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            {errors.email && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.4rem',
              fontWeight: 600,
              color: '#374151'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                  borderRadius: '0.5rem',
                  border: `1px solid ${errors.password ? '#ef4444' : '#d1d5db'}`,
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.4rem',
              fontWeight: 600,
              color: '#374151'
            }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                  borderRadius: '0.5rem',
                  border: `1px solid ${errors.confirmPassword ? '#ef4444' : '#d1d5db'}`,
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af'
                }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.8rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: loading ? '#93c5fd' : '#2563eb',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
