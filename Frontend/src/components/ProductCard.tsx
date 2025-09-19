import { Heart, ShoppingCart, X } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { Product } from '../data/products'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart()
  const [showModal, setShowModal] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    })
  }

  // Modal for image view
  const ImageModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }} onClick={() => setShowModal(false)}>
      <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
        <img src={product.image} alt={product.name} style={{
          maxWidth: '80vw',
          maxHeight: '80vh',
          borderRadius: '1.2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
        }} />
        <button onClick={() => setShowModal(false)} style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'rgba(255,255,255,0.85)',
          border: 'none',
          borderRadius: '50%',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
        }}><X size={22} color="#334155" /></button>
      </div>
    </div>
  )

  return (
    <div
      className="product-card-modern"
      style={{
        background: 'white',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px 0 rgba(30,41,59,0.13)',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 420,
        position: 'relative',
        margin: '0.7rem',
        minWidth: 320,
        maxWidth: 400,
        width: '100%',
      }}
    >
      {showModal && <ImageModal />}
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
        {/* Image Section */}
  <div style={{ position: 'relative', width: '100%', height: 260, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderTopLeftRadius: '1.5rem',
              borderTopRightRadius: '1.5rem',
              transition: 'transform 0.3s',
              boxShadow: '0 2px 12px rgba(30,41,59,0.07)'
            }}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.045)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
            onClick={e => { e.preventDefault(); setShowModal(true); }}
          />
          {/* Stock Badge */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            backgroundColor: product.inStock ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '0.35rem 0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(16,185,129,0.10)',
            zIndex: 2,
          }}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </div>
          {/* Wishlist Button */}
          <button
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              backgroundColor: 'rgba(255,255,255,0.95)',
              border: 'none',
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            tabIndex={-1}
            aria-label="Add to wishlist"
          >
            <Heart size={18} style={{ color: '#64748b' }} />
          </button>
        </div>
  {/* Content Section */}
  <div style={{ padding: '1.7rem 1.3rem 1.3rem 1.3rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.7rem' }}>
          {/* Category */}
          <div style={{
            display: 'inline-block',
            backgroundColor: '#e0e7ef',
            color: '#2563eb',
            padding: '0.32rem 0.8rem',
            borderRadius: '0.5rem',
            fontSize: '0.92rem',
            fontWeight: 600,
            textTransform: 'capitalize',
            marginBottom: '0.8rem',
            letterSpacing: '0.01em',
          }}>
            {product.category}
          </div>
          {/* Name */}
          <h3 style={{
            fontSize: '1.32rem',
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: '0.4rem',
            lineHeight: 1.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {product.name}
          </h3>
          {/* Description */}
          <p style={{
            color: '#64748b',
            fontSize: '1.01rem',
            lineHeight: 1.55,
            marginBottom: '1.05rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.5em',
          }}>
            {product.description}
          </p>
          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div style={{ marginBottom: '1.05rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {product.features.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#334155',
                    padding: '0.18rem 0.6rem',
                    borderRadius: '0.3rem',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
          {/* Price and Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            gap: '1.2rem',
            paddingTop: '0.7rem',
          }}>
            <span style={{
              fontSize: '1.7rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.01em',
            }}>
              R{product.price}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              style={{
                padding: '0.8rem 1.5rem',
                fontSize: '1.07rem',
                fontWeight: 600,
                borderRadius: '0.7rem',
                background: product.inStock ? 'linear-gradient(90deg,#3b82f6 0%,#2563eb 100%)' : '#cbd5e1',
                color: 'white',
                border: 'none',
                opacity: product.inStock ? 1 : 0.6,
                cursor: product.inStock ? 'pointer' : 'not-allowed',
                boxShadow: product.inStock ? '0 2px 8px rgba(59,130,246,0.10)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.2s',
              }}
            >
              <ShoppingCart size={19} />
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
