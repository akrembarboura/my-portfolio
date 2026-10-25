export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer relative overflow-hidden">
      {/* Background illustration taking the exact footer size */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/footer-bg.jpg"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        {/* Soft overlay ensuring text legibility */}
        <div className="absolute inset-0 bg-[#060a12]/75 backdrop-blur-[0.5px]" />
      </div>

      <div className="container relative z-10">
        <div className="footer-inner">
          <span className="footer-logo !text-white !bg-none drop-shadow-sm font-bold">
            Akrem Barboura
          </span>
          <span className="footer-copy !text-slate-200 drop-shadow-sm">
            &copy; {currentYear} Akrem Barboura &middot; Built with ❤️
          </span>
          <div className="footer-links">
            <a
              href="https://github.com/akrembarboura"
              target="_blank"
              rel="noopener noreferrer"
              className="!text-slate-200 hover:!text-white transition-colors drop-shadow-sm"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/akrembarboura"
              target="_blank"
              rel="noopener noreferrer"
              className="!text-slate-200 hover:!text-white transition-colors drop-shadow-sm"
            >
              LinkedIn
            </a>
            <a
              href="mailto:akrembarboura@gmail.com"
              className="!text-slate-200 hover:!text-white transition-colors drop-shadow-sm"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
