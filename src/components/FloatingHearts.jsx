import { useEffect, useRef } from 'react'

const EMOJIS = ['💕', '🌸', '💖', '💗', '🌷', '✨', '💝', '🌺']

export default function FloatingHearts() {
    const containerRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        const hearts = []

        for (let i = 0; i < 18; i++) {
            const heart = document.createElement('div')
            heart.className = 'heart'
            heart.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]

            const size = Math.random() * 1.2 + 0.8
            const left = Math.random() * 100
            const delay = Math.random() * 12
            const duration = Math.random() * 10 + 12

            heart.style.cssText = `
        left: ${left}%;
        font-size: ${size}rem;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
      `
            container.appendChild(heart)
            hearts.push(heart)
        }
        return () => hearts.forEach(h => h.remove())
    }, [])

    return <div className="hearts-bg" ref={containerRef} />
}
