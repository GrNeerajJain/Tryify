import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, UploadIcon, ImageIcon, SettingsIcon, CheckCircleIcon } from './icons';

interface TutorialOverlayProps {
  onDismiss: () => void;
}

const tutorialSteps = [
  {
    icon: <UploadIcon className="h-10 w-10 text-indigo-500" />,
    title: "Step 1: Upload Your Photo",
    content: "Start by uploading a clear photo of a person. This will be the canvas for your new outfit!"
  },
  {
    icon: <ImageIcon className="h-10 w-10 text-indigo-500" />,
    title: "Step 2: Provide an Outfit",
    content: "You can either upload a reference image of an outfit OR describe the outfit you have in mind using the text box."
  },
  {
    icon: <SettingsIcon className="h-10 w-10 text-indigo-500" />,
    title: "Step 3: Choose Aspect Ratio",
    content: "Select the desired dimensions for your final image. Presets are available for portrait, landscape, and square formats."
  },
  {
    icon: <CheckCircleIcon className="h-10 w-10 text-indigo-500" />,
    title: "Step 4: Generate!",
    content: "Once you're ready, hit the 'Generate Outfit' button. Our AI will work its magic and create your new look."
  }
];

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onDismiss }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = tutorialSteps.length;
  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(prev => prev + 1);
    } else {
      onDismiss();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = tutorialSteps[currentStep];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 text-center transform animate-scale-in p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center">
          <div className="mb-4 bg-indigo-100 rounded-full p-3">
            {currentStepData.icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
          <p className="text-gray-600 mb-6">{currentStepData.content}</p>
        </div>

        {/* Navigation and Progress */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous step"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>

          <div className="flex gap-2">
            {tutorialSteps.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${index === currentStep ? 'bg-indigo-600' : 'bg-gray-300'}`}
              ></div>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Next step"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mt-6">
           <button
            onClick={onDismiss}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {isLastStep ? "Get Started!" : "Skip Tutorial"}
          </button>
        </div>
      </div>
    </div>
  );
};
