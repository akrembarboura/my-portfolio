import useTypewriter from '../hooks/useTypewriter'
import typewriterPhrases from '../data/typewriter'
import Button from './Button'
import imageAkrem from '../assets/akrempicture.png'
const HERO_IMAGE = imageAkrem

export default function Hero() {
  const typedText = useTypewriter(typewriterPhrases)

  return (
    <section id="hero" className="min-h-screen pt-[70px] flex items-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-transparent md:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.18)_0%,transparent_70%),radial-gradient(ellipse_50%_40%_at_90%_80%,rgba(139,92,246,0.1)_0%,transparent_60%),radial-gradient(ellipse_40%_40%_at_0%_60%,rgba(6,182,212,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 z-0 bg-transparent md:bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] md:bg-[size:60px_60px] md:[mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_0%,transparent_100%)]" />

      <div className="max-w-[1200px] mx-auto px-8 w-full z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <div className="pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-[0.4rem] bg-tag-bg border border-border-strong rounded-full text-[0.8rem] font-medium text-tag-color mb-6 animate-fade-in-down">
              <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-blink" />
              Available for opportunities
            </div>
            <p className="font-mono text-[0.875rem] text-accent mb-2 animate-fade-in-up [animation-delay:200ms]">
              // Tunis, TN &rarr; open to remote
            </p>
            <h1 className="font-syne font-extrabold text-[clamp(2.8rem,6vw,5rem)] leading-none tracking-tight bg-gradient-to-br from-text-1 to-text-2 bg-clip-text text-transparent mb-4 animate-fade-in-up [animation-delay:300ms]">
              Akrem<br />Barboura
            </h1>
            <p className="text-[clamp(1rem,2vw,1.25rem)] text-text-2 mb-7 min-h-[2em] animate-fade-in-up [animation-delay:400ms]">
              I'm a <span className="text-accent-2 font-medium">{typedText}</span>
              <span className="inline-block w-[2px] h-[1.1em] bg-accent-2 ml-[2px] align-text-bottom animate-blink" />
            </p>
            <p className="text-base text-text-3 max-w-[480px] leading-[1.65] mb-10 animate-fade-in-up [animation-delay:500ms]">
              Building full-stack web apps with React, Node.js, and MongoDB — from database schema to production deployment.
              Currently open to full-time roles and freelance projects.
            </p>
            <div className="flex gap-4 flex-wrap animate-fade-in-up [animation-delay:600ms]">
              <Button variant="primary" href="#projects">View Projects ↓</Button>
              <Button variant="secondary" href="#contact">Contact Me 💬</Button>
            </div>
          </div>

          <div className="flex justify-center items-center animate-fade-in-up [animation-delay:300ms]">
            <div className="relative w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[380px] aspect-square mx-auto lg:mx-0 mt-8 lg:mt-0">
              <div className="absolute -inset-[16px] sm:-inset-[20px] rounded-full bg-[conic-gradient(from_0deg,var(--accent),var(--accent-2),var(--accent-3),var(--accent))] animate-spin-slow opacity-40" />
              <div className="absolute -inset-[8px] sm:-inset-[12px] rounded-full border border-border-light" />
              <div className="absolute inset-[4px] sm:inset-[6px] rounded-full overflow-hidden border-[3px] border-background-0 bg-background-1">
                <img src={HERO_IMAGE} alt="Akrem Barboura" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-[20px] -left-[20px] lg:-left-[50px] bg-card border border-border-light rounded-xl px-4 py-2.5 flex items-center gap-2 text-[0.8rem] font-semibold backdrop-blur-md shadow-2xl whitespace-nowrap animate-float-1">
                <span className="text-[1.1rem]">🇹🇳</span> Based in <strong>Tunisia</strong>
              </div>
              <div className="absolute top-[30px] -right-[20px] lg:-right-[50px] bg-card border border-border-light rounded-xl px-4 py-2.5 flex items-center gap-2 text-[0.8rem] font-semibold backdrop-blur-md shadow-2xl whitespace-nowrap animate-float-2">
                <span className="text-[1.1rem]">💻</span> MERN Stack
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
