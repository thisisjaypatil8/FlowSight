import React from 'react';
import { FileText, Zap, Settings } from 'lucide-react';

const TopBar = ({ fileName, viewMode, setViewMode, onSettingsClick }) => (
  <div className="w-full max-w-6xl flex flex-wrap justify-between items-center mb-6 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
    <div className="flex items-center space-x-2 mb-2 sm:mb-0">
      <FileText className="w-5 h-5 text-indigo-600" />
      <h1 className="font-bold text-lg mr-4">Flow Sight</h1>
      {fileName && (
        <span className="text-xs font-medium px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-md truncate max-w-[150px]">
          {fileName}
        </span>
      )}
    </div>
    
    <div className="flex items-center space-x-2">
      <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 mr-2">
         <button
           onClick={() => setViewMode('rsvp')}
           className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${viewMode === 'rsvp' ? 'bg-white dark:bg-slate-600 shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
         >
           <Zap className="w-3 h-3" />
           <span>Speed</span>
         </button>
         <button
           onClick={() => setViewMode('pdf')}
           className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${viewMode === 'pdf' ? 'bg-white dark:bg-slate-600 shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
         >
           <FileText className="w-3 h-3" />
           <span>Original</span>
         </button>
      </div>

      <button 
        onClick={onSettingsClick}
        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition text-slate-500"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default TopBar;