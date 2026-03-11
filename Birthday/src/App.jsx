import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WelcomePage from './WelcomePage';
import PhotoFrame from './PhotoFrame';
import ScratchCard from './ScratchCard';
import FinalPage from './FinalPage';
import './index.css';

// background audio config: low volume loop between 28s and 60s


const PAGE_VARIANTS = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

const pages = ['welcome', 'photos', 'scratch', 'final'];

function App() {
  const [page, setPage] = useState('welcome');
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio('/song.mp3');
    audio.volume = 0.15; // low volume
    audio.currentTime = 28;
    const onTime = () => {
      if (audio.currentTime >= 60) {
        audio.currentTime = 28;
      }
    };
    audio.addEventListener('timeupdate', onTime);
    audio.play().catch(() => {});
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
    };
  }, []);

  const goTo = (name) => {
    // attempt to play if user has interacted (avoids autoplay block)
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }
    setPage(name);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        variants={PAGE_VARIANTS}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        style={{ minHeight: '100vh' }}
      >
        {page === 'welcome' && <WelcomePage onYes={() => goTo('photos')} />}
        {page === 'photos' && <PhotoFrame onNext={() => goTo('scratch')} />}
        {page === 'scratch' && <ScratchCard onNext={() => goTo('final')} />}
        {page === 'final' && <FinalPage />}
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
