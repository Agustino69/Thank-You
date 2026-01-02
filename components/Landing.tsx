import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavicon } from '../hooks/useFavicon';
import { EasterEgg } from '../types';

interface LandingProps {
  onUnlock: (code: string) => void;
  isUnlocking: boolean;
  onTransitionComplete: () => void;
  error?: boolean;
  activeEasterEgg?: EasterEgg | null; // Changed from systemMessage string to full object
  onClearError?: () => void;
  transitionColor?: string;
}

const Landing: React.FC<LandingProps> = ({ 
  onUnlock, 
  isUnlocking, 
  onTransitionComplete, 
  error = false, 
  activeEasterEgg,
  onClearError,
  transitionColor = '#F9F7F0' 
}) => {
  const [input, setInput] = useState('');
  const [showHintButton, setShowHintButton] = useState(false);
  const [hintRevealed, setHintRevealed] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Timer state for countdowns
  const [timeLeft, setTimeLeft] = useState<string>('');
  
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

  // Handle Countdown Logic
  useEffect(() => {
    if (!activeEasterEgg || activeEasterEgg.type !== 'countdown' || !activeEasterEgg.date) return;

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const target = new Date(activeEasterEgg.date!).getTime();
        const diff = target - now;
        
        const isPast = diff < 0;
        const absDiff = Math.abs(diff);

        const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

        const pad = (n: number) => n.toString().padStart(2, '0');
        const prefix = isPast ? 'T-PLUS' : 'T-MINUS';
        
        setTimeLeft(`${prefix} [${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}]`);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeEasterEgg]);

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
        await new Promise(r => setTimeout(r, 800)); 
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
    if ((error || activeEasterEgg) && onClearError) {
      onClearError();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }} 
      className="h-[100dvh] w-screen bg-black flex flex-col items-center justify-center text-zinc-400 font-mono text-sm selection:bg-zinc-800 selection:text-zinc-200 relative overflow-hidden"
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

      <div className="w-full max-w-lg px-6 flex flex-col gap-4 md:gap-6 relative z-10 -mt-12 md:mt-0">
        
        {/* Header / System Status */}
        <div className="flex flex-col gap-1 opacity-50 text-[10px] md:text-xs mb-4 md:mb-8">
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
                        className="text-zinc-100 text-[11px] md:text-xs uppercase tracking-wider"
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
                <span className="text-zinc-600 select-none text-lg">{'>'}</span>
                <div className="relative flex-1">
                    <input
                    ref={inputRef}
                    id="cmd"
                    type="text"
                    inputMode="text"
                    autoCapitalize="none"
                    value={input}
                    onChange={handleInputChange}
                    autoComplete="off"
                    autoFocus
                    className="w-full bg-transparent border-none outline-none text-zinc-200 placeholder-transparent p-0 uppercase tracking-widest caret-transparent text-base md:text-sm"
                    />
                    {/* Custom Block Cursor implementation */}
                    <span className="absolute inset-0 pointer-events-none text-zinc-200 tracking-widest uppercase flex items-center">
                    {input}
                    <motion.span 
                        animate={{ opacity: [1, 1, 0, 0] }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 0.8, 
                          ease: "linear",
                          times: [0, 0.5, 0.5, 1]
                        }}
                        className="inline-block w-2.5 h-4 bg-zinc-500 ml-1"
                    />
                    </span>
                </div>
                </div>

                {/* Error Message or System Message */}
                <div className="min-h-[1.5rem] pl-7">
                <AnimatePresence mode="wait">
                    {error && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-red-900 text-[10px] md:text-xs"
                    >
                        ERR: ACCESS_DENIED // INVALID_KEY
                    </motion.div>
                    )}
                    {activeEasterEgg && (
                    <motion.div
                        key="sys"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-amber-700 text-[10px] md:text-xs flex flex-col gap-1"
                    >
                        {activeEasterEgg.type === 'countdown' ? (
                            <>
                                <span className="uppercase tracking-widest">{`> TARGET: "${activeEasterEgg.response}"`}</span>
                                <span className="text-zinc-200 font-bold tracking-widest text-xs md:text-sm">{timeLeft}</span>
                            </>
                        ) : (
                            <span>{`> SYSTEM_RESPONSE: "${activeEasterEgg.response}"`}</span>
                        )}
                    </motion.div>
                    )}
                </AnimatePresence>
                </div>
            </div>
            </form>
        )}

        {/* Footer / Hint */}
        <div className="mt-8 md:mt-12 flex flex-col items-start gap-4 h-12">
          {!isUnlocking && (
             <AnimatePresence>
             {showHintButton && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="text-[10px] md:text-xs"
               >
                 {!hintRevealed ? (
                   <button
                     type="button"
                     onClick={() => setHintRevealed(true)}
                     className="text-zinc-800 hover:text-zinc-600 hover:bg-zinc-900 transition-colors px-1 -ml-1 border border-zinc-900 rounded"
                   >
                     [ --hint ]
                   </button>
                 ) : (
                   <div className="flex flex-col gap-1 text-zinc-700">
                     <span>{'>'} EXECUTE_HINT_PROTOCOL</span>
                     <span className="text-zinc-500 italic">OUTPUT: "IDENTIDAD"</span>
                   </div>
                 )}
               </motion.div>
             )}
           </AnimatePresence>
          )}
        </div>

      </div>

      <div className="absolute bottom-8 left-0 w-full flex justify-center md:justify-start md:left-8">
        <div className="text-[10px] text-zinc-900 uppercase tracking-[0.3em] font-light flex items-center gap-2">
          <span>Agus</span>
          <span className="text-zinc-800 opacity-50">©</span>
          <span className="text-zinc-800">2026</span>
          <span className="w-1 h-1 bg-zinc-900 rounded-full opacity-20"></span>
          <span className="opacity-30">Archive.sys</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Landing;