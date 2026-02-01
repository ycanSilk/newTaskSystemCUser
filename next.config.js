/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
  eslint: {
    // 禁用Next.js默认的lint配置，使用项目自定义配置
    ignoreDuringBuilds: true
  },
  experimental: {
    typedRoutes: true,
    // 启用滚动恢复
    scrollRestoration: true,
  },
  // 构建优化
  productionBrowserSourceMaps: false, // 生产环境不生成source maps
  swcMinify: true, // 使用SWC进行代码压缩
  output: 'standalone', // 生成独立的输出目录
  // API代理配置，用于解决跨域问题
  // 统一开发环境和生产环境的API代理配置
  async rewrites() {
    // 使用统一的API地址，确保环境一致性
    const apiBaseUrl = process.env.API_BASE_URL || 'http://134.122.136.221:4667/api';
    
    return [
      { source: '/api/users/me', destination: '/api/users/me' }, // 不转发到外部服务器
      { source: '/api/users/register', destination: `${apiBaseUrl}/api/users/register` },
      { source: '/api/users/login', destination: `${apiBaseUrl}/api/users/login` },
      { source: '/api/users', destination: `${apiBaseUrl}/api/users` },
      { source: '/api/:path*', destination: `${apiBaseUrl}/api/:path*` },
    ]
  },
  // H5移动端优化
  compiler: {
    // 保留所有环境的日志输出，便于调试和问题排查
    removeConsole: process.env.NODE_ENV === 'production', // 生产环境移除console
  },
  // 图片优化
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.douyin.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.douyin-task.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60, // 图片缓存时间
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // PWA支持准备
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Cache-Control',
            value: isDevelopment 
              ? 'no-store, no-cache, must-revalidate, proxy-revalidate' 
              : 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: isDevelopment ? 'no-cache' : 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          // 添加安全相关的头部
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:",
          },
        ],
      },
      // 对静态资源文件设置不同的缓存策略
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 对图片等媒体资源设置缓存策略
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // 环境变量
  env: {
    CUSTOM_APP_NAME: '抖音派单系统',
    CUSTOM_APP_VERSION: '2.0.0',
  },
  // 自定义webpack配置
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 添加构建时间戳
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BUILD_TIMESTAMP': JSON.stringify(new Date().toISOString()),
      })
    );
    
    // 优化模块解析
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    
    return config;
  },
};

module.exports = nextConfig;