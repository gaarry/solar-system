// 精确的轨道力学计算
// 使用开普勒定律和行星轨道参数计算真实位置

import { PlanetData, J2000_EPOCH } from './planetData';

// 常量
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const DAYS_PER_MILLISECOND = 1 / (24 * 60 * 60 * 1000);

/**
 * 计算儒略日
 * @param date JavaScript Date 对象
 * @returns 儒略日数
 */
export function dateToJulianDay(date: Date): number {
  const time = date.getTime();
  return 2440587.5 + time / 86400000;
}

/**
 * 计算从J2000.0历元开始的天数
 * @param date JavaScript Date 对象
 * @returns 天数
 */
export function daysSinceJ2000(date: Date): number {
  return (date.getTime() - J2000_EPOCH) * DAYS_PER_MILLISECOND;
}

/**
 * 求解开普勒方程 (牛顿-拉夫森方法)
 * E - e*sin(E) = M
 * @param M 平近点角 (弧度)
 * @param e 离心率
 * @returns 偏近点角 E (弧度)
 */
export function solveKeplerEquation(M: number, e: number): number {
  // 初始猜测
  let E = M + e * Math.sin(M);
  
  // 牛顿-拉夫森迭代
  const tolerance = 1e-10;
  const maxIterations = 100;
  
  for (let i = 0; i < maxIterations; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;
    
    if (Math.abs(dE) < tolerance) {
      break;
    }
  }
  
  return E;
}

/**
 * 计算真近点角
 * @param E 偏近点角 (弧度)
 * @param e 离心率
 * @returns 真近点角 (弧度)
 */
export function eccentricToTrueAnomaly(E: number, e: number): number {
  const sinV = Math.sqrt(1 - e * e) * Math.sin(E) / (1 - e * Math.cos(E));
  const cosV = (Math.cos(E) - e) / (1 - e * Math.cos(E));
  return Math.atan2(sinV, cosV);
}

/**
 * 计算日心距离
 * @param a 半长轴
 * @param e 离心率
 * @param v 真近点角 (弧度)
 * @returns 日心距离
 */
export function calculateHeliocentricDistance(a: number, e: number, v: number): number {
  return a * (1 - e * e) / (1 + e * Math.cos(v));
}

/**
 * 计算行星在给定日期的位置
 * @param planet 行星数据
 * @param date 日期
 * @returns 3D位置 {x, y, z} (单位: AU)
 */
export function calculatePlanetPosition(
  planet: PlanetData,
  date: Date
): { x: number; y: number; z: number } {
  const elements = planet.orbitalElements;
  const T = daysSinceJ2000(date);
  
  // 计算平近点角
  const n = 360 / elements.orbitalPeriod; // 平均运动 (度/天)
  let M = (elements.meanAnomalyAtEpoch + n * T) % 360;
  if (M < 0) M += 360;
  const M_rad = M * DEG_TO_RAD;
  
  // 求解开普勒方程得到偏近点角
  const E = solveKeplerEquation(M_rad, elements.eccentricity);
  
  // 计算真近点角
  const v = eccentricToTrueAnomaly(E, elements.eccentricity);
  
  // 计算日心距离
  const r = calculateHeliocentricDistance(
    elements.semiMajorAxis,
    elements.eccentricity,
    v
  );
  
  // 轨道平面内的坐标
  const xOrbit = r * Math.cos(v);
  const yOrbit = r * Math.sin(v);
  
  // 转换为黄道坐标系
  const omega = elements.argumentOfPerihelion * DEG_TO_RAD;
  const Omega = elements.longitudeOfAscendingNode * DEG_TO_RAD;
  const i = elements.inclination * DEG_TO_RAD;
  
  // 旋转矩阵计算
  const cosOmega = Math.cos(Omega);
  const sinOmega = Math.sin(Omega);
  const cosOmegaSmall = Math.cos(omega);
  const sinOmegaSmall = Math.sin(omega);
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);
  
  // 应用旋转变换
  const x = (cosOmega * cosOmegaSmall - sinOmega * sinOmegaSmall * cosI) * xOrbit +
            (-cosOmega * sinOmegaSmall - sinOmega * cosOmegaSmall * cosI) * yOrbit;
  
  const y = (sinOmega * cosOmegaSmall + cosOmega * sinOmegaSmall * cosI) * xOrbit +
            (-sinOmega * sinOmegaSmall + cosOmega * cosOmegaSmall * cosI) * yOrbit;
  
  const z = sinOmegaSmall * sinI * xOrbit + cosOmegaSmall * sinI * yOrbit;
  
  return { x, y, z };
}

/**
 * 计算行星的轨道速度
 * @param planet 行星数据
 * @param date 日期
 * @returns 速度向量 {vx, vy, vz} (单位: AU/天)
 */
export function calculatePlanetVelocity(
  planet: PlanetData,
  date: Date
): { vx: number; vy: number; vz: number } {
  // 通过数值微分计算速度
  const dt = 0.001; // 天
  const date1 = new Date(date.getTime() - dt * 86400000);
  const date2 = new Date(date.getTime() + dt * 86400000);
  
  const pos1 = calculatePlanetPosition(planet, date1);
  const pos2 = calculatePlanetPosition(planet, date2);
  
  return {
    vx: (pos2.x - pos1.x) / (2 * dt),
    vy: (pos2.y - pos1.y) / (2 * dt),
    vz: (pos2.z - pos1.z) / (2 * dt),
  };
}

/**
 * 生成行星的完整轨道路径
 * @param planet 行星数据
 * @param segments 轨道分段数
 * @returns 轨道点数组
 */
export function generateOrbitPath(
  planet: PlanetData,
  segments: number = 360
): { x: number; y: number; z: number }[] {
  const elements = planet.orbitalElements;
  const path: { x: number; y: number; z: number }[] = [];
  
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
    const r = calculateHeliocentricDistance(
      elements.semiMajorAxis,
      elements.eccentricity,
      v
    );
    
    const xOrbit = r * Math.cos(v);
    const yOrbit = r * Math.sin(v);
    
    const x = (cosOmega * cosOmegaSmall - sinOmega * sinOmegaSmall * cosI) * xOrbit +
              (-cosOmega * sinOmegaSmall - sinOmega * cosOmegaSmall * cosI) * yOrbit;
    
    const y = (sinOmega * cosOmegaSmall + cosOmega * sinOmegaSmall * cosI) * xOrbit +
              (-sinOmega * sinOmegaSmall + cosOmega * cosOmegaSmall * cosI) * yOrbit;
    
    const z = sinOmegaSmall * sinI * xOrbit + cosOmegaSmall * sinI * yOrbit;
    
    path.push({ x, y, z });
  }
  
  return path;
}

/**
 * 计算行星的当前轨道参数
 * @param planet 行星数据
 * @param date 日期
 * @returns 轨道参数
 */
export function calculateOrbitalInfo(planet: PlanetData, date: Date) {
  const elements = planet.orbitalElements;
  const T = daysSinceJ2000(date);
  
  const n = 360 / elements.orbitalPeriod;
  let M = (elements.meanAnomalyAtEpoch + n * T) % 360;
  if (M < 0) M += 360;
  const M_rad = M * DEG_TO_RAD;
  
  const E = solveKeplerEquation(M_rad, elements.eccentricity);
  const v = eccentricToTrueAnomaly(E, elements.eccentricity);
  const r = calculateHeliocentricDistance(
    elements.semiMajorAxis,
    elements.eccentricity,
    v
  );
  
  // 计算轨道速度大小 (vis-viva 方程)
  const mu = 1; // 太阳引力参数 (AU³/天²)
  const v_orbital = Math.sqrt(mu * (2/r - 1/elements.semiMajorAxis));
  
  return {
    meanAnomaly: M,
    eccentricAnomaly: E * RAD_TO_DEG,
    trueAnomaly: v * RAD_TO_DEG,
    heliocentricDistance: r,
    orbitalVelocity: v_orbital * 1731.457, // 转换为 km/s
    perihelion: elements.semiMajorAxis * (1 - elements.eccentricity),
    aphelion: elements.semiMajorAxis * (1 + elements.eccentricity),
  };
}

/**
 * 计算行星自转角度
 * @param rotationPeriod 自转周期 (小时)
 * @param date 日期
 * @returns 自转角度 (弧度)
 */
export function calculateRotationAngle(rotationPeriod: number, date: Date): number {
  const hours = date.getTime() / (60 * 60 * 1000);
  const rotations = hours / Math.abs(rotationPeriod);
  const angle = (rotations % 1) * 2 * Math.PI;
  return rotationPeriod < 0 ? -angle : angle;
}

/**
 * 格式化距离显示
 * @param au 天文单位距离
 * @returns 格式化的字符串
 */
export function formatDistance(au: number): string {
  if (au < 0.01) {
    return `${(au * 149597870.7).toFixed(0)} km`;
  } else if (au < 1) {
    return `${au.toFixed(4)} AU (${(au * 149597870.7 / 1e6).toFixed(2)} 百万公里)`;
  } else {
    return `${au.toFixed(4)} AU (${(au * 149597870.7 / 1e6).toFixed(1)} 百万公里)`;
  }
}

/**
 * 计算光从太阳到行星的传播时间
 * @param distanceAU 距离 (AU)
 * @returns 分钟数
 */
export function calculateLightTravelTime(distanceAU: number): number {
  const speedOfLight = 299792.458; // km/s
  const auInKm = 149597870.7;
  const distanceKm = distanceAU * auInKm;
  return distanceKm / speedOfLight / 60;
}

