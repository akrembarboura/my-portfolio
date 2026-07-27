import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import ContactInfoItem from './ContactInfoItem'
import contactInfo from '../data/contact'
import { supabase } from '../supabaseClient'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  })

  const headerRef = useScrollReveal()
  const formRef = useScrollReveal()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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