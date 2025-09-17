import { Heart, ShoppingCart } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { Product } from '../data/products'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart()

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

  return (
    <div
      className="product-card-modern"
      style={{
        background: 'white',
        borderRadius: '1.25rem',
        boxShadow: '0 6px 24px 0 rgba(30,41,59,0.10)',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 400,
        position: 'relative',
      }}
    >
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
        {/* Image Section */}
        <div style={{ position: 'relative', width: '100%', height: 260, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderTopLeftRadius: '1.25rem',
              borderTopRightRadius: '1.25rem',
              transition: 'transform 0.3s',
            }}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
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
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Category */}
          <div style={{
            display: 'inline-block',
            backgroundColor: '#e0e7ef',
            color: '#2563eb',
            padding: '0.3rem 0.7rem',
            borderRadius: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'capitalize',
            marginBottom: '0.7rem',
            letterSpacing: '0.01em',
          }}>
            {product.category}
          </div>
          {/* Name */}
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: '0.5rem',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {product.name}
          </h3>
          {/* Description */}
          <p style={{
            color: '#64748b',
            fontSize: '0.97rem',
            lineHeight: 1.5,
            marginBottom: '1.1rem',
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
            <div style={{ marginBottom: '1.1rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
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
            gap: '1rem',
          }}>
            <span style={{
              fontSize: '1.6rem',
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
                padding: '0.7rem 1.3rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '0.6rem',
                background: product.inStock ? 'linear-gradient(90deg,#3b82f6 0%,#2563eb 100%)' : '#cbd5e1',
                color: 'white',
                border: 'none',
                opacity: product.inStock ? 1 : 0.6,
                cursor: product.inStock ? 'pointer' : 'not-allowed',
                boxShadow: product.inStock ? '0 2px 8px rgba(59,130,246,0.10)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
              }}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
