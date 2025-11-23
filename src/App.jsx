import React, { useState, useEffect, useMemo } from 'react';
import TopBar from './components/TopBar';
import PDFDisplay from './components/PDFDisplay';
import RSVPDisplay from './components/RSVPDisplay';
import ControlBar from './components/ControlBar';
import UploadState from './components/UploadState';
import SettingsModal from './components/SettingsModal';
import usePdfLoader from './hooks/usePdfLoader';
import useReaderEngine from './hooks/useReaderEngine';
import useAIProcessor from './hooks/useAIProcessor';
import { processTextToChunks } from './utils/naturalReadingUtils';
import { createAIChunks } from './utils/aiChunker';

function App() {
  const [wpm, setWpm] = useState(300);
  const [chunkSize, setChunkSize] = useState(1);
  const [viewMode, setViewMode] = useState('pdf');
  const [showSettings, setShowSettings] = useState(false);
  const [scale, setScale] = useState(1.2);
  const [isNaturalReading, setIsNaturalReading] = useState(false);
  const [isAiEnhanced, setIsAiEnhanced] = useState(false);
  const [aiChunks, setAiChunks] = useState([]);

  const { loadFile, isLoading, progress, fileName, docData, flatWords, pdfDocument } = usePdfLoader();
  const { status: aiStatus, processText } = useAIProcessor();

  // Effect to trigger AI processing when enabled
  useEffect(() => {
    const runAI = async () => {
      if (isAiEnhanced && flatWords.length > 0 && aiStatus === 'ready') {
        try {
          // Process first 1000 words to avoid overwhelming
          const textToProcess = flatWords.slice(0, 1000).map(w => w.text).join(' ');
          const output = await processText(textToProcess);

          console.log('✅ AI Processing Complete');
          console.log('📊 POS Entities detected:', output?.length || 0);
          if (output && output.length > 0) {
            console.log('Sample entities:', output.slice(0, 5));
          }

          // Store AI output for chunk enhancement
          setAiChunks(output || []);

        } catch (e) {
          console.error('❌ AI Processing Failed:', e);
          setAiChunks([]); // Clear on error
        }
      } else {
        setAiChunks([]); // Clear when AI disabled
      }
    };

    if (isAiEnhanced) {
      runAI();
    } else {
      setAiChunks([]);
    }
  }, [isAiEnhanced, flatWords, aiStatus, processText]);

  // Process chunks if Natural Reading is enabled
  const processedChunks = useMemo(() => {
    if (isNaturalReading && flatWords.length > 0) {
      // If AI is enabled and we have AI data, use AI-powered chunking
      if (isAiEnhanced && aiChunks.length > 0) {
        console.log('🤖 Using AI-powered phrase detection');
        return createAIChunks(flatWords, aiChunks, wpm);
      }

      // Otherwise use heuristic chunking
      return processTextToChunks(flatWords, wpm);
    }
    return [];
  }, [flatWords, wpm, isNaturalReading, isAiEnhanced, aiChunks]);

  // Determine what the engine should use
  const engineWords = isNaturalReading ? processedChunks : flatWords;
  const engineTotal = engineWords.length;
  const engineChunkSize = isNaturalReading ? 1 : chunkSize;
  const engineDelays = isNaturalReading ? processedChunks.map(c => c.delay) : [];

  const { isPlaying, currentIndex, togglePlay, seek, jump, setIsPlaying } = useReaderEngine(
    engineTotal,
    wpm,
    engineChunkSize,
    viewMode,
    engineDelays
  );

  useEffect(() => { setIsPlaying(false); }, [viewMode, showSettings, isNaturalReading, isAiEnhanced]);

  const activeWord = engineWords[currentIndex];

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
            {/* AI Loading State */}
            {isAiEnhanced && aiStatus === 'loading' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg z-50 text-sm animate-pulse">
                Initializing AI Model...
              </div>
            )}

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
                words={engineWords}
                currentIndex={currentIndex}
                chunkSize={engineChunkSize}
                pageIndex={activeWord?.pageIndex || 1}
              />
            )}

            <ControlBar
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              currentIndex={currentIndex}
              total={engineTotal}
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
        isNaturalReading={isNaturalReading}
        setIsNaturalReading={setIsNaturalReading}
        isAiEnhanced={isAiEnhanced}
        setIsAiEnhanced={setIsAiEnhanced}
        onReset={() => { setWpm(300); setChunkSize(1); setScale(1.2); setIsNaturalReading(false); setIsAiEnhanced(false); }}
      />
    </div>
  );
}

export default App;