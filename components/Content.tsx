import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Person } from '../types';
import { Play, Music, ChevronDown, Image as ImageIcon, ExternalLink, Folder } from 'lucide-react';
import { useFavicon } from '../hooks/useFavicon';

interface ContentProps {
  person: Person;
  onExit: () => void;
}

// Helper to convert hex to rgb for background tinting
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
        : '74, 70, 62'; // Fallback
};

// Helper to detect Google Photos links
const isGooglePhotosLink = (url: string) => {
  return url.includes('photos.app.goo.gl') || url.includes('photos.google.com');
};

// Helper to detect Google Drive links
const isGoogleDriveLink = (url: string) => {
  return url.includes('drive.google.com');
};

const Content: React.FC<ContentProps> = ({ person, onExit }) => {
  // Theme Color
  const themeColor = person.themeColor || '#4A463E';
  
  // Set the favicon to match the theme color
  useFavicon(themeColor);

  // Create RGB string for transparent backgrounds
  const themeRgb = useMemo(() => hexToRgb(themeColor), [themeColor]);

  // Refs for sections
  const introRef = useRef<HTMLElement>(null);
  const messageRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [isPlayerOpen, setIsPlayerOpen] = useState(false); // Initially closed
  const [shouldShake, setShouldShake] = useState(false); // State for attention grabbing

  // Define available sections dynamically
  const sections = [
    { id: 'intro', label: 'Inicio', ref: introRef, exists: true },
    { id: 'message', label: 'Mensaje', ref: messageRef, exists: true },
    { id: 'gallery', label: 'Recuerdos', ref: galleryRef, exists: person.images && person.images.length > 0 },
    { id: 'video', label: 'Video', ref: videoRef, exists: !!person.videoUrl },
  ].filter(s => s.exists);

  const lastSectionId = sections[sections.length - 1]?.id;

  // Background Music Logic
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !person.bgmUrl) return;

    audio.volume = person.bgmVolume ?? 0.3;

    const playAudio = async () => {
      try {
        await audio.play();
      } catch (e) {
        console.log("Autoplay blocked by browser policy until interaction", e);
      }
    };

    // If Spotify is open OR we are in video section, pause BGM
    if (isPlayerOpen || activeSection === 'video') {
       // Fade out effect could go here, but pause is immediate for now
       audio.pause();
    } else {
       playAudio();
    }

    return () => {
        audio.pause();
    };
  }, [isPlayerOpen, activeSection, person.bgmUrl, person.bgmVolume]);


  // Intersection Observers setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            
            // Trigger shake if we reached the last section and player hasn't been opened
            if (entry.target.id === lastSectionId && !isPlayerOpen) {
              setShouldShake(true);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });

    return () => observer.disconnect();
  }, [sections, lastSectionId, isPlayerOpen]);


  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isYoutube = person.videoUrl?.includes('youtube.com') || person.videoUrl?.includes('youtu.be');
  const isGooglePhotosVideo = person.videoUrl ? isGooglePhotosLink(person.videoUrl) : false;
  const isGoogleDriveVideo = person.videoUrl ? isGoogleDriveLink(person.videoUrl) : false;

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Helper to convert regular Spotify links to Embed links
  const getSpotifyEmbedUrl = (url: string) => {
    try {
      if (url.includes('embed')) return url;
      // Handle "https://open.spotify.com/track/ID?si=..."
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean); // ['track', 'ID']
      if (pathParts.length >= 2) {
        const type = pathParts[0];
        const id = pathParts[1];
        return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.2, ease: "easeOut" } }, // Slow, luxurious fade in
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const handleOpenPlayer = () => {
    setIsPlayerOpen(true);
    setShouldShake(false); // Stop shaking once opened
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-screen bg-warm-100 text-warm-900 selection:text-white relative overflow-hidden"
      style={{
          // Dynamic background tinting based on theme color
          backgroundColor: '#F9F7F0',
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(${themeRgb}, 0.15), transparent 70%),
            linear-gradient(to bottom, rgba(${themeRgb}, 0.05), transparent)
          `
      }}
    >
        <style>{`
            ::selection {
                background-color: ${themeColor};
                color: #ffffff;
            }
        `}</style>

      {/* Hidden Audio Player for BGM */}
      {person.bgmUrl && (
          <audio ref={audioRef} src={person.bgmUrl} loop />
      )}

      {/* Scrollable Container */}
      <main className="h-full overflow-y-auto scroll-smooth snap-y snap-mandatory no-scrollbar pb-24 md:pb-0">
        
        {/* SECTION 1: INTRO */}
        <section 
          id="intro" 
          ref={introRef} 
          className="min-h-screen w-full flex flex-col items-center justify-center p-8 snap-start relative"
        >
          <button 
             onClick={onExit} 
             className="absolute top-8 left-8 text-xs uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity z-50"
             style={{ color: themeColor }}
          >
            Salir
          </button>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <p className="text-sm font-serif italic mb-4 opacity-60">Para</p>
            <h1 
              className="text-5xl md:text-7xl font-serif italic leading-tight"
              style={{ color: themeColor }}
            >
              {person.displayName}
            </h1>
            <div className="w-16 h-[1px] mx-auto mt-8 opacity-40" style={{ backgroundColor: themeColor }}></div>
          </motion.div>
        </section>

        {/* SECTION 2: MESSAGE */}
        <section 
          id="message" 
          ref={messageRef} 
          className="min-h-screen w-full flex items-center justify-center p-6 md:p-20 snap-start"
        >
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl prose prose-stone prose-lg md:prose-xl font-serif leading-relaxed opacity-90 whitespace-pre-wrap text-center md:text-left relative z-10 p-8 rounded-xl"
            style={{ 
                color: themeColor,
                backgroundColor: `rgba(${themeRgb}, 0.03)` // Very subtle box background
            }} 
           >
             <span className="block text-inherit filter opacity-80">
              {person.message}
             </span>
           </motion.div>
        </section>

        {/* SECTION 3: GALLERY */}
        {person.images && person.images.length > 0 && (
          <section 
            id="gallery" 
            ref={galleryRef} 
            className="min-h-screen w-full flex items-center justify-center p-6 md:p-20 snap-start"
          >
             <div className="w-full max-w-6xl">
                <h2 
                  className="text-2xl font-serif italic mb-10 text-center opacity-70"
                  style={{ color: themeColor }}
                >
                  Recuerdos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {person.images.map((img, idx) => {
                    const isGPhotos = isGooglePhotosLink(img);
                    const isGDrive = isGoogleDriveLink(img);
                    const isExternalLink = isGPhotos || isGDrive;
                    
                    return (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className={`relative overflow-hidden aspect-[3/4] rounded-sm shadow-sm border border-transparent hover:border-opacity-50 transition-colors duration-500`}
                        style={{ borderColor: themeColor }}
                      >
                        {isExternalLink ? (
                           <a 
                             href={img} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="w-full h-full flex flex-col items-center justify-center bg-black/5 hover:bg-black/10 transition-colors group cursor-pointer text-center p-4"
                           >
                              <div className="mb-3 opacity-60 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-500">
                                {isGDrive ? (
                                    <Folder size={32} strokeWidth={1.5} color={themeColor} />
                                ) : (
                                    <ImageIcon size={32} strokeWidth={1.5} color={themeColor} />
                                )}
                              </div>
                              <span className="font-serif italic text-sm opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: themeColor }}>
                                {isGDrive ? 'Ver en Drive' : 'Ver en Google Photos'}
                              </span>
                              <ExternalLink size={12} className="mt-2 opacity-40" color={themeColor} />
                           </a>
                        ) : (
                          <img 
                            src={img} 
                            alt={`Memory ${idx + 1}`} 
                            className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
             </div>
          </section>
        )}

        {/* SECTION 4: VIDEO */}
        {person.videoUrl && (
          <section 
            id="video" 
            ref={videoRef} 
            className="min-h-screen w-full flex flex-col items-center justify-center p-8 snap-start"
          >
             <h2 
                className="text-2xl font-serif italic mb-8 opacity-70"
                style={{ color: themeColor }}
             >
                Un momento
             </h2>
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
               className="w-full max-w-4xl relative aspect-video shadow-xl overflow-hidden"
               style={{ backgroundColor: `rgba(${themeRgb}, 0.1)` }}
             >
                {isYoutube ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${getYoutubeId(person.videoUrl)}?controls=0&rel=0&modestbranding=1`}
                    title="Video Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a 
                      href={person.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-4 hover:scale-105 transition-transform duration-500"
                    >
                      <div 
                        className="w-20 h-20 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: themeColor }}
                      >
                         {isGooglePhotosVideo ? (
                             <ImageIcon size={32} strokeWidth={1.5} color={themeColor} />
                         ) : isGoogleDriveVideo ? (
                             <Folder size={32} strokeWidth={1.5} color={themeColor} />
                         ) : (
                             <Play size={32} fill={themeColor} color={themeColor} className="ml-1" />
                         )}
                      </div>
                      <span className="font-serif italic" style={{ color: themeColor }}>
                        {isGooglePhotosVideo ? 'Ver en Google Photos' : isGoogleDriveVideo ? 'Ver en Drive' : 'Ver externo'}
                      </span>
                    </a>
                  </div>
                )}
             </motion.div>
             
             <footer className="mt-20 opacity-40 font-serif italic text-sm">
                Con aprecio, Agus.
             </footer>
          </section>
        )}
      </main>

      {/* Spotify Floating Player & Message */}
      {person.spotifyUrl && (
        <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2">
          
          <AnimatePresence>
            {isPlayerOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-[85vw] max-w-[320px] origin-bottom-left"
              >
                {/* Dedication Message Bubble */}
                {person.spotifyMessage && (
                   <div className="mb-2 bg-white/90 backdrop-blur-md p-3 rounded-t-xl rounded-br-xl shadow-lg border border-white/20 text-xs text-gray-700 font-serif italic leading-relaxed relative">
                     <p>"{person.spotifyMessage}"</p>
                     <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white/90 transform rotate-45"></div>
                   </div>
                )}

                {/* Player Container */}
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl relative group">
                   <div className="absolute top-0 right-0 p-1 z-10 bg-gradient-to-b from-black/60 to-transparent w-full flex justify-end">
                      <button 
                        onClick={() => setIsPlayerOpen(false)}
                        className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors"
                        title="Minimizar"
                      >
                        <ChevronDown size={18} />
                      </button>
                   </div>
                   
                   <iframe 
                    style={{ borderRadius: '12px' }} 
                    src={getSpotifyEmbedUrl(person.spotifyUrl)} 
                    width="100%" 
                    height="80" 
                    frameBorder="0" 
                    allowFullScreen={false} 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                  ></iframe>
                </div>
              </motion.div>
            ) : (
              <motion.button
                initial={{ scale: 0 }}
                animate={shouldShake ? { 
                  scale: [1, 1.15, 1, 1.15, 1],
                  rotate: [0, -10, 10, -5, 5, 0],
                } : { scale: 1 }}
                transition={shouldShake ? {
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 2.5,
                  ease: "easeInOut"
                } : {}}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleOpenPlayer}
                className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center backdrop-blur-md border transition-all z-50 relative"
                style={{ 
                    backgroundColor: themeColor,
                    borderColor: `rgba(255,255,255,0.3)`
                }}
                title="Mostrar música"
              >
                <Music size={20} className="text-white" />
                {shouldShake && (
                   <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Navigation Dots (Recuadro por puntos) */}
      <nav className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-50 py-4 px-2 bg-white/30 backdrop-blur-sm rounded-full shadow-sm border border-white/40">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.ref)}
            className="group relative flex items-center justify-center w-4 h-4"
            aria-label={`Go to ${section.label}`}
          >
            <span 
               className={`absolute w-full h-full rounded-full transition-all duration-300 ease-out border`}
               style={{ 
                 borderColor: activeSection === section.id ? themeColor : 'transparent',
                 transform: activeSection === section.id ? 'scale(1.5)' : 'scale(1)',
                 opacity: 0.5
               }}
            />
            <span 
              className={`w-2 h-2 rounded-full transition-colors duration-300`}
              style={{ 
                backgroundColor: activeSection === section.id ? themeColor : `rgba(${themeRgb}, 0.2)`, 
              }}
            />
            
            {/* Tooltip on hover */}
            <span className="absolute right-8 px-2 py-1 text-[10px] uppercase tracking-widest bg-white text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded shadow-sm pointer-events-none">
              {section.label}
            </span>
          </button>
        ))}
      </nav>

    </motion.div>
  );
};

export default Content;