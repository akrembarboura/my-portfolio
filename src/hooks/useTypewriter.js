import { useEffect, useRef, useState } from 'react'

// Cycles through phrases, typing and deleting each one
export default function useTypewriter(phrases, typeSpeed = 100, deleteSpeed = 60, pause = 1800) {
  const [text, setText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex]

    const handleTick = () => {
      if (!isDeleting) {
        // Typing forward
        const nextText = currentPhrase.slice(0, text.length + 1)
        setText(nextText)

        if (nextText === currentPhrase) {
          // Pause before deleting
          timeoutRef.current = setTimeout(() => setIsDeleting(true), pause)
          return
        }
        timeoutRef.current = setTimeout(handleTick, typeSpeed)
      } else {
        // Deleting
        const nextText = currentPhrase.slice(0, text.length - 1)
        setText(nextText)

        if (nextText === '') {
          setIsDeleting(false)
          setPhraseIndex((phraseIndex + 1) % phrases.length)
          timeoutRef.current = setTimeout(handleTick, 400)
          return
        }
        timeoutRef.current = setTimeout(handleTick, deleteSpeed)
      }
    }

    timeoutRef.current = setTimeout(handleTick, isDeleting ? deleteSpeed : typeSpeed)

    return () => clearTimeout(timeoutRef.current)
  }, [text, isDeleting, phraseIndex, phrases, typeSpeed, deleteSpeed, pause])

  return text
}
