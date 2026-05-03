import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    // Total duration before triggering transition into the game
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background ambient lighting and grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.06),transparent_60%)]" />
        
        {/* Subtle 3D grid floor */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: 'perspective(800px) rotateX(60deg) scale(2.5) translateY(-50px)',
            transformOrigin: 'center center',
          }}
        />

        {/* Ambient drift */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(129,140,248,0.08),transparent_50%)]" 
        />
      </motion.div>

      {/* Main Logo Elements */}
      <div className="z-10 relative flex flex-col items-center justify-center">
        {/* Glowing backdrop specifically for the logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
        />

        <motion.h1
          className="relative text-6xl md:text-8xl font-bold tracking-[12px] text-[var(--color-sapphire-text)] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center gap-4 ml-3"
          initial={{ opacity: 0, filter: 'blur(12px)', scale: 0.9, y: 10 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          M
          <motion.span 
            className="text-[var(--color-sapphire-accent)]"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
            style={{ textShadow: '0 0 30px rgba(34,211,238,0.8), 0 0 10px rgba(34,211,238,0.5)' }}
          >
            /
          </motion.span>
          NE
        </motion.h1>
      </div>

      {/* Footer Credit */}
      <motion.div
        className="absolute bottom-12 z-10"
        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.0, ease: 'easeOut', delay: 1.6 }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-[1px] h-6 bg-gradient-to-b from-transparent to-cyan-500/30 mb-2" />
          <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[6px] text-slate-400 drop-shadow-sm ml-1.5">
            BIOWESS 2026
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};
