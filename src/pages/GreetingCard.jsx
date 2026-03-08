import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactConfetti from 'react-confetti'
import html2canvas from 'html2canvas'
import PolaroidCard from '../components/PolaroidCard'
   
/* ── Name → Message lookup ── */
const NAME_MESSAGES = {
    keni: 'Hi Keni 💐 You are very hardworking. I never met someone like you who is very hardworking.',
    zeel: 'Hi Chotu Sister ❤️ You are my chotu and jaggadalu sister supportive ,little good motu and little cute now promise me to you dont fight with me.',
    bhoomi: 'Hi Bhoomi 🌸 You are always there for everyone and never felt anyone alone in group.',
    hitesha: 'Hi Hitesha 💜 You are the definition of how big sister has you order me pusnishme love me fight with me take care of me like little baby.',
    prisha: 'Hi Prisha 🌺 Your smile lights up every room you walk in. foodie and talktive',
    rutvi: 'Hi Rutvi 🌷 You are smart, kind, and absolutely wonderful. sweet like as your cake',
    komal: 'Hi Komal ✨ You are a strong and amazing person .',
    khushi: 'Hi Khushi 💗 Your 11 00 clock alarm is perfect like you.',
    riya: 'Hi Riya 🌸 You are full of life and inspire everyone around you.',
    hetvi: 'Hi Hetvi 💕 You light up lives just by being you. always helpful to me ',
    mummy: 'Hi Mummy 🌹 You are the heart and soul of our family, always loving and caring.',
    aarti: 'Hi Aarti 🌼 Your kindness and warmth make you truly special. You are a wonderful person. always understand and our friendship is unexpected like god send people speically for us like that',
    preksha: 'Hi Preksha 🌼 you are my sister i am always there for you sister remeber this just live life like no one expected ',

}

const DEFAULT_MSG = 'Happy Women\'s Day 🌸 You are amazing and inspiring.'

function getMsg(name) {
    const key = (name || '').trim().toLowerCase()
    return NAME_MESSAGES[key] || DEFAULT_MSG
}

export default function GreetingCard() {
    const navigate = useNavigate()
    const name = localStorage.getItem('wd_name') || 'Beautiful'
    const photo = localStorage.getItem('wd_photo') || null
    const message = getMsg(name)
    const cardRef = useRef()

    const [confetti, setConfetti] = useState(true)
    const [downloading, setDownloading] = useState(false)
    const [winSize, setWinSize] = useState({ w: window.innerWidth, h: window.innerHeight })

    useEffect(() => {
        const handler = () => setWinSize({ w: window.innerWidth, h: window.innerHeight })
        window.addEventListener('resize', handler)
        const timer = setTimeout(() => setConfetti(false), 7000)
        return () => { window.removeEventListener('resize', handler); clearTimeout(timer) }
    }, [])

    const handleDownload = async () => {
        if (!cardRef.current) return
        setDownloading(true)
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
            })
            const link = document.createElement('a')
            link.download = `womens-day-card-${name}.png`
            link.href = canvas.toDataURL('image/png')
            link.click()
        } catch (err) {
            console.error('Download failed:', err)
        } finally {
            setDownloading(false)
        }
    }

    return (
        <div className="page" style={{ zIndex: 1, paddingBottom: '3rem' }}>
            {confetti && (
                <ReactConfetti
                    width={winSize.w}
                    height={winSize.h}
                    numberOfPieces={220}
                    colors={['#ff80ab', '#ce93d8', '#f48fb1', '#e91e63', '#ab47bc', '#ffffff', '#ffcdd2']}
                    recycle={false}
                    gravity={0.18}
                    style={{ position: 'fixed', top: 0, left: 0, zIndex: 999 }}
                />
            )}

            <div className="glass-card" style={{ maxWidth: 420 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.3rem' }}>🌸</div>
                <h1 className="display" style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>
                    Your Greeting Card
                </h1>

                <div className="polaroid-wrapper">
                    <PolaroidCard
                        photoSrc={photo}
                        name={name}
                        message={message}
                        cardRef={cardRef}
                    />
                </div>

                <div className="gap-row">
                    <button
                        className="btn btn-primary"
                        onClick={handleDownload}
                        disabled={downloading}
                        id="download-btn"
                    >
                        {downloading ? '⏳ Saving…' : '⬇️ Download Card'}
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/feedback')}
                        id="feedback-btn"
                    >
                        Next ➡️
                    </button>
                </div>

                <p style={{ marginTop: '1rem', color: 'var(--text-mid)', fontSize: '0.85rem' }}>
                    Share it on WhatsApp or Instagram! 💌
                </p>
            </div>
        </div>
    )
}
