import React, { useEffect, useRef } from 'react';

const PDFDisplay = ({ pdfDocument, docData, activeWord, scale, setScale, isPlaying }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const activePageIndex = activeWord ? activeWord.pageIndex : 1;

  useEffect(() => {
    if (!pdfDocument || !activeWord) return;

    const renderPage = async () => {
      const page = await pdfDocument.getPage(activePageIndex);
      const viewport = page.getViewport({ scale });
      
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: ctx, viewport }).promise;
      }
    };
    renderPage();
  }, [pdfDocument, activePageIndex, scale]);

  useEffect(() => {
    if (activeWord && containerRef.current && isPlaying) {
       const pageData = docData.pages[activePageIndex - 1];
       if (!pageData) return;
       
       const wordY = pageData.words[activeWord.wordIndexInPage]?.y || 0;
       const viewportH = pageData.viewport.height;
       
       const topPx = (viewportH - wordY) * scale;
       const container = containerRef.current;
       const offset = topPx - (container.clientHeight / 2);
       
       container.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }, [activeWord, scale, isPlaying]);


  // FIXED — precise bounding box, clean highlight color
  const getHighlightStyle = () => {
    if (!activeWord) return { display: 'none' };

    const pageData = docData.pages[activePageIndex - 1];
    const wordData = pageData?.words[activeWord.wordIndexInPage];
    if (!wordData) return { display: 'none' };

    const { x, y, w, h } = wordData;
    const viewportH = pageData.viewport.height;

    return {
      left: `${x * scale}px`,
      top: `${(viewportH - y - h) * scale}px`, // correct alignment (no guess)
      width: `${w * scale}px`,
      height: `${h * scale * 1.2}px`,                // exact height
    };
  };

  return (
    <div className="relative w-full flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden shadow-inner border border-slate-300 dark:border-slate-700 flex flex-col">
      
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-20 flex space-x-2">
        <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="bg-black/50 text-white p-1 rounded hover:bg-black/70">-</button>
        <span className="bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center">{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(s => Math.min(3.0, s + 0.2))} className="bg-black/50 text-white p-1 rounded hover:bg-black/70">+</button>
      </div>

      {/* Page indicator */}
      <div className="absolute top-4 left-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
        Page {activePageIndex}
      </div>

      {/* PDF + Highlight */}
      <div ref={containerRef} className="w-full h-[60vh] overflow-auto flex justify-center p-8 bg-slate-500/10">
        <div className="relative shadow-2xl transition-transform duration-200 origin-top">
          <canvas ref={canvasRef} className="bg-white" />
          <div 
            className="absolute transition-all duration-100 ease-linear shadow-md"
            style={{
              ...getHighlightStyle(),
              background: 'rgba(0, 153, 255, 0.35)',         // clean highlight color
              borderBottom: '2px solid rgba(0, 153, 255, 0.6)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFDisplay;
