import { useState, useEffect } from 'react';

const usePdfLoader = () => {
  const [pdfDocument, setPdfDocument] = useState(null);
  const [docData, setDocData] = useState({ pages: [] });
  const [flatWords, setFlatWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    };
    document.body.appendChild(script);
    return () => {
        if(document.body.contains(script)) {
            document.body.removeChild(script);
        }
    }
  }, []);

  const loadFile = async (file) => {
    if (!file || file.type !== 'application/pdf') return alert("Invalid PDF");
    if (!window.pdfjsLib) return alert("PDF Engine loading...");

    setIsLoading(true);
    setFileName(file.name);
    setFlatWords([]);

    try {
      const buf = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
      setPdfDocument(pdf);
      await parseContent(pdf);
    } catch (e) {
      console.error(e);
      alert("Error parsing PDF");
      setIsLoading(false);
    }
  };

  const parseContent = async (pdf) => {
    const pages = [];
    const linearWords = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      setProgress(Math.round((i / pdf.numPages) * 100));
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.0 });
      const textContent = await page.getTextContent();
      
      const pageWords = processTextItems(textContent, viewport, i);
      
      pageWords.forEach(w => {
         linearWords.push({ ...w, wordIndexInPage: pages.length > 0 ? -1 : 0 }); 
      });

      pages.push({ pageIndex: i, words: pageWords, viewport });
    }

    let globalIdx = 0;
    const finalPages = pages.map(p => {
        const wordsWithIdx = p.words.map((w, localIdx) => {
            const wordObj = { ...w, wordIndexInPage: localIdx };
            linearWords[globalIdx] = wordObj;
            globalIdx++;
            return wordObj;
        });
        return { ...p, words: wordsWithIdx };
    });

    setDocData({ pages: finalPages });
    setFlatWords(linearWords);
    setIsLoading(false);
  };

  const processTextItems = (textContent, viewport, pageIndex) => {
    const words = [];
    textContent.items.forEach(item => {
      const str = item.str;
      if (!str.trim()) return;
      
      const tx = item.transform;
      const fontSize = Math.sqrt(tx[2]*tx[2] + tx[3]*tx[3]);
      const charW = item.width / str.length;
      
      let currentWord = '';
      let startX = 0;
      let currentX = 0;

      str.split('').forEach(char => {
         if (char.trim() === '') {
            if (currentWord) {
               words.push({
                  text: currentWord,
                  x: tx[4] + startX,
                  y: tx[5],
                  w: currentWord.length * charW,
                  h: item.height || fontSize,
                  pageIndex
               });
            }
            currentWord = '';
            startX = currentX + charW;
         } else {
            if (!currentWord) startX = currentX;
            currentWord += char;
         }
         currentX += charW;
      });
      
      if (currentWord) {
          words.push({
            text: currentWord,
            x: tx[4] + startX,
            y: tx[5],
            w: currentWord.length * charW,
            h: item.height || fontSize,
            pageIndex
         });
      }
    });
    return words;
  };

  return { loadFile, isLoading, progress, fileName, docData, flatWords, pdfDocument };
};

export default usePdfLoader;