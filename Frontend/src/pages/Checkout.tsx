import { CreditCard, User } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../api/orderService'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useNotification } from '../contexts/NotificationContext'

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { showError, showSuccess } = useNotification()

  const [formData, setFormData] = useState({
    // Billing Information
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: '',

    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!currentUser) throw new Error('User not logged in')
      // Only allow single-item checkout for backend compatibility
      if (items.length !== 1) {
        showError('You can only checkout one item at a time. Please remove extra items from your cart.');
        setLoading(false);
        return;
      }
      const item = items[0];
      const order = {
        productID: item.id,
        customerID: currentUser.id,
        quantity: item.quantity,
        total: item.price * item.quantity
      };
      await createOrder(order);
      clearCart();
      showSuccess('Order placed successfully!');
      navigate('/profile');
    } catch (error) {
      showError('Failed to process payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const subtotal = total
  const tax = total * 0.15
  const finalTotal = subtotal + tax

  return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
            Checkout
          </h1>
          <p style={{ color: '#6b7280' }}>
            Complete your order - items will be collected at the Design Department building
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3" style={{ gap: '2rem' }}>
            {/* Checkout Form */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Billing Information */}
                <div className="card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <User size={20} style={{ color: '#3b82f6' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Billing Information</h3>
                  </div>

                  <div className="grid md:grid-cols-2" style={{ gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        First Name *
                      </label>
                      <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="input"
                          required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Last Name *
                      </label>
                      <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="input"
                          required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Email *
                      </label>
                      <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="input"
                          required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Phone *
                      </label>
                      <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="input"
                          required
                      />
                    </div>
                  </div>
                </div>

                {/* Collection Information */}
                <div className="card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <span style={{ color: '#3b82f6', fontSize: '1.2rem' }}>📍</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Collection Information</h3>
                  </div>
                  
                  <div style={{ 
                    padding: '1rem', 
                    backgroundColor: '#f3f4f6', 
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db'
                  }}>
                    <p style={{ margin: 0, fontWeight: '500', color: '#374151' }}>
                      📦 Items will be collected at the administration office in the Design Department building.
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
                      You will receive a confirmation email with collection details once your order is processed.
                    </p>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <CreditCard size={20} style={{ color: '#3b82f6' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Payment Information</h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Cardholder Name *
                      </label>
                      <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="input"
                          required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Card Number *
                      </label>
                      <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="1234 5678 9012 3456"
                          required
                      />
                    </div>
                    <div className="grid md:grid-cols-2" style={{ gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          Expiry Date *
                        </label>
                        <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className="input"
                            placeholder="MM/YY"
                            required
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          CVV *
                        </label>
                        <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className="input"
                            placeholder="123"
                            required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="card" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                  Order Summary
                </h3>

                {/* Order Items */}
                <div style={{ marginBottom: '1.5rem' }}>
                  {items.map((item) => (
                      <div key={`${item.id}-${item.size}-${item.color}`} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        <div>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: '500' }}>{item.name}</h4>
                          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            Qty: {item.quantity}
                            {item.size && ` • Size: ${item.size}`}
                            {item.color && ` • Color: ${item.color}`}
                          </p>
                        </div>
                        <span style={{ fontWeight: '500' }}>
                      R{(item.price * item.quantity).toFixed(2)}
                    </span>
                      </div>
                  ))}
                </div>

                {/* Totals */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span>R{subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tax (15%)</span>
                    <span>R{tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '600' }}>
                    <span>Total</span>
                    <span>R{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1rem' }}
                    disabled={loading}
                >
                  {loading ? 'Processing...' : `Place Order • R${finalTotal.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
  )
}

export default Checkout
