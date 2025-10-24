import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { BottomNavBar } from './components/BottomNavBar';
import { CreationsView } from './components/CreationsView';
import { ProfileView } from './components/ProfileView';
import { HelpView } from './components/HelpView';
import { TutorialOverlay } from './components/TutorialOverlay';
import { Chatbot } from './components/Chatbot';
import { generateOutfit } from './services/geminiService';
import * as googleService from './services/googleService';
import { AspectRatio, View, Creation, UserInfo, Theme, Preset } from './types';
import { Spinner } from './components/Spinner';
import { ImageIcon, PencilIcon, SettingsIcon, BookmarkIcon, XIcon, ChatBotIcon, UserIcon } from './components/icons';

const App: React.FC = () => {
  // Form State
  const [userImage, setUserImage] = useState<File | null>(null);
  const [outfitImage, setOutfitImage] = useState<File | null>(null);
  const [outfitDescription, setOutfitDescription] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [fineDetails, setFineDetails] = useState<string>('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [outfitInputMode, setOutfitInputMode] = useState<'upload' | 'describe'>('upload');

  // App State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const originalUserImageRef = useRef<string | null>(null);

  // Data & Navigation State
  const [creations, setCreations] = useState<Creation[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoadingCreations, setIsLoadingCreations] = useState(true);
  const [isLoadingPresets, setIsLoadingPresets] = useState(true);
  const [activeView, setActiveView] = useState<View>('home');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // UI State
  const [theme, setTheme] = useState<Theme>('light');
  const [showTutorial, setShowTutorial] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Load initial data on mount
  useEffect(() => {
    // Theme
    const storedTheme = localStorage.getItem('tryify-theme') as Theme;
    if (storedTheme) setTheme(storedTheme);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');

    // Tutorial
    const hasSeenTutorial = localStorage.getItem('tryify-tutorial-seen');
    if (!hasSeenTutorial) setShowTutorial(true);

    // User Session
    const checkUserSession = async () => {
        try {
            const user = await googleService.checkSession();
            if (user) {
                setUserInfo(user);
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
                setUserInfo(null);
            }
        } catch (e) {
            console.error("Failed to check user session:", e);
            setError("Could not check your session. Please try refreshing.");
        }
    };
    
    checkUserSession();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('tryify-theme', theme);
  }, [theme]);
  
  const loadCreations = useCallback(async () => {
    setIsLoadingCreations(true);
    try {
      if (isLoggedIn) {
        const driveCreations = await googleService.getCreations();
        setCreations(driveCreations);
      } else {
        const localCreations = localStorage.getItem('tryify-creations');
        setCreations(localCreations ? JSON.parse(localCreations) : []);
      }
    } catch (err) {
      console.error("Failed to load creations:", err);
      setError("Could not load your creations. Please try refreshing.");
    } finally {
      setIsLoadingCreations(false);
    }
  }, [isLoggedIn]);

  const saveCreations = useCallback(async (newCreations: Creation[]) => {
    setCreations(newCreations);
    if (isLoggedIn) {
      googleService.saveCreations(newCreations);
    } else {
      localStorage.setItem('tryify-creations', JSON.stringify(newCreations));
    }
  }, [isLoggedIn]);

  const loadPresets = useCallback(async () => {
    setIsLoadingPresets(true);
    try {
      if (isLoggedIn) {
        const drivePresets = await googleService.getPresets();
        setPresets(drivePresets);
      } else {
        const localPresets = localStorage.getItem('tryify-presets');
        setPresets(localPresets ? JSON.parse(localPresets) : []);
      }
    } catch (err) {
      console.error("Failed to load presets:", err);
      setError("Could not load your presets.");
    } finally {
      setIsLoadingPresets(false);
    }
  }, [isLoggedIn]);

  const savePresets = useCallback(async (newPresets: Preset[]) => {
      setPresets(newPresets);
      if (isLoggedIn) {
        await googleService.savePresets(newPresets);
      } else {
        localStorage.setItem('tryify-presets', JSON.stringify(newPresets));
      }
  }, [isLoggedIn]);

  // Load creations and presets whenever login status changes
  useEffect(() => {
    loadCreations();
    loadPresets();
  }, [isLoggedIn, loadCreations, loadPresets]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    originalUserImageRef.current = null;

    if (!userImage) {
      setError('Please upload an image of a person.');
      setIsLoading(false);
      return;
    }
    if (!outfitImage && !outfitDescription) {
      setError('Please provide an outfit image or a description.');
      setIsLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(userImage);
    reader.onloadend = async () => {
        originalUserImageRef.current = reader.result as string;
        try {
            const resultImageUrl = await generateOutfit(userImage, outfitImage, outfitDescription, aspectRatio, negativePrompt, fineDetails);
            setGeneratedImage(resultImageUrl);

            const newCreation: Creation = {
              id: Date.now().toString(),
              timestamp: Date.now(),
              userImage: originalUserImageRef.current!,
              generatedImage: resultImageUrl,
              ...(outfitImage && { outfitImage: await fileToDataUrl(outfitImage) }),
              prompt: outfitDescription,
            };
            saveCreations([newCreation, ...creations]);
        } catch (err: any) {
            console.error(err);
            setError(`An error occurred: ${err.message || 'Please try again.'}`);
        } finally {
            setIsLoading(false);
        }
    };
  };
  
  const handleTryAgain = () => {
    setGeneratedImage(null);
    originalUserImageRef.current = null;
  }

  const fileToDataUrl = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
      });
  };

  const handleShare = async (imageSrc: string) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], 'tryify-creation.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Tryify Creation',
          text: 'Check out this image I created with Tryify!',
          files: [file],
        });
      } else {
        alert("Sharing is not supported on your browser, or you've disabled it.");
      }
    } catch (err) {
      console.error('Error sharing:', err);
      alert('Could not share the image.');
    }
  };

  const handleDownload = (imageSrc: string) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `tryify-creation-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogin = async () => {
    try {
      const user = await googleService.signIn();
      if (user) {
        setUserInfo(user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Google Sign-In failed. Please try again.");
    }
  };
  
  const handleLogout = useCallback(() => {
    googleService.signOut();
    setUserInfo(null);
    setIsLoggedIn(false);
  }, []);

  const handleClearAllCreations = () => {
    saveCreations([]);
  };

  const dismissTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('tryify-tutorial-seen', 'true');
  };

  const handleOutfitModeChange = (mode: 'upload' | 'describe') => {
    setOutfitInputMode(mode);
    if (mode === 'upload') {
      setOutfitDescription('');
    } else {
      setOutfitImage(null);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setOutfitDescription(prev => prev ? `${prev.trim()}, ${suggestion.toLowerCase()}` : suggestion);
  };
  
  const handleUpdateProfile = async (updatedFields: { name?: string, picture?: string }) => {
    if (!userInfo) return;
    const updatedInfo = { ...userInfo, ...updatedFields };
    setUserInfo(updatedInfo); // Optimistic update
    try {
      await googleService.updateUser(updatedInfo);
    } catch (e) {
      console.error("Failed to update profile", e);
      setUserInfo(userInfo); // Revert on error
      setError("Failed to save profile changes.");
    }
  };

  const handleSavePreset = async () => {
    let newPreset: Preset | null = null;

    if (outfitInputMode === 'upload' && outfitImage) {
        const dataUrl = await fileToDataUrl(outfitImage);
        newPreset = {
            id: Date.now().toString(),
            type: 'image',
            value: dataUrl,
            name: `Image Preset ${presets.length + 1}`
        };
    } else if (outfitInputMode === 'describe' && outfitDescription.trim()) {
        newPreset = {
            id: Date.now().toString(),
            type: 'description',
            value: outfitDescription.trim(),
            name: `Desc. Preset ${presets.length + 1}`
        };
    }

    if (newPreset) {
        savePresets([newPreset, ...presets]);
    } else {
        alert("No outfit provided to save as a preset.");
    }
  };

  const handleSelectPreset = async (preset: Preset) => {
      if (preset.type === 'image') {
          handleOutfitModeChange('upload');
          const response = await fetch(preset.value);
          const blob = await response.blob();
          const file = new File([blob], "preset.png", { type: blob.type });
          setOutfitImage(file);
      } else {
          handleOutfitModeChange('describe');
          setOutfitDescription(preset.value);
      }
  };

  const handleDeletePreset = (presetId: string) => {
      const updatedPresets = presets.filter(p => p.id !== presetId);
      savePresets(updatedPresets);
  };
  
  const isGenerateDisabled = () => {
      if (isLoading) return true;
      return !userImage || (!outfitImage && !outfitDescription.trim());
  }

  const suggestions = [
    "A formal black tuxedo",
    "Casual summer dress with floral patterns",
    "Vintage leather jacket and blue jeans",
    "Cozy knitted sweater",
    "A red silk evening gown",
    "Denim overalls with a striped shirt"
  ];
  
  const renderHomeView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Side: Inputs */}
        <div className="flex flex-col gap-6">

          <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">1. Upload Photo</h3>
                <ImageUploader label="Upload Person" id="user-image" value={userImage} onChange={setUserImage} />
              </div>
              
              <div>
                 <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">2. Provide Outfit</h3>
                 <div className="flex items-center p-1 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
                    <button onClick={() => handleOutfitModeChange('upload')} className={`w-1/2 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${outfitInputMode === 'upload' ? 'bg-white dark:bg-gray-900 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-600/50'}`}><ImageIcon className="h-5 w-5"/><span>Upload</span></button>
                    <button onClick={() => handleOutfitModeChange('describe')} className={`w-1/2 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${outfitInputMode === 'describe' ? 'bg-white dark:bg-gray-900 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-600/50'}`}><PencilIcon className="h-5 w-5"/><span>Describe</span></button>
                 </div>
                 
                 {outfitInputMode === 'upload' ? (<ImageUploader label="Upload Outfit" id="outfit-image" value={outfitImage} onChange={setOutfitImage} />) : (
                    <div className="animate-fade-in">
                        <textarea id="description" rows={4} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-200" placeholder="e.g., A vintage leather jacket..." value={outfitDescription} onChange={(e) => setOutfitDescription(e.target.value)} />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-3">For better results, try these suggestions:</p>
                        <div className="flex flex-wrap gap-2">{suggestions.map((suggestion) => (<button key={suggestion} onClick={() => handleSuggestionClick(suggestion)} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-400 font-semibold py-1 px-2 rounded-full transition-colors">{suggestion}</button>))}</div>
                    </div>
                 )}
                 <button onClick={handleSavePreset} disabled={!outfitImage && !outfitDescription.trim()} className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><BookmarkIcon className="h-5 w-5" /><span>Save as Preset</span></button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Your Presets</h3>
              {isLoadingPresets ? (<div className="flex justify-center items-center h-24"><Spinner /></div>) : presets.length === 0 ? (<p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">You have no saved presets.</p>) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">{presets.map(preset => (<div key={preset.id} className="relative group"><div onClick={() => handleSelectPreset(preset)} className="aspect-square bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-offset-2 dark:ring-offset-gray-900 hover:ring-indigo-500 transition-all">{preset.type === 'image' ? (<img src={preset.value} alt="Outfit preset" className="w-full h-full object-cover" />) : (<p className="p-2 text-xs text-gray-600 dark:text-gray-300 break-words line-clamp-4">{preset.value}</p>)}</div><button onClick={() => handleDeletePreset(preset.id)} className="absolute top-1 right-1 h-6 w-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all" aria-label="Delete preset"><XIcon className="h-4 w-4" /></button></div>))}</div>
              )}
            </div>
          </div>
          
          <div>
            <button onClick={() => setIsAdvancedOpen(!isAdvancedOpen)} className="w-full flex justify-between items-center font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-800 dark:hover:text-indigo-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"><div className='flex items-center gap-2'><SettingsIcon className="h-5 w-5" /><span>Advanced Settings</span></div><span className={`transform transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`}>▼</span></button>
            {isAdvancedOpen && (
              <div className="mt-4 space-y-4 animate-fade-in bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border dark:border-gray-700">
                 <div><label htmlFor="fineDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fine Details</label><input type="text" id="fineDetails" className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm text-gray-900 dark:text-gray-200" placeholder="e.g., add gold buttons, intricate embroidery" value={fineDetails} onChange={(e) => setFineDetails(e.target.value)} /></div>
                  <div><label htmlFor="negativePrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Negative Prompt (Things to avoid)</label><input type="text" id="negativePrompt" className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm text-gray-900 dark:text-gray-200" placeholder="e.g., no hats, blurry background" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} /></div>
              </div>
            )}
          </div>

          <div>
             <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">3. Select Aspect Ratio</h3>
             <AspectRatioSelector selected={aspectRatio} onSelect={setAspectRatio} />
          </div>

          <button onClick={handleGenerate} disabled={isGenerateDisabled()} className="w-full bg-indigo-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2">{isLoading ? <><Spinner className="h-5 w-5" /> Generating...</> : 'Generate Outfit'}</button>
          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        </div>

        <ResultDisplay isLoading={isLoading} generatedImage={generatedImage} originalImage={originalUserImageRef.current || undefined} onShare={handleShare} onDownload={handleDownload} onTryAgain={handleTryAgain} />
      </div>
  );

  const renderView = () => {
    switch(activeView) {
      case 'creations':
        return <CreationsView creations={creations} onShare={handleShare} onClearAll={handleClearAllCreations} isLoggedIn={isLoggedIn} isLoading={isLoadingCreations} />;
      case 'profile':
        return <ProfileView userInfo={userInfo} onLogin={handleLogin} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} />;
      case 'help':
        return <HelpView />;
      case 'home':
      default:
        return renderHomeView();
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans`}>
      {showTutorial && <TutorialOverlay onDismiss={dismissTutorial} />}
      <Header />
      <main className="container mx-auto px-4 py-8 pb-24">
        {renderView()}
      </main>
      <BottomNavBar activeView={activeView} setActiveView={setActiveView} />
      
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-20 right-4 h-14 w-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center z-20"
        aria-label="Open AI Assistant"
      >
        <ChatBotIcon className="h-7 w-7" />
      </button>

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

export default App;
