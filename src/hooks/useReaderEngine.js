import { useState, useEffect, useRef } from 'react';

const useReaderEngine = (totalWords, wpm, chunkSize, viewMode, customDelays = []) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    let timeoutId;

    if (isPlaying && totalWords > 0) {
      // Determine delay for the CURRENT item
      let delay = 60000 / wpm;
      
      if (customDelays && customDelays.length > 0 && customDelays[currentIndex] !== undefined) {
        delay = customDelays[currentIndex];
      }

      timeoutId = setTimeout(() => {
        setCurrentIndex(prev => {
          const step = viewMode === 'rsvp' ? chunkSize : 1;
          const next = prev + step;
          
          if (next >= totalWords) {
            setIsPlaying(false);
            return prev; // Stay on last item
          }
          return next;
        });
      }, delay);
    }

    return () => clearTimeout(timeoutId);
  }, [isPlaying, currentIndex, wpm, chunkSize, totalWords, viewMode, customDelays]);

  const togglePlay = () => {
      if (currentIndex >= totalWords - 1) setCurrentIndex(0);
      setIsPlaying(p => !p);
  };
  
  const seek = (val) => setCurrentIndex(Number(val));
  const jump = (delta) => setCurrentIndex(i => Math.max(0, Math.min(totalWords - 1, i + delta)));

  return { isPlaying, currentIndex, togglePlay, seek, jump, setIsPlaying };
};

export default useReaderEngine;