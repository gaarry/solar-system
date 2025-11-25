// 精确的行星数据 - 基于NASA JPL数据
// 所有距离单位为天文单位(AU)，时间单位为地球日

export interface PlanetData {
  id: string;
  name: string;
  nameCN: string;
  description: string;
  
  // 物理属性
  radius: number;           // 相对于地球的半径
  mass: number;             // 相对于地球的质量 (地球 = 1)
  density: number;          // 密度 (g/cm³)
  gravity: number;          // 表面重力 (相对于地球)
  
  // 轨道参数 (开普勒轨道六要素)
  orbitalElements: {
    semiMajorAxis: number;    // 半长轴 (AU)
    eccentricity: number;     // 离心率
    inclination: number;      // 轨道倾角 (度)
    longitudeOfAscendingNode: number;  // 升交点经度 (度)
    argumentOfPerihelion: number;      // 近日点幅角 (度)
    meanAnomalyAtEpoch: number;        // 历元平近点角 (度)
    orbitalPeriod: number;    // 公转周期 (地球日)
  };
  
  // 自转参数
  rotationPeriod: number;   // 自转周期 (地球时)
  axialTilt: number;        // 轴倾角 (度)
  
  // 视觉属性
  color: string;
  glowColor: string;
  textureUrl: string;
  hasRings?: boolean;
  ringColor?: string;
  
  // 附加信息
  moons: number;
  discoveryYear?: number;
  discoverer?: string;
  atmosphere?: string[];
  facts: string[];
}

// J2000.0 历元 (2000年1月1日 12:00 TT)
export const J2000_EPOCH = new Date('2000-01-01T12:00:00Z').getTime();

export const SUN_DATA = {
  id: 'sun',
  name: 'Sun',
  nameCN: '太阳',
  description: '太阳是太阳系的中心恒星，包含了太阳系99.86%的质量。',
  radius: 109.2,  // 相对于地球
  mass: 332946,
  temperature: 5778, // K (表面温度)
  luminosity: 1,
  spectralType: 'G2V',
  age: 4.6, // 十亿年
  color: '#FDB813',
  glowColor: '#FF6B00',
  textureUrl: '/textures/sun.jpg',
  facts: [
    '太阳每秒将400万吨物质转化为能量',
    '太阳的核心温度约为1500万摄氏度',
    '光从太阳到达地球需要约8分20秒',
    '太阳每25天自转一周(赤道)',
  ]
};

export const PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    nameCN: '水星',
    description: '水星是太阳系中最小且最靠近太阳的行星，也是太阳系中轨道偏心率最大的行星。',
    radius: 0.383,
    mass: 0.055,
    density: 5.427,
    gravity: 0.378,
    orbitalElements: {
      semiMajorAxis: 0.38709927,
      eccentricity: 0.20563593,
      inclination: 7.00497902,
      longitudeOfAscendingNode: 48.33076593,
      argumentOfPerihelion: 29.12703035,
      meanAnomalyAtEpoch: 174.796,
      orbitalPeriod: 87.969,
    },
    rotationPeriod: 1407.6,
    axialTilt: 0.034,
    color: '#B7B8B9',
    glowColor: '#8C8C8C',
    textureUrl: '/textures/mercury.jpg',
    moons: 0,
    atmosphere: [],
    facts: [
      '水星上一天等于176个地球日',
      '温差可达600°C',
      '没有大气层保护',
      '表面布满陨石坑',
    ],
  },
  {
    id: 'venus',
    name: 'Venus',
    nameCN: '金星',
    description: '金星是太阳系中最热的行星，有浓密的大气层和极端的温室效应。',
    radius: 0.949,
    mass: 0.815,
    density: 5.243,
    gravity: 0.907,
    orbitalElements: {
      semiMajorAxis: 0.72333566,
      eccentricity: 0.00677672,
      inclination: 3.39467605,
      longitudeOfAscendingNode: 76.67984255,
      argumentOfPerihelion: 54.85229058,
      meanAnomalyAtEpoch: 50.115,
      orbitalPeriod: 224.701,
    },
    rotationPeriod: -5832.5, // 负值表示逆向自转
    axialTilt: 177.36,
    color: '#E6C87A',
    glowColor: '#FFA500',
    textureUrl: '/textures/venus.jpg',
    moons: 0,
    atmosphere: ['CO₂ (96.5%)', 'N₂ (3.5%)'],
    facts: [
      '金星逆向自转',
      '表面温度约465°C',
      '大气压是地球的92倍',
      '被称为地球的"姐妹行星"',
    ],
  },
  {
    id: 'earth',
    name: 'Earth',
    nameCN: '地球',
    description: '地球是太阳系中已知唯一存在生命的行星，拥有液态水和适宜生命的大气层。',
    radius: 1,
    mass: 1,
    density: 5.514,
    gravity: 1,
    orbitalElements: {
      semiMajorAxis: 1.00000261,
      eccentricity: 0.01671123,
      inclination: 0.00005,
      longitudeOfAscendingNode: -11.26064,
      argumentOfPerihelion: 102.94719,
      meanAnomalyAtEpoch: 357.529,
      orbitalPeriod: 365.256,
    },
    rotationPeriod: 23.934,
    axialTilt: 23.44,
    color: '#6B93D6',
    glowColor: '#4169E1',
    textureUrl: '/textures/earth.jpg',
    moons: 1,
    atmosphere: ['N₂ (78%)', 'O₂ (21%)', 'Ar (0.9%)'],
    facts: [
      '地球是太阳系中密度最大的行星',
      '71%的表面被水覆盖',
      '拥有保护生命的磁场',
      '唯一已知存在生命的星球',
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    nameCN: '火星',
    description: '火星被称为"红色星球"，是人类探索最多的行星之一，可能曾经有液态水存在。',
    radius: 0.532,
    mass: 0.107,
    density: 3.934,
    gravity: 0.377,
    orbitalElements: {
      semiMajorAxis: 1.52371034,
      eccentricity: 0.09339410,
      inclination: 1.84969142,
      longitudeOfAscendingNode: 49.55953891,
      argumentOfPerihelion: 286.5016,
      meanAnomalyAtEpoch: 19.373,
      orbitalPeriod: 686.980,
    },
    rotationPeriod: 24.623,
    axialTilt: 25.19,
    color: '#E27B58',
    glowColor: '#CD5C5C',
    textureUrl: '/textures/mars.jpg',
    moons: 2,
    atmosphere: ['CO₂ (95.3%)', 'N₂ (2.7%)', 'Ar (1.6%)'],
    facts: [
      '拥有太阳系最高的山峰-奥林帕斯山',
      '一天约24小时37分钟',
      '有两颗小卫星：火卫一和火卫二',
      '表面有巨大的峡谷系统',
    ],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    nameCN: '木星',
    description: '木星是太阳系中最大的行星，质量是其他所有行星总和的2.5倍。著名的大红斑是一个持续了数百年的巨大风暴。',
    radius: 11.209,
    mass: 317.8,
    density: 1.326,
    gravity: 2.528,
    orbitalElements: {
      semiMajorAxis: 5.20288700,
      eccentricity: 0.04838624,
      inclination: 1.30439695,
      longitudeOfAscendingNode: 100.47390909,
      argumentOfPerihelion: 273.867,
      meanAnomalyAtEpoch: 20.020,
      orbitalPeriod: 4332.59,
    },
    rotationPeriod: 9.925,
    axialTilt: 3.13,
    color: '#D8CA9D',
    glowColor: '#DAA520',
    textureUrl: '/textures/jupiter.jpg',
    moons: 95,
    atmosphere: ['H₂ (89.8%)', 'He (10.2%)'],
    facts: [
      '木星一天不到10小时',
      '大红斑可以容纳2-3个地球',
      '拥有太阳系最强的磁场',
      '有95颗已知卫星',
    ],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    nameCN: '土星',
    description: '土星以其壮观的环系统而闻名，是太阳系中第二大行星。土星的密度低于水，理论上可以漂浮在水面上。',
    radius: 9.449,
    mass: 95.16,
    density: 0.687,
    gravity: 1.065,
    orbitalElements: {
      semiMajorAxis: 9.53667594,
      eccentricity: 0.05386179,
      inclination: 2.48599187,
      longitudeOfAscendingNode: 113.66242448,
      argumentOfPerihelion: 339.392,
      meanAnomalyAtEpoch: 317.020,
      orbitalPeriod: 10759.22,
    },
    rotationPeriod: 10.656,
    axialTilt: 26.73,
    color: '#F4D59E',
    glowColor: '#F0E68C',
    textureUrl: '/textures/saturn.jpg',
    hasRings: true,
    ringColor: '#C9B896',
    moons: 146,
    atmosphere: ['H₂ (96.3%)', 'He (3.25%)'],
    facts: [
      '土星环主要由冰块组成',
      '密度比水还低',
      '风速可达1800公里/小时',
      '泰坦是其最大的卫星，有浓厚大气',
    ],
  },
  {
    id: 'uranus',
    name: 'Uranus',
    nameCN: '天王星',
    description: '天王星是一颗冰巨星，独特之处在于它的自转轴几乎平行于公转轨道面，像是"躺着"转动。',
    radius: 4.007,
    mass: 14.54,
    density: 1.270,
    gravity: 0.886,
    orbitalElements: {
      semiMajorAxis: 19.18916464,
      eccentricity: 0.04725744,
      inclination: 0.77263783,
      longitudeOfAscendingNode: 74.01692503,
      argumentOfPerihelion: 96.998857,
      meanAnomalyAtEpoch: 142.238,
      orbitalPeriod: 30688.5,
    },
    rotationPeriod: -17.24, // 逆向自转
    axialTilt: 97.77,
    color: '#B5E3E3',
    glowColor: '#40E0D0',
    textureUrl: '/textures/uranus.jpg',
    hasRings: true,
    ringColor: '#87CEEB',
    moons: 28,
    discoveryYear: 1781,
    discoverer: 'William Herschel',
    atmosphere: ['H₂ (82.5%)', 'He (15.2%)', 'CH₄ (2.3%)'],
    facts: [
      '轴倾角接近98度，几乎"躺着"转',
      '是太阳系中最冷的行星',
      '公转一周需要84年',
      '1781年被威廉·赫歇尔发现',
    ],
  },
  {
    id: 'neptune',
    name: 'Neptune',
    nameCN: '海王星',
    description: '海王星是太阳系最远的行星，拥有太阳系中最强的风暴和最快的风速。',
    radius: 3.883,
    mass: 17.15,
    density: 1.638,
    gravity: 1.137,
    orbitalElements: {
      semiMajorAxis: 30.06992276,
      eccentricity: 0.00859048,
      inclination: 1.77004347,
      longitudeOfAscendingNode: 131.78422574,
      argumentOfPerihelion: 276.336,
      meanAnomalyAtEpoch: 256.228,
      orbitalPeriod: 60182,
    },
    rotationPeriod: 16.11,
    axialTilt: 28.32,
    color: '#5B5DDF',
    glowColor: '#4169E1',
    textureUrl: '/textures/neptune.jpg',
    hasRings: true,
    ringColor: '#6495ED',
    moons: 16,
    discoveryYear: 1846,
    discoverer: 'Johann Galle',
    atmosphere: ['H₂ (80%)', 'He (19%)', 'CH₄ (1%)'],
    facts: [
      '风速可达2100公里/小时',
      '公转一周需要165年',
      '是第一颗通过数学预测发现的行星',
      '拥有太阳系中最大的卫星之一—海卫一',
    ],
  },
];

// 矮行星数据
export const DWARF_PLANETS = [
  {
    id: 'pluto',
    name: 'Pluto',
    nameCN: '冥王星',
    description: '冥王星曾被认为是第九大行星，2006年被重新分类为矮行星。',
    radius: 0.186,
    mass: 0.0022,
    orbitalElements: {
      semiMajorAxis: 39.48211675,
      eccentricity: 0.24882730,
      inclination: 17.14001206,
      longitudeOfAscendingNode: 110.30393684,
      argumentOfPerihelion: 113.834,
      meanAnomalyAtEpoch: 14.53,
      orbitalPeriod: 90560,
    },
    rotationPeriod: -153.3,
    axialTilt: 122.53,
    color: '#D2B48C',
    glowColor: '#C4A574',
    textureUrl: '/textures/pluto.jpg',
    moons: 5,
    discoveryYear: 1930,
    discoverer: 'Clyde Tombaugh',
  },
];

// 小行星带数据
export const ASTEROID_BELT = {
  innerRadius: 2.2,  // AU
  outerRadius: 3.2,  // AU
  count: 1000,       // 可视化的小行星数量
};

// 柯伊伯带数据
export const KUIPER_BELT = {
  innerRadius: 30,   // AU
  outerRadius: 50,   // AU
  count: 500,
};

// 彗星数据接口
export interface CometData {
  id: string;
  name: string;
  nameCN: string;
  description: string;
  
  // 轨道参数
  orbitalElements: {
    semiMajorAxis: number;
    eccentricity: number;
    inclination: number;
    longitudeOfAscendingNode: number;
    argumentOfPerihelion: number;
    meanAnomalyAtEpoch: number;
    orbitalPeriod: number;
  };
  
  // 视觉属性
  color: string;
  tailColor: string;
  coreSize: number;  // 核心大小
  
  // 信息
  discoveryYear?: number;
  discoverer?: string;
  lastPerihelion?: string;  // 上次近日点时间
  nextPerihelion?: string;  // 下次近日点时间
}

// 著名彗星数据
export const COMETS: CometData[] = [
  {
    id: 'halley',
    name: "Halley's Comet",
    nameCN: '哈雷彗星',
    description: '最著名的短周期彗星，约每76年回归一次。自古以来就有观测记录。',
    orbitalElements: {
      semiMajorAxis: 17.834,
      eccentricity: 0.96714,
      inclination: 162.26,
      longitudeOfAscendingNode: 58.42,
      argumentOfPerihelion: 111.33,
      meanAnomalyAtEpoch: 38.38,  // 2000年历元
      orbitalPeriod: 27510,  // 约75.3年
    },
    color: '#E8E8E8',
    tailColor: '#87CEEB',
    coreSize: 0.08,
    discoveryYear: -240,
    discoverer: '古代天文学家',
    lastPerihelion: '1986-02-09',
    nextPerihelion: '2061-07-28',
  },
  {
    id: 'hale-bopp',
    name: 'Hale-Bopp',
    nameCN: '海尔-波普彗星',
    description: '20世纪最壮观的彗星之一，1997年肉眼可见长达18个月。',
    orbitalElements: {
      semiMajorAxis: 186.0,
      eccentricity: 0.995,
      inclination: 89.4,
      longitudeOfAscendingNode: 282.47,
      argumentOfPerihelion: 130.59,
      meanAnomalyAtEpoch: 180.0,
      orbitalPeriod: 926000,  // 约2533年
    },
    color: '#FFFACD',
    tailColor: '#FFD700',
    coreSize: 0.1,
    discoveryYear: 1995,
    discoverer: 'Alan Hale, Thomas Bopp',
    lastPerihelion: '1997-04-01',
    nextPerihelion: '4530',
  },
  {
    id: 'encke',
    name: "Encke's Comet",
    nameCN: '恩克彗星',
    description: '已知周期最短的彗星，约3.3年回归一次。',
    orbitalElements: {
      semiMajorAxis: 2.215,
      eccentricity: 0.847,
      inclination: 11.76,
      longitudeOfAscendingNode: 334.57,
      argumentOfPerihelion: 186.54,
      meanAnomalyAtEpoch: 190.0,
      orbitalPeriod: 1204,  // 约3.3年
    },
    color: '#D3D3D3',
    tailColor: '#98FB98',
    coreSize: 0.05,
    discoveryYear: 1786,
    discoverer: 'Pierre Méchain',
    lastPerihelion: '2023-10-22',
    nextPerihelion: '2027-02-21',
  },
  {
    id: 'swift-tuttle',
    name: 'Swift-Tuttle',
    nameCN: '斯威夫特-塔特尔彗星',
    description: '英仙座流星雨的母体彗星，周期约133年。',
    orbitalElements: {
      semiMajorAxis: 26.092,
      eccentricity: 0.9632,
      inclination: 113.45,
      longitudeOfAscendingNode: 139.38,
      argumentOfPerihelion: 152.98,
      meanAnomalyAtEpoch: 100.0,
      orbitalPeriod: 48650,  // 约133年
    },
    color: '#F5F5DC',
    tailColor: '#FF6347',
    coreSize: 0.07,
    discoveryYear: 1862,
    discoverer: 'Lewis Swift, Horace Tuttle',
    lastPerihelion: '1992-12-12',
    nextPerihelion: '2126-07-12',
  },
  {
    id: 'tempel-1',
    name: 'Tempel 1',
    nameCN: '坦普尔1号彗星',
    description: 'NASA深度撞击任务的目标彗星，周期约5.5年。',
    orbitalElements: {
      semiMajorAxis: 3.138,
      eccentricity: 0.5175,
      inclination: 10.53,
      longitudeOfAscendingNode: 68.93,
      argumentOfPerihelion: 178.93,
      meanAnomalyAtEpoch: 150.0,
      orbitalPeriod: 2030,  // 约5.56年
    },
    color: '#C0C0C0',
    tailColor: '#ADD8E6',
    coreSize: 0.04,
    discoveryYear: 1867,
    discoverer: 'Wilhelm Tempel',
    lastPerihelion: '2022-03-04',
    nextPerihelion: '2027-09-01',
  },
];

export type CelestialBody = typeof SUN_DATA | PlanetData;

