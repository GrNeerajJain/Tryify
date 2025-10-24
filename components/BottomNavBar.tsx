import React from 'react';
import { View } from '../types';
import { HomeIcon, ImageIcon, UserIcon, QuestionMarkCircleIcon } from './icons';

interface BottomNavBarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const navItems = [
  { view: 'home', label: 'Home', icon: <HomeIcon /> },
  { view: 'creations', label: 'Creations', icon: <ImageIcon className="h-6 w-6" /> },
  { view: 'help', label: 'Help', icon: <QuestionMarkCircleIcon /> },
  { view: 'profile', label: 'Profile', icon: <UserIcon /> },
];

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 z-20">
      <div className="container mx-auto px-4 grid grid-cols-4">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view as View)}
            className={`flex flex-col items-center justify-center py-2 transition-colors ${
              activeView === item.view
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </footer>
  );
};