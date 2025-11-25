'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useSolarSystemStore } from '@/lib/store';

export default function TimeControl() {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  
  const {
    currentDate,
    setCurrentDate,
    timeSpeed,
    setTimeSpeed,
    isPaused,
    togglePause,
    showUI,
  } = useSolarSystemStore();
  
  if (!showUI) return null;
  
  // 时间速度预设
  const speedPresets = [
    { value: -365, label: '-1年/秒', short: '-1Y' },
    { value: -30, label: '-1月/秒', short: '-1M' },
    { value: -7, label: '-1周/秒', short: '-1W' },
    { value: -1, label: '-1天/秒', short: '-1D' },
    { value: 0.0007, label: '实时', short: '实时' },
    { value: 1, label: '1天/秒', short: '1D' },
    { value: 7, label: '1周/秒', short: '1W' },
    { value: 30, label: '1月/秒', short: '1M' },
    { value: 365, label: '1年/秒', short: '1Y' },
  ];
  
  const formatSpeed = (speed: number) => {
    if (Math.abs(speed) < 0.01) return '实时';
    if (Math.abs(speed) < 1) return `${(speed * 24).toFixed(1)}时/秒`;
    if (Math.abs(speed) === 1) return `${speed > 0 ? '' : '-'}1天/秒`;
    if (Math.abs(speed) === 7) return `${speed > 0 ? '' : '-'}1周/秒`;
    if (Math.abs(speed) < 7) return `${speed.toFixed(0)}天/秒`;
    if (Math.abs(speed) === 30) return `${speed > 0 ? '' : '-'}1月/秒`;
    if (Math.abs(speed) < 30) return `${(speed / 7).toFixed(1)}周/秒`;
    if (Math.abs(speed) === 365) return `${speed > 0 ? '' : '-'}1年/秒`;
    if (Math.abs(speed) < 365) return `${(speed / 30).toFixed(1)}月/秒`;
    return `${(speed / 365).toFixed(1)}年/秒`;
  };
  
  // 跳转到今天
  const handleJumpToNow = () => {
    const now = new Date();
    setCurrentDate(now);
    setTimeSpeed(1);
  };
  
  // 获取当前选中的速度预设
  const getCurrentPresetIndex = () => {
    return speedPresets.findIndex(p => Math.abs(p.value - timeSpeed) < 0.001);
  };
  
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-20"
    >
      <div className="glass-dark rounded-2xl px-5 py-3 flex items-center gap-4">
        {/* 日期显示 - 使用固定宽度防止抖动 */}
        <div className="text-center w-[165px] flex-shrink-0">
          <div 
            className="font-display text-xl font-bold text-white tracking-wider whitespace-nowrap"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {format(currentDate, 'yyyy年MM月dd日', { locale: zhCN })}
          </div>
          <div 
            className="text-xs text-white/50 font-body whitespace-nowrap"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {format(currentDate, 'HH:mm:ss', { locale: zhCN })}
          </div>
        </div>
        
        {/* 分隔线 */}
        <div className="w-px h-10 bg-white/10 flex-shrink-0" />
        
        {/* 播放控制 */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* 快退 */}
          <button
            onClick={() => {
              const idx = getCurrentPresetIndex();
              if (idx > 0) {
                setTimeSpeed(speedPresets[idx - 1].value);
              } else if (idx === -1) {
                const smaller = speedPresets.filter(p => p.value < timeSpeed);
                if (smaller.length > 0) {
                  setTimeSpeed(smaller[smaller.length - 1].value);
                }
              }
            }}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            title="减速"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
            </svg>
          </button>
          
          {/* 播放/暂停 */}
          <button
            onClick={togglePause}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              transition-all duration-300
              ${isPaused 
                ? 'bg-cosmic-accent text-white glow-button' 
                : 'bg-white/10 text-white hover:bg-white/20'
              }
            `}
          >
            {isPaused ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            )}
          </button>
          
          {/* 快进 */}
          <button
            onClick={() => {
              const idx = getCurrentPresetIndex();
              if (idx !== -1 && idx < speedPresets.length - 1) {
                setTimeSpeed(speedPresets[idx + 1].value);
              } else if (idx === -1) {
                const larger = speedPresets.filter(p => p.value > timeSpeed);
                if (larger.length > 0) {
                  setTimeSpeed(larger[0].value);
                }
              }
            }}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            title="加速"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
            </svg>
          </button>
        </div>
        
        {/* 分隔线 */}
        <div className="w-px h-10 bg-white/10 flex-shrink-0" />
        
        {/* 速度选择器 - 固定宽度 */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors w-[100px]"
          >
            <div className="text-left flex-1">
              <div className="text-[10px] text-white/40 whitespace-nowrap">时间流速</div>
              <div 
                className="font-display text-sm text-cosmic-glow whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {formatSpeed(timeSpeed)}
              </div>
            </div>
            <svg 
              className={`w-3 h-3 text-white/50 transition-transform flex-shrink-0 ${showSpeedMenu ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* 速度预设菜单 */}
          <AnimatePresence>
            {showSpeedMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 glass-dark rounded-xl overflow-hidden min-w-[120px] z-50"
              >
                {speedPresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => {
                      setTimeSpeed(preset.value);
                      setShowSpeedMenu(false);
                    }}
                    className={`
                      w-full px-4 py-2 text-left text-sm transition-colors whitespace-nowrap
                      ${Math.abs(preset.value - timeSpeed) < 0.001
                        ? 'bg-cosmic-accent/30 text-cosmic-glow'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    {preset.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* 快捷速度按钮 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {[
            { value: 1, label: '1D' },
            { value: 7, label: '1W' },
            { value: 30, label: '1M' },
            { value: 365, label: '1Y' },
          ].map((preset) => (
            <button
              key={preset.value}
              onClick={() => setTimeSpeed(preset.value)}
              className={`
                w-8 h-7 rounded text-xs font-display transition-all flex items-center justify-center
                ${Math.abs(timeSpeed - preset.value) < 0.001
                  ? 'bg-cosmic-accent text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }
              `}
              title={`${preset.value === 1 ? '1天' : preset.value === 7 ? '1周' : preset.value === 30 ? '1月' : '1年'}/秒`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        
        {/* 分隔线 */}
        <div className="w-px h-10 bg-white/10 flex-shrink-0" />
        
        {/* 回到今天 */}
        <button
          onClick={handleJumpToNow}
          className="w-14 h-9 rounded-lg bg-cosmic-accent/20 hover:bg-cosmic-accent/40 text-cosmic-glow hover:text-white transition-all font-display text-sm border border-cosmic-accent/30 flex items-center justify-center flex-shrink-0"
        >
          今天
        </button>
      </div>
      
      {/* 点击外部关闭菜单 */}
      {showSpeedMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSpeedMenu(false)}
        />
      )}
    </motion.div>
  );
}
