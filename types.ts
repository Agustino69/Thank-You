export type EasterEggType = 'text' | 'countdown' | 'audio';

export interface EasterEgg {
  code: string;
  type?: EasterEggType; // Optional for backward compatibility (default: 'text')
  response: string; // Text message OR Event Title for countdowns OR Audio URL
  date?: string; // ISO string, required only for countdown type
}

export interface Person {
  id: string;
  accessKeys: string[]; 
  displayName: string; 
  message: string; 
  images: string[]; 
  videoUrls?: string[]; // Renamed from videoUrl to support multiple
  /** @deprecated use videoUrls instead */
  videoUrl?: string; 
  
  spotifyUrl?: string; 
  spotifyMessage?: string; 
  themeColor?: string; 
  
  bgmUrl?: string; 
  bgmVolume?: number; 
  easterEggs?: EasterEgg[]; 
}

export type ViewState = 'LANDING' | 'CONTENT' | 'ADMIN';