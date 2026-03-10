import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PHOTOS = [
    {
        src: '/img1.jpeg',
        caption: '🌸 You are my biggest supporter — the one who believed in me before I believed in myself. 🌸',
        pos: 'center center',
    },
    {
        src: '/img7.jpeg',
        caption: '💫 You\'ve been my support system through every storm, every doubt, and every breakdown. I\'d be lost without you. 💫',
        pos: 'center center',
    },
    {
        src: '/img31.jpeg',
        caption: '👶 You take care of me like a little baby — always checking, always worrying, always loving. That means everything. 💕',
        pos: 'center 20%',
    },
    {
        src: '/img5.jpeg',
        caption: '👀 You look at my face and just... know. You understand what I\'m feeling before I even say a word. That\'s rare. 🎉',
        pos: 'center 15%',
    },
    {
        src: '/img6.jpeg',
        caption: '🎀 No one in this world understands me better than you do. You are my big sister, my safe place, my home. 🎀',
        pos: 'center center',
    },
];

const PhotoFrame = ({ onNext }) => {
    const [current, setCurrent] = useState(0);
    const [dir, setDir] = useState(1);
    const [done, setDone] = useState(false);

    const goNext = useCallback(() => {
        if (done) return;
        setDir(1);
        const nxt = current + 1;
        if (nxt >= PHOTOS.length) {
            setDone(true);
        } else {
            setCurrent(nxt);
        }
    }, [current, done]);

    const downloadAll = () => {
        PHOTOS.forEach((p, i) => {
            setTimeout(() => {
                const a = document.createElement('a');
                a.href = p.src;
                a.download = `memory_${i + 1}.jpg`;
                a.click();
            }, i * 300);
        });
    };

    const slideVariants = {
        enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
    };

    return (
        <div className="photo-page page-enter">
            <motion.h1
                className="photo-page-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                💝 Our Precious Memories 💝
            </motion.h1>
            <motion.p
                className="photo-page-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {done ? 'All memories viewed! 🌸' : 'Tap the photo to see the next memory ✨'}
            </motion.p>

            {!done && (
                <>
                    <div className="photo-counter">
                        {current + 1} / {PHOTOS.length}
                    </div>

                    <div className="photo-stack-wrapper">
                        <AnimatePresence mode="wait" custom={dir}>
                            <motion.div
                                key={current}
                                className="photo-card"
                                custom={dir}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35, ease: 'easeInOut' }}
                                onClick={goNext}
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={PHOTOS[current].src}
                                    alt={`Memory ${current + 1}`}
                                    draggable={false}
                                    style={{ objectPosition: PHOTOS[current].pos }}
                                />
                                <div className="photo-caption">
                                    <p>{PHOTOS[current].caption}</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="photo-hint">
                        <span>👆</span>
                        <span>Tap the photo to flip to the next memory</span>
                    </div>
                </>
            )}

            {done && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center' }}
                >
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌟</div>
                    <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '2rem' }}>
                        You've seen all our beautiful memories! 💕
                    </p>
                    <div className="photo-actions">
                        <motion.button
                            className="btn-download"
                            onClick={downloadAll}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            📥 Download Memories
                        </motion.button>
                        <motion.button
                            className="btn-next-surprise"
                            onClick={onNext}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            🎁 I Have One More Surprise
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default PhotoFrame;
