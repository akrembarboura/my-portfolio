import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

// Contact info row with icon, label, value, and 1-click copy capability
export default function ContactInfoItem({ icon, iconClass, label, value, href }) {
  const [copied, setCopied] = useState(false)
  const isEmail = label.toLowerCase() === 'email'

  const handleCopy = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const Wrapper = href ? 'a' : 'div'
  const wrapperProps = href
    ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper className="contact-info-item group relative" {...wrapperProps}>
      <div className={`contact-icon ${iconClass}`}>{icon}</div>
      <div className="contact-detail flex-1">
        <div className="label">{label}</div>
        <div className="value">{value}</div>
      </div>
      {isEmail && (
        <button
          type="button"
          onClick={handleCopy}
          className="ml-auto p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-mono"
          title="Copy email address"
          aria-label="Copy email address"
        >
          {copied ? (
            <>
              <Check size={13} className="text-[#39D353]" />
              <span className="text-[#39D353] text-[10px]">Copied</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span className="hidden sm:inline text-[10px]">Copy</span>
            </>
          )}
        </button>
      )}
    </Wrapper>
  )
}
