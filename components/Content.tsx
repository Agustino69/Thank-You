import React, { useRef, useState, useEffect } from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import { Person } from '../types';
import { Play } from 'lucide-react';

interface ContentProps {
  person: Person;
  onExit: () => void;
}

const Content: React.FC<ContentProps> = ({ person, onExit }) => {
  // Theme Color
  const themeColor = person.themeColor || '#4A463E';

  // Refs for sections
  const introRef = useRef<HTMLElement>(null);
  const messageRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLElement>(null);
  
  const [activeSection, setActiveSection] = useState<string>('intro');

  // Define available sections dynamically
  const sections = [
    { id: 'intro', label: 'Inicio', ref: introRef, exists: true },
    { id: 'message', label: 'Mensaje', ref: messageRef, exists: true },
    { id: 'gallery', label: 'Recuerdos', ref: galleryRef, exists: person.images && person.images.length > 0 },
    { id: 'video', label: 'Video', ref: videoRef, exists: !!person.videoUrl },
  ].filter(s => s.exists);

  // Intersection Observers setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
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
  }, [sections]);


  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isYoutube = person.videoUrl?.includes('youtube.com') || person.videoUrl?.includes('youtu.be');
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-screen bg-warm-100 text-warm-900 selection:bg-orange-200 relative overflow-hidden"
    >
      {/* Scrollable Container */}
      <main className="h-full overflow-y-auto scroll-smooth snap-y snap-mandatory no-scrollbar">
        
        {/* SECTION 1: INTRO */}
        <section 
          id="intro" 
          ref={introRef} 
          className="min-h-screen w-full flex flex-col items-center justify-center p-8 snap-start relative"
        >
          <button 
             onClick={onExit} 
             className="absolute top-8 left-8 text-xs uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
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
          className="min-h-screen w-full flex items-center justify-center p-6 md:p-20 snap-start bg-warm-50"
        >
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl prose prose-stone prose-lg md:prose-xl font-serif leading-relaxed opacity-90 whitespace-pre-wrap text-center md:text-left"
            style={{ color: themeColor }} // Applying theme color to text roughly
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
                  {person.images.map((img, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className={`relative overflow-hidden aspect-[3/4] rounded-sm shadow-sm`}
                    >
                      <img 
                        src={img} 
                        alt={`Memory ${idx + 1}`} 
                        className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
                      />
                    </motion.div>
                  ))}
                </div>
             </div>
          </section>
        )}

        {/* SECTION 4: VIDEO */}
        {person.videoUrl && (
          <section 
            id="video" 
            ref={videoRef} 
            className="min-h-screen w-full flex flex-col items-center justify-center p-8 snap-start bg-warm-50"
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
               className="w-full max-w-4xl relative aspect-video bg-warm-200 shadow-xl overflow-hidden"
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
                        <Play size={32} fill={themeColor} color={themeColor} className="ml-1" />
                      </div>
                      <span className="font-serif italic" style={{ color: themeColor }}>Ver externo</span>
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

      {/* Navigation Dots (Recuadro por puntos) */}
      <nav className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-50 py-4 px-2 bg-warm-50/50 backdrop-blur-sm rounded-full shadow-sm border border-white/20">
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
                backgroundColor: activeSection === section.id ? themeColor : '#d6d3d1', // stone-300 inactive
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