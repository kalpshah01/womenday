import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Surprise() {
    const navigate = useNavigate()
    const [noPos, setNoPos] = useState({ top: '55%', left: '60%' })
    const [clicks, setClicks] = useState(0)

    const moveNoButton = useCallback(() => {
        const margin = 80
        const top = margin + Math.random() * (window.innerHeight - margin * 3)
        const left = margin + Math.random() * (window.innerWidth - margin * 3)
        setNoPos({ top: `${top}px`, left: `${left}px` })
        setClicks(c => c + 1)
    }, [])

    return (
        <div className="page" style={{ zIndex: 1 }}>
            <div className="glass-card">
                <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🌸</div>
                <h1 className="display">Happy Women's Day!</h1>
                <h2 className="subtitle">I have a special surprise for you 🎁</h2>
                <p className="body-text" style={{ marginBottom: '2rem' }}>
                    Do you want to see it? 🌷
                </p>
                <div className="gap-row" style={{ marginTop: 0 }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/name')}
                        id="yes-btn"
                    >
                        Yes, please! 💖
                    </button>
                </div>
                {clicks > 0 && clicks < 5 && (
                    <p style={{ marginTop: '1rem', color: 'var(--purple)', fontSize: '0.85rem', fontWeight: 700 }}>
                        😄 Aww, come on! Hit Yes!
                    </p>
                )}
                {clicks >= 5 && (
                    <p style={{ marginTop: '1rem', color: 'var(--pink)', fontSize: '0.85rem', fontWeight: 700 }}>
                        🌸 You can't escape the love! Click Yes!
                    </p>
                )}
            </div>

            {/* Floating No button */}
            <button
                className="btn btn-no"
                style={{ top: noPos.top, left: noPos.left }}
                onMouseEnter={moveNoButton}
                onFocus={moveNoButton}
                onClick={moveNoButton}
                id="no-btn"
                aria-label="No button — try to click it!"
            >
                No 😅
            </button>
        </div>
    )
}
