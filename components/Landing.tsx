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
  useFavicon('#000000');

  // ------------------------------------------------
  // 1. BOOT SEQUENCE ANIMATION & AUDIO
  // ------------------------------------------------
  useEffect(() => {
    const playBootSound = async () => {
        if (bootSfxRef.current && systemConfig.bootSfxUrl) {
            bootSfxRef.current.volume = 0.4;
            try {
                await bootSfxRef.current.play();
            } catch (e) {
                console.log("Auto-play blocked, waiting for interaction");
            }
        }
    };
    playBootSound();

    const bootSequence = [
      { text: 'BIOS_INIT...', delay: 100 },
      { text: 'MEM_CHECK_64KB... OK', delay: 400 },
      { text: 'LOADING_KERNEL_V.1...', delay: 800 },
      { text: 'DECRYPTING_SECURE_LAYER...', delay: 1400 },
      { text: 'MOUNTING_VIRTUAL_DRIVE...', delay: 1900 },
      { text: 'READY.', delay: 2400 }
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
  }, []);

  // ------------------------------------------------
  // 2. AMBIENT & OCCASIONAL NOISE LOGIC
  // ------------------------------------------------
  useEffect(() => {
    if (!isBooting) {
        if (ambientSfxRef.current && systemConfig.ambientSfxUrl) {
            ambientSfxRef.current.volume = 0.05;
            ambientSfxRef.current.play().catch(() => {});
        }
    } else {
        if (ambientSfxRef.current) ambientSfxRef.current.pause();
    }
  }, [isBooting, systemConfig.ambientSfxUrl]);

  useEffect(() => {
    if (isBooting || isUnlocking || !systemConfig.occasionalSfxUrl) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleSound = () => {
        const delay = Math.random() * 12000 + 8000;
        timeoutId = setTimeout(() => {
            if (occasionalSfxRef.current) {
                occasionalSfxRef.current.volume = 0.1;
                occasionalSfxRef.current.currentTime = 0;
                occasionalSfxRef.current.play().catch(() => {});
                scheduleSound();
            }
        }, delay);
    };

    scheduleSound();

    return () => clearTimeout(timeoutId);
  }, [isBooting, isUnlocking, systemConfig.occasionalSfxUrl]);

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
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isBooting]);

  // ------------------------------------------------
  // 4. LOGIC & EGGS
  // ------------------------------------------------
  useEffect(() => {
    if (activeEasterEgg && activeEasterEgg.type === 'audio' && activeEasterEgg.response) {
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
            }
        }
        if (!isUnlocking && !isBooting && ambientSfxRef.current && ambientSfxRef.current.paused && systemConfig.ambientSfxUrl) {
            ambientSfxRef.current.play().catch(() => {});
        }
    }

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
        const prefix = isPast ? 'T+' : 'T-';
        setTimeLeft(`${prefix}${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeEasterEgg, isBooting, isUnlocking, systemConfig.ambientSfxUrl]);

  useEffect(() => {
    if (isUnlocking) {
      const sequence = async () => {
        setLogs(prev => [...prev, 'ACCESS_GRANTED']);
        await new Promise(r => setTimeout(r, 400));
        setLogs(prev => [...prev, 'DECRYPTING_ARCHIVE...']);
        await new Promise(r => setTimeout(r, 600));
        setLogs(prev => [...prev, 'LOADING_FRAGMENTS...']);
        await new Promise(r => setTimeout(r, 500));
        setLogs(prev => [...prev, 'RENDERING...']);
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
    if (systemConfig.beepSfxUrl && beepSfxRef.current) {
        beepSfxRef.current.currentTime = 0;
        beepSfxRef.current.volume = 0.2;
        beepSfxRef.current.play().catch(() => {});
    }
    if ((error || activeEasterEgg) && onClearError) {
      onClearError();
    }
  };

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
      className="h-[100dvh] w-screen bg-black flex flex-col items-center justify-center p-6 font-workbench selection:bg-green-500 selection:text-black relative overflow-hidden"
    >
      <style>{`
        /* Apply Workbench Specific Settings */
        .font-workbench {
             font-variation-settings: "BLED" 0, "SCAN" -3;
        }

        /* "Apachurrada" al revés: Wider and shorter */
        .expanded-text {
            transform: scale(1.05, 0.9);
            transform-origin: center;
            width: 95%; /* Compensate for horizontal stretch */
            margin: 0 auto;
        }

        /* Reduced Scanlines */
        .scanlines {
            background: linear-gradient(
                to bottom,
                rgba(18, 16, 16, 0) 50%,
                rgba(0, 0, 0, 0.1) 50%
            ), linear-gradient(
                90deg,
                rgba(255, 0, 0, 0.03),
                rgba(0, 255, 0, 0.01),
                rgba(0, 0, 255, 0.03)
            );
            background-size: 100% 3px, 3px 100%;
            animation: scroll 8s linear infinite;
            pointer-events: none;
            z-index: 30;
        }

        /* Reduced Color Bleeding / Chromatic Aberration */
        .color-bleed {
            text-shadow: 
                -0.5px 0 rgba(255,0,0,0.4), 
                0.5px 0 rgba(0,255,255,0.4),
                0 0 2px rgba(255, 255, 255, 0.1);
        }

        /* Darker Fisheye / Vignette inside Terminal */
        .terminal-screen {
            box-shadow: inset 0 0 100px rgba(0,0,0,0.95);
            background-color: #050505;
        }
        
        /* Glitch Animation */
        .glitch-text {
            position: relative;
            display: inline-block;
        }
        .glitch-text::before,
        .glitch-text::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #050505;
            opacity: 0.8;
        }
        .glitch-text::before {
            left: 2px;
            text-shadow: -2px 0 #ff00c1;
            clip: rect(44px, 450px, 56px, 0);
            animation: glitch-anim 5s infinite linear alternate-reverse;
        }
        .glitch-text::after {
            left: -2px;
            text-shadow: -2px 0 #00fff9;
            clip: rect(44px, 450px, 56px, 0);
            animation: glitch-anim2 5s infinite linear alternate-reverse;
        }

        @keyframes scroll {
            0% { background-position: 0 0; }
            100% { background-position: 0 100%; }
        }

        @keyframes glitch-anim {
            0% { clip: rect(2px, 9999px, 5px, 0); }
            5% { clip: rect(65px, 9999px, 100px, 0); }
            10% { clip: rect(12px, 9999px, 34px, 0); }
            100% { clip: rect(2px, 9999px, 5px, 0); }
        }
        @keyframes glitch-anim2 {
            0% { clip: rect(65px, 9999px, 100px, 0); }
            5% { clip: rect(2px, 9999px, 5px, 0); }
            10% { clip: rect(40px, 9999px, 80px, 0); }
            100% { clip: rect(65px, 9999px, 100px, 0); }
        }
      `}</style>

      {/* Audio Elements */}
      <audio ref={audioEggRef} className="hidden" />
      {systemConfig.bootSfxUrl && <audio ref={bootSfxRef} src={getAudioUrl(systemConfig.bootSfxUrl)} preload="auto" className="hidden" /> }
      {systemConfig.ambientSfxUrl && <audio ref={ambientSfxRef} src={getAudioUrl(systemConfig.ambientSfxUrl)} loop preload="auto" className="hidden" />}
      {systemConfig.beepSfxUrl && <audio ref={beepSfxRef} src={getAudioUrl(systemConfig.beepSfxUrl)} preload="auto" className="hidden" />}
      {systemConfig.occasionalSfxUrl && <audio ref={occasionalSfxRef} src={getAudioUrl(systemConfig.occasionalSfxUrl)} preload="auto" className="hidden" />}

      {/* MAIN TERMINAL CONTAINER */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-xl aspect-[4/3] md:aspect-video bg-[#000] rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden z-20 border border-zinc-900"
      >
          {/* SCREEN CONTENT */}
          <div className="absolute inset-0 terminal-screen p-6 md:p-10 flex flex-col justify-between text-zinc-300 text-lg leading-snug font-medium color-bleed">
            
            {/* CRT Overlay Effects (Scoped to terminal) */}
            <div className="absolute inset-0 pointer-events-none scanlines mix-blend-hard-light opacity-30"></div>
            <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.9)_100%)]"></div>

            {/* WHITE FLASH TRANSITION OVERLAY (Scoped to terminal) */}
             <AnimatePresence>
                {isUnlocking && logs.length >= 4 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 z-50 pointer-events-none bg-white mix-blend-overlay"
                    />
                )}
            </AnimatePresence>

            {/* CONTENT WRAPPER WITH EXPANDED EFFECT */}
            <div className="w-full h-full flex flex-col justify-between expanded-text">
                {/* TOP HEADER */}
                <div className="relative z-30 opacity-70 text-sm uppercase flex justify-between items-start border-b border-zinc-800 pb-3 mb-2 tracking-wide">
                    <div className="flex flex-col">
                        <span className="text-zinc-500 font-bold">ARCHIVE_SYS.V1.7</span>
                        <span className="text-zinc-700 text-xs">MEM_ADDR: 0x8F44A</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-sm ${isUnlocking ? 'bg-yellow-600 animate-pulse' : 'bg-green-700'}`}></div>
                        <span className="text-xs font-bold">{isUnlocking ? 'BUSY' : 'IDLE'}</span>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="relative z-30 flex-1 flex flex-col justify-center py-2">
                    {isBooting ? (
                        <div className="flex flex-col gap-1 text-zinc-500 text-base">
                            {bootLines.map((line, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <span className="opacity-50">{`>`}</span>
                                    <span>{line}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {isUnlocking ? (
                                <div className="flex flex-col gap-1 text-zinc-200 text-base">
                                    {logs.map((log, idx) => (
                                        <motion.div 
                                            key={idx}
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="uppercase tracking-wider"
                                        >
                                            {`> ${log}`}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="w-full">
                                    <label htmlFor="input-terminal" className="sr-only">Command Input</label>
                                    <div className="flex flex-col gap-2">
                                        <div className="text-zinc-500 text-base mb-1 uppercase tracking-wider font-bold">ENTER ACCESS KEY:</div>
                                        <div className="flex items-center gap-2 text-2xl md:text-3xl text-zinc-100">
                                            <span className="text-zinc-600 select-none animate-pulse">{`>`}</span>
                                            <div className="relative flex-1">
                                                <input
                                                    ref={inputRef}
                                                    id="input-terminal"
                                                    type="text"
                                                    value={input}
                                                    onChange={handleInputChange}
                                                    autoFocus
                                                    autoComplete="off"
                                                    className="w-full bg-transparent border-none outline-none text-transparent caret-transparent p-0 tracking-widest font-bold"
                                                />
                                                {/* Custom Cursor / Input Display */}
                                                <div className="absolute inset-0 pointer-events-none flex items-center">
                                                    <span className="tracking-widest">{input}</span>
                                                    <motion.span 
                                                        animate={{ opacity: [1, 0] }}
                                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                                        className="w-3 h-6 bg-zinc-500 ml-1 block"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}
                            
                            {/* Messages / Errors Area */}
                            <div className="h-8 flex items-center text-lg">
                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }} 
                                            exit={{ opacity: 0 }}
                                            className="text-red-700 glitch-text uppercase font-bold" 
                                            data-text="ERROR: INVALID_KEY"
                                        >
                                            ERROR: INVALID_KEY
                                        </motion.div>
                                    )}
                                    {activeEasterEgg && (
                                        <motion.div 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }} 
                                            exit={{ opacity: 0 }}
                                            className="text-yellow-600 w-full"
                                        >
                                            {activeEasterEgg.type === 'countdown' ? (
                                                <div className="flex flex-col">
                                                    <span className="text-sm opacity-70 uppercase">{activeEasterEgg.response}</span>
                                                    <span className="text-xl font-bold tracking-widest">{timeLeft}</span>
                                                </div>
                                            ) : activeEasterEgg.type === 'audio' ? (
                                                <div className="flex items-center gap-2 animate-pulse">
                                                    <span>PLAYING_STREAM...</span>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <span className="opacity-50">{`>>`}</span>
                                                    <span>{activeEasterEgg.response}</span>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>

                {/* BOTTOM HINT AREA */}
                <div className="relative z-30 min-h-[20px] flex items-end justify-between text-sm text-zinc-600 uppercase tracking-wide">
                    {!isUnlocking && !isBooting && (
                        <>
                            <AnimatePresence>
                                {showHintButton && hintState === 'IDLE' && (
                                    <motion.button 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        onClick={handleHintClick}
                                        className="hover:text-zinc-400 transition-colors"
                                    >
                                        [ --HINT ]
                                    </motion.button>
                                )}
                                {hintState === 'SEARCHING' && <span>SEARCHING_DB...</span>}
                                {hintState === 'REVEALED' && (
                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-500">
                                        "TRY YOUR NAME"
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            <div>SYS_READY</div>
                        </>
                    )}
                </div>
            </div>
          </div>
      </motion.div>

      {/* FOOTER - MOVED TO BOTTOM LEFT */}
      <div className="absolute bottom-6 left-6 text-sm text-zinc-800 uppercase tracking-widest flex flex-col gap-1 z-10 opacity-40 font-bold font-elegant font-light">
         <div className="flex items-center gap-2">
            <span>AGUS</span>
            <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></span>
            <span>2026</span>
         </div>

      </div>

    </motion.div>
  );
};

export default Landing;