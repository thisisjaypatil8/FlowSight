import { useState, useEffect, useRef, useCallback } from 'react';

const useAIProcessor = () => {
  const [status, setStatus] = useState('idle'); // idle, loading, ready, error
  const [progress, setProgress] = useState(0);
  const workerRef = useRef(null);

  useEffect(() => {
    // Initialize worker
    workerRef.current = new Worker(new URL('../workers/aiWorker.js', import.meta.url), {
      type: 'module'
    });

    workerRef.current.onmessage = (e) => {
      const { status, data, error } = e.data;
      
      if (status === 'loading') {
        setStatus('loading');
        if (data && data.status === 'progress') {
            setProgress(data.progress);
        }
      } else if (status === 'ready') {
        setStatus('ready');
      } else if (status === 'error') {
        setStatus('error');
        console.error("AI Worker Error:", error);
      }
    };

    // Start initialization
    workerRef.current.postMessage({ type: 'init' });

    return () => {
      workerRef.current.terminate();
    };
  }, []);

  const processText = useCallback((text) => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current || status !== 'ready') {
        reject(new Error("AI Model not ready"));
        return;
      }

      const handleMessage = (e) => {
        const { status, output, error } = e.data;
        if (status === 'complete') {
          workerRef.current.removeEventListener('message', handleMessage);
          resolve(output);
        } else if (status === 'error') {
          workerRef.current.removeEventListener('message', handleMessage);
          reject(error);
        }
      };

      workerRef.current.addEventListener('message', handleMessage);
      workerRef.current.postMessage({ type: 'process', text });
    });
  }, [status]);

  return { status, progress, processText };
};

export default useAIProcessor;
