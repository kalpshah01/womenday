import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WelcomePage from './WelcomePage';
import PhotoFrame from './PhotoFrame';
import ScratchCard from './ScratchCard';
import FinalPage from './FinalPage';
import './index.css';

const PAGE_VARIANTS = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

const pages = ['welcome', 'photos', 'scratch', 'final'];

function App() {
  const [page, setPage] = useState('welcome');

  const goTo = (name) => setPage(name);

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
