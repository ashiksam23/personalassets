import React from 'react';

interface ControlPanelProps {
  onGenerate: () => void;
  onReset: () => void;
  onLoadExample: () => void;
  onDownload: () => void;
  onUndo: () => void;
  onRedo: () => void;
  isGenerating: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onGenerate,
  onReset,
  onLoadExample,
  onDownload,
  onUndo,
  onRedo,
  isGenerating,
  canUndo,
  canRedo
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-2 mr-4">
        <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-indigo-600 rounded-md shadow-lg flex items-center justify-center text-white font-bold text-xs">
          MC
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
          Mandala AI
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-100 rounded-lg p-1 mr-2">
          <button 
            onClick={onUndo} 
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`p-2 rounded-md transition-all ${
              canUndo 
                ? 'text-slate-700 hover:bg-white hover:shadow-sm hover:text-indigo-600' 
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
          <div className="w-px h-4 bg-slate-200 mx-1"></div>
          <button 
            onClick={onRedo} 
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            className={`p-2 rounded-md transition-all ${
              canRedo 
                ? 'text-slate-700 hover:bg-white hover:shadow-sm hover:text-indigo-600' 
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          </button>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            isGenerating
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 shadow-md'
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              Auto-Fill with AI
            </>
          )}
        </button>

        <div className="h-6 w-px bg-slate-300 mx-2 hidden md:block"></div>

        <button onClick={onLoadExample} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
          Load Ohtani Example
        </button>

        <button onClick={onReset} className="px-3 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors">
          Clear Board
        </button>
        
         <button onClick={onDownload} className="px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Export
        </button>
      </div>
    </div>
  );
};