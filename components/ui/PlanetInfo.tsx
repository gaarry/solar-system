'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSolarSystemStore } from '@/lib/store';
import { SUN_DATA } from '@/lib/planetData';
import { calculateOrbitalInfo, formatDistance, calculateLightTravelTime } from '@/lib/orbitalMechanics';

export default function PlanetInfo() {
  const {
    selectedPlanet,
    currentDate,
    showInfoPanel,
    setShowInfoPanel,
    showUI,
    viewMode,
    setViewMode,
  } = useSolarSystemStore();
  
  if (!showUI) return null;
  
  // 如果没有选中行星，显示太阳信息
  const displaySun = !selectedPlanet;
  
  // 计算轨道信息
  const orbitalInfo = selectedPlanet ? calculateOrbitalInfo(selectedPlanet, currentDate) : null;
  
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="absolute right-4 top-24 z-20"
    >
      {/* 折叠按钮 */}
      <button
        onClick={() => setShowInfoPanel(!showInfoPanel)}
        className="absolute -left-10 top-4 w-8 h-8 rounded-l-lg bg-cosmic-dark/80 border border-r-0 border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
      >
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${showInfoPanel ? 'rotate-0' : 'rotate-180'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <AnimatePresence>
        {showInfoPanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-dark rounded-2xl overflow-hidden"
          >
            <div className="p-5 w-80">
              {/* 头部 */}
              <div className="flex items-start gap-4 mb-4">
                {/* 行星图标 */}
                <div
                  className="w-16 h-16 rounded-full flex-shrink-0 relative"
                  style={{
                    background: displaySun
                      ? `radial-gradient(circle at 30% 30%, ${SUN_DATA.color}, ${SUN_DATA.glowColor})`
                      : `radial-gradient(circle at 30% 30%, ${selectedPlanet!.color}, ${selectedPlanet!.glowColor})`,
                    boxShadow: `0 0 30px ${displaySun ? SUN_DATA.glowColor : selectedPlanet!.glowColor}50`,
                  }}
                >
                  {/* 太阳光芒效果 */}
                  {displaySun && (
                    <div className="absolute inset-0 animate-pulse">
                      <div 
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `radial-gradient(circle, ${SUN_DATA.glowColor}30 0%, transparent 70%)`,
                          transform: 'scale(1.5)',
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h2 className="font-display text-2xl font-bold text-white">
                    {displaySun ? SUN_DATA.nameCN : selectedPlanet!.nameCN}
                  </h2>
                  <p className="text-sm text-white/50">
                    {displaySun ? SUN_DATA.name : selectedPlanet!.name}
                  </p>
                  <p className="text-xs text-white/60 mt-1 line-clamp-2">
                    {displaySun ? SUN_DATA.description : selectedPlanet!.description}
                  </p>
                </div>
              </div>
              
              {/* 视图控制 */}
              {!displaySun && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setViewMode('follow')}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      viewMode === 'follow'
                        ? 'bg-cosmic-accent text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    跟随视角
                  </button>
                  <button
                    onClick={() => setViewMode('orbit')}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      viewMode === 'orbit'
                        ? 'bg-cosmic-accent text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    环绕视角
                  </button>
                </div>
              )}
              
              {/* 分隔线 */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4" />
              
              {/* 物理参数 */}
              <div className="space-y-3">
                <h3 className="text-xs text-white/50 uppercase tracking-wider font-display">
                  物理参数
                </h3>
                
                {displaySun ? (
                  <div className="grid grid-cols-2 gap-3">
                    <InfoItem 
                      label="表面温度" 
                      value={`${SUN_DATA.temperature.toLocaleString()} K`} 
                    />
                    <InfoItem 
                      label="光谱类型" 
                      value={SUN_DATA.spectralType} 
                    />
                    <InfoItem 
                      label="年龄" 
                      value={`${SUN_DATA.age} 十亿年`} 
                    />
                    <InfoItem 
                      label="质量" 
                      value={`${SUN_DATA.mass.toLocaleString()} 地球`} 
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <InfoItem 
                      label="半径" 
                      value={`${selectedPlanet!.radius.toFixed(3)} 地球`} 
                    />
                    <InfoItem 
                      label="质量" 
                      value={`${selectedPlanet!.mass.toFixed(3)} 地球`} 
                    />
                    <InfoItem 
                      label="密度" 
                      value={`${selectedPlanet!.density.toFixed(2)} g/cm³`} 
                    />
                    <InfoItem 
                      label="表面重力" 
                      value={`${selectedPlanet!.gravity.toFixed(2)} g`} 
                    />
                    <InfoItem 
                      label="卫星数量" 
                      value={`${selectedPlanet!.moons} 颗`} 
                    />
                    <InfoItem 
                      label="轴倾角" 
                      value={`${selectedPlanet!.axialTilt.toFixed(1)}°`} 
                    />
                  </div>
                )}
              </div>
              
              {/* 轨道信息 */}
              {orbitalInfo && (
                <>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4" />
                  
                  <div className="space-y-3">
                    <h3 className="text-xs text-white/50 uppercase tracking-wider font-display">
                      轨道信息
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <InfoItem 
                        label="距太阳" 
                        value={formatDistance(orbitalInfo.heliocentricDistance)} 
                        fullWidth
                      />
                      <InfoItem 
                        label="轨道速度" 
                        value={`${orbitalInfo.orbitalVelocity.toFixed(2)} km/s`} 
                      />
                      <InfoItem 
                        label="光传播时间" 
                        value={`${calculateLightTravelTime(orbitalInfo.heliocentricDistance).toFixed(1)} 分钟`} 
                      />
                      <InfoItem 
                        label="近日点" 
                        value={`${orbitalInfo.perihelion.toFixed(3)} AU`} 
                      />
                      <InfoItem 
                        label="远日点" 
                        value={`${orbitalInfo.aphelion.toFixed(3)} AU`} 
                      />
                      <InfoItem 
                        label="公转周期" 
                        value={`${selectedPlanet!.orbitalElements.orbitalPeriod.toFixed(1)} 天`} 
                      />
                      <InfoItem 
                        label="自转周期" 
                        value={`${Math.abs(selectedPlanet!.rotationPeriod).toFixed(1)} 小时`} 
                      />
                    </div>
                  </div>
                </>
              )}
              
              {/* 大气成分 */}
              {!displaySun && selectedPlanet!.atmosphere && selectedPlanet!.atmosphere.length > 0 && (
                <>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4" />
                  
                  <div className="space-y-2">
                    <h3 className="text-xs text-white/50 uppercase tracking-wider font-display">
                      大气成分
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlanet!.atmosphere.map((gas, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-full bg-cosmic-accent/20 text-cosmic-glow text-xs"
                        >
                          {gas}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {/* 趣味事实 */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4" />
              
              <div className="space-y-2">
                <h3 className="text-xs text-white/50 uppercase tracking-wider font-display">
                  趣味知识
                </h3>
                <ul className="space-y-1.5">
                  {(displaySun ? SUN_DATA.facts : selectedPlanet!.facts).map((fact, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                      <span className="text-cosmic-glow mt-0.5">✦</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InfoItem({ 
  label, 
  value, 
  fullWidth = false 
}: { 
  label: string; 
  value: string; 
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <div className="text-xs text-white/40">{label}</div>
      <div className="text-sm text-white/90 font-medium">{value}</div>
    </div>
  );
}

