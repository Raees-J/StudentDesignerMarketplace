import React from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

const Cart: React.FC = () => {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <ShoppingBag size={64} style={{ color: '#9ca3af', margin: '0 auto 2rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
            Your cart is empty
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/products" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
          Shopping Cart
        </h1>
        <p style={{ color: '#6b7280' }}>
          {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid lg:grid-cols-3" style={{ gap: '2rem' }}>
        {/* Cart Items */}
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {item.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="btn btn-outline"
                          style={{ padding: '0.5rem', minWidth: 'auto' }}
                        >
                          <Minus size={16} />
                        </button>
                        <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: '600' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="btn btn-outline"
                          style={{ padding: '0.5rem', minWidth: 'auto' }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                          R{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="btn btn-outline"
                          style={{ padding: '0.5rem', minWidth: 'auto', color: '#ef4444', borderColor: '#ef4444' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/products" className="btn btn-outline">
              Continue Shopping
            </Link>
            <button onClick={clearCart} className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              Order Summary
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>R{total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span>R{total > 500 ? '0.00' : '50.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tax</span>
                <span>R{(total * 0.15).toFixed(2)}</span>
              </div>
              <hr />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '600' }}>
                <span>Total</span>
                <span>R{(total + (total > 500 ? 0 : 50) + (total * 0.15)).toFixed(2)}</span>
              </div>
            </div>

            {total > 500 && (
              <div style={{
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}>
                🎉 You qualify for free shipping!
              </div>
            )}

            <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
