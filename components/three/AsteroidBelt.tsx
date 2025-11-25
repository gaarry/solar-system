'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AsteroidBeltProps {
  innerRadius: number;
  outerRadius: number;
  count: number;
}

export default function AsteroidBelt({ innerRadius, outerRadius, count }: AsteroidBeltProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  // 生成小行星位置
  const { positions, sizes, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // 随机角度
      const angle = Math.random() * Math.PI * 2;
      
      // 随机半径 (在内外半径之间)
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      
      // 添加一些随机的垂直偏移
      const verticalOffset = (Math.random() - 0.5) * 0.5;
      
      // 位置
      positions[i * 3] = Math.cos(angle) * radius * 10;
      positions[i * 3 + 1] = verticalOffset;
      positions[i * 3 + 2] = Math.sin(angle) * radius * 10;
      
      // 大小
      sizes[i] = Math.random() * 0.08 + 0.02;
      
      // 颜色 (灰色到棕色)
      const colorValue = 0.3 + Math.random() * 0.3;
      colors[i * 3] = colorValue + Math.random() * 0.1;
      colors[i * 3 + 1] = colorValue;
      colors[i * 3 + 2] = colorValue - Math.random() * 0.1;
    }
    
    return { positions, sizes, colors };
  }, [innerRadius, outerRadius, count]);
  
  // 缓慢旋转
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.001;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

