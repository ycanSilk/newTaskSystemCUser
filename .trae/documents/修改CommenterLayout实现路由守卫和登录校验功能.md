## 修改CommenterLayout实现路由守卫和登录校验功能

### 1. 文件关系分析
- **`Providers.tsx`**：应用级上下文提供者，负责全局功能（Toast消息、用户信息初始化）
- **`AuthGuard.tsx`**：路由守卫组件，保护需要登录的页面，检查用户权限
- **`middleware.ts`**：Next.js中间件，处理路由加密/解密和Token验证
- **`useUser.ts`**：用户状态管理钩子，获取和管理用户登录状态
- **`CommenterLayout`**：评论员布局组件，需要添加路由守卫功能

### 2. 修改目标
- 导入`AuthGuard`组件
- 修改认证页面判断逻辑，确保全面覆盖
- 使用`AuthGuard`保护非认证页面，设置`requiredRole="commenter"`
- 添加`Suspense`组件处理加载状态
- 简化用户状态管理，移除本地状态

### 3. 具体修改步骤
1. **导入必要组件**：
   - 导入`AuthGuard`组件
   - 导入`Suspense`组件

2. **修改认证页面判断逻辑**：
   - 参考PublisherLayout的实现，扩展认证页面判断条件
   - 确保覆盖加密路由情况

3. **使用AuthGuard保护非认证页面**：
   - 在非认证页面外层包裹`AuthGuard`组件
   - 设置`requiredRole="commenter"`

4. **添加Suspense组件**：
   - 用`Suspense`包裹子组件，添加加载状态

5. **简化用户状态管理**：
   - 移除本地`user`和`isLoading`状态
   - 使用`useUser`钩子替代（如果需要）

6. **保持原有布局结构**：
   - 确保导航栏和头部只在非认证页面显示
   - 保持底部导航栏的显示逻辑

### 4. 预期效果
- 认证页面（登录、注册）不显示导航栏和头部
- 非认证页面需要登录才能访问，未登录时显示登录提示
- 登录后验证用户角色，确保只有评论员角色可以访问
- 实现完整的路由守卫功能，与PublisherLayout保持一致

### 5. 修改后代码结构
```typescript
'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import TopNavigationBar from './components/TopNavigationBar';
import BottomNavigationBar from './components/BottomNavigationBar';
// 导入AuthGuard组件
import { AuthGuard } from '@/components/providers/AuthGuard';

export default function CommenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // 判断是否为认证页面
  const isAuthPage = pathname?.includes('/auth/') || 
                   pathname?.includes('/login') || 
                   pathname?.includes('/register');
  
  // 认证页面直接渲染内容，不显示导航栏
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }
  
  // 非认证页面使用AuthGuard保护
  return (
    <AuthGuard requiredRole="commenter">
      <div className="min-h-screen bg-gray-50">
        {/* 顶部导航栏 */}
        <TopNavigationBar />
        
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
```