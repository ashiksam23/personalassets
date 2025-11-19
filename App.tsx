import React, { useState, useCallback, useEffect } from 'react';
import { MandalaData, GRID_INDICES } from './types';
import { EMPTY_DATA, OHTANI_DATA } from './constants';
import { Block } from './components/Block';
import { ControlPanel } from './components/ControlPanel';
import { generateMandalaContent } from './services/geminiService';
import { useCanvas } from './hooks/useCanvas';
import { useUndoRedo } from './hooks/useUndoRedo';

const App: React.FC = () => {
  // Replaced useState with useUndoRedo
  const { 
    state: data, 
    setState: setData, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useUndoRedo<MandalaData>(EMPTY_DATA);

  const [isGenerating, setIsGenerating] = useState(false);
  const { downloadImage } = useCanvas();

  // Keyboard Shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Z or Cmd+Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      // Check for Ctrl+Y or Cmd+Y (Common Redo on Windows)
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Handlers for data updates
  const handleUpdateMainGoal = useCallback((val: string) => {
    setData(prev => ({ ...prev, mainGoal: val }));
  }, [setData]);

  const handleUpdateSubGoal = useCallback((index: number, val: string) => {
    setData(prev => {
      const newSubGoals = [...prev.subGoals];
      newSubGoals[index] = val;
      return { ...prev, subGoals: newSubGoals };
    });
  }, [setData]);

  const handleUpdateTask = useCallback((blockIndex: number, cellIndex: number, val: string) => {
    setData(prev => {
      const newTasks = [...prev.tasks];
      // Ensure the row exists
      if (!newTasks[blockIndex]) newTasks[blockIndex] = Array(9).fill("");
      
      const newBlockTasks = [...newTasks[blockIndex]];
      newBlockTasks[cellIndex] = val;
      newTasks[blockIndex] = newBlockTasks;
      
      return { ...prev, tasks: newTasks };
    });
  }, [setData]);

  // AI Generation Handler
  const handleGenerate = async () => {
    const goal = data.mainGoal.trim();
    if (!goal) {
      alert("Please enter a Main Goal in the center pink box first!");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateMandalaContent(goal);
      
      // Map result to our state structure
      // The API returns arrays of 8. We need arrays of 9 (skipping index 4).
      
      // 1. Map Subgoals
      const mappedSubGoals = Array(9).fill("");
      let apiIndex = 0;
      GRID_INDICES.forEach(i => {
        if (i === 4) return; // Skip center
        if (result.subGoals[apiIndex]) mappedSubGoals[i] = result.subGoals[apiIndex];
        apiIndex++;
      });

      // 2. Map Tasks
      const mappedTasks = Array(9).fill(null).map(() => Array(9).fill(""));
      
      // Iterate through the 8 outer blocks
      apiIndex = 0; // Reset for blocks
      GRID_INDICES.forEach(blockIdx => {
        if (blockIdx === 4) return; // Skip center block
        
        const blockTasks = result.tasks[apiIndex] || [];
        let taskApiIndex = 0;
        
        // Iterate through 8 cells in that block
        GRID_INDICES.forEach(cellIdx => {
            if (cellIdx === 4) return; // Skip label cell
            if (blockTasks[taskApiIndex]) {
                mappedTasks[blockIdx][cellIdx] = blockTasks[taskApiIndex];
            }
            taskApiIndex++;
        });
        apiIndex++;
      });

      setData({
        mainGoal: goal,
        subGoals: mappedSubGoals,
        tasks: mappedTasks
      });

    } catch (error) {
      alert("Failed to generate content. Please check your API key or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <ControlPanel 
        onGenerate={handleGenerate}
        onReset={() => { if(confirm("Clear all fields?")) setData(EMPTY_DATA); }}
        onLoadExample={() => setData(OHTANI_DATA)}
        onDownload={() => downloadImage(data)}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        isGenerating={isGenerating}
      />

      <main className="flex-1 p-4 md:p-8 overflow-auto flex items-center justify-center">
        <div className="relative min-w-[900px] aspect-square max-h-[1200px] max-w-[1200px] p-4 bg-white rounded-3xl shadow-2xl border border-slate-100">
          
          <div className="grid grid-cols-3 gap-3 md:gap-6 h-full w-full">
            {GRID_INDICES.map((blockIndex) => (
              <div key={blockIndex} className="w-full h-full">
                <Block
                  blockIndex={blockIndex}
                  mainGoal={data.mainGoal}
                  subGoals={data.subGoals}
                  tasks={data.tasks[blockIndex] || Array(9).fill("")}
                  onUpdateSubGoal={handleUpdateSubGoal}
                  onUpdateTask={handleUpdateTask}
                  onUpdateMainGoal={handleUpdateMainGoal}
                />
              </div>
            ))}
          </div>

        </div>
      </main>
      
      <footer className="p-4 text-center text-slate-400 text-sm">
        <p>Tip: Start in the center Pink box. The text you type there will be the prompt for AI.</p>
      </footer>
    </div>
  );
};

export default App;