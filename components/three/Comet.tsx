'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CometData } from '@/lib/planetData';
import { useSolarSystemStore } from '@/lib/store';

interface CometProps {
  comet: CometData;
  date: Date;
  orbitScale: number;
}

// J2000历元
const J2000_EPOCH = new Date('2000-01-01T12:00:00Z').getTime();
const DEG_TO_RAD = Math.PI / 180;
const DAYS_PER_MS = 1 / (24 * 60 * 60 * 1000);

// 求解开普勒方程
function solveKeplerEquation(M: number, e: number): number {
  let E = M + e * Math.sin(M);
  const tolerance = 1e-10;
  const maxIterations = 100;
  
  for (let i = 0; i < maxIterations; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < tolerance) break;
  }
  
  return E;
}

// 计算彗星位置
function calculateCometPosition(comet: CometData, date: Date): THREE.Vector3 {
  const elements = comet.orbitalElements;
  const T = (date.getTime() - J2000_EPOCH) * DAYS_PER_MS;
  
  const n = 360 / elements.orbitalPeriod;
  let M = (elements.meanAnomalyAtEpoch + n * T) % 360;
  if (M < 0) M += 360;
  const M_rad = M * DEG_TO_RAD;
  
  const E = solveKeplerEquation(M_rad, elements.eccentricity);
  
  // 真近点角
  const sinV = Math.sqrt(1 - elements.eccentricity * elements.eccentricity) * Math.sin(E) / (1 - elements.eccentricity * Math.cos(E));
  const cosV = (Math.cos(E) - elements.eccentricity) / (1 - elements.eccentricity * Math.cos(E));
  const v = Math.atan2(sinV, cosV);
  
  // 日心距离
  const r = elements.semiMajorAxis * (1 - elements.eccentricity * elements.eccentricity) / (1 + elements.eccentricity * Math.cos(v));
  
  // 轨道平面坐标
  const xOrbit = r * Math.cos(v);
  const yOrbit = r * Math.sin(v);
  
  // 转换到黄道坐标系
  const omega = elements.argumentOfPerihelion * DEG_TO_RAD;
  const Omega = elements.longitudeOfAscendingNode * DEG_TO_RAD;
  const i = elements.inclination * DEG_TO_RAD;
  
  const cosOmega = Math.cos(Omega);
  const sinOmega = Math.sin(Omega);
  const cosOmegaSmall = Math.cos(omega);
  const sinOmegaSmall = Math.sin(omega);
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);
  
  const x = (cosOmega * cosOmegaSmall - sinOmega * sinOmegaSmall * cosI) * xOrbit +
            (-cosOmega * sinOmegaSmall - sinOmega * cosOmegaSmall * cosI) * yOrbit;
  
  const y = (sinOmega * cosOmegaSmall + cosOmega * sinOmegaSmall * cosI) * xOrbit +
            (-sinOmega * sinOmegaSmall + cosOmega * cosOmegaSmall * cosI) * yOrbit;
  
  const z = sinOmegaSmall * sinI * xOrbit + cosOmegaSmall * sinI * yOrbit;
  
  return new THREE.Vector3(x, z, y); // Y-up坐标系
}

// 生成彗星轨道路径
function generateCometOrbitPath(comet: CometData, segments: number = 500): THREE.Vector3[] {
  const elements = comet.orbitalElements;
  const path: THREE.Vector3[] = [];
  
  const omega = elements.argumentOfPerihelion * DEG_TO_RAD;
  const Omega = elements.longitudeOfAscendingNode * DEG_TO_RAD;
  const i = elements.inclination * DEG_TO_RAD;
  
  const cosOmega = Math.cos(Omega);
  const sinOmega = Math.sin(Omega);
  const cosOmegaSmall = Math.cos(omega);
  const sinOmegaSmall = Math.sin(omega);
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);
  
  for (let j = 0; j <= segments; j++) {
    const v = (j / segments) * 2 * Math.PI;
    const r = elements.semiMajorAxis * (1 - elements.eccentricity * elements.eccentricity) / 
              (1 + elements.eccentricity * Math.cos(v));
    
    // 限制显示范围（对于非常椭圆的轨道）
    if (r > 50) continue;
    
    const xOrbit = r * Math.cos(v);
    const yOrbit = r * Math.sin(v);
    
    const x = (cosOmega * cosOmegaSmall - sinOmega * sinOmegaSmall * cosI) * xOrbit +
              (-cosOmega * sinOmegaSmall - sinOmega * cosOmegaSmall * cosI) * yOrbit;
    
    const y = (sinOmega * cosOmegaSmall + cosOmega * sinOmegaSmall * cosI) * xOrbit +
              (-sinOmega * sinOmegaSmall + cosOmega * cosOmegaSmall * cosI) * yOrbit;
    
    const z = sinOmegaSmall * sinI * xOrbit + cosOmegaSmall * sinI * yOrbit;
    
    path.push(new THREE.Vector3(x, z, y));
  }
  
  return path;
}

export default function Comet({ comet, date, orbitScale }: CometProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Points>(null);
  
  const { showOrbits, showLabels } = useSolarSystemStore();
  
  // 计算位置
  const position = useMemo(() => {
    const pos = calculateCometPosition(comet, date);
    return pos.multiplyScalar(orbitScale * 10);
  }, [comet, date, orbitScale]);
  
  // 计算到太阳的距离（用于彗尾效果）
  const distanceToSun = useMemo(() => {
    return position.length() / (orbitScale * 10);
  }, [position, orbitScale]);
  
  // 生成轨道路径
  const orbitPath = useMemo(() => {
    const path = generateCometOrbitPath(comet);
    return path.map(p => p.multiplyScalar(orbitScale * 10));
  }, [comet, orbitScale]);
  
  // 彗尾粒子
  const tailParticles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const tailColor = new THREE.Color(comet.tailColor);
    
    for (let i = 0; i < count; i++) {
      // 粒子沿着远离太阳的方向分布
      const t = i / count;
      const spread = Math.random() * 0.3;
      
      positions[i * 3] = t * 2 + (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.5;
      
      // 颜色渐变
      const alpha = 1 - t * 0.8;
      colors[i * 3] = tailColor.r * alpha;
      colors[i * 3 + 1] = tailColor.g * alpha;
      colors[i * 3 + 2] = tailColor.b * alpha;
      
      sizes[i] = (1 - t) * 0.08 + 0.02;
    }
    
    return { positions, colors, sizes };
  }, [comet.tailColor]);
  
  // 更新彗尾方向（始终背离太阳）
  useFrame(() => {
    if (groupRef.current && tailRef.current) {
      groupRef.current.position.copy(position);
      
      // 彗尾指向远离太阳的方向
      const sunDir = position.clone().normalize();
      tailRef.current.lookAt(position.clone().add(sunDir));
      
      // 根据距离调整彗尾长度
      const tailScale = Math.max(0.3, Math.min(2, 3 / distanceToSun));
      tailRef.current.scale.set(tailScale, tailScale, tailScale);
    }
  });
  
  // 如果彗星太远则不显示
  if (distanceToSun > 40) return null;
  
  return (
    <>
      {/* 彗星轨道 */}
      {showOrbits && orbitPath.length > 2 && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={orbitPath.length}
              array={new Float32Array(orbitPath.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={comet.tailColor}
            transparent
            opacity={0.3}
            linewidth={1}
          />
        </line>
      )}
      
      <group ref={groupRef}>
        {/* 彗核 */}
        <mesh>
          <sphereGeometry args={[comet.coreSize * 2, 16, 16]} />
          <meshBasicMaterial color={comet.color} />
        </mesh>
        
        {/* 彗发（核心周围的光晕） */}
        <mesh>
          <sphereGeometry args={[comet.coreSize * 4, 16, 16]} />
          <meshBasicMaterial
            color={comet.color}
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* 彗尾（粒子系统） */}
        <points ref={tailRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={tailParticles.positions.length / 3}
              array={tailParticles.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={tailParticles.colors.length / 3}
              array={tailParticles.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.06}
            vertexColors
            transparent
            opacity={Math.min(1, 2 / distanceToSun)}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>
        
        {/* 离子尾（蓝色，更直） */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.05, distanceToSun < 5 ? 3 : 1.5, 8, 1, true]} />
          <meshBasicMaterial
            color="#4169E1"
            transparent
            opacity={Math.min(0.4, 1.5 / distanceToSun)}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* 标签 */}
        {showLabels && distanceToSun < 20 && (
          <Html
            position={[0, comet.coreSize * 6 + 0.3, 0]}
            center
            style={{ pointerEvents: 'none' }}
          >
            <div className="px-2 py-1 rounded-full bg-cosmic-dark/70 backdrop-blur-sm border border-white/10 text-[10px] text-white/70 font-display whitespace-nowrap">
              ☄️ {comet.nameCN}
            </div>
          </Html>
        )}
      </group>
    </>
  );
}

