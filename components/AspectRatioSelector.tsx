import React, { useMemo } from 'react';
import { AspectRatio } from '../types';
import { LandscapeIcon, LockIcon, PortraitIcon } from './icons';

interface AspectRatioSelectorProps {
  selected: AspectRatio;
  onSelect: (ratio: AspectRatio) => void;
}

const portraitRatios: { ratio: AspectRatio; locked: boolean }[] = [
  { ratio: '9:16', locked: false }, { ratio: '10:16', locked: false },
  { ratio: '2:3', locked: false }, { ratio: '3:4', locked: false },
  { ratio: '4:5', locked: false }
];

const landscapeRatios: { ratio: AspectRatio; locked: boolean }[] = [
  { ratio: '16:9', locked: false }, { ratio: '16:10', locked: false },
  { ratio: '3:2', locked: false }, { ratio: '4:3', locked: false },
  { ratio: '5:4', locked: false }
];

const otherRatios: { ratio: AspectRatio; label: string; locked: boolean }[] = [
  { ratio: '1:1', label: '1:1 (Square)', locked: false }
];

const allRatiosSorted: AspectRatio[] = [
    '9:16', '10:16', '2:3', '3:4', '4:5', '1:1', '5:4', '4:3', '3:2', '16:10', '16:9'
];


export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selected, onSelect }) => {
  const { paddingBottom, displayWidth, displayHeight } = useMemo(() => {
    const [w, h] = selected.split(':').map(Number);
    let dW, dH;
    if (h >= w) {
      dH = 1120;
      dW = Math.round(1120 * (w / h));
    } else {
      dW = 1120;
      dH = Math.round(1120 * (h / w));
    }
    return {
      paddingBottom: (h / w) * 100,
      displayWidth: dW,
      displayHeight: dH,
    };
  }, [selected]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRatio = allRatiosSorted[parseInt(event.target.value, 10)];
    onSelect(newRatio);
  };
  
  const selectedIndex = allRatiosSorted.indexOf(selected);

  const renderRatioButton = (ratioInfo: { ratio: AspectRatio; label?: string; locked: boolean }) => {
    const isSelected = selected === ratioInfo.ratio;
    return (
      <button
        key={ratioInfo.ratio}
        onClick={() => onSelect(ratioInfo.ratio)}
        disabled={ratioInfo.locked}
        className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors flex items-center justify-between ${
          isSelected
            ? 'bg-indigo-600 text-white'
            : ratioInfo.locked
            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
        }`}
      >
        <span>{ratioInfo.label || ratioInfo.ratio}</span>
        {ratioInfo.locked && <LockIcon />}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {/* Left Side: Preview & Slider */}
      <div className="flex flex-col space-y-4">
        <div className="w-full max-w-[200px] mx-auto border-2 border-gray-300 dark:border-gray-600 rounded-md p-1">
           <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-sm" style={{ paddingBottom: `${paddingBottom}%` }}>
             <span className="absolute inset-0 flex items-center justify-center text-lg font-mono text-gray-500 dark:text-gray-400">{selected}</span>
           </div>
        </div>
        <input 
            type="range"
            min="0"
            max={allRatiosSorted.length - 1}
            step="1"
            value={selectedIndex}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 font-mono">
            <div><span className="font-sans text-gray-400 dark:text-gray-500">Width</span> {displayWidth} px</div>
            <div><span className="font-sans text-gray-400 dark:text-gray-500">Height</span> {displayHeight} px</div>
        </div>
      </div>

      {/* Right Side: Presets */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <h3 className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 font-semibold text-sm mb-2">
            <PortraitIcon />
            <span>Portrait</span>
          </h3>
          <div className="space-y-1">
            {portraitRatios.map(renderRatioButton)}
          </div>
        </div>
        <div>
           <h3 className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 font-semibold text-sm mb-2">
            <LandscapeIcon />
            <span>Landscape</span>
          </h3>
          <div className="space-y-1">
            {landscapeRatios.map(renderRatioButton)}
          </div>
        </div>
        <div className="col-span-2 space-y-1">
            {otherRatios.map(renderRatioButton)}
        </div>
      </div>
    </div>
  );
};