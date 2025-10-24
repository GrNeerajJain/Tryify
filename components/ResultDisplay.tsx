

import React from 'react';
import { Spinner } from './Spinner';
import { ImageIcon, ShareIcon, DownloadIcon, RedoIcon, CheckCircleIcon, CircleIcon } from './icons';

interface ResultDisplayProps {
  isLoading: boolean;
  generatedImage: string | null;
  originalImage?: string;
  onShare: (imageSrc: string) => void;
  onDownload: (imageSrc: string) => void;
  onTryAgain: () => void;
}

const generationSteps = [
  "Analyzing user and outfit images...",
  "Preparing the AI canvas...",
  "Generating outfit structure...",
  "Applying style and textures...",
  "Finalizing high-resolution image...",
];

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, generatedImage, originalImage, onShare, onDownload, onTryAgain }) => {
  const [isShareSupported, setIsShareSupported] = React.useState(false);
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  React.useEffect(() => {
    if(navigator.share) {
      setIsShareSupported(true);
    }
  }, []);

  React.useEffect(() => {
    let intervalId: number | undefined;
    if (isLoading) {
      setCurrentStepIndex(0); // Reset on start
      intervalId = window.setInterval(() => {
        setCurrentStepIndex(prev => {
          // Stop incrementing at the last step but keep the interval running
          // to give the impression of work until isLoading is false.
          if (prev >= generationSteps.length - 1) {
            return prev;
          }
          return prev + 1;
        });
      }, 2000); // Change step every 2 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLoading]);


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-4">
           <div className="w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Creating your new look...</h3>
            <div className="space-y-4">
              {generationSteps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isInProgress = index === currentStepIndex;

                return (
                  <div key={step} className="flex items-center gap-3 text-left animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center">
                      {isCompleted ? (
                        <CheckCircleIcon className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                      ) : isInProgress ? (
                        <Spinner className="h-5 w-5" />
                      ) : (
                        <CircleIcon className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                      )}
                    </div>
                    <p className={`font-medium transition-colors ${
                      isCompleted ? 'text-gray-500 dark:text-gray-400 line-through' :
                      isInProgress ? 'text-indigo-600 dark:text-indigo-400' :
                      'text-gray-700 dark:text-gray-300'
                    }`}>
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (generatedImage && originalImage) {
      return (
        <div className="flex flex-col h-full animate-fade-in">
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">Original</h3>
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-inner">
                <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">Generated</h3>
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-inner">
                <img src={generatedImage} alt="Generated outfit" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 sm:gap-4">
              <button onClick={() => onDownload(generatedImage)} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-semibold py-2 px-4 rounded-full transition-colors">
                <DownloadIcon />
                <span>Download</span>
              </button>
              {isShareSupported && (
                <button onClick={() => onShare(generatedImage)} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-semibold py-2 px-4 rounded-full transition-colors">
                    <ShareIcon />
                    <span>Share</span>
                </button>
              )}
               <button onClick={onTryAgain} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-semibold py-2 px-4 rounded-full transition-colors">
                <RedoIcon />
                <span>Try Again</span>
              </button>
          </div>
        </div>
      );
    }

    return (
      <div className="text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center h-full">
        <ImageIcon />
        <p className="mt-2 text-center">Your generated image will appear here</p>
      </div>
    );
  };
  
  return (
    <div className="w-full min-h-[400px] lg:min-h-[500px] lg:aspect-square relative flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
       <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100 flex-shrink-0">Result</h2>
      <div className="flex-grow relative">
        {renderContent()}
      </div>
    </div>
  );
};