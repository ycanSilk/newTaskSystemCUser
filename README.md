# 抖音评论派单系统

## 项目概述

抖音评论派单系统是一个 H5 移动端优先的评论任务平台，旨在为用户提供评论任务接取、完成和管理的功能。系统采用 Next.js 14 + TypeScript 技术栈，具有良好的性能和用户体验。

### 核心功能

- **任务系统**：评论任务接取、完成、提交和管理
- **租赁系统**：账号租赁相关功能
- **支付系统**：账户余额管理、提现功能
- **用户系统**：用户信息管理、登录注册
- **邀请系统**：邀请好友获得收益

## 技术栈

- **前端框架**：Next.js 14 + TypeScript
- **状态管理**：Zustand
- **UI 组件库**：Ant Design
- **HTTP 客户端**：Axios
- **样式方案**：Tailwind CSS
- **构建工具**：Next.js 内置构建系统
- **部署**：支持服务器部署

## 目录结构

```
src/
├── api/             # API 相关代码
│   ├── client/      # 客户端 API 配置
│   ├── endpoints/   # API 端点定义
│   ├── handlers/    # 服务端 API 处理函数
│   └── types/       # API 类型定义
├── app/             # 应用页面和路由
│   ├── commenter/   # 评论任务相关页面
│   ├── rental/      # 租赁相关页面
│   └── api/         # API 路由处理
├── components/      # 可复用组件
│   ├── button/      # 按钮组件
│   ├── error/       # 错误处理组件
│   ├── imagesUpload/ # 图片上传组件
│   ├── layout/      # 布局组件
│   ├── skeleton/    # 骨架屏组件
│   └── ui/          # 基础 UI 组件
├── hooks/           # 自定义 React Hooks
├── lib/             # 工具库
├── store/           # 状态管理
├── types/           # 全局类型定义
└── utils/           # 工具函数
public/              # 静态资源
└── images/          # 图片资源
```

## 开发指南

### 环境要求

- Node.js 18.0.0 或更高版本
- npm 8.0.0 或更高版本

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建项目

```bash
npm run build:clean
```

### 启动生产服务器

```bash
npm run start
```

### 部署

```bash
npm run deploy
```

## API 文档

### 认证相关 API

- **登录**：`POST /api/auth/login`
- **注册**：`POST /api/auth/register`
- **登出**：`POST /api/auth/logout`
- **检查 Token**：`GET /api/auth/checkToken`

### 任务相关 API

- **获取任务列表**：`GET /api/task/getTaskPoolList`
- **接取任务**：`POST /api/task/getTaskAccept`
- **获取已接取任务列表**：`GET /api/task/getMyAccepedTaskList`
- **提交任务**：`POST /api/task/submitTask`

### 用户相关 API

- **获取用户信息**：`GET /api/users/getUserInfo`

### 钱包相关 API

- **获取钱包余额**：`GET /api/paymentWallet/getWalletBalance`
- **提现**：`POST /api/paymentWallet/postWithdrawal`
- **获取提现记录**：`GET /api/paymentWallet/getWithdrawalList`

## 组件文档

### 核心组件

- **TopNavigationBar**：顶部导航栏组件
- **BottomNavigation**：底部导航栏组件
- **ImageUpload**：图片上传组件
- **ErrorBoundary**：全局错误边界组件
- **Skeleton**：骨架屏组件
- **CopyCommentButton**：复制评论按钮组件
- **OpenVideoButton**：打开视频按钮组件

### 布局组件

- **MobileLayout**：移动端布局组件
- **EarningsHeader**：收益页面头部组件

### UI 组件

- **Button**：按钮组件
- **Input**：输入框组件
- **Toast**：提示组件
- **Alert**：警告组件
- **RadioGroup**：单选组组件

## 最佳实践

### 代码规范

- 使用 TypeScript 类型定义，减少 `any` 类型使用
- 遵循 ESLint 和 Prettier 规则
- 组件命名使用 PascalCase
- 函数命名使用 camelCase
- 常量命名使用 UPPER_SNAKE_CASE

### 性能优化

- 使用 Next.js Image 组件优化图片加载
- 实现代码分割，减少初始加载体积
- 合理使用缓存策略
- 优化 API 请求，减少不必要的请求

### 安全性

- 使用 HTTPS 协议
- 加强 API 身份验证
- 实现请求频率限制
- 避免在前端暴露敏感信息

### 响应式设计

- 使用 Tailwind CSS 的响应式类
- 优先考虑移动端体验
- 测试不同屏幕尺寸的显示效果

## 部署指南

### 服务器配置

- Node.js 18.0.0 或更高版本
- 至少 2GB RAM
- 至少 20GB 磁盘空间
- 支持 HTTPS 的域名

### 部署步骤

1. **准备服务器**：安装 Node.js 和 npm，配置防火墙
2. **克隆代码**：`git clone <repository-url>`
3. **安装依赖**：`npm install`
4. **构建项目**：`npm run build:clean`
5. **启动服务**：`npm run start`

### 环境变量

项目需要配置以下环境变量：

- `NODE_ENV`：运行环境（development/production）
- `API_BASE_URL`：API 基础 URL
- `PORT`：服务器端口

## 监控与维护

### 日志管理

- 使用 PM2 管理 Node.js 进程
- 配置日志收集和分析

### 定期维护

- 定期更新依赖
- 定期备份数据
- 监控服务器性能

## 贡献指南

1. **Fork 仓库**
2. **创建分支**：`git checkout -b feature/your-feature`
3. **提交代码**：`git commit -m "Add your feature"`
4. **推送代码**：`git push origin feature/your-feature`
5. **创建 PR**

## 许可证

MIT

## 联系我们

如有任何问题或建议，请联系我们的客服团队。
