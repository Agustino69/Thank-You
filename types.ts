export interface EasterEgg {
  code: string;
  response: string;
}

export interface Person {
  id: string;
  accessKeys: string[]; // Changed from name to support multiple passwords
  displayName: string; // The name shown in the content (e.g., "Dear Alex")
  message: string; // Supports markdown-like paragraphs
  images: string[]; // Array of image URLs
  videoUrl?: string; // Optional YouTube or video link
  spotifyUrl?: string; // Optional Spotify track/playlist URL
  spotifyMessage?: string; // Context/Dedication for the song
  themeColor?: string; // Hex code for custom coloring
  
  // New features
  bgmUrl?: string; // Background music URL (mp3/direct link)
  bgmVolume?: number; // 0.0 to 1.0
  easterEggs?: EasterEgg[]; // Codes that trigger a text response but don't unlock
}

export type ViewState = 'LANDING' | 'CONTENT' | 'ADMIN';