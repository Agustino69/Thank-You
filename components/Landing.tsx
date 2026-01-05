import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavicon } from '../hooks/useFavicon';
import { EasterEgg, SystemConfig } from '../types';

interface LandingProps {
  onUnlock: (code: string) => void;
  isUnlocking: boolean;
  onTransitionComplete: () => void;
  error?: boolean;
  activeEasterEgg?: EasterEgg | null;
  systemLogs?: string[];
  onClearError?: () => void;
  transitionColor?: string;
  systemConfig: SystemConfig;
}

// Helper to convert Google Drive view links to direct audio stream links
const getAudioUrl = (url: string) => {
    if (!url) return '';
    try {
        if (url.includes('drive.google.com')) {
            const matches = url.match(/\/d\/(.+?)(\/|$)/) || url.match(/id=(.+?)(\&|$)/);
            if (matches && matches[1]) {
                // export=download works best for audio tags vs export=view
                return `https://drive.google.com/uc?export=download&id=${matches[1]}`;
            }
        }
        return url;
    } catch (e) {
        return url;
    }
};

const Landing: React.FC<LandingProps> = ({ 
  onUnlock, 
  isUnlocking, 
  onTransitionComplete, 
  error = false, 
  activeEasterEgg,
  systemLogs,
  onClearError,
  transitionColor = '#F9F7F0',
  systemConfig
}) => {
  const [input, setInput] = useState('');
  
  // Boot Sequence State
  const [isBooting, setIsBooting] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);

  // Hint State
  const [showHintButton, setShowHintButton] = useState(false);
  const [hintState, setHintState] = useState<'IDLE' | 'SEARCHING' | 'REVEALED'>('IDLE');
  
  // Unlock / Logs State
  const [logs, setLogs] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Audio Refs
  const audioEggRef = useRef<HTMLAudioElement>(null);
  const bootSfxRef = useRef<HTMLAudioElement>(null);
  const ambientSfxRef = useRef<HTMLAudioElement>(null);
  const beepSfxRef = useRef<HTMLAudioElement>(null);
  const occasionalSfxRef = useRef<HTMLAudioElement>(null);

  // Set Favicon to dark zinc for Landing
  useFavicon('#27272a');

  // ------------------------------------------------
  // 1. BOOT SEQUENCE ANIMATION & AUDIO
  // ------------------------------------------------
  useEffect(() => {
    // Attempt to play Boot Sound
    const playBootSound = async () => {
        if (bootSfxRef.current && systemConfig.bootSfxUrl) {
            bootSfxRef.current.volume = 0.4; // Moderate volume
            try {
                await bootSfxRef.current.play();
            } catch (e) {
                console.log("Auto-play blocked, waiting for interaction");
            }
        }
    };
    playBootSound();

    const bootSequence = [
      { text: '> INITIALIZING_BIOS...', delay: 100 },
      { text: '> CHECKING_MEMORY_BLOCKS... OK', delay: 400 },
      { text: '> LOADING_KERNEL_V1.5.1...', delay: 800 },
      { text: '> DECRYPTING_SECURE_LAYER...', delay: 1400 },
      { text: '> MOUNTING_ARCHIVE_SYS...', delay: 1900 },
      { text: '> SYSTEM_READY.', delay: 2400 }
    ];

    let timeouts: ReturnType<typeof setTimeout>[] = [];

    bootSequence.forEach(({ text, delay }) => {
      const t = setTimeout(() => {
        setBootLines(prev => [...prev, text]);
      }, delay);
      timeouts.push(t);
    });

    const finishTimeout = setTimeout(() => {
      setIsBooting(false);
    }, 2800);
    timeouts.push(finishTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, []); // Only run once on mount

  // ------------------------------------------------
  // 2. AMBIENT & OCCASIONAL NOISE LOGIC
  // ------------------------------------------------
  useEffect(() => {
    if (!isBooting) {
        // Start ambient sound loop when boot finishes
        if (ambientSfxRef.current && systemConfig.ambientSfxUrl) {
            ambientSfxRef.current.volume = 0.1; // Low background hum/clicks
            ambientSfxRef.current.play().catch(() => {
                // Ignore autoplay errors, handled by click listener
            });
        }
    } else {
        if (ambientSfxRef.current) ambientSfxRef.current.pause();
    }
  }, [isBooting, systemConfig.ambientSfxUrl]);

  // Occasional Random SFX (Glitches, processing sounds)
  useEffect(() => {
    if (isBooting || isUnlocking || !systemConfig.occasionalSfxUrl) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleSound = () => {
        // Random time between 8 and 20 seconds
        const delay = Math.random() * 12000 + 8000;
        
        timeoutId = setTimeout(() => {
            if (occasionalSfxRef.current) {
                occasionalSfxRef.current.volume = 0.15; // Subtle
                occasionalSfxRef.current.currentTime = 0;
                occasionalSfxRef.current.play().catch(() => {});
                scheduleSound(); // Schedule next
            }
        }, delay);
    };

    scheduleSound();

    return () => clearTimeout(timeoutId);
  }, [isBooting, isUnlocking, systemConfig.occasionalSfxUrl]);


  // Stop ambient noise when unlocking starts
  useEffect(() => {
    if (isUnlocking && ambientSfxRef.current) {
        ambientSfxRef.current.pause();
    }
  }, [isUnlocking]);

  // ------------------------------------------------
  // 3. FOCUS & INTERACTION
  // ------------------------------------------------
  useEffect(() => {
    const handleClick = () => {
      if (!isUnlocking && !isBooting) {
          inputRef.current?.focus();
          
          // Ensure ambient sound is playing if it was blocked by autoplay policy
          if (ambientSfxRef.current && ambientSfxRef.current.paused && systemConfig.ambientSfxUrl) {
             ambientSfxRef.current.play().catch(e => console.error(e));
          }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isUnlocking, isBooting, systemConfig.ambientSfxUrl]);

  useEffect(() => {
    if (!isBooting) {
      const timer = setTimeout(() => {
        setShowHintButton(true);
      }, 5000); // Show hint button 5s after boot
      return () => clearTimeout(timer);
    }
  }, [isBooting]);

  // ------------------------------------------------
  // 4. LOGIC & EGGS
  // ------------------------------------------------

  // Handle Audio Egg Playback
  useEffect(() => {
    if (activeEasterEgg && activeEasterEgg.type === 'audio' && activeEasterEgg.response) {
        // Pause ambient during specific audio eggs
        if(ambientSfxRef.current) ambientSfxRef.current.pause();

        if (audioEggRef.current) {
            audioEggRef.current.src = getAudioUrl(activeEasterEgg.response);
            audioEggRef.current.play().catch(e => console.error("Audio playback failed", e));
        }
    } else {
        if(audioEggRef.current) {
            audioEggRef.current.pause();
            audioEggRef.current.currentTime = 0;
            if (audioEggRef.current.getAttribute('src')) {
                audioEggRef.current.removeAttribute('src');
                // Removing load() call to prevent "The element has no supported sources" error
                // audioEggRef.current.load(); 
            }
        }
        // Resume ambient
        if (!isUnlocking && !isBooting && ambientSfxRef.current && ambientSfxRef.current.paused && systemConfig.ambientSfxUrl) {
            ambientSfxRef.current.play().catch(() => {});
        }
    }

    // Handle Countdown Egg
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
  }, [activeEasterEgg, isBooting, isUnlocking, systemConfig.ambientSfxUrl]);

  // Unlock Animation
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
    if (input.trim() && !isUnlocking && !isBooting) {
      onUnlock(input.trim().toLowerCase());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    // Play Typing Beep
    if (systemConfig.beepSfxUrl && beepSfxRef.current) {
        beepSfxRef.current.currentTime = 0;
        beepSfxRef.current.volume = 0.2;
        beepSfxRef.current.play().catch(() => {});
    }

    if ((error || activeEasterEgg || systemLogs) && onClearError) {
      onClearError();
    }
  };

  // Enhanced Hint Handler
  const handleHintClick = () => {
    setHintState('SEARCHING');
    setTimeout(() => {
      setHintState('REVEALED');
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }} 
      className="h-[100dvh] w-screen bg-black flex flex-col items-center justify-center text-zinc-400 font-mono text-sm selection:bg-zinc-800 selection:text-zinc-200 relative overflow-hidden"
    >
      {/* Audio elements with Drive URL processing */}
      <audio ref={audioEggRef} className="hidden" />
      
      {/* Boot Sound */}
      {systemConfig.bootSfxUrl && (
          <audio ref={bootSfxRef} src={getAudioUrl(systemConfig.bootSfxUrl)} preload="auto" className="hidden" />
      )}
      
      {/* Ambient Sound */}
      {systemConfig.ambientSfxUrl && (
          <audio ref={ambientSfxRef} src={getAudioUrl(systemConfig.ambientSfxUrl)} loop preload="auto" className="hidden" />
      )}

      {/* Typing Beep */}
      {systemConfig.beepSfxUrl && (
          <audio ref={beepSfxRef} src={getAudioUrl(systemConfig.beepSfxUrl)} preload="auto" className="hidden" />
      )}

      {/* Occasional Ambient SFX */}
      {systemConfig.occasionalSfxUrl && (
          <audio ref={occasionalSfxRef} src={getAudioUrl(systemConfig.occasionalSfxUrl)} preload="auto" className="hidden" />
      )}

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
        
        {/* ==============================================
            BOOT SEQUENCE OR MAIN INTERFACE
           ============================================== */}
        {isBooting ? (
            <div className="flex flex-col gap-2 font-mono text-xs md:text-sm h-64 justify-end pb-12">
                {bootLines.map((line, idx) => (
                    <div key={idx} className="text-zinc-500">
                        {line}
                    </div>
                ))}
                 <motion.span 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="w-2 h-4 bg-zinc-500 inline-block"
                />
            </div>
        ) : (
            <>
                {/* Header / System Status / Changelog View */}
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex flex-col gap-1 text-[10px] md:text-xs mb-4 md:mb-8 min-h-[5rem]"
                >
                {systemLogs ? (
                    <div className="flex flex-col gap-1.5 border-l-2 border-zinc-800 pl-3 py-1">
                        {systemLogs.map((log, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="text-emerald-500/80"
                            >
                                {log}
                            </motion.div>
                        ))}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: systemLogs.length * 0.1 }}
                            className="text-zinc-600 mt-2"
                        >
                            &gt; END_OF_LOG
                        </motion.div>
                    </div>
                ) : (
                    <div className="opacity-50">
                        <p>ARCHIVE_SYS v.1.7.0</p>
                        <p>STATUS: {isUnlocking ? 'UNLOCKING...' : 'LOCKED'}</p>
                        <p>.....................</p>
                    </div>
                )}
                </motion.div>

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
                    <motion.form 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        onSubmit={handleSubmit} 
                        className="relative w-full"
                    >
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
                            className="w-full bg-transparent border-none outline-none text-transparent placeholder-transparent p-0 uppercase tracking-widest caret-transparent text-base md:text-sm"
                            />
                            {/* Custom Block Cursor implementation */}
                            <span className="absolute inset-0 pointer-events-none text-zinc-200 tracking-widest uppercase flex items-center text-base md:text-sm">
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
                                ) : activeEasterEgg.type === 'audio' ? (
                                    <span className="uppercase tracking-widest animate-pulse">{`> PLAYING_AUDIO_STREAM...`}</span>
                                ) : (
                                    <span>{`> SYSTEM_RESPONSE: "${activeEasterEgg.response}"`}</span>
                                )}
                            </motion.div>
                            )}
                        </AnimatePresence>
                        </div>
                    </div>
                    </motion.form>
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
                        {hintState === 'IDLE' && (
                        <button
                            type="button"
                            onClick={handleHintClick}
                            className="text-zinc-800 hover:text-zinc-600 hover:bg-zinc-900 transition-colors px-2 py-1 -ml-1 border border-zinc-900 rounded group flex items-center gap-2"
                        >
                            <span>[ --hint ]</span>
                        </button>
                        )}
                        
                        {hintState === 'SEARCHING' && (
                            <div className="text-zinc-600 animate-pulse flex items-center gap-2">
                                <span>{'>'} SEARCHING_DB...</span>
                            </div>
                        )}

                        {hintState === 'REVEALED' && (
                        <motion.div 
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col gap-1 text-zinc-600"
                        >
                            <span>{'>'} RESULT_FOUND:</span>
                            <span className="text-zinc-400 italic">"Prueba con tu nombre, o explora códigos."</span>
                        </motion.div>
                        )}
                    </motion.div>
                    )}
                </AnimatePresence>
                )}
                </div>
            </>
        )}

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