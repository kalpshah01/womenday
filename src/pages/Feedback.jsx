import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import StarRating from '../components/StarRating'

export default function Feedback() {
    const { state } = useLocation()
    const submissionId = state?.submissionId || null
    const name = state?.name || ''

    const [rating, setRating] = useState(0)
    const [message, setMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async () => {
        if (!rating) { setError('Please give a star rating 🌟'); return }
        if (!message.trim()) { setError('Please write a short message 💬'); return }

        setLoading(true)
        setError('')
        try {
            if (submissionId) {
                const { error: updErr } = await supabase
                    .from('submissions')
                    .update({ feedback: message.trim(), rating })
                    .eq('id', submissionId)
                if (updErr) throw updErr
            }
            setSubmitted(true)
        } catch (err) {
            console.error('Feedback error:', err)
            setError(`❌ Could not save: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="page" style={{ zIndex: 1 }}>
                <div className="glass-card">
                    <div className="thankyou-box">
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🥰</div>
                        <h2>Thank you so much, {name || 'beautiful'}!</h2>
                        <p style={{ color: 'var(--text-mid)', marginTop: '0.8rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            Your words mean the world to me 💖<br />
                            Have a wonderful Women's Day! 🌸🌺🌷
                        </p>
                        <div style={{ marginTop: '1.5rem', fontSize: '1.8rem' }}>
                            {'⭐'.repeat(rating)}
                        </div>
                        <p style={{ marginTop: '0.8rem', color: 'var(--purple)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                            "{message}"
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="page" style={{ zIndex: 1 }}>
            <div className="glass-card">
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>💌</div>
                <h1 className="display" style={{ fontSize: '1.8rem' }}>Tell me about me ❤️</h1>
                <p className="body-text" style={{ marginBottom: '1.5rem' }}>
                    Your honest feedback makes me happy 😊
                </p>

                <textarea
                    className="input-field"
                    placeholder="Write your thoughts here… What did you like? What should I improve?"
                    value={message}
                    onChange={e => { setMessage(e.target.value); setError('') }}
                    id="feedback-textarea"
                />

                <h2 className="subtitle" style={{ marginBottom: '0.2rem' }}>Rate this website ✨</h2>
                <StarRating rating={rating} onChange={r => { setRating(r); setError('') }} />

                {error && (
                    <p style={{ color: 'var(--pink)', fontWeight: 600, fontSize: '0.9rem', margin: '0.6rem 0' }}>
                        {error}
                    </p>
                )}

                <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    id="submit-btn"
                    style={{ width: '100%', marginTop: '1rem' }}
                >
                    {loading ? '⏳ Saving…' : 'Submit 💖'}
                </button>
            </div>
        </div>
    )
}
