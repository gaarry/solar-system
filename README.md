# 🌌 Solar System Explorer | 太阳系探索者

一个精美的交互式太阳系3D可视化应用，使用真实的轨道力学计算行星位置。

![Solar System Explorer](https://via.placeholder.com/800x400/0a0a1a/818cf8?text=Solar+System+Explorer)

## ✨ 特性

- 🪐 **真实轨道计算** - 基于开普勒定律和NASA JPL轨道参数
- 🎨 **精美视觉效果** - 程序化生成的行星纹理、大气层效果、光晕
- ⏱️ **时间控制** - 可以加速、减速、暂停时间，观察行星运动
- 🎯 **行星跟随** - 选择任意行星，跟随其视角观察
- 📊 **详细信息** - 展示每颗行星的物理参数、轨道信息
- ⌨️ **键盘快捷键** - 完整的键盘操作支持
- 📱 **响应式设计** - 支持各种屏幕尺寸

## 🚀 技术栈

- **框架**: Next.js 14 (App Router)
- **3D渲染**: Three.js + React Three Fiber
- **状态管理**: Zustand
- **动画**: Framer Motion
- **样式**: Tailwind CSS
- **部署**: Vercel

## 📦 安装

```bash
# 克隆仓库
git clone <your-repo-url>
cd solar-system

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 🎮 操作指南

### 鼠标操作
- **左键拖动** - 旋转视角
- **滚轮** - 缩放
- **点击行星** - 选择行星

### 键盘快捷键
| 按键 | 功能 |
|------|------|
| `Space` | 播放/暂停 |
| `← / →` | 切换行星 |
| `↑ / ↓` | 调整时间速度 |
| `H` | 显示/隐藏界面 |
| `R` | 重置视图 |
| `T` | 跳转到今天 |
| `?` | 显示帮助 |

## 🌍 行星数据

所有行星的轨道参数均来自NASA JPL (Jet Propulsion Laboratory) 的精确数据：

- **轨道六要素**: 半长轴、离心率、轨道倾角、升交点经度、近日点幅角、平近点角
- **物理参数**: 半径、质量、密度、表面重力
- **自转参数**: 自转周期、轴倾角

## 🎨 视图模式

1. **自由模式** - 自由旋转和缩放视角
2. **跟随模式** - 跟随选中行星移动
3. **环绕模式** - 围绕选中行星旋转
4. **俯视模式** - 从顶部俯瞰太阳系

## 🔧 配置选项

- **渲染质量**: 低/中/高/极致
- **显示比例**: 真实/增强/艺术
- **显示选项**: 轨道线、标签、大气层、小行星带、星空

## 📝 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 自动构建和部署

```bash
# 或使用 Vercel CLI
npm i -g vercel
vercel
```

## 🛠️ 开发

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 生产模式预览
npm run start

# 代码检查
npm run lint
```

## 📄 许可证

MIT License

## 🙏 致谢

- 轨道数据来源: NASA JPL
- 3D渲染: Three.js 社区
- UI 灵感: 现代天文应用

