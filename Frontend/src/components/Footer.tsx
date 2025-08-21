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
                  U
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
                  University Store
                </h3>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                Official merchandise and supplies from the University Marketing Department. 
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
                  All Products
                </Link>
                <Link to="/products/apparel" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Apparel
                </Link>
                <Link to="/products/furniture" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Furniture
                </Link>
                <Link to="/cart" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Shopping Cart
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                Categories
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/products/apparel" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                  T-Shirts & Hoodies
                </Link>
                <Link to="/products/furniture" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Office Chairs
                </Link>
                <Link to="/products/outdoor" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Event Tents
                </Link>
                <Link to="/products/accessories" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Accessories
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
                    ConnollyT@cput.ac.za
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid #374151', 
          paddingTop: '1.5rem', 
          paddingBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
            © 2025 Cape Peninsula University of Technology. All rights reserved.
            <br />
            Contact the Department of Marketing<br />
            Mrs T Connolly (Departmental Secretary)<br />
            Tel: +27 21 460 3306<br />
            Email: ConnollyT@cput.ac.za<br />
            <br />
            Physical address:<br />
            Room E3.18, 3rd Floor, Engineering Building<br />
            District Six Campus<br />
            <br />
            Postal address:<br />
            PO Box 658<br />
            Cape Town<br />
            8000
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
              Privacy Policy
            </a>
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
              Terms of Service
            </a>
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
              Shipping Info
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
