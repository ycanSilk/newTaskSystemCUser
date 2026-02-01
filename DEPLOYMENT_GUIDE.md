# 抖音评论派单系统 - 部署指南

## 项目概述

抖音评论派单系统是一个基于Next.js 14的H5移动端优先的应用，使用standalone模式进行部署，提供了高效、稳定的服务体验。

## 部署环境要求

### 服务器要求
- **操作系统**: Ubuntu 20.04+ 或 CentOS 7+ 或 Windows Server 2016+
- **Node.js**: v18.0.0+
- **内存**: 至少 2GB RAM
- **CPU**: 至少 1核
- **存储空间**: 至少 20GB 可用空间
- **网络**: 支持HTTP/HTTPS访问，开放相应端口

### 依赖项
- Node.js v18.0.0+
- npm v8.0.0+ 或 yarn v1.22.0+

## 部署步骤

### 方法一：使用standalone模式部署（推荐）

1. **在本地构建项目**
   ```bash
   # 安装依赖
   npm install
   
   # 构建项目（生成独立的standalone目录）
   npm run build:clean
   ```

2. **复制部署文件到服务器**
   ```bash
   # 复制.next/standalone目录到服务器
   scp -r .next/standalone user@server_ip:/path/to/deploy
   
   # 复制.next/static目录到服务器
   scp -r .next/static user@server_ip:/path/to/deploy/.next/
   
   # 复制public目录到服务器
   scp -r public user@server_ip:/path/to/deploy/
   ```

3. **在服务器上启动服务**
   ```bash
   # 进入部署目录
   cd /path/to/deploy
   
   # 启动服务
   NODE_ENV=production node server.js
   ```

### 方法二：完整部署（包含源码）

1. **克隆项目到服务器**
   ```bash
   git clone <repository_url> /path/to/project
   cd /path/to/project
   ```

2. **安装依赖并构建**
   ```bash
   # 安装依赖
   npm install
   
   # 构建项目
   npm run build:clean
   ```

3. **启动服务**
   ```bash
   # 启动服务
   npm run start
   ```

## 环境配置

### 环境变量

项目支持以下环境变量配置：

| 环境变量 | 描述 | 默认值 |
|---------|------|--------|
| NODE_ENV | 运行环境 | production |
| API_BASE_URL | API基础地址 | http://134.122.136.221:4667/api |
| PORT | 服务端口 | 8890（使用standalone模式时） |

### 端口配置

- 使用standalone模式时，默认端口为8890
- 如需修改端口，可在启动命令中指定：
  ```bash
  NODE_ENV=production PORT=8890 node server.js
  ```

## 启动脚本

项目提供了以下启动脚本：

| 脚本名称 | 功能 |
|---------|------|
| npm run dev | 启动开发环境 |
| npm run build | 构建生产环境 |
| npm run start | 启动生产环境（使用standalone模式） |
| npm run build:clean | 清除缓存并构建生产环境 |
| npm run start:clean | 清除缓存、构建并启动生产环境 |
| npm run deploy | 构建并启动生产环境 |
| npm run deploy:test | 构建并启动测试环境 |
| npm run deploy:prod | 构建并启动生产环境 |

## 监控与维护

### 日志管理

- 应用日志：可通过PM2或其他进程管理工具收集
- 访问日志：可通过Nginx等反向代理服务器收集

### 进程管理

推荐使用PM2进行进程管理：

```bash
# 安装PM2
npm install -g pm2

# 启动应用
npm run build:clean
npm run start

# 或使用PM2直接启动
npm run build:clean
pm2 start server.js --name "douyin-task-system" --env production

# 查看进程状态
pm2 ls

# 重启应用
pm2 restart douyin-task-system

# 停止应用
pm2 stop douyin-task-system
```

### 自动重启

使用PM2的自动重启功能：

```bash
# 启动应用并设置自动重启
npm run build:clean
pm2 start server.js --name "douyin-task-system" --env production --watch

# 设置开机自启动
pm2 startup
pm2 save
```

## 常见问题及解决方案

### 1. 端口占用

**问题**：启动服务时提示端口已被占用

**解决方案**：
- 修改启动端口：`PORT=8891 npm start`
- 查看并停止占用端口的进程：`lsof -i :8890` 然后 `kill <pid>`

### 2. 构建失败

**问题**：执行 `npm run build:clean` 时失败

**解决方案**：
- 检查依赖是否完整：`npm install`
- 检查Node.js版本：`node -v`（需要v18.0.0+）
- 清除缓存：`rimraf .next node_modules/.cache` 然后重新构建

### 3. 服务启动后无法访问

**问题**：服务已启动，但浏览器无法访问

**解决方案**：
- 检查服务器防火墙是否开放相应端口
- 检查服务是否绑定了正确的IP地址：`netstat -tlnp | grep node`
- 检查API地址配置是否正确

### 4. 图片上传失败

**问题**：上传图片时失败

**解决方案**：
- 检查服务器存储空间是否充足
- 检查临时目录权限：`chmod 755 /tmp`
- 检查API代理配置是否正确

## 性能优化建议

1. **使用CDN加速静态资源**
   - 将.next/static目录部署到CDN
   - 配置CDN缓存策略

2. **使用反向代理**
   - 配置Nginx或Apache作为反向代理
   - 启用HTTPS
   - 配置Gzip压缩

3. **数据库优化**
   - 使用连接池
   - 优化查询语句
   - 定期清理无用数据

4. **应用优化**
   - 启用浏览器缓存
   - 优化图片大小和格式
   - 使用代码分割减少初始加载时间

## 版本管理

- 每次部署前执行 `npm run type-check` 和 `npm run lint` 确保代码质量
- 记录部署版本和时间，便于回滚
- 定期备份数据库和配置文件

## 回滚操作

1. **停止当前服务**
   ```bash
   npm stop
   ```

2. **恢复之前的部署文件**
   ```bash
   # 恢复备份的standalone目录
   cp -r /path/to/backup/standalone/* /path/to/deploy/
   ```

3. **重新启动服务**
   ```bash
   npm start
   ```

## 联系与支持

- 技术支持：[your-email@example.com]
- 项目文档：[project-documentation-url]
- 问题反馈：[issue-tracker-url]

---

**部署完成后，请访问 http://your-server-ip 或 https://your-domain 查看应用**
