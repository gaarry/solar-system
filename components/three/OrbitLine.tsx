'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { PlanetData } from '@/lib/planetData';
import { generateOrbitPath } from '@/lib/orbitalMechanics';
import { useSolarSystemStore } from '@/lib/store';

interface OrbitLineProps {
  planet: PlanetData;
  scale: number;
}

export default function OrbitLine({ planet, scale }: OrbitLineProps) {
  const lineRef = useRef<THREE.Line>(null);
  const { selectedPlanet } = useSolarSystemStore();
  
  const isSelected = selectedPlanet?.id === planet.id;
  
  // 生成轨道路径点
  const points = useMemo(() => {
    const path = generateOrbitPath(planet, 360);
    return path.map(p => new THREE.Vector3(
      p.x * scale * 10,
      p.z * scale * 10, // Y-up 坐标系
      p.y * scale * 10
    ));
  }, [planet, scale]);
  
  // 轨道颜色
  const color = useMemo(() => {
    if (isSelected) {
      return planet.glowColor;
    }
    return planet.color;
  }, [planet, isSelected]);
  
  // 动画效果
  useFrame(() => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      const targetOpacity = isSelected ? 0.8 : 0.25;
      material.opacity += (targetOpacity - material.opacity) * 0.1;
    }
  });
  
  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={isSelected ? 2 : 1}
      transparent
      opacity={0.25}
      dashed={!isSelected}
      dashSize={isSelected ? 0 : 0.5}
      gapSize={isSelected ? 0 : 0.3}
    />
  );
}

