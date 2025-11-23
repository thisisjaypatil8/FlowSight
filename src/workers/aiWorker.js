import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

class AIHandler {
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      // Using a multilingual POS model. It's a bit larger but reliable.
      this.instance = await pipeline('token-classification', 'Xenova/bert-base-multilingual-cased-pos', { progress_callback });
    }
    return this.instance;
  }
}

// Simple heuristic to group POS tags into chunks
const chunkByPOS = (entities, originalText) => {
  const chunks = [];
  let currentChunk = [];
  
  // Map entities back to words (simplified)
  // The model returns tokens, which might be sub-words. We need to reconstruct.
  // For simplicity in this demo, we will assume the input text is already split by spaces 
  // and we match tags to words, OR we just use the entities directly if they map well.
  
  // Actually, running the model on the *entire* text at once might be too heavy/slow for long docs.
  // We should process sentence by sentence.
  
  // For this MVP, let's assume we receive a "sentence" or a small block of text.
  
  // Heuristic: Break after:
  // - Punctuation (., ;, ?, !)
  // - Verbs (VERB, AUX) - maybe start a new chunk with the verb?
  // - CONJ (CCONJ, SCONJ)
  
  // Since mapping tokens back to the original word objects (with x,y coords) is complex,
  // we will return a list of "Break Indices".
  // The main thread will use these indices to slice the `flatWords` array.
  
  return entities; 
};

self.addEventListener('message', async (event) => {
  const { text, type } = event.data;

  if (type === 'init') {
    try {
      await AIHandler.getInstance((data) => {
        self.postMessage({ status: 'loading', data });
      });
      self.postMessage({ status: 'ready' });
    } catch (e) {
      self.postMessage({ status: 'error', error: e.message });
    }
    return;
  }

  if (type === 'process') {
    try {
      const classifier = await AIHandler.getInstance();
      
      // The text might be very long. We should split it?
      // For now, let's assume the main thread sends reasonable chunks (e.g. pages or paragraphs).
      const output = await classifier(text);
      
      // We need to process this output into something useful.
      // The output is an array of { entity_group, score, word, start, end }.
      // We want to return a list of suggested "split points" or just the raw tags 
      // so the main thread can decide.
      
      // Let's return the raw entities for now, and let the main thread logic (which has the full word objects)
      // decide how to group them.
      
      self.postMessage({ status: 'complete', output });
    } catch (e) {
      self.postMessage({ status: 'error', error: e.message });
    }
  }
});
