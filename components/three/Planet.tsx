'use client';

import { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetData } from '@/lib/planetData';
import { calculatePlanetPosition, calculateRotationAngle } from '@/lib/orbitalMechanics';
import { useSolarSystemStore } from '@/lib/store';

interface PlanetProps {
  planet: PlanetData;
  date: Date;
  orbitScale: number;
  planetScale: number;
}

// 大气层着色器
const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  uniform vec3 glowColor;
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(glowColor, 1.0) * intensity;
  }
`;

export default function Planet({ planet, date, orbitScale, planetScale }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const { 
    selectedPlanet, 
    setSelectedPlanet, 
    showLabels, 
    showAtmosphere,
    isPaused,
  } = useSolarSystemStore();
  
  const isSelected = selectedPlanet?.id === planet.id;
  
  // 计算行星大小 (可视化用)
  const visualRadius = useMemo(() => {
    const baseSize = Math.max(0.15, Math.min(planet.radius * 0.3, 2));
    return baseSize * planetScale;
  }, [planet.radius, planetScale]);
  
  // 加载纹理 (使用程序化生成的纹理作为后备)
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // 创建程序化纹理
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const color = new THREE.Color(planet.color);
    
    // 添加颜色变化
    gradient.addColorStop(0, color.clone().offsetHSL(0, 0, 0.1).getStyle());
    gradient.addColorStop(0.3, color.getStyle());
    gradient.addColorStop(0.6, color.clone().offsetHSL(0.02, 0.1, -0.1).getStyle());
    gradient.addColorStop(1, color.clone().offsetHSL(0, 0, -0.2).getStyle());
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 添加噪点
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 30;
      imageData.data[i] += noise;
      imageData.data[i + 1] += noise;
      imageData.data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);
    
    // 添加行星特有的纹理特征
    if (planet.id === 'jupiter' || planet.id === 'saturn') {
      // 条纹效果
      for (let y = 0; y < canvas.height; y += 15) {
        const alpha = 0.1 + Math.random() * 0.15;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(0, y, canvas.width, 3 + Math.random() * 8);
      }
    }
    
    if (planet.id === 'earth') {
      // 简化的大陆效果
      ctx.fillStyle = 'rgba(34, 139, 34, 0.4)';
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.6 + canvas.height * 0.2;
        const w = 40 + Math.random() * 80;
        const h = 30 + Math.random() * 60;
        ctx.beginPath();
        ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    if (planet.id === 'mars') {
      // 火星极地冰盖
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, 20, 80, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height - 20, 60, 15, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    
    return texture;
  }, [planet]);
  
  // 大气层材质
  const atmosphereMaterial = useMemo(() => {
    if (!showAtmosphere || !planet.atmosphere?.length) return null;
    
    return new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        glowColor: { value: new THREE.Color(planet.glowColor) },
      },
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
  }, [planet, showAtmosphere]);
  
  // 行星位置计算
  const position = useMemo(() => {
    const pos = calculatePlanetPosition(planet, date);
    return new THREE.Vector3(
      pos.x * orbitScale * 10,
      pos.z * orbitScale * 10, // Y-up 坐标系
      pos.y * orbitScale * 10
    );
  }, [planet, date, orbitScale]);
  
  // 自转角度
  const rotationAngle = useMemo(() => {
    return calculateRotationAngle(planet.rotationPeriod, date);
  }, [planet.rotationPeriod, date]);
  
  // 处理点击
  const handleClick = useCallback((e: THREE.Event) => {
    e.stopPropagation();
    setSelectedPlanet(isSelected ? null : planet);
  }, [isSelected, planet, setSelectedPlanet]);
  
  // 动画更新
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.copy(position);
    }
    
    if (meshRef.current && !isPaused) {
      // 自转
      meshRef.current.rotation.y = rotationAngle;
    }
    
    // 选中或悬停时的光晕效果
    if (glowRef.current) {
      const targetOpacity = (isSelected || hovered) ? 0.4 : 0.1;
      const currentMaterial = glowRef.current.material as THREE.MeshBasicMaterial;
      currentMaterial.opacity += (targetOpacity - currentMaterial.opacity) * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* 行星主体 */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        rotation={[planet.axialTilt * Math.PI / 180, 0, 0]}
      >
        <sphereGeometry args={[visualRadius, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.8}
          metalness={0.1}
          emissive={new THREE.Color(planet.color)}
          emissiveIntensity={0.02}
        />
      </mesh>
      
      {/* 行星环 (土星、天王星、海王星) */}
      {planet.hasRings && (
        <group rotation={[Math.PI / 2, 0, 0]}>
          <Ring
            args={[visualRadius * 1.4, visualRadius * 2.2, 64]}
            rotation={[-planet.axialTilt * Math.PI / 180, 0, 0]}
          >
            <meshBasicMaterial
              color={planet.ringColor || '#C9B896'}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </Ring>
          <Ring
            args={[visualRadius * 2.2, visualRadius * 2.5, 64]}
            rotation={[-planet.axialTilt * Math.PI / 180, 0, 0]}
          >
            <meshBasicMaterial
              color={planet.ringColor || '#A89880'}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </Ring>
        </group>
      )}
      
      {/* 大气层光晕 */}
      {atmosphereMaterial && (
        <mesh material={atmosphereMaterial}>
          <sphereGeometry args={[visualRadius * 1.15, 32, 32]} />
        </mesh>
      )}
      
      {/* 选中/悬停光晕 */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[visualRadius * 1.3, 32, 32]} />
        <meshBasicMaterial
          color={planet.glowColor}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* 行星标签 */}
      {showLabels && (
        <Html
          position={[0, visualRadius + 0.5, 0]}
          center
          style={{
            pointerEvents: 'none',
            opacity: hovered || isSelected ? 1 : 0.7,
            transition: 'opacity 0.3s',
          }}
        >
          <div 
            className={`
              px-3 py-1.5 rounded-full text-xs font-display font-medium
              backdrop-blur-md border transition-all duration-300
              ${isSelected 
                ? 'bg-cosmic-accent/40 border-cosmic-glow text-white scale-110' 
                : 'bg-cosmic-dark/60 border-white/10 text-white/80'
              }
            `}
            style={{
              textShadow: isSelected ? '0 0 10px rgba(129, 140, 248, 0.8)' : 'none',
            }}
          >
            {planet.nameCN}
          </div>
        </Html>
      )}
    </group>
  );
}

