import React from 'react';
import { Play, Pause, Rewind, FastForward } from 'lucide-react';

const ControlBar = ({ isPlaying, togglePlay, currentIndex, total, wpm, onSeek, onJump }) => (
  <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mt-6">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center space-x-6 order-2 md:order-1">
        <button onClick={() => onJump(-20)} className="p-2 text-slate-400 hover:text-indigo-600 transition"><Rewind className="w-6 h-6" /></button>
        <button onClick={togglePlay} className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transform transition active:scale-95">
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-1 fill-current" />}
        </button>
        <button onClick={() => onJump(20)} className="p-2 text-slate-400 hover:text-indigo-600 transition"><FastForward className="w-6 h-6" /></button>
      </div>

      <div className="flex-1 w-full order-1 md:order-2 px-4">
         <div className="flex justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Start</span>
            <span>{total > 0 ? (currentIndex / total * 100).toFixed(0) : 0}%</span>
            <span>End</span>
         </div>
         <input type="range" min="0" max={total - 1} value={currentIndex} onChange={(e) => onSeek(e.target.value)} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
         <div className="text-center mt-1 text-xs text-slate-400">Word {currentIndex} of {total}</div>
      </div>

      <div className="order-3 flex items-center space-x-2 min-w-[100px] justify-end">
         <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">{wpm}</span>
         <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">wpm</span>
      </div>
    </div>
  </div>
);

export default ControlBar;