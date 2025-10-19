import { ArrowRight, HeadphonesIcon, Shield, Star, Truck } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllProducts } from '../api/productService'
import ProductCard from '../components/ProductCard'
import { Product, products as staticProducts } from '../data/products'

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch((err) => {
        console.warn('Backend not available, falling back to static data:', err)
        setProducts(staticProducts)
      })
  }, [])
  // Show all products on Home if needed, or keep featured as a separate section
  const featuredProducts = products.slice(0, 8)

  return (
    <div>
      
      <section style={{
        background: 'linear-gradient(135deg, #6B7AA1 0%, #4B5876 100%)', // grayish blue
        color: 'white',
        padding: '4rem 0'
      }}>
        <div className="container">
          <div className="grid md:grid-cols-2" style={{ alignItems: 'center', gap: '3rem' }}>
            <div>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '800',
                lineHeight: '1.1',
                marginBottom: '1.5rem'
              }}>
                Official University
                <span style={{ display: 'block', color: '#93c5fd' }}>
                  Designer Store
                </span>
              </h1>
              <p style={{
                fontSize: '1.25rem',
                lineHeight: '1.6',
                marginBottom: '2rem',
                opacity: 0.9
              }}>
                Official merchandise and supplies from the University Designer Department. Quality products for students, staff, and alumni.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/products" className="btn btn-primary" style={{
                  backgroundColor: 'white',
                  color: '#667eea',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  Shop Now
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <img
                src="assets\images\Logo.png"
                alt="University Students"
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  borderRadius: '1rem',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f9fafb' }}>
        <div className="container">
          <div className="grid md:grid-cols-4" style={{ gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'white'
              }}>
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Secure Payments
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Safe and secure payment processing with multiple payment options
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'white'
              }}>
                <Truck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Pick Up
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Collect your packages at your university doorstep
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#f59e0b',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'white'
              }}>
                <Star size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Premium Quality
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                High-quality products that represent our university with pride
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#8b5cf6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'white'
              }}>
                <HeadphonesIcon size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Support
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Dedicated customer support team ready to help you anytime
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Products */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f9fafb' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Featured Products
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover our most popular items loved by students and staff
            </p>
          </div>

          <div
            className="product-card-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '2.5rem',
              justifyContent: 'center',
              alignItems: 'stretch',
              margin: '0 auto',
              paddingBottom: '2rem',
              minHeight: 400,
              width: '100%',
              maxWidth: '1400px',
            }}
          >
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/products" className="btn btn-primary" style={{
              padding: '1rem 2rem',
              fontSize: '1rem'
            }}>
              View All Products
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{
        padding: '4rem 0',
        background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
        color: 'white'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              Stay Updated
            </h2>
            <p style={{
              fontSize: '1.125rem',
              marginBottom: '2rem',
              opacity: 0.9
            }}>
              Subscribe to our newsletter for exclusive offers, new product launches, 
              and university merchandise updates.
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              maxWidth: '400px',
              margin: '0 auto',
              flexWrap: 'wrap'
            }}>
              <input
                type="email"
                placeholder="Enter your email"
                className="input"
                style={{
                  flex: 1,
                  minWidth: '250px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white'
                }}
              />
              <button className="btn btn-primary" style={{
                backgroundColor: '#3b82f6',
                whiteSpace: 'nowrap'
              }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
