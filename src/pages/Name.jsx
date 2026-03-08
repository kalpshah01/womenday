import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Name() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [error, setError] = useState('')

    const handleNext = () => {
        const trimmed = name.trim()
        if (!trimmed) { setError('Please enter your name 🌸'); return }
        // Pass name forward via route state — no localStorage dependency
        navigate('/photo', { state: { name: trimmed } })
    }

    return (
        <div className="page" style={{ zIndex: 1 }}>
            <div className="glass-card">
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>💐</div>
                <h1 className="display">What's your name?</h1>
                <p className="body-text mb-2" style={{ marginBottom: '1.5rem' }}>
                    Let's make this personal, just for you 🌸
                </p>
                <input
                    className="input-field"
                    type="text"
                    placeholder="Enter your name…"
                    value={name}
                    onChange={e => { setName(e.target.value); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleNext()}
                    autoFocus
                    id="name-input"
                />
                {error && (
                    <p style={{ color: 'var(--pink)', marginBottom: '1rem', fontWeight: 600, fontSize: '0.9rem' }}>
                        {error}
                    </p>
                )}
                <button
                    className="btn btn-primary"
                    onClick={handleNext}
                    id="next-btn"
                    style={{ width: '100%' }}
                >
                    Next ✨
                </button>
            </div>
        </div>
    )
}
