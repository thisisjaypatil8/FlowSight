import React from 'react';
import { X, RotateCcw } from 'lucide-react';

const SettingsModal = ({ show, onClose, wpm, setWpm, chunkSize, setChunkSize, viewMode, onReset }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Reader Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Speed (WPM)</label>
            <input type="range" min="100" max="1000" step="25" value={wpm} onChange={(e) => setWpm(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>100</span><span>{wpm}</span><span>1000</span></div>
          </div>
          {viewMode === 'rsvp' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Chunk Size</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button key={num} onClick={() => setChunkSize(num)} className={`flex-1 py-2 rounded-md font-medium text-sm transition ${chunkSize === num ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>{num}</button>
                ))}
              </div>
            </div>
          )}
          <button onClick={onReset} className="w-full py-2 flex items-center justify-center space-x-2 text-slate-500 hover:text-indigo-600 transition text-sm border-t border-slate-100 dark:border-slate-700 pt-4 mt-2">
            <RotateCcw className="w-4 h-4" /><span>Reset to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;