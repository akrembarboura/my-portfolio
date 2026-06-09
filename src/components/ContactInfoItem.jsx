// Contact info row with icon, label, and value
export default function ContactInfoItem({ icon, iconClass, label, value, href }) {
  const Wrapper = href ? 'a' : 'div'
  const wrapperProps = href
    ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper className="contact-info-item" {...wrapperProps}>
      <div className={`contact-icon ${iconClass}`}>{icon}</div>
      <div className="contact-detail">
        <div className="label">{label}</div>
        <div className="value">{value}</div>
      </div>
    </Wrapper>
  )
}
