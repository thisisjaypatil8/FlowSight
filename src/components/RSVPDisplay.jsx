import React from 'react';

const RSVPDisplay = ({ words, currentIndex, chunkSize, pageIndex }) => {
  const currentWords = words.slice(currentIndex, currentIndex + chunkSize).map(w => w.text);
  
  const renderContent = () => {
    if (chunkSize === 1 && currentWords[0]) {
       const word = currentWords[0];
       const mid = Math.floor(word.length / 2);
       return (
          <div className="flex items-center justify-center text-5xl md:text-7xl font-mono font-bold tracking-wide h-40">
            <span className="text-slate-800 dark:text-slate-300 text-right w-1/2 overflow-visible whitespace-nowrap">{word.slice(0, mid)}</span>
            <span className="text-red-500 mx-0.5">{word[mid]}</span>
            <span className="text-slate-800 dark:text-slate-300 text-left w-1/2 overflow-visible whitespace-nowrap">{word.slice(mid + 1)}</span>
          </div>
       );
    }
    return (
        <div className="flex items-center justify-center text-4xl md:text-6xl font-bold h-40 text-slate-800 dark:text-slate-200 text-center px-4 leading-tight">
          {currentWords.join(' ')}
        </div>
    );
  };

  return (
    <div className="w-full aspect-video max-h-[500px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col items-center justify-center border-t-4 border-indigo-500 relative">
       <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-200 dark:bg-slate-700"></div>
       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-200 dark:bg-slate-700"></div>
       {renderContent()}
       <p className="absolute bottom-4 right-4 text-xs text-slate-400">Page {pageIndex}</p>
    </div>
  );
};

export default RSVPDisplay;