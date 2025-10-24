import React from 'react';

const Icon: React.FC<{ children: React.ReactNode; className?: string; viewBox?: string; }> = ({ children, className = 'h-6 w-6', viewBox = '0 0 24 24' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox={viewBox}
    stroke="currentColor"
    strokeWidth={1.5}
  >
    {children}
  </svg>
);

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className || "h-8 w-8"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </Icon>
);

export const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </Icon>
);

export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </Icon>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </Icon>
);

export const LandscapeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </Icon>
);

export const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className || "h-4 w-4"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </Icon>
);

export const PortraitIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || 'h-6 w-6'} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
  </svg>
);

export const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className || "h-12 w-12"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </Icon>
);

export const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </Icon>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </Icon>
);

export const RedoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 12A8 8 0 1013 5.372" />
  </Icon>
);

export const CircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </Icon>
);

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </Icon>
);

export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </Icon>
);

export const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </Icon>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </Icon>
);

export const QuestionMarkCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </Icon>
);

export const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || 'h-5 w-5'} viewBox="0 0 48 48">
      <path fill="#4285F4" d="M24 9.5c3.9 0 6.9 1.6 8.9 3.4l6.6-6.6C35.5 2.5 30.5 0 24 0 14.5 0 6.5 5.5 2.7 13.5l7.9 6.2C12.2 13.5 17.6 9.5 24 9.5z"></path>
      <path fill="#34A853" d="M46.2 25.4c0-1.7-.2-3.4-.4-5H24v9.3h12.5c-.5 3-2.1 5.6-4.6 7.3l7.6 5.9c4.4-4.1 7.1-10.1 7.1-17.5z"></path>
      <path fill="#FBBC05" d="M10.6 20.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7L2.7 5.1C1 8.2 0 11.9 0 16s1 7.8 2.7 10.9l7.9-6.2z"></path>
      <path fill="#EA4335" d="M24 48c6.5 0 11.9-2.1 15.8-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.2 2.3-6.4 0-11.8-4-13.7-9.5l-7.9 6.2C6.5 42.5 14.5 48 24 48z"></path>
      <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </Icon>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </Icon>
);

export const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </Icon>
);

export const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </Icon>
);

export const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </Icon>
);

export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </Icon>
);

export const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </Icon>
);

export const BookmarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </Icon>
);

export const CloudIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </Icon>
);

export const ChatBotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.17 48.17 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </Icon>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </Icon>
);

export const BuildingStorefrontIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V3m0 0l-3.08 3.08M12 3l3.08 3.08M12 21a2 2 0 01-2-2h4a2 2 0 01-2 2zM4 11h16M4 11a2 2 0 01-2-2V7a2 2 0 012-2h16a2 2 0 012 2v2a2 2 0 01-2 2M4 11v10M20 11v10" />
    </Icon>
);

export const TreeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a4 4 0 100-8 4 4 0 000 8z" />
    </Icon>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M19 3v4M17 5h4M12 11a1 1 0 100-2 1 1 0 000 2zM12 19a1 1 0 100-2 1 1 0 000 2zM5 19v-4M3 17h4M19 19v-4M17 17h4" />
    </Icon>
);


// SVGs for custom avatars
export const AvatarIcon1: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="#F2C94C"/>
        <path d="M60 60C60 51.1634 51.0457 44 40 44C28.9543 44 20 51.1634 20 60" fill="#E0A82E"/>
        <path d="M48 34C48 38.4183 44.4183 42 40 42C35.5817 42 32 38.4183 32 34C32 29.5817 35.5817 26 40 26C44.4183 26 48 29.5817 48 34Z" fill="#E0A82E"/>
    </svg>
);

export const AvatarIcon2: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="#6FCF97"/>
        <path d="M52 56C52 49.3726 46.6274 44 40 44C33.3726 44 28 49.3726 28 56" stroke="white" strokeWidth="4"/>
        <circle cx="34" cy="36" r="3" fill="white"/>
        <circle cx="46" cy="36" r="3" fill="white"/>
    </svg>
);

export const AvatarIcon3: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="#EB5757"/>
        <rect x="28" y="32" width="24" height="4" rx="2" fill="white"/>
        <rect x="28" y="44" width="24" height="4" rx="2" fill="white"/>
        <rect x="38" y="28" width="4" height="24" rx="2" fill="white"/>
    </svg>
);

export const AvatarIcon4: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="#56CCF2"/>
        <path d="M28 48L40 36L52 48" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <path d="M28 38L40 26L52 38" stroke="white" strokeWidth="4" strokeLinecap="round"/>
    </svg>
);