// Reusable button — 'primary' or 'secondary' variant
export default function Button({ variant = 'primary', className = '', children, ...props }) {
  const baseClasses = "inline-flex items-center gap-2 px-7 py-3 rounded-[10px] font-sans text-[0.9375rem] font-semibold cursor-pointer transition-all duration-300 ease-out"

  const variants = {
    primary: "bg-gradient-to-br from-accent to-accent-2 text-white shadow-[0_0_30px_var(--accent-glow)] hover:-translate-y-[2px] hover:shadow-[0_8px_32px_var(--accent-glow)]",
    secondary: "bg-transparent border border-border-strong text-text-1 hover:bg-background-2 hover:border-accent hover:text-accent hover:-translate-y-[2px]"
  }

  return (
    <a className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </a>
  )
}
