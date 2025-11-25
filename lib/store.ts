import { create } from 'zustand';
import { PlanetData, PLANETS } from './planetData';

export type ViewMode = 'free' | 'follow' | 'orbit' | 'top';

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

interface SolarSystemState {
  // 当前选中的行星
  selectedPlanet: PlanetData | null;
  setSelectedPlanet: (planet: PlanetData | null) => void;
  
  // 当前日期时间
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  
  // 时间流速 (1 = 实时, 负数 = 倒退)
  timeSpeed: number;
  setTimeSpeed: (speed: number) => void;
  
  // 是否暂停
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  togglePause: () => void;
  
  // 视图模式
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  // 相机状态
  cameraState: CameraState;
  setCameraState: (state: Partial<CameraState>) => void;
  
  // 显示设置
  showOrbits: boolean;
  setShowOrbits: (show: boolean) => void;
  
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
  
  showAsteroidBelt: boolean;
  setShowAsteroidBelt: (show: boolean) => void;
  
  showAtmosphere: boolean;
  setShowAtmosphere: (show: boolean) => void;
  
  showStars: boolean;
  setShowStars: (show: boolean) => void;
  
  showComets: boolean;
  setShowComets: (show: boolean) => void;
  
  // 缩放比例
  scaleMode: 'realistic' | 'enhanced' | 'artistic';
  setScaleMode: (mode: 'realistic' | 'enhanced' | 'artistic') => void;
  
  // 轨道缩放 (用于可视化)
  orbitScale: number;
  setOrbitScale: (scale: number) => void;
  
  // 行星大小缩放
  planetScale: number;
  setPlanetScale: (scale: number) => void;
  
  // 信息面板显示
  showInfoPanel: boolean;
  setShowInfoPanel: (show: boolean) => void;
  
  // 搜索/筛选
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // 动画质量
  quality: 'low' | 'medium' | 'high' | 'ultra';
  setQuality: (quality: 'low' | 'medium' | 'high' | 'ultra') => void;
  
  // UI 可见性
  showUI: boolean;
  setShowUI: (show: boolean) => void;
  toggleUI: () => void;
  
  // 快捷选择行星
  selectPlanetById: (id: string) => void;
  selectNextPlanet: () => void;
  selectPrevPlanet: () => void;
  
  // 重置视图
  resetView: () => void;
  
  // 跳转到当前时间
  jumpToNow: () => void;
}

const defaultCameraState: CameraState = {
  position: [30, 20, 30],
  target: [0, 0, 0],
  fov: 60,
};

export const useSolarSystemStore = create<SolarSystemState>((set, get) => ({
  // 选中的行星
  selectedPlanet: null,
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  
  // 时间控制
  currentDate: new Date(),
  setCurrentDate: (date) => set({ currentDate: date }),
  
  timeSpeed: 1,
  setTimeSpeed: (speed) => set({ timeSpeed: speed }),
  
  isPaused: false,
  setIsPaused: (paused) => set({ isPaused: paused }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  
  // 视图模式
  viewMode: 'free',
  setViewMode: (mode) => set({ viewMode: mode }),
  
  // 相机
  cameraState: defaultCameraState,
  setCameraState: (state) => set((prev) => ({
    cameraState: { ...prev.cameraState, ...state }
  })),
  
  // 显示设置
  showOrbits: true,
  setShowOrbits: (show) => set({ showOrbits: show }),
  
  showLabels: false,
  setShowLabels: (show) => set({ showLabels: show }),
  
  showAsteroidBelt: false,
  setShowAsteroidBelt: (show) => set({ showAsteroidBelt: show }),
  
  showAtmosphere: false,
  setShowAtmosphere: (show) => set({ showAtmosphere: show }),
  
  showStars: true,
  setShowStars: (show) => set({ showStars: show }),
  
  showComets: true,
  setShowComets: (show) => set({ showComets: show }),
  
  // 缩放
  scaleMode: 'enhanced',
  setScaleMode: (mode) => set({ scaleMode: mode }),
  
  orbitScale: 1,
  setOrbitScale: (scale) => set({ orbitScale: scale }),
  
  planetScale: 1,
  setPlanetScale: (scale) => set({ planetScale: scale }),
  
  // 信息面板
  showInfoPanel: true,
  setShowInfoPanel: (show) => set({ showInfoPanel: show }),
  
  // 搜索
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // 质量
  quality: 'high',
  setQuality: (quality) => set({ quality: quality }),
  
  // UI
  showUI: true,
  setShowUI: (show) => set({ showUI: show }),
  toggleUI: () => set((state) => ({ showUI: !state.showUI })),
  
  // 行星选择
  selectPlanetById: (id) => {
    if (id === 'sun') {
      set({ selectedPlanet: null });
      return;
    }
    const planet = PLANETS.find(p => p.id === id);
    if (planet) {
      set({ selectedPlanet: planet });
    }
  },
  
  selectNextPlanet: () => {
    const { selectedPlanet } = get();
    if (!selectedPlanet) {
      set({ selectedPlanet: PLANETS[0] });
      return;
    }
    const currentIndex = PLANETS.findIndex(p => p.id === selectedPlanet.id);
    const nextIndex = (currentIndex + 1) % PLANETS.length;
    set({ selectedPlanet: PLANETS[nextIndex] });
  },
  
  selectPrevPlanet: () => {
    const { selectedPlanet } = get();
    if (!selectedPlanet) {
      set({ selectedPlanet: PLANETS[PLANETS.length - 1] });
      return;
    }
    const currentIndex = PLANETS.findIndex(p => p.id === selectedPlanet.id);
    const prevIndex = (currentIndex - 1 + PLANETS.length) % PLANETS.length;
    set({ selectedPlanet: PLANETS[prevIndex] });
  },
  
  // 重置
  resetView: () => set({
    selectedPlanet: null,
    viewMode: 'free',
    cameraState: defaultCameraState,
  }),
  
  jumpToNow: () => {
    const now = new Date();
    set({
      currentDate: now,
      timeSpeed: 1, // 重置为1天/秒
    });
  },
}));

