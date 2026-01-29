'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import TopNavigationBar from './components/TopNavigationBar';
import BottomNavigationBar from './components/BottomNavigationBar';
// 导入AuthGuard组件，用于保护评论员路由
import { AuthGuard } from '@/components/providers/AuthGuard';
// 导入useUser钩子，用于获取用户信息
import { useUser } from '@/hooks/useUser';

export default function CommenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // 使用useUser钩子获取用户信息
  const { user } = useUser();
  
  // 判断是否为登录页面或认证相关页面
  // 需要考虑加密后的路径，例如 /encrypted-string/login
  const isAuthPage = pathname?.includes('/auth/') || 
                   pathname?.includes('/login') || 
                   pathname?.includes('/register') || 
                   pathname?.includes('/resetpwd');

  // 对于认证页面，直接渲染内容，不包含导航栏和头部
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }
  
  // 对于其他页面，渲染完整布局（头部、内容、底部导航）
  // 使用AuthGuard组件保护所有非认证页面
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* 顶部导航栏 */}
        <TopNavigationBar user={user} />

        {/* 主要内容区域 */}
        <main className="flex-1 pb-20">
          <Suspense fallback={<div className="w-full h-64 flex items-center justify-center">Loading...</div>}>
            {children}
          </Suspense>
        </main>

        {/* 底部导航栏 */}
        <BottomNavigationBar />
      </div>
    </AuthGuard>
  );
}