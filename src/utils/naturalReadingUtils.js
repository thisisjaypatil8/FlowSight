/**
 * Processes a flat list of words into "natural reading" chunks.
 * Groups words by phrases and calculates delay based on punctuation and line breaks.
 * 
 * @param {Array} words - Array of word objects { text: "word", x, y, pageIndex, ... }
 * @param {number} wpm - Words per minute
 * @returns {Array} - Array of chunk objects { text: "phrase", words: [], delay: ms }
 */
export const processTextToChunks = (words, wpm) => {
  if (!words || words.length === 0) return [];

  const baseDelay = 60000 / wpm;
  const chunks = [];
  let currentChunkWords = [];
  
  // Heuristics for punctuation delays (multipliers of base delay)
  const DELAY_MULTIPLIERS = {
    '.': 2.5,
    '!': 2.5,
    '?': 2.5,
    ';': 2.0,
    ':': 2.0,
    ',': 1.5,
    '-': 1.5,
    '—': 1.5,
    '\n': 2.0 // Paragraph breaks
  };

  const LINE_BREAK_MULTIPLIER = 1.8; // Pause when changing lines
  const MAX_CHUNK_LENGTH = 4; // Max words per chunk if no punctuation

  for (let i = 0; i < words.length; i++) {
    const wordObj = words[i];
    const text = wordObj.text;
    const lastChar = text.slice(-1);
    
    currentChunkWords.push(wordObj);

    // Detect line break (Y position changes significantly)
    let isLineBreak = false;
    if (i < words.length - 1) {
      const nextWord = words[i + 1];
      // If on same page and Y position changed more than word height, it's likely a line break
      if (wordObj.pageIndex === nextWord.pageIndex && wordObj.y && nextWord.y) {
        const yDiff = Math.abs(nextWord.y - wordObj.y);
        const avgHeight = (wordObj.h || 10); // Use word height or default
        if (yDiff > avgHeight * 0.5) { // If Y diff > 50% of word height, it's a new line
          isLineBreak = true;
        }
      }
    }

    // Check if we should break the chunk
    const isPunctuation = DELAY_MULTIPLIERS.hasOwnProperty(lastChar);
    const isMaxLen = currentChunkWords.length >= MAX_CHUNK_LENGTH;
    const isLastWord = i === words.length - 1;
    const isPageBreak = i < words.length - 1 && wordObj.pageIndex !== words[i + 1].pageIndex;

    // Break chunk if: punctuation, max length, line break, page break, or last word
    if (isPunctuation || isMaxLen || isLineBreak || isPageBreak || isLastWord) {
      // Calculate delay multiplier
      let multiplier = 1.0;
      
      if (isPunctuation) {
        multiplier = DELAY_MULTIPLIERS[lastChar];
      } else if (isLineBreak) {
        multiplier = LINE_BREAK_MULTIPLIER;
      } else if (isPageBreak) {
        multiplier = 2.0; // Pause at page breaks
      } else if (isMaxLen) {
        multiplier = 1.0; 
      }

      const wordCountDuration = currentChunkWords.length * baseDelay;
      const pauseBonus = (multiplier > 1.0) ? (baseDelay * (multiplier - 1)) : 0;
      const totalDelay = wordCountDuration + pauseBonus;

      chunks.push({
        text: currentChunkWords.map(w => w.text).join(' '),
        words: [...currentChunkWords], // Copy array with all properties
        delay: totalDelay,
        originalIndex: i - currentChunkWords.length + 1,
        pageIndex: currentChunkWords[0]?.pageIndex || 1,
        breakReason: isPunctuation ? 'punctuation' : isLineBreak ? 'lineBreak' : isPageBreak ? 'pageBreak' : isMaxLen ? 'maxLength' : 'end'
      });

      currentChunkWords = [];
    }
  }

  return chunks;
};
