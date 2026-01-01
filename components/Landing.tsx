import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, HelpCircle } from 'lucide-react';

interface LandingProps {
  onUnlock: (code: string) => void;
}

const Landing: React.FC<LandingProps> = ({ onUnlock }) => {
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onUnlock(input.trim().toLowerCase());
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-300 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 opacity-50 pointer-events-none" />

      <form onSubmit={handleSubmit} className="w-full max-w-md px-8 relative z-10 flex flex-col items-center">
        <label htmlFor="code" className="sr-only">Introduce tu nombre</label>
        
        <div className="relative w-full group">
          <input
            id="code"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder=""
            autoComplete="off"
            autoFocus
            className="w-full bg-transparent border-b border-zinc-800 text-center py-4 text-xl tracking-widest font-serif placeholder-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors duration-500"
          />
          
          <button 
            type="submit"
            className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 text-zinc-600 hover:text-zinc-200 transition-all duration-500 ${input ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <ArrowRight size={20} strokeWidth={1} />
          </button>
        </div>
        
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              <div className="flex items-center gap-2 text-zinc-600 text-xs tracking-wider border border-zinc-800 rounded-full px-4 py-1.5 bg-zinc-900/50">
                <HelpCircle size={12} />
                <span>¿Cómo te llamas?</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </form>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-0 w-full text-center pointer-events-none"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600 font-sans">
          Agus 2025-2026
        </span>
      </motion.div>
    </motion.div>
  );
};

export default Landing;