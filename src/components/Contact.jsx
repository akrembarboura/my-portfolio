import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import ContactInfoItem from './ContactInfoItem'
import contactInfo from '../data/contact.jsx'
import { supabase, BACKEND_ENABLED } from '../supabaseClient'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [locationError, setLocationError] = useState('')
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
  const infoRef = useScrollReveal()
  const formRef = useScrollReveal()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGetLocation = () => {
    setLocationError('')
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
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
        setLocationError("Unable to retrieve your location")
        setGettingLocation(false)
      }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setErrorMessage('')

    const fullName = `${formData.firstName} ${formData.lastName}`.trim()

    // When backend is hidden/disabled, fall back cleanly to mailto without network errors
    if (!BACKEND_ENABLED || !supabase) {
      const subject = encodeURIComponent(
        formData.subject ? `[Portfolio] ${formData.subject} — ${fullName}` : `[Portfolio Inquiry] from ${fullName}`
      )
      const bodyLines = [
        `Name: ${fullName}`,
        `Email: ${formData.email}`,
        formData.location ? `Location: ${formData.location}` : null,
        formData.subject ? `Project Type: ${formData.subject}` : null,
        '',
        formData.message
      ].filter((line) => line !== null)
      const body = encodeURIComponent(bodyLines.join('\n'))

      window.location.href = `mailto:akrembarboura@gmail.com?subject=${subject}&body=${body}`
      setSending(false)
      setSubmitted(true)
      return
    }

    const { error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: fullName,
          email: formData.email,
          location: formData.location,
          projectType: formData.subject,
          message: formData.message
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
        <div ref={headerRef} className="reveal">
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">
            Let's Build Something<br />Together
          </h2>
          <p className="section-sub" style={{ maxWidth: '600px' }}>
            I'm currently open to new opportunities. Whether you have a project in
            mind, want to collaborate, or just want to say hi — my inbox is always open.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info reveal-left" ref={infoRef}>
            {contactInfo.map((item) => (
              <ContactInfoItem key={item.id} {...item} />
            ))}
          </div>

          <div className="contact-form reveal-right" ref={formRef}>
            {!submitted ? (
              <form id="formContent" onSubmit={handleSubmit}>
                <h3 className="form-title" style={{ fontSize: '1.125rem' }}>Start a conversation</h3>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    type="submit"
                    className="form-submit"
                    disabled={sending}
                    style={sending ? { opacity: 0.7, pointerEvents: 'none', margin: 0 } : { margin: 0 }}
                  >
                    {sending ? 'Sending...' : 'Send Message ✈️'}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={gettingLocation || formData.location !== ''}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'transparent',
                        border: 'none',
                        color: formData.location ? '#10b981' : 'var(--text-3)',
                        fontSize: '0.85rem',
                        cursor: formData.location ? 'default' : 'pointer',
                        transition: 'color 0.2s',
                        textDecoration: formData.location ? 'none' : 'underline'
                      }}
                    >
                      {gettingLocation ? (
                        <>
                          <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                          Requesting...
                        </>
                      ) : formData.location ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          Location Attached
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                          Attach My Location (Optional)
                        </>
                      )}
                    </button>
                  </div>
                  {locationError && (
                    <p style={{ color: '#ff6b6b', fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>
                      {locationError}
                    </p>
                  )}
                </div>
              </form>
            ) : (
              <div className="form-success">
                <span className="success-icon" style={{ display: 'inline-block', color: 'var(--brand-green)', marginBottom: '1rem' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </span>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-1)' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-3)' }}>Thanks for reaching out. I'll be in touch within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
