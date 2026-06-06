import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import ContactInfoItem from './ContactInfoItem'
import contactInfo from '../data/contact'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const headerRef = useScrollReveal()
  const formRef = useScrollReveal()

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    // Simulated form submission
    setTimeout(() => {
      setSending(false)
      setSubmitted(true)
    }, 1500)
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

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input className="form-input" type="text" placeholder="John" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input className="form-input" type="text" placeholder="Doe" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="john@example.com" />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-input" type="text" placeholder="Project Inquiry / Collaboration" />
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-textarea" placeholder="Tell me about your project or idea..." />
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
