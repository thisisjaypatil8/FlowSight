import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import PDFDisplay from './components/PDFDisplay';
import RSVPDisplay from './components/RSVPDisplay';
import ControlBar from './components/ControlBar';
import UploadState from './components/UploadState';
import SettingsModal from './components/SettingsModal';
import usePdfLoader from './hooks/usePdfLoader';
import useReaderEngine from './hooks/useReaderEngine';

function App() {
  const [wpm, setWpm] = useState(300);
  const [chunkSize, setChunkSize] = useState(1);
  const [viewMode, setViewMode] = useState('pdf'); 
  const [showSettings, setShowSettings] = useState(false);
  const [scale, setScale] = useState(1.2);

  const { loadFile, isLoading, progress, fileName, docData, flatWords, pdfDocument } = usePdfLoader();

  const { isPlaying, currentIndex, togglePlay, seek, jump, setIsPlaying } = useReaderEngine(
    flatWords.length, 
    wpm, 
    chunkSize, 
    viewMode
  );

  useEffect(() => { setIsPlaying(false); }, [viewMode, showSettings]);

  const activeWord = flatWords[currentIndex];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col items-center p-4 font-sans transition-colors duration-300">
      
      <TopBar 
        fileName={fileName} 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        onSettingsClick={() => setShowSettings(true)} 
      />

      <div className="w-full max-w-6xl flex-1 flex flex-col items-center relative z-10 min-h-[500px]">
        {flatWords.length === 0 ? (
          <UploadState onFileSelect={loadFile} isLoading={isLoading} progress={progress} />
        ) : (
          <>
            {viewMode === 'pdf' ? (
               <PDFDisplay 
                  pdfDocument={pdfDocument} 
                  docData={docData} 
                  activeWord={activeWord} 
                  scale={scale} 
                  setScale={setScale}
                  isPlaying={isPlaying}
               />
            ) : (
               <RSVPDisplay 
                  words={flatWords} 
                  currentIndex={currentIndex} 
                  chunkSize={chunkSize}
                  pageIndex={activeWord?.pageIndex || 1}
               />
            )}
            
            <ControlBar 
               isPlaying={isPlaying}
               togglePlay={togglePlay}
               currentIndex={currentIndex}
               total={flatWords.length}
               wpm={wpm}
               onSeek={seek}
               onJump={jump}
            />
          </>
        )}
      </div>

      <SettingsModal 
        show={showSettings} 
        onClose={() => setShowSettings(false)}
        wpm={wpm}
        setWpm={setWpm}
        chunkSize={chunkSize}
        setChunkSize={setChunkSize}
        viewMode={viewMode}
        onReset={() => { setWpm(300); setChunkSize(1); setScale(1.2); }}
      />
    </div>
  );
}

export default App;