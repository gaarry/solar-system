'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSolarSystemStore } from '@/lib/store';
import { calculatePlanetPosition } from '@/lib/orbitalMechanics';

export default function CameraController() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  
  const {
    selectedPlanet,
    currentDate,
    viewMode,
    orbitScale,
    scaleMode,
    setCameraState,
  } = useSolarSystemStore();
  
  // 目标位置
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimating = useRef(false);
  
  // 缩放系数
  const scales = useMemo(() => {
    switch (scaleMode) {
      case 'realistic': return { orbit: 1, planet: 1 };
      case 'enhanced': return { orbit: 1, planet: 3 };
      case 'artistic': return { orbit: 0.5, planet: 5 };
      default: return { orbit: 1, planet: 3 };
    }
  }, [scaleMode]);
  
  // 当选中行星改变时，更新相机目标
  useEffect(() => {
    if (selectedPlanet && viewMode === 'follow') {
      isAnimating.current = true;
    } else if (!selectedPlanet && viewMode === 'follow') {
      // 返回太阳
      targetLookAt.current.set(0, 0, 0);
      targetPosition.current.set(30, 20, 30);
      isAnimating.current = true;
    }
  }, [selectedPlanet, viewMode]);
  
  // 视图模式变化
  useEffect(() => {
    isAnimating.current = true;
    
    switch (viewMode) {
      case 'top':
        targetPosition.current.set(0, 80, 0);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'free':
        if (!selectedPlanet) {
          targetPosition.current.set(30, 20, 30);
          targetLookAt.current.set(0, 0, 0);
        }
        break;
    }
  }, [viewMode, selectedPlanet]);
  
  useFrame((_, delta) => {
    if (!controlsRef.current) return;
    
    // 如果有选中的行星且在跟随模式
    if (selectedPlanet && (viewMode === 'follow' || viewMode === 'orbit')) {
      const pos = calculatePlanetPosition(selectedPlanet, currentDate);
      const planetPos = new THREE.Vector3(
        pos.x * orbitScale * scales.orbit * 10,
        pos.z * orbitScale * scales.orbit * 10,
        pos.y * orbitScale * scales.orbit * 10
      );
      
      targetLookAt.current.copy(planetPos);
      
      // 计算相机位置 (行星后方和上方)
      const cameraOffset = new THREE.Vector3();
      const planetRadius = Math.max(0.15, Math.min(selectedPlanet.radius * 0.3, 2)) * scales.planet;
      const distance = planetRadius * 8 + 5;
      
      if (viewMode === 'follow') {
        // 跟随模式：相对于太阳的方向
        const dirFromSun = planetPos.clone().normalize();
        cameraOffset.copy(dirFromSun).multiplyScalar(distance);
        cameraOffset.y += distance * 0.3;
      } else if (viewMode === 'orbit') {
        // 环绕模式：围绕行星旋转
        const time = Date.now() * 0.0001;
        cameraOffset.set(
          Math.cos(time) * distance,
          distance * 0.4,
          Math.sin(time) * distance
        );
      }
      
      targetPosition.current.copy(planetPos).add(cameraOffset);
      isAnimating.current = true;
    }
    
    // 平滑过渡相机位置
    if (isAnimating.current) {
      const lerpFactor = 1 - Math.pow(0.05, delta);
      
      camera.position.lerp(targetPosition.current, lerpFactor);
      controlsRef.current.target.lerp(targetLookAt.current, lerpFactor);
      
      // 检查是否接近目标位置
      if (
        camera.position.distanceTo(targetPosition.current) < 0.1 &&
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.1
      ) {
        isAnimating.current = false;
      }
    }
    
    // 更新控制器
    controlsRef.current.update();
    
    // 保存相机状态
    setCameraState({
      position: camera.position.toArray() as [number, number, number],
      target: controlsRef.current.target.toArray() as [number, number, number],
    });
  });
  
  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={viewMode === 'free'}
      enableZoom={true}
      enableRotate={viewMode === 'free' || viewMode === 'top'}
      minDistance={1}
      maxDistance={300}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      zoomSpeed={1.2}
      rotateSpeed={0.6}
      dampingFactor={0.1}
      enableDamping
    />
  );
}

