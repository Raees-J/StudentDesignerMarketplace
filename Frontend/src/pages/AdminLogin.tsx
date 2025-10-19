import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, role, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // AuthContext.login now only accepts email and password. Backend will return role.
      await login(email, password);
      // Navigation will be handled by useEffect below
    } catch (err: any) {
      setError(err?.message || 'Invalid admin credentials');
    }
  };

  useEffect(() => {
    // role is provided by AuthContext and uses uppercase values
    if (role === 'ADMIN') {
      navigate('/admin/dashboard'); // Adjust route as needed
    }
  }, [role, navigate]);

  return (
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
          />
          <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
  );
};

export default AdminLogin;