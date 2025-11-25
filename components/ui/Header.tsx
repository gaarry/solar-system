'use client';

import { motion } from 'framer-motion';
import { useSolarSystemStore } from '@/lib/store';

export default function Header() {
  const { showUI, toggleUI, resetView } = useSolarSystemStore();
  
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-4 left-4 z-30 flex items-center gap-4"
    >
      {/* Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={resetView}
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cosmic-star via-cosmic-accent to-cosmic-nebula animate-spin-slow" />
          <div className="absolute inset-1 rounded-full bg-cosmic-deeper" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cosmic-glow to-cosmic-accent" />
        </div>
        
        <div>
          <h1 className="font-display text-xl font-bold text-white tracking-wide group-hover:text-cosmic-glow transition-colors">
            Solar Explorer
          </h1>
          <p className="text-xs text-white/50 font-body -mt-0.5">
            太阳系探索者
          </p>
        </div>
      </div>
      
      {/* UI 切换按钮 */}
      <button
        onClick={toggleUI}
        className="ml-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
        title={showUI ? '隐藏界面 (H)' : '显示界面 (H)'}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {showUI ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          )}
        </svg>
      </button>
    </motion.header>
  );
}

