export type AspectRatio =
  | '1:1'
  | '9:16'
  | '10:16'
  | '2:3'
  | '3:4'
  | '4:5'
  | '5:4'
  | '4:3'
  | '3:2'
  | '16:10'
  | '16:9';

export type View = 'home' | 'creations' | 'help' | 'profile';

export type Theme = 'light' | 'dark';

export interface Creation {
  id: string;
  timestamp: number;
  prompt?: string;
  userImage?: string; // base64 data URL
  outfitImage?: string; // base64 data URL
  generatedImage: string; // base64 data URL
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export type PresetType = 'image' | 'description';

export interface Preset {
  id: string;
  type: PresetType;
  value: string; // base64 data URL for image, text for description
  name?: string; // e.g., "Casual Friday Look"
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}