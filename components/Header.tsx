import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/80 dark:border-gray-700/80 py-6 sticky top-0 z-20">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center">
        <h1 className="text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-wider">
          TRYIFY
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 tracking-widest uppercase">
          TRY IT. SEE IT. LOVE IT.
        </p>
      </div>
    </header>
  );
};