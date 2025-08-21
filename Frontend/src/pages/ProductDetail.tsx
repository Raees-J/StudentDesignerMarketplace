import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import { products } from '../data/products'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

const ProductDetail: React.FC = () => {
  const { id } = useParams()
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  const product = products.find(p => p.id === id)

  if (!product) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
          Product Not Found
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          The product you're looking for doesn't exist.
        </p>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size')
      return
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color')
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      size: selectedSize,
      color: selectedColor
    })

    toast.success('Added to cart!')
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        style={{
          color: i < rating ? '#fbbf24' : '#d1d5db',
          fill: i < rating ? '#fbbf24' : 'none'
        }}
      />
    ))
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          to="/products" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '0.875rem'
          }}
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </div>

      <div className="grid lg:grid-cols-2" style={{ gap: '3rem', marginBottom: '3rem' }}>
        {/* Product Images */}
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '500px',
                objectFit: 'cover',
                borderRadius: '0.75rem'
              }}
            />
          </div>
          
          {/* Thumbnail Images */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={product.image}
                alt={`${product.name} view ${i}`}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  border: i === 1 ? '2px solid #3b82f6' : '2px solid transparent'
                }}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
              {product.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {renderStars(product.rating)}
                <span style={{ marginLeft: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  ({product.rating}) • 127 reviews
                </span>
              </div>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6' }}>
              R{product.price.toFixed(2)}
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              {product.description}
            </p>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                Size
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: selectedSize === size ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      backgroundColor: selectedSize === size ? '#eff6ff' : 'white',
                      color: selectedSize === size ? '#3b82f6' : '#374151',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                Color
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: selectedColor === color ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      backgroundColor: selectedColor === color ? '#eff6ff' : 'white',
                      color: selectedColor === color ? '#3b82f6' : '#374151',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              Quantity
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="btn btn-outline"
                style={{ padding: '0.5rem', minWidth: 'auto' }}
              >
                -
              </button>
              <span style={{ 
                minWidth: '3rem', 
                textAlign: 'center', 
                fontWeight: '600',
                padding: '0.5rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem'
              }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="btn btn-outline"
                style={{ padding: '0.5rem', minWidth: 'auto' }}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={handleAddToCart}
              className="btn btn-primary"
              style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button
              className="btn btn-outline"
              style={{ padding: '1rem', minWidth: 'auto' }}
            >
              <Heart size={20} />
            </button>
            <button
              className="btn btn-outline"
              style={{ padding: '1rem', minWidth: 'auto' }}
            >
              <Share2 size={20} />
            </button>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>
              <Truck size={18} style={{ color: '#10b981' }} />
              <span>Free shipping on orders over R500</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>
              <Shield size={18} style={{ color: '#10b981' }} />
              <span>2-year warranty included</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>
              <RotateCcw size={18} style={{ color: '#10b981' }} />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '1rem 0',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: activeTab === tab ? '#3b82f6' : '#6b7280',
                  fontWeight: activeTab === tab ? '600' : '400',
                  borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div>
          {activeTab === 'description' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                Product Description
              </h3>
              <div style={{ color: '#6b7280', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '1rem' }}>
                  {product.description}
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  This premium university merchandise is crafted with attention to detail and quality materials. 
                  Perfect for students, alumni, and university supporters who want to show their school pride 
                  in style.
                </p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li>High-quality materials for durability</li>
                  <li>Comfortable fit for everyday wear</li>
                  <li>Official university branding</li>
                  <li>Machine washable for easy care</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                Specifications
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Materials</h4>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>100% Cotton blend</p>
                </div>
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Care Instructions</h4>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Machine wash cold, tumble dry low</p>
                </div>
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Origin</h4>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Made in South Africa</p>
                </div>
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Weight</h4>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>0.5kg</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                Customer Reviews
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { name: 'Sarah M.', rating: 5, comment: 'Excellent quality and fast shipping. Love the design!' },
                  { name: 'John D.', rating: 4, comment: 'Great product, fits perfectly. Would recommend.' },
                  { name: 'Lisa K.', rating: 5, comment: 'Amazing quality for the price. Very satisfied with my purchase.' }
                ].map((review, index) => (
                  <div key={index} style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '600' }}>{review.name}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
