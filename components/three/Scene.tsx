'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Stars, Preload } from '@react-three/drei';
import { useSolarSystemStore } from '@/lib/store';
import SolarSystem from './SolarSystem';
import CameraController from './CameraController';
import PostProcessing from './PostProcessing';

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#4f46e5" wireframe />
    </mesh>
  );
}

export default function Scene() {
  const { quality, showStars } = useSolarSystemStore();
  
  const qualitySettings = {
    low: { antialias: false, dpr: 0.75, shadows: false },
    medium: { antialias: true, dpr: 1, shadows: false },
    high: { antialias: true, dpr: 1.5, shadows: true },
    ultra: { antialias: true, dpr: 2, shadows: true },
  };
  
  const settings = qualitySettings[quality];
  
  return (
    <Canvas
      camera={{ position: [30, 20, 30], fov: 60, near: 0.01, far: 10000 }}
      gl={{ 
        antialias: settings.antialias,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      dpr={settings.dpr}
      shadows={settings.shadows}
      style={{ background: '#050510' }}
    >
      <Suspense fallback={<LoadingFallback />}>
        {/* 环境光和背景 */}
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 100, 500]} />
        
        {/* 星空背景 */}
        {showStars && (
          <>
            <Stars 
              radius={300} 
              depth={100} 
              count={quality === 'ultra' ? 10000 : quality === 'high' ? 7000 : 4000} 
              factor={4} 
              saturation={0.5} 
              fade 
              speed={0.3}
            />
            <Stars 
              radius={200} 
              depth={50} 
              count={quality === 'ultra' ? 3000 : 1500} 
              factor={6} 
              saturation={0.8} 
              fade 
              speed={0.1}
            />
          </>
        )}
        
        {/* 太阳系主场景 */}
        <SolarSystem />
        
        {/* 相机控制器 */}
        <CameraController />
        
        {/* 后期处理效果 */}
        {(quality === 'high' || quality === 'ultra') && <PostProcessing />}
        
        {/* 预加载资源 */}
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

