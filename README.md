# 传统色名浏览器

一个基于 Vue 3 的中国传统色名浏览与查询工具。

## 功能特性

- 🎨 浏览丰富的中国传统色彩
- 🔍 支持颜色名称搜索与筛选
- ⭐ 收藏喜欢的颜色
- 🎲 随机发现有趣的传统色
- 📊 颜色统计概览
- 📱 响应式设计，适配移动端

## 技术栈

- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **UI 组件库**: Naive UI
- **路由**: Vue Router
- **搜索**: Fuse.js

## 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

## 安装依赖

```bash
npm install
```

## 本地启动

```bash
npm run dev
```

启动成功后，访问 http://localhost:5101 即可浏览应用。

## 类型检查与构建

```bash
npm run build
```

该命令会先执行 TypeScript 类型检查，类型检查通过后再执行生产环境构建。构建产物将输出到 `dist` 目录。

## 本地预览构建产物

```bash
npm run preview
```

该命令会启动一个本地静态服务器，预览生产构建的结果。

## 持续集成

项目已配置 GitHub Actions 自动化流水线，在以下场景会自动触发：

- 向 `main` 或 `master` 分支推送代码
- 向 `main` 或 `master` 分支发起合并请求（Pull Request）

流水线会自动执行：
1. 安装依赖
2. TypeScript 类型检查
3. 生产环境构建

若类型检查或构建失败，流水线日志中将输出明确的中文错误摘要。
