import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { downloadElementAsPng } from './downloadCard';

const SCRATCH_THRESHOLD = 55; // % of canvas scratched to auto-reveal

const ScratchCard = ({ onNext }) => {
    const canvasRef = useRef(null);
    const cardRef = useRef(null);
    const isDrawing = useRef(false);
    const [progress, setProgress] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [canvasReady, setCanvasReady] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const handleDownloadCard = async () => {
        if (!cardRef.current || downloading) return;
        setDownloading(true);
        try {
            await downloadElementAsPng(cardRef.current, 'secret_message_for_didi');
        } finally {
            setDownloading(false);
        }
    };

    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Silver scratch surface gradient
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#e5c3d8');
        grad.addColorStop(0.3, '#f8d7ea');
        grad.addColorStop(0.6, '#e5c3d8');
        grad.addColorStop(1, '#d4a0c0');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Decorative pattern overlay
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        for (let row = 0; row < canvas.height; row += 22) {
            for (let col = 0; col < canvas.width; col += 22) {
                if ((row + col) % 44 === 0) ctx.fillRect(col, row, 10, 10);
            }
        }

        // Instructions text
        ctx.fillStyle = 'rgba(150, 50, 100, 0.6)';
        ctx.font = 'bold 16px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🪄 Scratch Here! 🪄', canvas.width / 2, canvas.height / 2);

        setCanvasReady(true);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(initCanvas, 100);
        return () => clearTimeout(timeout);
    }, [initCanvas]);

    const getPos = (e, canvas) => {
        const rect = canvas.getBoundingClientRect();
        const src = e.touches ? e.touches[0] : e;
        return {
            x: src.clientX - rect.left,
            y: src.clientY - rect.top,
        };
    };

    const scratch = useCallback((e) => {
        if (!isDrawing.current || revealed) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { x, y } = getPos(e, canvas);

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();

        // Calculate progress
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let transparent = 0;
        for (let i = 3; i < imageData.data.length; i += 4) {
            if (imageData.data[i] < 128) transparent++;
        }
        const pct = Math.round((transparent / (imageData.data.length / 4)) * 100);
        setProgress(Math.min(pct, 100));
        if (pct >= SCRATCH_THRESHOLD) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setRevealed(true);
        }
    }, [revealed]);

    const startDraw = useCallback((e) => {
        e.preventDefault();
        isDrawing.current = true;
        scratch(e);
    }, [scratch]);

    const stopDraw = useCallback(() => { isDrawing.current = false; }, []);

    return (
        <div className="scratch-page page-enter">
            <motion.div
                ref={cardRef}
                className="scratch-card-container"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            >
                <h2 className="scratch-title">💌 A Secret Message For You 💌</h2>
                <p className="scratch-subtitle">Scratch to reveal what lives in my heart... ✨</p>

                <div
                    className="scratch-canvas-wrap"
                    style={{ width: '100%', maxWidth: 360, height: 240, margin: '0 auto', display: 'block' }}
                >
                    <img
                        src="/img4.jpeg"
                        alt="Surprise"
                        className="scratch-reveal-img"
                        style={{ width: 'auto', maxWidth: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 16 }}
                    />
                    {!revealed && (
                        <canvas
                            ref={canvasRef}
                            className="scratch-canvas"
                            onMouseDown={startDraw}
                            onMouseMove={scratch}
                            onMouseUp={stopDraw}
                            onMouseLeave={stopDraw}
                            onTouchStart={startDraw}
                            onTouchMove={scratch}
                            onTouchEnd={stopDraw}
                        />
                    )}
                </div>

                {!revealed ? (
                    <div className="scratch-progress">
                        <span>{progress}% scratched</span>
                        <div className="scratch-progress-bar">
                            <div className="scratch-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                    >
                        <p className="scratch-revealed-msg">
                            💝 You are my biggest supporter, my support system, my big sister —
                            but you take care of me like a little baby. 👶
                        </p>
                        <p style={{ color: 'var(--text-mid)', fontSize: '1rem', marginTop: '0.8rem', fontFamily: "'Playfair Display', serif", lineHeight: 1.7 }}>
                            You know what I am feeling just from my face.
                            You understand me better than anyone else in this entire world. 🌸
                        </p>
                    </motion.div>
                )}

                {revealed && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                        <motion.button
                            className="btn-continue"
                            onClick={handleDownloadCard}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={downloading}
                            style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
                        >
                            {downloading ? '⏳ Saving...' : '📥 Download This Card'}
                        </motion.button>
                        <motion.button
                            className="btn-continue"
                            onClick={onNext}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            💌 See Your Final Message
                        </motion.button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ScratchCard;
