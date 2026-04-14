import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-800 text-sky-400 hover:bg-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]' 
          : 'bg-white text-slate-500 hover:bg-slate-100 shadow-sm border border-slate-200 hover:text-sky-500'
      } ${className}`}
      aria-label="Toggle Dark Mode"
      title={theme === 'light' ? 'تفعيل الوضع الليلي' : 'تفعيل الوضع النهاري'}
    >
      <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="text-lg" />
    </button>
  );
};
