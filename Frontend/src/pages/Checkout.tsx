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

    // Payment Method
    paymentMethod: 'Card',

    // Payment Information (Card)
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',

    // EFT Information
    bankName: '',
    accountNumber: '',
    branchCode: '',
    accountHolder: ''
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
        total: item.price * item.quantity,
        paymentMethod: formData.paymentMethod
      };
      await createOrder(order);
      clearCart();
      
      // Different success messages based on payment method
      if (formData.paymentMethod === 'Cash') {
        toast.success('Order placed! Check your email for collection details.');
      } else if (formData.paymentMethod === 'EFT') {
        toast.success('Order placed! EFT payment details sent to your email.');
      } else {
        toast.success('Order placed successfully!');
      }
      
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

                  {/* Payment Method Selection */}
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '500' }}>
                      Select Payment Method *
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        padding: '1rem', 
                        border: '2px solid', 
                        borderColor: formData.paymentMethod === 'Card' ? '#3b82f6' : '#e5e7eb',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        backgroundColor: formData.paymentMethod === 'Card' ? '#eff6ff' : 'white'
                      }}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Card"
                          checked={formData.paymentMethod === 'Card'}
                          onChange={handleInputChange}
                          style={{ margin: 0 }}
                        />
                        <CreditCard size={20} />
                        <div>
                          <strong>Credit/Debit Card</strong>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                            Pay securely with your card
                          </p>
                        </div>
                      </label>

                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        padding: '1rem', 
                        border: '2px solid', 
                        borderColor: formData.paymentMethod === 'EFT' ? '#3b82f6' : '#e5e7eb',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        backgroundColor: formData.paymentMethod === 'EFT' ? '#eff6ff' : 'white'
                      }}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="EFT"
                          checked={formData.paymentMethod === 'EFT'}
                          onChange={handleInputChange}
                          style={{ margin: 0 }}
                        />
                        <span style={{ fontSize: '1.25rem' }}>🏦</span>
                        <div>
                          <strong>EFT Payment</strong>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                            Electronic Funds Transfer
                          </p>
                        </div>
                      </label>

                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        padding: '1rem', 
                        border: '2px solid', 
                        borderColor: formData.paymentMethod === 'Cash' ? '#3b82f6' : '#e5e7eb',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        backgroundColor: formData.paymentMethod === 'Cash' ? '#eff6ff' : 'white'
                      }}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Cash"
                          checked={formData.paymentMethod === 'Cash'}
                          onChange={handleInputChange}
                          style={{ margin: 0 }}
                        />
                        <span style={{ fontSize: '1.25rem' }}>💰</span>
                        <div>
                          <strong>Cash on Pickup</strong>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                            Pay in cash when you collect your order
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Payment Details Forms */}
                  {formData.paymentMethod === 'Card' && (
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
                      <div style={{ 
                        padding: '1rem', 
                        backgroundColor: '#fef3c7', 
                        borderRadius: '0.5rem',
                        border: '1px solid #f59e0b'
                      }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e' }}>
                          ⚠️ <strong>Note:</strong> This is a demo system. Card details are not processed or stored.
                        </p>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'EFT' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          Bank Name *
                        </label>
                        <select
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            className="input"
                            required
                        >
                          <option value="">Select your bank</option>
                          <option value="ABSA">ABSA</option>
                          <option value="Standard Bank">Standard Bank</option>
                          <option value="FNB">FNB</option>
                          <option value="Nedbank">Nedbank</option>
                          <option value="Capitec">Capitec</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          Account Holder Name *
                        </label>
                        <input
                            type="text"
                            name="accountHolder"
                            value={formData.accountHolder}
                            onChange={handleInputChange}
                            className="input"
                            required
                        />
                      </div>
                      <div className="grid md:grid-cols-2" style={{ gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Account Number *
                          </label>
                          <input
                              type="text"
                              name="accountNumber"
                              value={formData.accountNumber}
                              onChange={handleInputChange}
                              className="input"
                              placeholder="123456789"
                              required
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Branch Code *
                          </label>
                          <input
                              type="text"
                              name="branchCode"
                              value={formData.branchCode}
                              onChange={handleInputChange}
                              className="input"
                              placeholder="123456"
                              required
                          />
                        </div>
                      </div>
                      <div style={{ 
                        padding: '1rem', 
                        backgroundColor: '#dbeafe', 
                        borderRadius: '0.5rem',
                        border: '1px solid #3b82f6'
                      }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e40af' }}>
                          💡 <strong>EFT Instructions:</strong> You will receive payment details via email to complete your EFT transfer. Your order will be processed once payment is confirmed.
                        </p>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'Cash' && (
                    <div style={{ 
                      padding: '1.5rem', 
                      backgroundColor: '#f0fdf4', 
                      borderRadius: '0.5rem',
                      border: '2px solid #16a34a'
                    }}>
                      <h4 style={{ margin: '0 0 1rem 0', color: '#15803d', fontSize: '1.125rem' }}>
                        💰 Cash Payment Instructions
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem', color: '#166534' }}>
                        <li>Your order will be reserved for <strong>48 hours</strong></li>
                        <li>Collect your item at the Design Department building</li>
                        <li>Pay in cash when you collect your order</li>
                        <li>Bring exact change if possible</li>
                        <li>You will receive collection details via email</li>
                      </ul>
                    </div>
                  )}
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
                  {loading ? 'Processing...' : 
                    formData.paymentMethod === 'Cash' ? `Reserve Order • R${finalTotal.toFixed(2)}` :
                    formData.paymentMethod === 'EFT' ? `Place Order (EFT) • R${finalTotal.toFixed(2)}` :
                    `Place Order • R${finalTotal.toFixed(2)}`
                  }
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
  )
}

export default Checkout
