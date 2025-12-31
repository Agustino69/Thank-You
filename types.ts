export interface Person {
  id: string;
  accessKeys: string[]; // Changed from name to support multiple passwords
  displayName: string; // The name shown in the content (e.g., "Dear Alex")
  message: string; // Supports markdown-like paragraphs
  images: string[]; // Array of image URLs
  videoUrl?: string; // Optional YouTube or video link
  themeColor?: string; // Hex code for custom coloring
}

export type ViewState = 'LANDING' | 'CONTENT' | 'ADMIN';