

import React, { useState, useEffect } from 'react';
import { UserInfo } from '../types';
import { GoogleIcon, InfoIcon, EditIcon, AvatarIcon1, AvatarIcon2, AvatarIcon3, AvatarIcon4, CloudIcon, CheckCircleIcon } from './icons';
import { Spinner } from './Spinner';

interface ProfileViewProps {
  userInfo: UserInfo | null;
  onLogin: () => Promise<void>;
  onLogout: () => void;
  onUpdateProfile: (updatedInfo: { name?: string, picture?: string }) => void;
}

const MenuItem: React.FC<{ children: React.ReactNode; isDestructive?: boolean; onClick?: () => void }> = ({ children, isDestructive = false, onClick }) => (
  <button onClick={onClick} className={`w-full text-left p-4 border-b border-gray-200 dark:border-gray-700 transition-colors ${isDestructive ? 'text-red-500 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
    {children}
  </button>
);

const AVATAR_COMPONENTS: { [key: string]: React.FC<{className?: string}> } = {
  'avatar-1': AvatarIcon1,
  'avatar-2': AvatarIcon2,
  'avatar-3': AvatarIcon3,
  'avatar-4': AvatarIcon4,
};

const UserAvatar: React.FC<{ picture: string; className?: string }> = ({ picture, className }) => {
    const AvatarComponent = AVATAR_COMPONENTS[picture];
    if (AvatarComponent) {
        return <AvatarComponent className={className} />;
    }
    return <img src={picture} alt="User avatar" className={className} />;
};


export const ProfileView: React.FC<ProfileViewProps> = ({ userInfo, onLogin, onLogout, onUpdateProfile }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<'Delete account' | 'Log out' | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  
  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPicture, setEditedPicture] = useState('');
  
  useEffect(() => {
    if (userInfo) {
      setEditedName(userInfo.name);
      setEditedPicture(userInfo.picture);
    }
  }, [userInfo]);


  const handleLoginClick = async () => {
    setIsLoggingIn(true);
    await onLogin();
    setIsLoggingIn(false);
  };
  
  const handleActionClick = (action: 'Delete account' | 'Log out') => {
    setActionToConfirm(action);
  };

  const handleConfirm = () => {
    if (actionToConfirm === 'Log out') {
      onLogout();
    } else if (actionToConfirm === 'Delete account') {
      alert(`Account deletion process initiated. This will remove all data from your Google Drive. You will be logged out.`);
      onLogout(); 
    }
    setActionToConfirm(null);
    setDeleteConfirmationText('');
  };
  
  const handleCancel = () => {
    setActionToConfirm(null);
    setDeleteConfirmationText('');
  };

  const handleEditProfile = () => {
    if (userInfo) {
        setEditedName(userInfo.name);
        setEditedPicture(userInfo.picture);
        setIsEditing(true);
    }
  };
  
  const handleSaveProfile = () => {
    onUpdateProfile({ name: editedName, picture: editedPicture });
    setIsEditing(false);
  };

  const renderConfirmationDialog = () => {
    if (!actionToConfirm) return null;

    if (actionToConfirm === 'Log out') {
      return (
        <div 
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={handleCancel}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm m-4 text-center transform animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Confirm Log Out</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button onClick={handleCancel} className="px-6 py-2 rounded-full font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors">Cancel</button>
              <button onClick={handleConfirm} className="px-6 py-2 rounded-full font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">Log Out</button>
            </div>
          </div>
        </div>
      );
    }
    
    if (actionToConfirm === 'Delete account') {
      const isDeleteDisabled = deleteConfirmationText.toLowerCase() !== 'delete';
      return (
        <div 
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={handleCancel}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4 text-left transform animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Delete Your Account?</h2>
            
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 text-red-800 dark:text-red-200 p-3 flex items-start gap-3 rounded-md mb-4">
              <InfoIcon className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm">All your generations and data will be permanently deleted from your Google Drive.</p>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              The process usually takes 48 hours, during which you cannot re-register with the same email. 
              Please type "<strong className="text-gray-800 dark:text-gray-100 font-semibold">delete</strong>" below to confirm.
            </p>

            <input
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder='Type "delete" here'
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              autoComplete="off"
            />

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleCancel}
                className="px-6 py-2 rounded-full font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isDeleteDisabled}
                className="px-6 py-2 rounded-full font-semibold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderEditProfileModal = () => {
    if (!isEditing || !userInfo) return null;

    return (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsEditing(false)}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4 text-left transform animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Edit Profile</h2>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                        <input
                            type="text"
                            id="displayName"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Choose Avatar</label>
                        <div className="grid grid-cols-4 gap-4">
                            {Object.keys(AVATAR_COMPONENTS).map(key => {
                                const Avatar = AVATAR_COMPONENTS[key];
                                const isSelected = editedPicture === key;
                                return (
                                    <button 
                                        key={key} 
                                        onClick={() => setEditedPicture(key)}
                                        className={`p-1 rounded-full transition-all duration-200 ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800' : 'hover:ring-2 ring-gray-300 dark:hover:ring-gray-500'}`}
                                    >
                                        <Avatar className="w-16 h-16" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-full font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                    <button onClick={handleSaveProfile} className="px-6 py-2 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">Save Changes</button>
                </div>
            </div>
        </div>
    );
  };


  const LoggedOutView = () => (
    <div className="max-w-md mx-auto text-center p-4 sm:p-6">
        <div className="mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full h-20 w-20 flex items-center justify-center">
            <CloudIcon className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Sign in to Tryify</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Save your creations and access them from anywhere.</p>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-8 text-left">
            <ul className="space-y-4">
                <li className="flex items-start gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Sync to Google Drive</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save your creations and presets to a private folder in your Google Drive.</p>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Access Anywhere</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Sign in on any device to view and use your saved creations and presets.</p>
                    </div>
                </li>
                 <li className="flex items-start gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Private & Secure</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your data is stored securely in your own Google account, managed by you.</p>
                    </div>
                </li>
            </ul>
        </div>

        <button
            onClick={handleLoginClick}
            disabled={isLoggingIn}
            className="w-full max-w-xs mx-auto flex items-center justify-center gap-3 py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-wait"
        >
            {isLoggingIn ? (
                <>
                    <Spinner className="h-5 w-5" />
                    <span>Signing in...</span>
                </>
            ) : (
                <>
                    <GoogleIcon />
                    <span>Sign in with Google</span>
                </>
            )}
        </button>
    </div>
  );

  const LoggedInView = () => (
    userInfo && (
      <div>
        <div className="flex flex-col items-center mb-8">
          <UserAvatar picture={userInfo.picture} className="w-24 h-24 rounded-full mb-4 border-4 border-white dark:border-gray-700 shadow-lg" />
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{userInfo.name}</h1>
            <button onClick={handleEditProfile} className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
              <EditIcon className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-500 dark:text-gray-400">{userInfo.email}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <MenuItem onClick={() => handleActionClick('Delete account')} isDestructive>
            Delete account
          </MenuItem>
          <MenuItem onClick={() => handleActionClick('Log out')} isDestructive>
            Log out
          </MenuItem>
        </div>
      </div>
    )
  );

  return (
    <div className="max-w-md mx-auto">
      {userInfo ? <LoggedInView /> : <LoggedOutView />}
      {renderConfirmationDialog()}
      {renderEditProfileModal()}
    </div>
  );
};