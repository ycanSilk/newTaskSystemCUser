// 用户信息状态管理
import { create } from 'zustand';
// 导入用户信息类型定义
import { User } from '@/types';
// 导入获取用户信息的API类型定义
import { GetUserInfoResponse } from '@/types/getUserInfo/getUserInfoTypes';
// 导入路由解密工具函数
import { decryptRoute, isEncryptedRoute } from '@/lib/routeEncryption';

// 定义Store的状态和方法
interface UserState {
  // 状态 (State)
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;

  // 方法 (Actions)
  // 用于设置用户信息
  setUser: (user: User) => void;
  // 用于清除用户信息（登出时用）
  clearUser: () => void;
  // 用于获取用户信息，如果内存中没有，则从API获取
  fetchUser: () => Promise<void>;
}

// 创建并导出Zustand store
export const useUserStore = create<UserState>((set, get) => ({
  // 初始状态
  currentUser: null,
  isLoading: false,
  error: null,

  // 方法的实现
  setUser: (user) => set({ currentUser: user, isLoading: false, error: null }),

  clearUser: () => set({ currentUser: null, error: null }),

  fetchUser: async () => {
    // 如果已经有用户信息了，就不再请求
    if (get().currentUser) {
      console.log('已有用户信息，跳过API调用');
      return;
    }
    
    // 检查是否在浏览器环境中
    if (typeof window !== 'undefined') {
      // 检查当前页面是否为登录或注册页面
      let currentPath = window.location.pathname;
      
      // 解密路径，以便正确判断页面类型
      const pathParts = currentPath.split('/').filter(Boolean);
      if (pathParts.length > 0 && isEncryptedRoute(pathParts[0])) {
        try {
          const decryptedPath = decryptRoute(pathParts[0]);
          const decryptedParts = decryptedPath.split('/').filter(Boolean);
          const remainingPath = pathParts.slice(1).join('/');
          currentPath = `/${decryptedParts.join('/')}${remainingPath ? `/${remainingPath}` : ''}`;
        } catch (error) {
          console.error('解密路径失败:', error);
        }
      }
      
      console.log('当前页面路径:', currentPath);
      
      // 检查是否为登录或注册页面
      const isAuthPage = currentPath.includes('/commenter/auth/login') || currentPath.includes('/commenter/auth/register');
      if (isAuthPage) {
        console.log('当前在登录注册页面，跳过API调用');
        set({ isLoading: false });
        return;
      }
      
      // 检查是否有登录相关的cookie，没有则跳过API调用
      const hasAuthCookie = document.cookie.split(';').some(cookie => 
        cookie.trim().startsWith('token=') || cookie.trim().startsWith('session_id=')
      );
      
      if (!hasAuthCookie) {
        console.log('未检测到登录cookie，跳过API调用');
        set({ isLoading: false });
        return;
      }
    }
    
    console.log('开始调用获取用户信息API');
    set({ isLoading: true, error: null });
    
    try {
      // 调用API获取用户信息
      const response = await fetch('/api/users/getUserInfo', {
        method: 'GET',
        credentials: 'include', // 包含cookie
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`获取用户信息失败: ${response.status}`);
      }
      
      const result: GetUserInfoResponse = await response.json();
      
      console.log('获取用户信息成功:', result);
      if (result.code === 0 && result.data) {
        // 将API响应数据转换为User类型
        const userData: User = {
          id: String(result.data.id || ''),
          username: result.data.username || '',
          email: result.data.email,
          phone: result.data.phone,
          role: 'commenter',
          balance: parseFloat(result.data.wallet?.balance || '0'),
          status: result.data.status === 1 ? 'active' : 'inactive',
          createdAt: result.data.created_at || new Date().toISOString(),
          updatedAt: result.data.updated_at,
          invitationCode: result.data.invite_code,
          unread_count: 0 // 默认未读消息数量
        };
        console.log('转换后的用户数据:', userData);
        // 设置用户信息到store
        set({ 
          currentUser: userData, 
          isLoading: false, 
          error: null 
        });
      } else {
        throw new Error(result.message || '获取用户信息失败');
      }
    } catch (error) {
      console.error('获取用户信息出错:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '获取用户信息失败' 
      });
    }
  },
}));
