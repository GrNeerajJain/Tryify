import React from 'react';
import { Theme } from '../types';
import { SunIcon, MoonIcon } from './icons';

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const themeOptions: { name: Theme; icon: React.ReactNode }[] = [
  { name: 'light', icon: <SunIcon /> },
  { name: 'dark', icon: <MoonIcon /> },
];

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  return (
    <div className="flex items-center p-1 bg-gray-200/80 dark:bg-slate-800/80 rounded-full">
      {themeOptions.map((option) => (
        <button
          key={option.name}
          onClick={() => setTheme(option.name)}
          className={`p-1.5 rounded-full transition-colors duration-300 flex items-center gap-1.5 ${
            theme === option.name
              ? 'bg-white dark:bg-slate-700 text-indigo-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100'
          }`}
          aria-label={`Switch to ${option.name} theme`}
        >
          {option.icon}
          <span className="capitalize text-sm font-semibold">{option.name}</span>
        </button>
      ))}
    </div>
  );
};
