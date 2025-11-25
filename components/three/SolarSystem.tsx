'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSolarSystemStore } from '@/lib/store';
import { PLANETS, SUN_DATA, ASTEROID_BELT, COMETS } from '@/lib/planetData';
import Sun from './Sun';
import Planet from './Planet';
import OrbitLine from './OrbitLine';
import AsteroidBelt from './AsteroidBelt';
import Comet from './Comet';

export default function SolarSystem() {
  const groupRef = useRef<THREE.Group>(null);
  
  const { 
    currentDate, 
    showOrbits,
    showAsteroidBelt,
    showComets,
    orbitScale,
    scaleMode,
  } = useSolarSystemStore();
  
  // 根据显示模式计算缩放系数
  const scales = useMemo(() => {
    switch (scaleMode) {
      case 'realistic':
        return { orbit: 1, planet: 1 };
      case 'enhanced':
        return { orbit: 1, planet: 3 };
      case 'artistic':
        return { orbit: 0.5, planet: 5 };
      default:
        return { orbit: 1, planet: 3 };
    }
  }, [scaleMode]);
  
  // 更新时间 - 使用 getState 获取最新状态避免闭包问题
  useFrame((_, delta) => {
    const state = useSolarSystemStore.getState();
    if (!state.isPaused) {
      // timeSpeed: 1 = 1天/秒
      const newDate = new Date(state.currentDate.getTime() + delta * state.timeSpeed * 24 * 60 * 60 * 1000);
      state.setCurrentDate(newDate);
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* 太阳 */}
      <Sun />
      
      {/* 行星轨道线 */}
      {showOrbits && PLANETS.map((planet) => (
        <OrbitLine 
          key={`orbit-${planet.id}`}
          planet={planet}
          scale={orbitScale * scales.orbit}
        />
      ))}
      
      {/* 行星 */}
      {PLANETS.map((planet) => (
        <Planet
          key={planet.id}
          planet={planet}
          date={currentDate}
          orbitScale={orbitScale * scales.orbit}
          planetScale={scales.planet}
        />
      ))}
      
      {/* 小行星带 */}
      {showAsteroidBelt && (
        <AsteroidBelt 
          innerRadius={ASTEROID_BELT.innerRadius * orbitScale * scales.orbit}
          outerRadius={ASTEROID_BELT.outerRadius * orbitScale * scales.orbit}
          count={ASTEROID_BELT.count}
        />
      )}
      
      {/* 彗星 */}
      {showComets && COMETS.map((comet) => (
        <Comet
          key={comet.id}
          comet={comet}
          date={currentDate}
          orbitScale={orbitScale * scales.orbit}
        />
      ))}
    </group>
  );
}

