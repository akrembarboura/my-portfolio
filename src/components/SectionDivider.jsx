import useScrollReveal from '../hooks/useScrollReveal'

export default function SectionDivider() {
  const dividerRef = useScrollReveal({ threshold: 0.4 })

  return (
    <div className="container" aria-hidden="true">
      <div ref={dividerRef} className="circuit-divider">
        <span className="circuit-divider-terminal" />
        <span className="circuit-divider-line circuit-divider-line--left" />
        <span className="circuit-divider-via">
          <span className="circuit-divider-via-core" />
        </span>
        <span className="circuit-divider-line circuit-divider-line--right" />
        <span className="circuit-divider-terminal" />
      </div>
    </div>
  )
}
