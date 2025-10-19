
import { Clock, Mail, Phone, Send } from 'lucide-react'
import React, { useState } from 'react'

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form submitted:', formData)
    // Handle form submission here
    alert('Thank you for your message! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
            Contact Us
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            Have questions about our products or need assistance? We're here to help!
          </p>
        </div>

  <div className="grid lg:grid-cols-2" style={{ gap: '3rem', alignItems: 'center' }}>
          {/* Contact Information Card */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
            borderRadius: '1.5rem',
            boxShadow: '0 12px 32px 0 rgba(59,130,246,0.10), 0 2px 8px 0 rgba(30,41,59,0.06)',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            justifyContent: 'center',
            minHeight: 480,
            transition: 'transform 0.25s cubic-bezier(.4,2,.6,1)',
            willChange: 'transform',
            position: 'relative',
            top: 0,
            zIndex: 2,
            filter: 'drop-shadow(0 8px 24px rgba(59,130,246,0.10))',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937', letterSpacing: '-0.01em' }}>
              Get in Touch
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div style={{
                width: '3.2rem', height: '3.2rem', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.3rem', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(59,130,246,0.10)'
              }}>📍</div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>Address</h3>
                <p style={{ color: '#6b7280' }}>
                  District Six Campus, Room E3.18, 3rd Floor, Engineering Building<br />
                  Cape Town, 7700, South Africa
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div style={{
                width: '3.2rem', height: '3.2rem', backgroundColor: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 2px 8px rgba(16,185,129,0.10)'
              }}><Phone size={22} /></div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>Phone</h3>
                <p style={{ color: '#6b7280' }}>+27 21 650 9000</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div style={{
                width: '3.2rem', height: '3.2rem', backgroundColor: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 2px 8px rgba(245,158,11,0.10)'
              }}><Mail size={22} /></div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>Email</h3>
                <p style={{ color: '#6b7280' }}>230558135@mycput.ac.za</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div style={{
                width: '3.2rem', height: '3.2rem', backgroundColor: '#8b5cf6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 2px 8px rgba(139,92,246,0.10)'
              }}><Clock size={22} /></div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>Hours</h3>
                <p style={{ color: '#6b7280' }}>
                  Mon - Fri: 8:00 AM - 5:00 PM<br />
                  Sat: 9:00 AM - 2:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div style={{
            background: 'linear-gradient(135deg, #fff 0%, #f3f4f6 100%)',
            borderRadius: '1.5rem',
            boxShadow: '0 12px 32px 0 rgba(59,130,246,0.10), 0 2px 8px 0 rgba(30,41,59,0.06)',
            padding: '2.5rem',
            minHeight: 480,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '1.5rem',
            transition: 'transform 0.25s cubic-bezier(.4,2,.6,1)',
            willChange: 'transform',
            position: 'relative',
            top: 0,
            zIndex: 2,
            filter: 'drop-shadow(0 8px 24px rgba(59,130,246,0.10))',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937', letterSpacing: '-0.01em', textAlign: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.7rem', background: 'linear-gradient(90deg,#3b82f6 0%,#10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, fontSize: '1.7rem' }}>
                <Send size={24} style={{ color: '#3b82f6', background: 'white', borderRadius: '50%', boxShadow: '0 2px 8px rgba(59,130,246,0.10)', padding: '0.2rem' }} />
                Send us a Message
              </span>
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                    required
                    placeholder="Your full name"
                    style={{ borderRadius: '0.7rem', border: '1px solid #e5e7eb', padding: '0.9rem 1.2rem', fontSize: '1rem', background: '#f9fafb', boxShadow: '0 1px 4px rgba(59,130,246,0.04)' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input"
                    required
                    placeholder="your.email@example.com"
                    style={{ borderRadius: '0.7rem', border: '1px solid #e5e7eb', padding: '0.9rem 1.2rem', fontSize: '1rem', background: '#f9fafb', boxShadow: '0 1px 4px rgba(59,130,246,0.04)' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="input"
                  required
                  placeholder="What is this about?"
                  style={{ borderRadius: '0.7rem', border: '1px solid #e5e7eb', padding: '0.9rem 1.2rem', fontSize: '1rem', background: '#f9fafb', boxShadow: '0 1px 4px rgba(59,130,246,0.04)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="input"
                  required
                  placeholder="Tell us how we can help you..."
                  style={{ borderRadius: '0.7rem', border: '1px solid #e5e7eb', padding: '0.9rem 1.2rem', fontSize: '1rem', background: '#f9fafb', resize: 'vertical', minHeight: '120px', boxShadow: '0 1px 4px rgba(59,130,246,0.04)' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '0.7rem', padding: '1rem', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 4px 16px rgba(59,130,246,0.10)', letterSpacing: '0.01em', transition: 'background 0.2s' }}>
                <Send size={20} style={{ marginRight: '0.5rem' }} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
  )
}

export default Contact
