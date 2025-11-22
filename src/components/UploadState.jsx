import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

const UploadState = ({ onFileSelect, isLoading, progress }) => {
  const fileRef = useRef(null);
  return (
    <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 w-full bg-white/50 dark:bg-slate-800/50">
       {isLoading ? (
          <>
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium">Reading PDF... {progress}%</p>
          </>
       ) : (
          <>
             <Upload className="w-16 h-16 text-indigo-400 mb-6" />
             <h2 className="text-2xl font-bold mb-2">Drop your PDF here</h2>
             <p className="text-slate-500 mb-6">We'll analyze the layout for reading.</p>
             <button onClick={() => fileRef.current.click()} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition transform hover:scale-105">
               Select PDF File
             </button>
             <input type="file" ref={fileRef} onChange={(e) => onFileSelect(e.target.files[0])} accept="application/pdf" className="hidden" />
          </>
       )}
    </div>
  );
};

export default UploadState;