import React, { useState } from 'react';
import { BuildingStorefrontIcon, CameraIcon, SunIcon, TreeIcon, SparklesIcon, PencilIcon, ImageIcon } from './icons';

interface BackgroundSelectorProps {
    preset: string;
    onPresetChange: (preset: string) => void;
    customDescription: string;
    onCustomDescriptionChange: (description: string) => void;
}

const presets = [
    { name: 'Original', icon: <ImageIcon className="h-6 w-6" /> },
    { name: 'City Street', icon: <BuildingStorefrontIcon className="h-6 w-6" /> },
    { name: 'Studio Backdrop', icon: <CameraIcon className="h-6 w-6" /> },
    { name: 'Nature', icon: <TreeIcon className="h-6 w-6" /> },
    { name: 'Beach', icon: <SunIcon className="h-6 w-6" /> },
    { name: 'Minimalist Wall', icon: <SparklesIcon className="h-6 w-6" /> },
];

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
    preset,
    onPresetChange,
    customDescription,
    onCustomDescriptionChange,
}) => {
    const [mode, setMode] = useState<'preset' | 'custom'>('preset');

    const handleModeChange = (newMode: 'preset' | 'custom') => {
        setMode(newMode);
        if (newMode === 'preset') {
            // If switching back to preset, select 'Original' if 'Custom' was active
            if (preset === 'Custom') {
                onPresetChange('Original');
            }
        } else {
            // When switching to custom, update the preset state
            onPresetChange('Custom');
        }
    };
    
    const handlePresetClick = (presetName: string) => {
        setMode('preset');
        onPresetChange(presetName);
        onCustomDescriptionChange('');
    };

    return (
        <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center p-1 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
                <button
                    onClick={() => handleModeChange('preset')}
                    className={`w-1/2 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${
                        mode === 'preset' ? 'bg-white dark:bg-gray-900 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-600/50'
                    }`}
                >
                    Presets
                </button>
                <button
                    onClick={() => handleModeChange('custom')}
                    className={`w-1/2 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${
                        mode === 'custom' ? 'bg-white dark:bg-gray-900 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-600/50'
                    }`}
                >
                    <PencilIcon className="h-5 w-5" />
                    Custom
                </button>
            </div>

            {mode === 'preset' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in">
                    {presets.map((p) => (
                        <button
                            key={p.name}
                            onClick={() => handlePresetClick(p.name)}
                            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                                preset === p.name ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            {p.icon}
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{p.name}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="animate-fade-in">
                    <textarea
                        value={customDescription}
                        onChange={(e) => onCustomDescriptionChange(e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-200"
                        placeholder="e.g., A futuristic neon-lit city street at night, a cozy library with a fireplace..."
                    />
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Describe the background you want the AI to create.</p>
                </div>
            )}
        </div>
    );
};
