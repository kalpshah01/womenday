import { useRef, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { motion } from 'framer-motion';
import { downloadElementAsPng } from './downloadCard';

const FinalPage = () => {
    const cardRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!cardRef.current || downloading) return;
        setDownloading(true);
        try {
            await downloadElementAsPng(cardRef.current, 'birthday_message_for_didi');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="final-page page-enter">
            <ReactConfetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={true}
                numberOfPieces={220}
                colors={['#ec4899', '#f9a8d4', '#e879f9', '#fde68a', '#fb7185', '#ffffff', '#f59e0b']}
                gravity={0.18}
                style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }}
            />

            <motion.div
                ref={cardRef}
                className="final-card"
                style={{ position: 'relative', zIndex: 1 }}
                initial={{ opacity: 0, scale: 0.7, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 90 }}
            >
                <div className="final-emoji-row">
                    <span>🎂</span>
                    <span>🎉</span>
                    <span>🌸</span>
                    <span>🎊</span>
                    <span>🥳</span>
                </div>

                <motion.h1
                    className="final-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Happy Birthday,<br />My Big Sister, My Everything 🎀
                </motion.h1>

                <motion.p
                    className="final-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    You have been my biggest supporter from the very beginning — before anyone else saw what I was capable of, you already believed in me. You are not just my sister, you are my support system, my safe place, my home.
                    <br /><br />
                    You take care of me like a little baby, always making sure I'm okay, always watching over me. And somehow, you always know what I'm feeling just by looking at my face. You understand me better than I understand myself. That kind of love is rare and I am the luckiest person alive to have it.
                    <br /><br />
                    On your birthday, I just want to say: I see you, I love you, and I am so endlessly grateful for you. 🌸✨
                </motion.p>

                <motion.p
                    className="final-signature"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, type: 'spring' }}
                >
                    With all my love, forever and always 💝
                </motion.p>

                <motion.div
                    className="final-hearts"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                >
                    {'❤️🧡💛💚💙💜🤍'.split('').map((h, i) => (
                        <motion.span
                            key={i}
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1, ease: 'easeInOut' }}
                            style={{ display: 'inline-block' }}
                        >
                            {h}
                        </motion.span>
                    ))}
                </motion.div>

                <motion.button
                    className="btn-download-all"
                    onClick={handleDownload}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={downloading}
                >
                    {downloading ? '⏳ Saving...' : '📥 Download This Card'}
                </motion.button>
            </motion.div>
        </div>
    );
};

export default FinalPage;
