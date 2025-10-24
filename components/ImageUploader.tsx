import React, { useState, useRef, useCallback, useEffect } from 'react';
import { UploadIcon, XIcon, CameraIcon, CheckCircleIcon } from './icons';

interface ImageUploaderProps {
  value: File | null;
  onChange: (file: File | null) => void;
  label: string;
  id: string;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, label, id, disabled = false }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // UI Feedback State
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Effect to update preview when the value prop changes
  useEffect(() => {
    let objectUrl: string | null = null;
    if (value) {
      objectUrl = URL.createObjectURL(value);
      setImagePreview(objectUrl);
      
      // Trigger success feedback if it's a new value
      if (imagePreview !== objectUrl) {
          triggerSuccessFeedback();
      }
    } else {
      setImagePreview(null);
    }
    
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  
  const triggerSuccessFeedback = () => {
      setUploadSuccess(true);
      setTimeout(() => {
          setUploadSuccess(false);
      }, 1500);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };
  
  const handleClearImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }, [onChange]);

  const handleContainerClick = () => {
    if (disabled || imagePreview) return;
    fileInputRef.current?.click();
  };

  // Camera Handlers
  const handleOpenCamera = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check your browser permissions.");
    }
  }, [disabled]);

  const handleCloseCamera = useCallback(() => {
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
    setIsCameraOpen(false);
  }, [stream]);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onChange(capturedFile);
          }
        }, 'image/jpeg');
      }
      handleCloseCamera();
    }
  }, [handleCloseCamera, onChange]);

  return (
    <>
      <div
        onClick={handleContainerClick}
        className={`w-full aspect-square bg-gray-50 dark:bg-gray-800 border-2 border-dashed rounded-xl flex items-center justify-center text-center transition-all duration-300 relative group overflow-hidden ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700/50'} ${imagePreview ? '' : 'p-4'} ${uploadSuccess ? 'border-indigo-500 dark:border-indigo-400' : 'border-gray-300 dark:border-gray-600'}`}
      >
        <input
          type="file"
          id={id}
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          disabled={disabled}
        />
        {imagePreview ? (
          <>
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
             {uploadSuccess && (
              <div className="absolute inset-0 bg-white/70 dark:bg-black/50 flex items-center justify-center animate-fade-in pointer-events-none">
                <CheckCircleIcon className="h-16 w-16 text-indigo-600 dark:text-indigo-400 animate-scale-in" />
              </div>
            )}
            {!disabled && (
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                  <button
                  onClick={handleClearImage}
                  className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5 text-white hover:bg-red-500 transition-colors"
                  aria-label="Remove image"
                  >
                  <XIcon />
                  </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
            <div className="cursor-pointer">
                <UploadIcon />
                <span className="mt-2 font-semibold block">{label}</span>
                <span className="text-xs">Click to upload</span>
            </div>
             <div className="flex items-center space-x-2 my-2">
                <hr className="w-12 border-gray-300 dark:border-gray-600" />
                <span className="text-gray-400 dark:text-gray-500 text-xs font-semibold">OR</span>
                <hr className="w-12 border-gray-300 dark:border-gray-600" />
            </div>
             <button
                onClick={handleOpenCamera}
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-1.5 px-4 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors z-10"
              >
                <CameraIcon className="h-5 w-5" />
                <span>Use Camera</span>
              </button>
          </div>
        )}
      </div>

      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center animate-fade-in">
          <video ref={videoRef} autoPlay playsInline className="w-full max-w-full h-auto max-h-full object-contain"></video>
          <canvas ref={canvasRef} className="hidden"></canvas>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center items-center">
             <button 
                onClick={handleCapture} 
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center ring-4 ring-white/30 hover:ring-white/50 transition-transform active:scale-95"
                aria-label="Capture photo"
             >
                <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-800"></div>
             </button>
          </div>
          
          <button 
              onClick={handleCloseCamera} 
              className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
              aria-label="Close camera"
          >
              <XIcon />
          </button>
        </div>
      )}
    </>
  );
};