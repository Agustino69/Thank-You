export type EasterEggType = 'text' | 'countdown';

export interface EasterEgg {
  code: string;
  type?: EasterEggType; // Optional for backward compatibility (default: 'text')
  response: string; // Text message OR Event Title for countdowns
  date?: string; // ISO string, required only for countdown type
}

export interface Person {
  id: string;
  accessKeys: string[]; 
  displayName: string; 
  message: string; 
  images: string[]; 
  videoUrl?: string; 
  spotifyUrl?: string; 
  spotifyMessage?: string; 
  themeColor?: string; 
  
  bgmUrl?: string; 
  bgmVolume?: number; 
  easterEggs?: EasterEgg[]; 
}

export type ViewState = 'LANDING' | 'CONTENT' | 'ADMIN';