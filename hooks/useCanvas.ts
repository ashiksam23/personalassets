import { useCallback } from 'react';
import { MandalaData, GRID_INDICES } from '../types';

export const useCanvas = () => {
  const downloadImage = useCallback((data: MandalaData) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = 2; // Retina quality
    const cellSize = 140 * scale;
    const gap = 16 * scale;
    const blockGap = 4 * scale;
    const padding = 80 * scale;
    
    const blockSize = (cellSize * 3) + (blockGap * 2);
    const totalWidth = (blockSize * 3) + (gap * 2) + (padding * 2);
    const totalHeight = totalWidth + (150 * scale); // Extra space for title

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    const fontBase = '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

    // Background
    ctx.fillStyle = '#f8fafc'; 
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Title
    ctx.fillStyle = '#0f172a'; 
    ctx.font = `800 ${48 * scale}px ${fontBase}`;
    ctx.textAlign = 'center';
    ctx.fillText(data.mainGoal || "Mandala Goal Chart", totalWidth / 2, 100 * scale);
    
    ctx.fillStyle = '#64748b'; 
    ctx.font = `500 ${24 * scale}px ${fontBase}`;
    ctx.fillText("Generated with AI", totalWidth / 2, 140 * scale);

    const drawCell = (text: string, x: number, y: number, type: 'main' | 'sub' | 'label' | 'task') => {
      if (type === 'main') ctx.fillStyle = '#fff1f2'; 
      else if (type === 'sub') ctx.fillStyle = '#eef2ff'; 
      else if (type === 'label') ctx.fillStyle = '#f1f5f9';
      else ctx.fillStyle = '#ffffff';

      // Shadow
      ctx.shadowColor = "rgba(0,0,0,0.05)";
      ctx.shadowBlur = 10 * scale;
      ctx.shadowOffsetY = 4 * scale;
      ctx.fillRect(x, y, cellSize, cellSize);
      ctx.shadowColor = "transparent"; 
      
      // Border
      ctx.lineWidth = 2 * scale;
      if (type === 'main') ctx.strokeStyle = '#fda4af'; 
      else if (type === 'sub') ctx.strokeStyle = '#c7d2fe'; 
      else ctx.strokeStyle = '#e2e8f0'; 
      ctx.strokeRect(x, y, cellSize, cellSize);

      // Text Color & Font
      ctx.fillStyle = '#1c1917';
      if (type === 'main') {
          ctx.font = `800 ${18 * scale}px ${fontBase}`;
          ctx.fillStyle = '#881337'; 
      } else if (type === 'sub') {
          ctx.font = `700 ${16 * scale}px ${fontBase}`;
          ctx.fillStyle = '#3730a3'; 
      } else if (type === 'label') {
          ctx.font = `700 ${14 * scale}px ${fontBase}`;
          ctx.fillStyle = '#64748b';
      } else {
          ctx.font = `500 ${15 * scale}px ${fontBase}`;
          ctx.fillStyle = '#334155'; 
      }
      
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Word Wrapping
      const words = (text || "").split(' ');
      let line = '';
      let lines = [];
      
      for(let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > cellSize - (24 * scale) && n > 0) {
              lines.push(line);
              line = words[n] + ' ';
          } else {
              line = testLine;
          }
      }
      lines.push(line);

      const lineHeight = 22 * scale;
      const startY = y + (cellSize/2) - ((lines.length - 1) * lineHeight / 2);

      lines.forEach((l, i) => {
          ctx.fillText(l.trim(), x + cellSize/2, startY + (i * lineHeight));
      });
    };

    // Render Loop
    for (let blockRow = 0; blockRow < 3; blockRow++) {
      for (let blockCol = 0; blockCol < 3; blockCol++) {
        const blockIndex = blockRow * 3 + blockCol;
        const blockX = padding + (blockCol * (blockSize + gap));
        const blockY = (180 * scale) + (blockRow * (blockSize + gap));
        const isCenterBlock = blockIndex === 4;

        for (let cellRow = 0; cellRow < 3; cellRow++) {
          for (let cellCol = 0; cellCol < 3; cellCol++) {
            const cellIndex = cellRow * 3 + cellCol;
            const cellX = blockX + (cellCol * (cellSize + blockGap));
            const cellY = blockY + (cellRow * (cellSize + blockGap));
            const isCenterCell = cellIndex === 4;

            let text = "";
            let type: 'main' | 'sub' | 'label' | 'task' = 'task';

            if (isCenterBlock) {
              if (isCenterCell) { text = data.mainGoal; type = 'main'; }
              else { text = data.subGoals[cellIndex]; type = 'sub'; }
            } else {
              if (isCenterCell) { text = data.subGoals[blockIndex]; type = 'label'; }
              else { text = data.tasks[blockIndex]?.[cellIndex] || ""; type = 'task'; }
            }
            drawCell(text, cellX, cellY, type);
          }
        }
      }
    }

    const link = document.createElement('a');
    link.download = `mandala-chart-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  }, []);

  return { downloadImage };
};