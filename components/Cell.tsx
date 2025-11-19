import React, { useCallback } from 'react';

interface CellProps {
  value: string;
  onChange?: (value: string) => void;
  isReadOnly?: boolean;
  variant?: 'main' | 'sub' | 'task' | 'label';
  placeholder?: string;
}

export const Cell: React.FC<CellProps> = ({ 
  value, 
  onChange, 
  isReadOnly = false, 
  variant = 'task',
  placeholder = ''
}) => {
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  }, [onChange]);

  // Dynamic styles based on variant
  const getStyles = () => {
    const baseStyles = "w-full h-full resize-none p-1 md:p-2 text-center flex items-center justify-center focus:outline-none transition-colors duration-200 no-scrollbar rounded-md text-[10px] md:text-xs leading-tight";
    
    switch (variant) {
      case 'main':
        return `${baseStyles} bg-rose-100 text-rose-900 font-extrabold text-xs md:text-sm border-2 border-rose-300 hover:bg-rose-50 focus:bg-white focus:border-rose-500`;
      case 'sub':
        return `${baseStyles} bg-indigo-50 text-indigo-900 font-bold border border-indigo-100 hover:bg-white focus:bg-white focus:border-indigo-400`;
      case 'label':
        return `${baseStyles} bg-slate-100 text-slate-500 font-bold cursor-default select-none uppercase tracking-wider`;
      case 'task':
      default:
        return `${baseStyles} bg-white text-slate-700 font-medium border border-slate-100 hover:border-slate-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400`;
    }
  };

  return (
    <div className="relative w-full h-full aspect-square">
      <textarea
        className={getStyles()}
        value={value}
        onChange={handleChange}
        readOnly={isReadOnly}
        placeholder={placeholder}
        spellCheck={false}
      />
    </div>
  );
};