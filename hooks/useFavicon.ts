import { useEffect } from 'react';

export const useFavicon = (color: string) => {
  useEffect(() => {
    const updateFavicon = (colorHex: string) => {
      // Create a simple circle SVG string
      // We use encodeURIComponent to ensure the # symbol in hex codes works in the data URI
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" fill="${encodeURIComponent(colorHex)}" />
        </svg>
      `.trim();

      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
      
      link.type = 'image/svg+xml';
      link.rel = 'icon';
      link.href = `data:image/svg+xml,${svg}`;

      // Append to head if it didn't exist
      if (!document.head.contains(link)) {
        document.head.appendChild(link);
      }
    };

    updateFavicon(color);

    // Optional: Cleanup not strictly necessary as the next component will overwrite it,
    // but good for rigorous state management.
  }, [color]);
};