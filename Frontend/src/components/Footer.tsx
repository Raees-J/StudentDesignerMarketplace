import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#1f2937', color: 'white', marginTop: '4rem' }}>
      <div className="container">
        <div style={{ padding: '3rem 0 2rem' }}>
          <div className="grid md:grid-cols-4" style={{ gap: '2rem' }}>
            {/* Company Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '2rem', 
                  height: '2rem', 
                  backgroundColor: '#3b82f6', 
                  borderRadius: '0.375rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                }}>
                  SDM
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
                  Designer Market
                </h3>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                Official merchandise and supplies from the University Design Department. 
                Quality products for students, staff, and alumni.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  <Facebook size={20} />
                </a>
                <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  <Twitter size={20} />
                </a>
                <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                Quick Links
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Home
                </Link>
                <Link to="/products" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Products
                </Link>
                <Link to="/about" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                  About us
                </Link>
                <Link to="/contact" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                Contact Us
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} style={{ color: '#9ca3af' }} />
                  <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                    District Six Campus, Room E3.18, 3rd Floor, Engineering Building
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} style={{ color: '#9ca3af' }} />
                  <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                    +27 21 460 3306
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} style={{ color: '#9ca3af' }} />
                  <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                    230558135@mycput.ac.za
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>      
      </div>
    </footer>
  )
}

export default Footer
