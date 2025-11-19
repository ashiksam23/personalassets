export interface MandalaData {
  mainGoal: string;
  // We use an array of 9 for subGoals to match the 3x3 grid index directly. 
  // Index 4 is unused/placeholder in this array, but keeps logic simple.
  subGoals: string[]; 
  // We use an array of 9 arrays, each with 9 strings.
  // tasks[blockIndex][cellIndex]
  tasks: string[][]; 
}

export interface GeminiMandalaResponse {
  subGoals: string[]; // Expected length 8
  tasks: string[][]; // Expected length 8, each length 8
}

// Helper types for Grid rendering
export type GridIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export const GRID_INDICES: GridIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
