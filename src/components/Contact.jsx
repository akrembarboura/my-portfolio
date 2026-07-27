import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import ContactInfoItem from './ContactInfoItem'
import contactInfo from '../data/contact'
import { supabase } from '../supabaseClient'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [gettingLocation, setGettingLocation] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    subject: '',
    message: ''
  })

  const headerRef = useScrollReveal()
  const formRef = useScrollReveal()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }
    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          location: `${position.coords.latitude}, ${position.coords.longitude}`
        }))
        setGettingLocation(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        alert("Unable to retrieve your location")
        setGettingLocation(false)
      }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setErrorMessage('')

    const { error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          location: formData.location,
          projectType: formData.subject,
          message: formData.message
          // status & created_at handled automatically by DB defaults
        }
      ])

    setSending(false)

    if (error) {
      console.error('Error submitting lead:', error)
      setErrorMessage('Failed to send message. Please try again later.')
    } else {
      setSubmitted(true)
    }
  }

  return (
    <section id="contact">
      <div className="container">
        <div ref={headerRef}>
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">
            Let's Build Something<br />Together
          </h2>
          <p className="section-sub">
            I'm currently open to new opportunities. Whether you have a project in
            mind, want to collaborate, or just want to say hi — my inbox is always open.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="availability-badge">
              <span className="dot" />
              Open to work — Available now
            </div>

            {contactInfo.map((item) => (
              <ContactInfoItem key={item.id} {...item} />
            ))}

            <div className="code-block" style={{ marginTop: '1rem' }}>
              {`// Let's connect!
const developer = {
  name: 'Akrem Barboura',
  location: 'Tunisia 🇹🇳',
  stack: ['MERN'],
  available: true
};`}
            </div>
          </div>

          <div className="contact-form" ref={formRef}>
            {!submitted ? (
              <form id="formContent" onSubmit={handleSubmit}>
                <h3 className="form-title">Send a Message 💬</h3>
                <p className="form-sub">I'll get back to you within 24 hours.</p>

                {errorMessage && (
                  <p style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {errorMessage}
                  </p>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      className="form-input"
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      className="form-input"
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-input"
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    className="form-input"
                    type="text"
                    name="subject"
                    placeholder="Project Inquiry / Collaboration"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-textarea"
                    name="message"
                    placeholder="Tell me about your project or idea..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gettingLocation || formData.location !== ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.875rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 500,
                    marginBottom: '1rem',
                    transition: 'all 0.2s ease',
                    cursor: formData.location ? 'default' : 'pointer',
                    background: formData.location ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-2)',
                    border: formData.location ? '1px solid #10b981' : '1px solid var(--border-color)',
                    color: formData.location ? '#10b981' : 'var(--text-1)'
                  }}
                >
                  {gettingLocation ? (
                    <>
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                      Requesting Permission...
                    </>
                  ) : formData.location ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      Location Attached
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                      Attach My Location (Optional)
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  className="form-submit"
                  disabled={sending}
                  style={sending ? { opacity: 0.7, pointerEvents: 'none' } : {}}
                >
                  {sending ? 'Sending...' : 'Send Message ✈️'}
                </button>
              </form>
            ) : (
              <div className="form-success">
                <span className="success-icon">✅</span>
                <h3>Message Sent! 🎉</h3>
                <p>Thanks for reaching out. I'll be in touch within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}