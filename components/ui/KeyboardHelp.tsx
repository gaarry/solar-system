'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSolarSystemStore } from '@/lib/store';

export default function KeyboardHelp() {
  const [showHelp, setShowHelp] = useState(false);
  const {
    togglePause,
    toggleUI,
    selectNextPlanet,
    selectPrevPlanet,
    resetView,
    setTimeSpeed,
    timeSpeed,
    jumpToNow,
    showUI,
  } = useSolarSystemStore();
  
  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 忽略输入框中的按键
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePause();
          break;
        case 'h':
          toggleUI();
          break;
        case 'arrowright':
          selectNextPlanet();
          break;
        case 'arrowleft':
          selectPrevPlanet();
          break;
        case 'arrowup':
          e.preventDefault();
          // 速度档位: 1, 7, 30, 365
          if (timeSpeed < 1) setTimeSpeed(1);
          else if (timeSpeed < 7) setTimeSpeed(7);
          else if (timeSpeed < 30) setTimeSpeed(30);
          else if (timeSpeed < 365) setTimeSpeed(365);
          break;
        case 'arrowdown':
          e.preventDefault();
          // 速度档位: 365, 30, 7, 1
          if (timeSpeed > 365) setTimeSpeed(365);
          else if (timeSpeed > 30) setTimeSpeed(30);
          else if (timeSpeed > 7) setTimeSpeed(7);
          else if (timeSpeed > 1) setTimeSpeed(1);
          else if (timeSpeed > 0.001) setTimeSpeed(0.0007);
          break;
        case 'r':
          resetView();
          break;
        case 't':
          jumpToNow();
          break;
        case '?':
          setShowHelp(!showHelp);
          break;
        case 'escape':
          setShowHelp(false);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePause, toggleUI, selectNextPlanet, selectPrevPlanet, resetView, setTimeSpeed, timeSpeed, jumpToNow, showHelp]);
  
  if (!showUI) return null;
  
  return (
    <>
      {/* 帮助按钮 */}
      <button
        onClick={() => setShowHelp(true)}
        className="absolute bottom-4 right-4 z-20 w-8 h-8 rounded-full glass flex items-center justify-center text-white/50 hover:text-white transition-colors"
      >
        <span className="font-display text-sm font-bold">?</span>
      </button>
      
      {/* 帮助弹窗 */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-dark rounded-2xl p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-white">
                  键盘快捷键
                </h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3">
                {[
                  { key: 'Space', desc: '播放/暂停' },
                  { key: '← / →', desc: '切换行星' },
                  { key: '↑ / ↓', desc: '调整时间速度' },
                  { key: 'H', desc: '显示/隐藏界面' },
                  { key: 'R', desc: '重置视图' },
                  { key: 'T', desc: '跳转到今天' },
                  { key: '?', desc: '显示帮助' },
                  { key: 'Esc', desc: '关闭弹窗' },
                ].map((shortcut) => (
                  <div key={shortcut.key} className="flex items-center gap-4">
                    <kbd className="min-w-[80px] px-3 py-1.5 rounded-lg bg-white/10 text-sm font-mono text-white/90 text-center">
                      {shortcut.key}
                    </kbd>
                    <span className="text-sm text-white/70">{shortcut.desc}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs text-white/50 text-center">
                  使用鼠标拖动旋转视角，滚轮缩放
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

