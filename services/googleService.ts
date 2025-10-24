import { Creation, UserInfo, Preset } from '../types';

const USER_SESSION_KEY = 'tryify-mock-google-session';
const DRIVE_CREATIONS_KEY = 'tryify-mock-drive-creations';
const DRIVE_PRESETS_KEY = 'tryify-mock-drive-presets';

// --- Simulation Helpers ---

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getMockUser = (): UserInfo => ({
  id: '123456789',
  name: 'Demo User',
  email: 'demo.user@example.com',
  picture: 'avatar-1', // Use one of the predefined avatars
});


// --- Public API ---

export const signIn = async (): Promise<UserInfo | null> => {
  await delay(1000); // Simulate login process
  const user = getMockUser();
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  return user;
};

export const signOut = (): void => {
  localStorage.removeItem(USER_SESSION_KEY);
  // Note: For this simulation, we are not clearing the "Drive" data on logout,
  // so the user can log back in and find their creations.
};

export const checkSession = async (): Promise<UserInfo | null> => {
    await delay(200); // Simulate checking session
    const storedUser = localStorage.getItem(USER_SESSION_KEY);
    if (storedUser) {
        return JSON.parse(storedUser) as UserInfo;
    }
    return null;
};

export const updateUser = async (updatedInfo: UserInfo): Promise<UserInfo> => {
    await delay(300);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedInfo));
    return updatedInfo;
}

export const getCreations = async (): Promise<Creation[]> => {
    await delay(800);
    const data = localStorage.getItem(DRIVE_CREATIONS_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveCreations = async (creations: Creation[]): Promise<void> => {
    await delay(500);
    localStorage.setItem(DRIVE_CREATIONS_KEY, JSON.stringify(creations));
};

export const getPresets = async (): Promise<Preset[]> => {
    await delay(600);
    const data = localStorage.getItem(DRIVE_PRESETS_KEY);
    return data ? JSON.parse(data) : [];
};

export const savePresets = async (presets: Preset[]): Promise<void> => {
    await delay(400);
    localStorage.setItem(DRIVE_PRESETS_KEY, JSON.stringify(presets));
};
