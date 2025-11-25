'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSolarSystemStore } from '@/lib/store';
import { PLANETS, SUN_DATA } from '@/lib/planetData';

export default function PlanetSelector() {
  const {
    selectedPlanet,
    selectPlanetById,
    showUI,
  } = useSolarSystemStore();
  
  if (!showUI) return null;
  
  const allBodies = [
    { id: 'sun', nameCN: '太阳', color: SUN_DATA.color, glowColor: SUN_DATA.glowColor },
    ...PLANETS.map(p => ({
      id: p.id,
      nameCN: p.nameCN,
      color: p.color,
      glowColor: p.glowColor,
    })),
  ];
  
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
    >
      <div className="glass-dark rounded-full px-4 py-2 flex items-center gap-2">
        {allBodies.map((body, index) => {
          const isSelected = selectedPlanet?.id === body.id || 
            (body.id === 'sun' && !selectedPlanet);
          
          return (
            <motion.button
              key={body.id}
              onClick={() => selectPlanetById(body.id)}
              className={`
                relative group
                w-10 h-10 rounded-full
                flex items-center justify-center
                transition-all duration-300
                ${isSelected ? 'scale-125' : 'hover:scale-110'}
              `}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {/* 行星圆球 */}
              <div
                className={`
                  w-7 h-7 rounded-full
                  transition-all duration-300
                  ${isSelected ? 'shadow-lg' : ''}
                `}
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${body.color}, ${body.glowColor})`,
                  boxShadow: isSelected 
                    ? `0 0 20px ${body.glowColor}, 0 0 40px ${body.glowColor}50`
                    : 'none',
                }}
              />
              
              {/* 土星环 */}
              {body.id === 'saturn' && (
                <div 
                  className="absolute w-10 h-3 border-2 rounded-full opacity-60"
                  style={{
                    borderColor: '#C9B896',
                    transform: 'rotateX(70deg)',
                  }}
                />
              )}
              
              {/* 悬停提示 */}
              <div className="
                absolute -top-10 left-1/2 -translate-x-1/2
                px-2 py-1 rounded-lg
                bg-cosmic-dark/90 border border-white/10
                text-xs text-white font-display
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                whitespace-nowrap
                pointer-events-none
              ">
                {body.nameCN}
              </div>
              
              {/* 选中指示器 */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -bottom-2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: body.glowColor }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

