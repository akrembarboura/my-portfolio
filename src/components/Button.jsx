// Reusable button — 'primary' or 'secondary' variant
export default function Button({ variant = 'primary', children, ...props }) {
  const className = `btn btn-${variant}`
  return (
    <a className={className} {...props}>
      {children}
    </a>
  )
}
