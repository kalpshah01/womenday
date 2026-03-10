import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const FloatingHearts = () => {
    const hearts = Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${6 + Math.random() * 6}s`,
        size: `${0.8 + Math.random() * 1.2}rem`,
        emoji: ['❤️', '🌸', '💕', '🎀', '💝', '✨'][Math.floor(Math.random() * 6)],
    }));
    return (
        <div className="floating-hearts-bg">
            {hearts.map(h => (
                <span key={h.id} className="heart-float" style={{
                    left: h.left, bottom: '-30px',
                    animationDelay: h.delay, animationDuration: h.duration, fontSize: h.size,
                }}>{h.emoji}</span>
            ))}
        </div>
    );
};

const WelcomePage = ({ onYes }) => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleNoInteract = useCallback((e) => {
        e.preventDefault();
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const pad = 10;
        const btnW = rect.width;
        const btnH = rect.height;
        const btnLeft = rect.left;
        const btnTop = rect.top;

        // Random direction, 80–160px jump
        const angle = Math.random() * 2 * Math.PI;
        const dist = 80 + Math.random() * 80;
        const newLeft = btnLeft + Math.cos(angle) * dist;
        const newTop = btnTop + Math.sin(angle) * dist;

        // Clamp to viewport
        const clampedLeft = Math.max(pad, Math.min(vw - btnW - pad, newLeft));
        const clampedTop = Math.max(pad, Math.min(vh - btnH - pad, newTop));

        // Actual delta from current visual position
        const actualDx = clampedLeft - btnLeft;
        const actualDy = clampedTop - btnTop;

        // Accumulate into transform offset
        setOffset(prev => ({ x: prev.x + actualDx, y: prev.y + actualDy }));
    }, []);

    return (
        <div className="page page-enter">
            <FloatingHearts />
            <motion.div
                className="welcome-card"
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, type: 'spring', stiffness: 120 }}
            >
                <span className="gift-icon">🎁</span>
                <h1 className="welcome-title">I Have a Surprise for You! 🎀</h1>
                <p className="welcome-subtitle">Just for the most special person in my world 💕</p>
                <div className="btn-row">
                    <motion.button
                        className="btn-yes"
                        onClick={onYes}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        🥰 Yes, show me!
                    </motion.button>

                    {/* ✅ Only animate x/y — don't set them in style too */}
                    <motion.button
                        className="btn-no"
                        animate={{ x: offset.x, y: offset.y }}
                        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                        onMouseEnter={handleNoInteract}
                        onTouchStart={handleNoInteract}
                    >
                        😅 No
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default WelcomePage;
