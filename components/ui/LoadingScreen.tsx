'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('正在初始化...');
  
  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: '加载恒星数据...' },
      { progress: 40, text: '计算轨道参数...' },
      { progress: 60, text: '渲染行星纹理...' },
      { progress: 80, text: '初始化3D场景...' },
      { progress: 100, text: '准备就绪!' },
    ];
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setProgress(loadingSteps[currentStep].progress);
        setLoadingText(loadingSteps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 400);
    
    return () => clearInterval(interval);
  }, [onComplete]);
  
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-cosmic-deeper flex items-center justify-center"
    >
      {/* 背景星星 */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              '--duration': `${2 + Math.random() * 3}s`,
              '--delay': `${Math.random() * 2}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* 动画logo */}
        <div className="relative w-32 h-32 mb-8">
          {/* 轨道圈 */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 rounded-full border border-cosmic-glow/30"
              style={{
                transform: `scale(${0.4 + ring * 0.2})`,
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 8 - ring * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {/* 轨道上的行星 */}
              <div
                className="absolute w-2 h-2 rounded-full"
                style={{
                  top: '50%',
                  left: '-4px',
                  transform: 'translateY(-50%)',
                  background: `hsl(${ring * 60 + 180}, 70%, 60%)`,
                  boxShadow: `0 0 10px hsl(${ring * 60 + 180}, 70%, 60%)`,
                }}
              />
            </motion.div>
          ))}
          
          {/* 中心太阳 */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-10 h-10 -ml-5 -mt-5 rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #FDB813, #FF6B00)',
              boxShadow: '0 0 40px #FF6B00, 0 0 80px #FDB81350',
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        
        {/* 标题 */}
        <motion.h1
          className="font-display text-3xl font-bold text-white mb-2 tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Solar Explorer
        </motion.h1>
        
        <motion.p
          className="text-white/50 text-sm mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          太阳系探索者
        </motion.p>
        
        {/* 进度条 */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-cosmic-accent to-cosmic-nebula"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* 加载文字 */}
        <motion.p
          className="text-white/70 text-sm font-body"
          key={loadingText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {loadingText}
        </motion.p>
      </div>
    </motion.div>
  );
}

