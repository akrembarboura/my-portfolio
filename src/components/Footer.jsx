export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <span className="footer-logo">Akrem Barboura</span>
          <span className="footer-copy">
            &copy; {new Date().getFullYear()} Akrem Barboura &middot; Built with React &amp; Supabase
          </span>
          <div className="footer-links">
            <a href="https://github.com/akrembarboura" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/akrembarboura" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:akrembarboura316@gmail.com">Email</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
