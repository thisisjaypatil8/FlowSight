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

      let wordY = 0;
      if (activeWord.words && Array.isArray(activeWord.words) && activeWord.words.length > 0) {
        wordY = pageData.words[activeWord.words[0].wordIndexInPage]?.y || 0;
      } else {
        wordY = pageData.words[activeWord.wordIndexInPage]?.y || 0;
      }

      const viewportH = pageData.viewport.height;
      const topPx = (viewportH - wordY) * scale;
      const container = containerRef.current;
      const offset = topPx - (container.clientHeight / 2);

      container.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }, [activeWord, scale, isPlaying, docData, activePageIndex]);

  const getHighlightRects = () => {
    if (!activeWord) return [];

    const pageData = docData.pages[activePageIndex - 1];
    if (!pageData) return [];

    const viewportH = pageData.viewport.height;
    const wordsToHighlight = [];
    
    if (activeWord.words && Array.isArray(activeWord.words)) {
      activeWord.words.forEach((w) => {
        const wordData = pageData.words[w.wordIndexInPage];
        if (wordData) wordsToHighlight.push(wordData);
      });
    } else {
      const wordData = pageData.words[activeWord.wordIndexInPage];
      if (wordData) wordsToHighlight.push(wordData);
    }

    if (wordsToHighlight.length === 0) return [];

    const lineGroups = [];
    wordsToHighlight.forEach(word => {
      const { x, y, w, h } = word;
      let lineGroup = lineGroups.find(group => Math.abs(group.y - y) < h * 0.3);
      
      if (!lineGroup) {
        lineGroup = { y, h, words: [] };
        lineGroups.push(lineGroup);
      }
      
      lineGroup.words.push({ x, y, w, h });
    });

    return lineGroups.map(group => {
      group.words.sort((a, b) => a.x - b.x);
      const leftmost = group.words[0];
      const rightmost = group.words[group.words.length - 1];
      const startX = leftmost.x;
      const endX = rightmost.x + rightmost.w;
      
      return {
        left: `${startX * scale}px`,
        top: `${(viewportH - group.y - group.h) * scale}px`,
        width: `${(endX - startX) * scale}px`,
        height: `${group.h * scale * 1.2}px`,
      };
    });
  };

  return (
    <div className="relative w-full flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden shadow-inner border border-slate-300 dark:border-slate-700 flex flex-col">
      <div className="absolute top-4 right-4 z-20 flex space-x-2">
        <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="bg-black/50 text-white p-1 rounded hover:bg-black/70">-</button>
        <span className="bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center">{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(s => Math.min(3.0, s + 0.2))} className="bg-black/50 text-white p-1 rounded hover:bg-black/70">+</button>
      </div>

      <div className="absolute top-4 left-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
        Page {activePageIndex}
      </div>

      <div ref={containerRef} className="w-full h-[60vh] overflow-auto flex justify-center p-8 bg-slate-500/10">
        <div className="relative shadow-2xl transition-transform duration-200 origin-top">
          <canvas ref={canvasRef} className="bg-white" />
          
          {getHighlightRects().map((style, idx) => (
            <div
              key={idx}
              className="absolute shadow-lg pdf-highlight"
              style={{
                ...style,
                background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.28), rgba(37, 99, 235, 0.38))',
                borderRadius: '4px',
                boxShadow: '0 3px 10px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.45)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PDFDisplay;
