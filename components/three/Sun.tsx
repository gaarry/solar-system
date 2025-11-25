'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSolarSystemStore } from '@/lib/store';

// 太阳着色器
const sunVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sunFragmentShader = `
  uniform float time;
  uniform vec3 baseColor;
  uniform vec3 glowColor;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  // 噪声函数
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    // 创建动态表面纹理
    vec3 pos = vPosition * 2.0;
    float noise1 = snoise(pos + time * 0.1) * 0.5 + 0.5;
    float noise2 = snoise(pos * 3.0 - time * 0.15) * 0.5 + 0.5;
    float noise3 = snoise(pos * 6.0 + time * 0.2) * 0.5 + 0.5;
    
    float noise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
    
    // 颜色混合
    vec3 color = mix(baseColor, glowColor, noise);
    
    // 边缘发光效果
    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    color += glowColor * fresnel * 0.5;
    
    // 添加亮斑
    float spots = snoise(pos * 10.0 + time * 0.3);
    if (spots > 0.7) {
      color += vec3(0.3, 0.2, 0.0);
    }
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Points>(null);
  
  const { scaleMode, setSelectedPlanet, isPaused } = useSolarSystemStore();
  
  // 太阳大小 (可视化缩放)
  const sunSize = useMemo(() => {
    switch (scaleMode) {
      case 'realistic': return 2;
      case 'enhanced': return 3;
      case 'artistic': return 4;
      default: return 3;
    }
  }, [scaleMode]);
  
  // 着色器材质
  const sunMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: sunVertexShader,
      fragmentShader: sunFragmentShader,
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color('#FDB813') },
        glowColor: { value: new THREE.Color('#FF6B00') },
      },
    });
  }, []);
  
  // 日冕粒子
  const coronaParticles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = sunSize * (1.2 + Math.random() * 0.8);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      sizes[i] = Math.random() * 0.15 + 0.05;
    }
    
    return { positions, sizes };
  }, [sunSize]);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // 更新着色器时间
    if (sunMaterial.uniforms) {
      sunMaterial.uniforms.time.value = time;
    }
    
    // 太阳自转
    if (meshRef.current && !isPaused) {
      meshRef.current.rotation.y += 0.0002;
    }
    
    // 光晕脉动
    if (glowRef.current) {
      const scale = 1 + Math.sin(time * 0.5) * 0.05;
      glowRef.current.scale.setScalar(scale);
    }
    
    // 日冕粒子动画
    if (coronaRef.current) {
      coronaRef.current.rotation.y += 0.0001;
    }
  });
  
  return (
    <group onClick={() => setSelectedPlanet(null)}>
      {/* 太阳主体 */}
      <mesh ref={meshRef} material={sunMaterial}>
        <sphereGeometry args={[sunSize, 64, 64]} />
      </mesh>
      
      {/* 内层光晕 */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[sunSize * 1.15, 32, 32]} />
        <meshBasicMaterial 
          color="#FF6B00" 
          transparent 
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* 外层光晕 */}
      <mesh>
        <sphereGeometry args={[sunSize * 1.5, 32, 32]} />
        <meshBasicMaterial 
          color="#FF4500" 
          transparent 
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* 日冕粒子 */}
      <points ref={coronaRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={coronaParticles.positions.length / 3}
            array={coronaParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={coronaParticles.sizes.length}
            array={coronaParticles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#FF8C00"
          size={0.1}
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* 点光源 */}
      <pointLight 
        color="#FFF5E1" 
        intensity={3} 
        distance={500}
        decay={0.5}
      />
      <pointLight 
        color="#FF6B00" 
        intensity={1} 
        distance={100}
        decay={1}
      />
    </group>
  );
}

