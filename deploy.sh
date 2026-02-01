#!/bin/bash

# 抖音评论派单系统 - 部署脚本

# 显示执行的命令
set -x

echo "===================================="
echo "开始部署抖音评论派单系统"
echo "===================================="

# 检查Node.js版本
NODE_VERSION=$(node -v)
echo "当前Node.js版本: $NODE_VERSION"

if [[ "$NODE_VERSION" != v18* && "$NODE_VERSION" != v19* && "$NODE_VERSION" != v20* ]]; then
  echo "错误: 需要Node.js v18.0.0或更高版本"
  exit 1
fi

# 检查npm版本
NPM_VERSION=$(npm -v)
echo "当前npm版本: $NPM_VERSION"

# 清除旧的构建文件
echo "清除旧的构建文件..."
rimraf .next
rimraf node_modules/.cache

# 安装依赖
echo "安装项目依赖..."
npm install

if [ $? -ne 0 ]; then
  echo "错误: 依赖安装失败"
  exit 1
fi

# 构建项目
echo "构建项目..."
npm run build:clean

if [ $? -ne 0 ]; then
  echo "错误: 项目构建失败"
  exit 1
fi

# 检查构建结果
if [ ! -d ".next/standalone" ]; then
  echo "错误: 构建结果中缺少standalone目录"
  exit 1
fi

echo "===================================="
echo "部署完成！"
echo "===================================="
echo "可以使用以下命令启动服务:"
echo "1. npm run start"
echo "2. NODE_ENV=production node .next/standalone/server.js"
echo "3. 使用PM2管理: pm2 start .next/standalone/server.js --name "douyin-task-system" --env production"
