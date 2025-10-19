import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';
import About from './pages/About';

const App: React.FC = () => {
    return (
        <Router>
            <NotificationProvider>
                <AuthProvider>
                    <CartProvider>
                        <div
                            style={{
                                minHeight: '100vh',
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: '#f9fafb'
                            }}
                        >
                            <Routes>
                                {/* Admin Routes - No Header/Footer */}
                                <Route
                                    path="/admin/dashboard"
                                    element={
                                        <ProtectedAdminRoute>
                                            <AdminDashboard />
                                        </ProtectedAdminRoute>
                                    }
                                />
                                {/* Public Routes with Header/Footer */}
                                <Route
                                    path="/*"
                                    element={
                                        <>
                                        <Header />
                                        <main style={{ flex: 1 }}>
                                            <Routes>
                                                <Route path="/" element={<Home />} />
                                                <Route path="/products" element={<Products />} />
                                                <Route path="/products/:id" element={<ProductDetail />} />
                                                <Route path="/cart" element={<Cart />} />
                                                <Route path="/contact" element={<Contact />} />
                                                <Route path="/about" element={<About />} />
                                                <Route path="/login" element={<Login />} />
                                                <Route path="/register" element={<Register />} />

                                                {/* Catch all - redirect to home */}
                                                <Route path="*" element={<Navigate to="/" replace />} />
                                            </Routes>
                                        </main>
                                            <Footer />
                                        </>
                                    }
                                />
                            </Routes>
                        </div>
                    </CartProvider>
                </AuthProvider>
            </NotificationProvider>
        </Router>
    );
};

export default App;
