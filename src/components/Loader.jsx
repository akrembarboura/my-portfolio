import { useEffect, useState } from 'react'

// Full-screen loader that fades out after content loads
export default function Loader() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`loader${hidden ? ' hidden' : ''}`}>
      <div className="loader-inner">
        <div className="loader-logo">AB</div>
        <div className="loader-bar">
          <div className="loader-progress" />
        </div>
      </div>
    </div>
  )
}
