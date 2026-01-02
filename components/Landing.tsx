import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavicon } from '../hooks/useFavicon';

interface LandingProps {
  onUnlock: (code: string) => void;
  isUnlocking: boolean;
  onTransitionComplete: () => void;
  error?: boolean;
  systemMessage?: string;
  onClearError?: () => void;
  transitionColor?: string;
}

const Landing: React.FC<LandingProps> = ({ 
  onUnlock, 
  isUnlocking, 
  onTransitionComplete, 
  error = false, 
  systemMessage,
  onClearError,
  transitionColor = '#F9F7F0' // Default warm color if undefined
}) => {
  const [input, setInput] = useState('');
  const [showHintButton, setShowHintButton] = useState(false);
  const [hintRevealed, setHintRevealed] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set Favicon to dark zinc for Landing
  useFavicon('#27272a');

  // Focus input on click anywhere, unless unlocking
  useEffect(() => {
    const handleClick = () => {
      if (!isUnlocking) inputRef.current?.focus();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isUnlocking]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHintButton(true);
    }, 8000); 
    return () => clearTimeout(timer);
  }, []);

  // Handle the success animation sequence
  useEffect(() => {
    if (isUnlocking) {
      const sequence = async () => {
        setLogs(prev => [...prev, '> ACCESS GRANTED']);
        await new Promise(r => setTimeout(r, 400));
        setLogs(prev => [...prev, '> DECRYPTING ARCHIVE...']);
        await new Promise(r => setTimeout(r, 600));
        setLogs(prev => [...prev, '> LOADING MEMORY FRAGMENTS...']);
        await new Promise(r => setTimeout(r, 500));
        setLogs(prev => [...prev, '> RENDERING...']);
        await new Promise(r => setTimeout(r, 800)); // Slightly longer for the fade feel
        // Signal parent to switch view
        onTransitionComplete();
      };
      sequence();
    }
  }, [isUnlocking, onTransitionComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isUnlocking) {
      onUnlock(input.trim().toLowerCase());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if ((error || systemMessage) && onClearError) {
      onClearError();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }} // Slower exit for smoother feel
      className="min-h-screen bg-black flex flex-col items-center justify-center text-zinc-400 font-mono text-sm selection:bg-zinc-800 selection:text-zinc-200 relative overflow-hidden"
    >
      {/* FADE OVERLAY TRANSITION */}
      <AnimatePresence>
        {isUnlocking && logs.length >= 4 && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 z-50 pointer-events-none"
                style={{ backgroundColor: transitionColor }}
            />
        )}
      </AnimatePresence>

      <div className="w-full max-w-lg px-6 flex flex-col gap-6 relative z-10">
        
        {/* Header / System Status */}
        <div className="flex flex-col gap-1 opacity-50 text-xs mb-8">
          <p>ARCHIVE_SYS v.1.0.4</p>
          <p>STATUS: {isUnlocking ? 'UNLOCKING...' : 'LOCKED'}</p>
          <p>.....................</p>
        </div>

        {/* Unlocking Logs View */}
        {isUnlocking ? (
            <div className="flex flex-col gap-2 h-32 justify-end pb-2">
                {logs.map((log, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-zinc-100 text-xs uppercase tracking-wider"
                    >
                        {log}
                    </motion.div>
                ))}
            </div>
        ) : (
            /* Standard Input View */
            <form onSubmit={handleSubmit} className="relative w-full">
            <label htmlFor="cmd" className="sr-only">Input Code</label>
            
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                <span className="text-zinc-600 select-none">{'>'}</span>
                <div className="relative flex-1">
                    <input
                    ref={inputRef}
                    id="cmd"
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    autoComplete="off"
                    autoFocus
                    className="w-full bg-transparent border-none outline-none text-zinc-200 placeholder-transparent p-0 uppercase tracking-widest caret-transparent"
                    />
                    {/* Custom Block Cursor implementation */}
                    <span className="absolute inset-0 pointer-events-none text-zinc-200 tracking-widest uppercase">
                    {input}
                    <motion.span 
                        animate={{ opacity: [1, 1, 0, 0] }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 0.8, 
                          ease: "linear",
                          times: [0, 0.5, 0.5, 1]
                        }}
                        className="inline-block w-2.5 h-4 bg-zinc-500 align-middle ml-1"
                    />
                    </span>
                </div>
                </div>

                {/* Error Message or System Message */}
                <div className="h-6 pl-6">
                <AnimatePresence mode="wait">
                    {error && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-red-800 text-xs"
                    >
                        ERR: ACCESS_DENIED // INVALID_KEY
                    </motion.div>
                    )}
                    {systemMessage && (
                    <motion.div
                        key="sys"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-amber-600 text-xs"
                    >
                        {`> SYSTEM_RESPONSE: "${systemMessage}"`}
                    </motion.div>
                    )}
                </AnimatePresence>
                </div>
            </div>
            </form>
        )}

        {/* Footer / Hint */}
        <div className="mt-12 flex flex-col items-start gap-4 h-12">
          {!isUnlocking && (
             <AnimatePresence>
             {showHintButton && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="text-xs"
               >
                 {!hintRevealed ? (
                   <button
                     type="button"
                     onClick={() => setHintRevealed(true)}
                     className="text-zinc-700 hover:text-zinc-400 hover:bg-zinc-900 transition-colors px-1 -ml-1"
                   >
                     [ --hint ]
                   </button>
                 ) : (
                   <div className="flex flex-col gap-1 text-zinc-600">
                     <span>{'>'} EXECUTE_HINT_PROTOCOL</span>
                     <span className="text-zinc-300">OUTPUT: "IDENTIDAD"</span>
                   </div>
                 )}
               </motion.div>
             )}
           </AnimatePresence>
          )}
        </div>

      </div>

      <div className="absolute bottom-6 left-6 text-[10px] text-zinc-800 uppercase tracking-widest">
        Agus_Archive_2025.sys
      </div>
    </motion.div>
  );
};

export default Landing;