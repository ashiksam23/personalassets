import React from 'react';
import { Cell } from './Cell';
import { GRID_INDICES } from '../types';

interface BlockProps {
  blockIndex: number;
  mainGoal: string;
  subGoals: string[];
  tasks: string[]; // The 9 tasks for this specific block (if applicable)
  onUpdateSubGoal: (index: number, value: string) => void;
  onUpdateTask: (blockIndex: number, cellIndex: number, value: string) => void;
  onUpdateMainGoal: (value: string) => void;
}

export const Block: React.FC<BlockProps> = ({
  blockIndex,
  mainGoal,
  subGoals,
  tasks,
  onUpdateSubGoal,
  onUpdateTask,
  onUpdateMainGoal
}) => {
  const isCenterBlock = blockIndex === 4;

  return (
    <div className={`grid grid-cols-3 gap-1 p-1 md:gap-2 md:p-2 rounded-lg ${isCenterBlock ? 'bg-white shadow-xl ring-4 ring-rose-50 z-10 scale-105' : 'bg-white/50 border border-slate-200'}`}>
      {GRID_INDICES.map((cellIndex) => {
        const isCenterCell = cellIndex === 4;
        let cellContent = "";
        let variant: 'main' | 'sub' | 'task' | 'label' = 'task';
        let isReadOnly = false;
        let handleChange: ((val: string) => void) | undefined = undefined;
        let placeholder = "";

        if (isCenterBlock) {
          // Center Block Logic
          if (isCenterCell) {
            // THE Main Goal
            cellContent = mainGoal;
            variant = 'main';
            handleChange = onUpdateMainGoal;
            placeholder = "MAIN GOAL";
          } else {
            // Sub Goals surrounding Main Goal
            cellContent = subGoals[cellIndex];
            variant = 'sub';
            handleChange = (val) => onUpdateSubGoal(cellIndex, val);
            placeholder = "Sub-goal";
          }
        } else {
          // Outer Block Logic
          if (isCenterCell) {
            // Label Cell (Copy of Sub-goal)
            cellContent = subGoals[blockIndex];
            variant = 'label';
            isReadOnly = true;
          } else {
            // Task Cell
            cellContent = tasks[cellIndex];
            variant = 'task';
            handleChange = (val) => onUpdateTask(blockIndex, cellIndex, val);
            placeholder = "Task";
          }
        }

        return (
          <div key={`${blockIndex}-${cellIndex}`} className="w-full h-full">
            <Cell
              value={cellContent}
              onChange={handleChange}
              isReadOnly={isReadOnly}
              variant={variant}
              placeholder={placeholder}
            />
          </div>
        );
      })}
    </div>
  );
};