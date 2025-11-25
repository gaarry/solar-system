'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSolarSystemStore } from '@/lib/store';

export default function ControlPanel() {
  const {
    showOrbits,
    setShowOrbits,
    showLabels,
    setShowLabels,
    showAsteroidBelt,
    setShowAsteroidBelt,
    showAtmosphere,
    setShowAtmosphere,
    showStars,
    setShowStars,
    showComets,
    setShowComets,
    scaleMode,
    setScaleMode,
    quality,
    setQuality,
    viewMode,
    setViewMode,
    showUI,
  } = useSolarSystemStore();
  
  if (!showUI) return null;
  
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-20"
    >
      <div className="glass-dark rounded-2xl p-4 space-y-4 w-56">
        {/* 标题 */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <div className="w-2 h-2 rounded-full bg-cosmic-glow animate-pulse" />
          <h3 className="font-display text-sm font-semibold text-white/90">
            控制面板
          </h3>
        </div>
        
        {/* 视图模式 */}
        <div className="space-y-2">
          <label className="text-xs text-white/60 uppercase tracking-wider">
            视图模式
          </label>
          <div className="grid grid-cols-2 gap-1">
            {[
              { id: 'free', label: '自由' },
              { id: 'follow', label: '跟随' },
              { id: 'orbit', label: '环绕' },
              { id: 'top', label: '俯视' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${viewMode === mode.id
                    ? 'bg-cosmic-accent text-white glow-button'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }
                `}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* 显示设置 */}
        <div className="space-y-2">
          <label className="text-xs text-white/60 uppercase tracking-wider">
            显示设置
          </label>
          <div className="space-y-1">
            {[
              { key: 'orbits', label: '轨道线', value: showOrbits, setter: setShowOrbits },
              { key: 'labels', label: '行星标签', value: showLabels, setter: setShowLabels },
              { key: 'comets', label: '☄️ 彗星', value: showComets, setter: setShowComets },
              { key: 'atmosphere', label: '大气效果', value: showAtmosphere, setter: setShowAtmosphere },
              { key: 'asteroids', label: '小行星带', value: showAsteroidBelt, setter: setShowAsteroidBelt },
              { key: 'stars', label: '星空背景', value: showStars, setter: setShowStars },
            ].map((toggle) => (
              <div
                key={toggle.key}
                className="flex items-center justify-between py-1"
              >
                <span className="text-sm text-white/80">{toggle.label}</span>
                <button
                  onClick={() => toggle.setter(!toggle.value)}
                  className={`
                    w-10 h-5 rounded-full relative transition-colors duration-300
                    ${toggle.value ? 'bg-cosmic-accent' : 'bg-white/20'}
                  `}
                >
                  <motion.div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-lg"
                    animate={{ left: toggle.value ? '22px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* 缩放模式 */}
        <div className="space-y-2">
          <label className="text-xs text-white/60 uppercase tracking-wider">
            显示比例
          </label>
          <div className="flex gap-1">
            {[
              { id: 'realistic', label: '真实' },
              { id: 'enhanced', label: '增强' },
              { id: 'artistic', label: '艺术' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setScaleMode(mode.id as any)}
                className={`
                  flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${scaleMode === mode.id
                    ? 'bg-cosmic-nebula text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }
                `}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* 画质设置 */}
        <div className="space-y-2">
          <label className="text-xs text-white/60 uppercase tracking-wider">
            渲染质量
          </label>
          <div className="flex gap-1">
            {[
              { id: 'low', label: '低' },
              { id: 'medium', label: '中' },
              { id: 'high', label: '高' },
              { id: 'ultra', label: '极致' },
            ].map((q) => (
              <button
                key={q.id}
                onClick={() => setQuality(q.id as any)}
                className={`
                  flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${quality === q.id
                    ? 'bg-cosmic-star text-cosmic-dark'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }
                `}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

