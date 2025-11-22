import { useState, useEffect, useRef } from 'react';

const useReaderEngine = (totalWords, wpm, chunkSize, viewMode) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPlaying && totalWords > 0) {
      const interval = 60000 / wpm;
      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const step = viewMode === 'rsvp' ? chunkSize : 1;
          const next = prev + step;
          if (next >= totalWords) {
            setIsPlaying(false);
            return totalWords - 1;
          }
          return next;
        });
      }, interval);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, wpm, chunkSize, totalWords, viewMode]);

  const togglePlay = () => {
      if (currentIndex >= totalWords - 1) setCurrentIndex(0);
      setIsPlaying(p => !p);
  };
  
  const seek = (val) => setCurrentIndex(Number(val));
  const jump = (delta) => setCurrentIndex(i => Math.max(0, Math.min(totalWords - 1, i + delta)));

  return { isPlaying, currentIndex, togglePlay, seek, jump, setIsPlaying };
};

export default useReaderEngine;