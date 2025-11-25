'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Header from '@/components/ui/Header';
import TimeControl from '@/components/ui/TimeControl';
import ControlPanel from '@/components/ui/ControlPanel';
import PlanetSelector from '@/components/ui/PlanetSelector';
import PlanetInfo from '@/components/ui/PlanetInfo';
import KeyboardHelp from '@/components/ui/KeyboardHelp';

// 动态导入3D场景以避免SSR问题
const Scene = dynamic(() => import('@/components/three/Scene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-cosmic-deeper flex items-center justify-center">
      <div className="loading-ring w-12 h-12" />
    </div>
  ),
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return (
      <div className="w-full h-screen bg-cosmic-deeper" />
    );
  }
  
  return (
    <main className="w-full h-screen overflow-hidden relative cosmic-gradient">
      {/* 加载屏幕 */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      
      {/* 3D 场景 */}
      <div className="absolute inset-0">
        <Scene />
      </div>
      
      {/* UI 层 */}
      {!isLoading && (
        <>
          {/* 头部Logo */}
          <Header />
          
          {/* 时间控制 */}
          <TimeControl />
          
          {/* 左侧控制面板 */}
          <ControlPanel />
          
          {/* 右侧行星信息 */}
          <PlanetInfo />
          
          {/* 底部行星选择器 */}
          <PlanetSelector />
          
          {/* 键盘帮助 */}
          <KeyboardHelp />
        </>
      )}
    </main>
  );
}

