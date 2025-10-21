import { Heart, ShoppingCart, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProductReviewStats, ReviewStats } from '../api/reviewService'
import { useCart } from '../contexts/CartContext'
import { Product } from '../data/products'
import ReviewSection from './ReviewSection'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart()
  const [showModal, setShowModal] = useState(false)
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [showScrollHint, setShowScrollHint] = useState(true)

  // Load review data when component mounts
  useEffect(() => {
    const loadReviewStats = async () => {
      try {
        const stats = await getProductReviewStats(product.id)
        setReviewStats(stats)
      } catch (error) {
        console.error('Error loading review stats:', error)
        // Keep default values on error
      } finally {
        setLoading(false)
      }
    }
    
    loadReviewStats()
  }, [product.id])

  // Handle scroll lock when modal opens/closes
  useEffect(() => {
    if (showModal) {
      // Lock background scroll
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '15px' // Prevent layout shift from scrollbar
      // Reset scroll hint when modal opens
      setShowScrollHint(true)
    } else {
      // Restore background scroll
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }
  }, [showModal])

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

  // Modal for image and description view - E-commerce style layout
  const ImageModal = () => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    
    // Create multiple views of the same product image for thumbnail effect
    const productImages = [
      product.image
    ]

    return (
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
        zIndex: 1000,
        padding: '1rem'
      }} 
      onClick={() => setShowModal(false)}>
        <div style={{ 
          position: 'relative', 
          width: window.innerWidth > 1024 ? '1200px' : '95vw',
          maxHeight: 'calc(100vh - 1rem)',
          height: '95vh',
          minHeight: '600px',
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: window.innerWidth > 1024 ? 'row' : 'column'
        }} 
        onClick={e => e.stopPropagation()}
        onTouchMove={e => e.stopPropagation()}>
          
          {/* Left Thumbnail Section - Desktop only */}
          {window.innerWidth > 1024 && (
            <div style={{
              width: '100px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '20px 10px',
              borderRight: '1px solid #f1f5f9',
              backgroundColor: '#fafafb'
            }}>
              {productImages.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  style={{
                    width: '80px',
                    height: '80px',
                    border: selectedImageIndex === index ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img src={img} alt={`${product.name} view ${index + 1}`} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }} />
                </div>
              ))}
            </div>
          )}
          
          {/* Center Main Image Section */}
          <div style={{ 
            flex: window.innerWidth > 1024 ? '1' : '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: '#fafafb',
            minHeight: window.innerWidth > 1024 ? '400px' : '300px',
            maxHeight: window.innerWidth > 1024 ? '500px' : '400px'
          }}>
            <img src={productImages[selectedImageIndex]} alt={product.name} style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: '8px'
            }} />
          </div>
          
          {/* Right Product Details Section */}
          <div 
            className="modal-scroll" 
            style={{
              flex: '1',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'white',
              borderLeft: window.innerWidth > 1024 ? '1px solid #f1f5f9' : 'none',
              overflowY: 'auto',
              height: '100%',
              maxHeight: '95vh',
              position: 'relative',
              scrollBehavior: 'smooth'
            }}
            onScroll={(e) => {
              const element = e.currentTarget
              if (element.scrollTop > 50) {
                setShowScrollHint(false)
              }
            }}
          >
            {/* Scroll Indicator */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '20px',
              color: '#9ca3af',
              fontSize: '12px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              opacity: 0.8
            }}>
              <span>Scroll to see more</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Brand/Category */}
            <div style={{
              color: '#3b82f6',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {product.category}
            </div>
            
            {/* Product Name */}
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '12px',
              lineHeight: 1.3
            }}>
              {product.name}
            </h1>
            
            {/* Product Code */}
            <div style={{
              color: '#6b7280',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              Product Code: {product.id}
            </div>
            
            {/* Rating */}
            {loading ? (
              <div style={{ marginBottom: '20px', color: '#6b7280' }}>
                Loading reviews...
              </div>
            ) : reviewStats.totalReviews > 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map(star => (
                    <span 
                      key={star} 
                      style={{ 
                        color: star <= Math.round(reviewStats.averageRating) ? '#fbbf24' : '#e5e7eb', 
                        fontSize: '16px' 
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span style={{ color: '#3b82f6', fontSize: '14px', fontWeight: '500' }}>
                  {reviewStats.averageRating.toFixed(1)} ({reviewStats.totalReviews} Review{reviewStats.totalReviews !== 1 ? 's' : ''})
                </span>
              </div>
            ) : (
              <div style={{
                marginBottom: '20px',
                color: '#6b7280',
                fontSize: '14px'
              }}>
                No reviews yet
              </div>
            )}
            
            {/* Price */}
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#059669',
              marginBottom: '20px'
            }}>
              R{product.price.toFixed(2)}
            </div>
            
            {/* Size Selection */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px'
              }}>
                Select a size:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['S', 'M', 'L', 'XL', '2XL'].map(size => (
                  <button key={size} style={{
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6'
                    e.currentTarget.style.backgroundColor = '#eff6ff'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.backgroundColor = 'white'
                  }}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Description - Scrollable */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Description:
              </div>
              <div className="modal-scroll" style={{
                maxHeight: '200px',
                overflowY: 'auto',
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#4b5563'
              }}>
                {product.description}
              </div>
            </div>
            
            {/* Features */}
            <div style={{ marginBottom: '20px' }}>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: 1.6
              }}>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>•</span>
                  Free Delivery Available
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>•</span>
                  Hassle-Free Exchanges & Returns for 30 Days
                </li>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>•</span>
                  6-Month Limited Warranty
                </li>
              </ul>
            </div>

            {/* Reviews Section */}
            <div style={{ marginBottom: '24px' }}>
              <ReviewSection productId={product.id} />
            </div>
            
            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              marginTop: '20px',
              padding: '16px 0 0 0',
              borderTop: '1px solid #f1f5f9'
            }}>
              <Link
                to={`/products/${product.id}#reviews`}
                onClick={() => setShowModal(false)}
                style={{
                  flex: '1',
                  padding: '14px',
                  backgroundColor: 'transparent',
                  color: '#3b82f6',
                  border: '1px solid #3b82f6',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                View Reviews
              </Link>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddToCart(e)
                  setShowModal(false)
                }}
                style={{
                  flex: '2',
                  padding: '14px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Floating Scroll Down Button */}
          {showScrollHint && (
            <button 
              onClick={() => {
                const scrollContainer = document.querySelector('.modal-scroll')
                if (scrollContainer) {
                  scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight / 2,
                    behavior: 'smooth'
                  })
                }
              }}
              style={{
                position: 'absolute',
                bottom: '80px',
                right: '20px',
                background: 'rgba(59, 130, 246, 0.9)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 9,
                animation: 'bounce 2s infinite'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          
          {/* Close Button */}
          <button onClick={() => setShowModal(false)} style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 10
          }}>
            <X size={20} color="#6b7280" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="product-card-modern"
      style={{
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 6px 24px 0 rgba(30,41,59,0.10)',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 350,
        position: 'relative',
        margin: '0.5rem',
        minWidth: 280,
        maxWidth: 320,
        width: '100%',
      }}
    >
      {showModal && <ImageModal />}
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
        {/* Image Section */}
  <div style={{ position: 'relative', width: '100%', height: 200, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderTopLeftRadius: '1rem',
              borderTopRightRadius: '1rem',
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
  <div style={{ padding: '1.2rem 1rem 1rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.6rem' }}>
          {/* Category */}
          <div style={{
            display: 'inline-block',
            backgroundColor: '#e0e7ef',
            color: '#2563eb',
            padding: '0.25rem 0.6rem',
            borderRadius: '0.4rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'capitalize',
            marginBottom: '0.6rem',
            letterSpacing: '0.01em',
          }}>
            {product.category}
          </div>
          {/* Name */}
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: '0.3rem',
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
            fontSize: '0.9rem',
            lineHeight: 1.4,
            marginBottom: '0.8rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.8em',
          }}>
            {product.description}
          </p>
          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div style={{ marginBottom: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {product.features.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#334155',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
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
              fontSize: '1.4rem',
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
                padding: '0.6rem 1.2rem',
                fontSize: '0.9rem',
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
