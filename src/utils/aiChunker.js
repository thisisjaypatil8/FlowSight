/**
 * AI-Enhanced Chunking Utility
 * Uses POS tagging to create intelligent phrase boundaries
 */

import { processTextToChunks } from './naturalReadingUtils';

/**
 * Creates AI-enhanced chunks using POS tagging
 * @param {Array} words - Original word objects from PDF
 * @param {Array} posEntities - POS tagging entities from AI model
 * @param {number} wpm - Words per minute
 * @returns {Array} - Smart chunks with AI-detected phrase boundaries
 */
export const createAIChunks = (words, posEntities, wpm) => {
  if (!posEntities || posEntities.length === 0 || !words || words.length === 0) {
    return processTextToChunks(words, wpm);
  }

  const baseDelay = 60000 / wpm;
  const chunks = [];
  let currentChunk = [];

  // POS tag grouping rules for natural phrases
  const PHRASE_CONTINUITY = {
    // Determiners start noun phrases
    'DET': { canStart: true, continuesWith: ['ADJ', 'NOUN', 'PROPN', 'NUM'] },
    // Adjectives continue and extend noun phrases
    'ADJ': { canStart: false, continuesWith: ['ADJ', 'NOUN', 'PROPN'] },
    // Nouns are core of phrases
    'NOUN': { canStart: true, continuesWith: ['NOUN', 'PROPN', 'ADP'] },
    'PROPN': { canStart: true, continuesWith: ['PROPN'] },
    // Verbs can start verb phrases
    'VERB': { canStart: true, continuesWith: ['ADV', 'ADP', 'PART'] },
    'AUX': { canStart: true, continuesWith: ['VERB', 'ADV'] },
    // Adverbs modify verbs
    'ADV': { canStart: false, continuesWith: ['VERB', 'ADJ'] },
    // Prepositions start prepositional phrases
    'ADP': { canStart: true, continuesWith: ['DET', 'ADJ', 'NOUN', 'PROPN'] },
    // Conjunctions always break
    'CCONJ': { canStart: false, continuesWith: [], breakBefore: true },
    'SCONJ': { canStart: false, continuesWith: [], breakBefore: true },
    // Punctuation breaks
    'PUNCT': { canStart: false, continuesWith: [], breakAfter: true },
  };

  const DELAY_MULTIPLIERS = {
    '.': 2.5, '!': 2.5, '?': 2.5, ';': 2.0, ':': 2.0, ',': 1.5,
  };

  // Map POS entities to word indices
  let wordIdx = 0;
  
  for (let i = 0; i < Math.min(posEntities.length, words.length); i++) {
    const entity = posEntities[i];
    const word = words[wordIdx];
    
    if (!word) break;

    const tag = entity.entity_group || entity.entity || 'NOUN'; // Fallback to NOUN
    const rules = PHRASE_CONTINUITY[tag] || {};
    
    // Check if we should break before this word
    if (rules.breakBefore && currentChunk.length > 0) {
      // Finalize current chunk
      chunks.push(createChunk(currentChunk, wpm));
      currentChunk = [];
    }

    currentChunk.push(word);

    // Check break conditions
    const shouldBreak = 
      rules.breakAfter || // Punctuation
      currentChunk.length >= 5 || // Max length
      (i < posEntities.length - 1 && !canContinue(tag, posEntities[i + 1]?.entity_group)); // Can't continue with next

    if (shouldBreak || wordIdx >= words.length - 1) {
      chunks.push(createChunk(currentChunk, wpm));
      currentChunk = [];
    }

    wordIdx++;
  }

  // Handle remaining words with heuristic
  if (wordIdx < words.length) {
    const remainingWords = words.slice(wordIdx);
    const remainingChunks = processTextToChunks(remainingWords, wpm);
    chunks.push(...remainingChunks);
  }

  return chunks.length > 0 ? chunks : processTextToChunks(words, wpm);
};

function canContinue(currentTag, nextTag) {
  const rules = PHRASE_CONTINUITY[currentTag];
  if (!rules || !rules.continuesWith) return false;
  return rules.continuesWith.includes(nextTag);
}

function createChunk(words, wpm) {
  const baseDelay = 60000 / wpm;
  const text = words.map(w => w.text).join(' ');
  const lastChar = text.slice(-1);
  
  const DELAY_MULTIPLIERS = {
    '.': 2.5, '!': 2.5, '?': 2.5, ';': 2.0, ':': 2.0, ',': 1.5,
  };

  const multiplier = DELAY_MULTIPLIERS[lastChar] || 1.0;
  const duration = words.length * baseDelay;
  const pauseBonus = multiplier > 1.0 ? baseDelay * (multiplier - 1) : 0;

  return {
    text,
    words: [...words],
    delay: duration + pauseBonus,
    pageIndex: words[0]?.pageIndex || 1,
    breakReason: 'ai-phrase'
  };
}
