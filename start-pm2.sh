#!/bin/bash

# 抖音评论派单系统 - PM2启动脚本

# 显示执行的命令
set -x

echo "===================================="
echo "启动抖音评论派单系统 (PM2)"
echo "===================================="

# 检查当前目录是否是项目根目录
if [ ! -f "package.json" ]; then
  echo "错误: 请在项目根目录执行此脚本"
  exit 1
fi

# 创建日志目录
if [ ! -d "logs" ]; then
  echo "创建日志目录..."
  mkdir -p logs
fi

# 检查PM2是否安装
if ! command -v pm2 &> /dev/null; then
  echo "安装PM2..."
  npm install -g pm2
  
  if [ $? -ne 0 ]; then
    echo "错误: PM2安装失败"
    exit 1
  fi
fi

# 检查ecosystem.config.js文件
if [ ! -f "ecosystem.config.js" ]; then
  echo "错误: 未找到ecosystem.config.js文件"
  exit 1
fi

# 检查构建文件
if [ ! -d ".next/standalone" ]; then
  echo "构建项目..."
  npm run build:clean
  
  if [ $? -ne 0 ]; then
    echo "错误: 项目构建失败"
    exit 1
  fi
fi

# 启动PM2服务
echo "启动PM2服务..."
pm2 start ecosystem.config.js

if [ $? -ne 0 ]; then
  echo "错误: PM2服务启动失败"
  exit 1
fi

# 保存PM2配置
echo "保存PM2配置..."
pm2 save

# 设置开机自启
echo "设置开机自启..."
pm2 startup

# 显示服务状态
echo "===================================="
echo "服务启动完成！"
echo "===================================="
pm2 ls

echo "===================================="
echo "日志文件位置: ./logs/"
echo "访问地址: http://localhost:8890"
echo "===================================="
