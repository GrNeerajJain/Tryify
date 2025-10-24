import React, { useState, useEffect } from 'react';
import { DownloadIcon, ShareIcon, TrashIcon, XIcon } from './icons';
import { Spinner } from './Spinner';
import { Creation } from '../types';

interface CreationsViewProps {
  creations: Creation[];
  onShare: (imageSrc: string) => void;
  onClearAll: () => void;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const CreationsView: React.FC<CreationsViewProps> = ({ creations, onShare, onClearAll, isLoggedIn, isLoading }) => {
  const [creationToDownload, setCreationToDownload] = useState<Creation | null>(null);
  const [isConfirmingClear, setIsConfirmingClear] = useState<boolean>(false);
  const [isShareSupported, setIsShareSupported] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.share) {
      setIsShareSupported(true);
    }
  }, []);

  const handleDownload = (imageSrc: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCreationToDownload(null); // Close modal after download
  };

  const handleConfirmClear = () => {
    onClearAll();
    setIsConfirmingClear(false);
  };
  
  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Spinner />
                <p className="mt-4">Loading your creations...</p>
            </div>
        );
    }

    if (creations.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 mt-4">You haven't generated any images yet.</p>
                <p className="text-gray-500">Go to the 'Home' tab to start creating!</p>
            </div>
        );
    }

    return (
        <>
         {!isLoggedIn && creations.length > 0 && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-md shadow" role="alert">
                <p className="font-bold">Your creations are saved locally on this device.</p>
                <p>Go to the 'Profile' tab and sign in to sync your creations to your Google Drive.</p>
            </div>
        )}
        {isLoggedIn && creations.length > 0 && (
             <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 mb-6 rounded-md shadow" role="alert">
                <p className="font-bold">Your creations are safely stored in your Google Drive.</p>
                <p>They are accessible from any device where you are logged in.</p>
            </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {creations.map((creation) => (
            <div 
                key={creation.id} 
                className="group relative rounded-lg overflow-hidden shadow-lg border border-gray-200 cursor-zoom-in"
                onClick={() => setZoomedImage(creation.generatedImage)}
            >
                <img 
                src={creation.generatedImage} 
                alt={`Creation from ${new Date(creation.timestamp).toLocaleString()}`} 
                className="aspect-square w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div 
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4"
                onClick={(e) => e.stopPropagation()}
                >
                <button
                    onClick={() => setCreationToDownload(creation)}
                    className="flex items-center justify-center h-10 w-10 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
                    aria-label="Download image"
                >
                    <DownloadIcon />
                </button>
                {isShareSupported && (
                    <button
                        onClick={() => onShare(creation.generatedImage)}
                        className="flex items-center justify-center h-10 w-10 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
                        aria-label="Share image"
                    >
                    <ShareIcon />
                    </button>
                )}
                </div>
            </div>
            ))}
        </div>
      </>
    );
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">My Creations</h1>
            {creations.length > 0 && !isLoading && (
                 <button 
                    onClick={() => setIsConfirmingClear(true)}
                    className="flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-full transition-colors"
                >
                    <TrashIcon className="h-4 w-4" />
                    <span>Clear All</span>
                </button>
            )}
        </div>
        
        {renderContent()}

        {/* Zoom Modal */}
        {zoomedImage && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={() => setZoomedImage(null)}
                role="dialog"
                aria-modal="true"
                aria-label="Zoomed image view"
            >
                <div className="relative w-full h-full p-4 sm:p-8">
                    <img
                        src={zoomedImage}
                        alt="Zoomed creation"
                        className="w-full h-full object-contain animate-scale-in"
                    />
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setZoomedImage(null);
                    }}
                    className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                    aria-label="Close zoomed view"
                >
                    <XIcon />
                </button>
            </div>
        )}

      {/* Download Options Dialog */}
      {creationToDownload && (
        <div 
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setCreationToDownload(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4 text-left transform animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900">Download Options</h2>
             {creationToDownload.prompt && (
              <p className="text-xs text-gray-500 mt-2 mb-4 bg-gray-100 p-2 rounded-md font-mono">
                  <strong>Prompt:</strong> {creationToDownload.prompt}
              </p>
            )}
            <p className="text-gray-600 mb-6">Choose which image(s) to download.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleDownload(creationToDownload.generatedImage, `tryify-generated-${creationToDownload.id}.png`)}
                className="w-full px-6 py-2.5 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Download Generated Image
              </button>
              {creationToDownload.userImage && (
                <button
                  onClick={() => handleDownload(creationToDownload.userImage, `tryify-original-${creationToDownload.id}.png`)}
                  className="w-full px-6 py-2.5 rounded-full font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  Download Your Photo
                </button>
              )}
              {creationToDownload.outfitImage && (
                <button
                    onClick={() => handleDownload(creationToDownload.outfitImage!, `tryify-outfit-${creationToDownload.id}.png`)}
                    className="w-full px-6 py-2.5 rounded-full font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                    Download Outfit Photo
                </button>
              )}
              <button
                onClick={() => setCreationToDownload(null)}
                className="w-full mt-2 py-2 rounded-full font-semibold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Dialog */}
      {isConfirmingClear && (
        <div 
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsConfirmingClear(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4 text-center transform animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900">Clear All Creations?</h2>
            <p className="text-gray-600 mt-2 mb-6">This will permanently delete all your creations {isLoggedIn ? 'from your Google Drive' : 'from this device'}. This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsConfirmingClear(false)}
                className="px-6 py-2 rounded-full font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-6 py-2 rounded-full font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};