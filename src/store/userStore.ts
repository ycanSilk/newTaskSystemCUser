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
  // 新增状态
  unread_count: number; // 未读消息数量
  lastRequestTime: number; // 上次API请求时间，用于防抖

  // 方法 (Actions)
  // 用于设置用户信息
  setUser: (user: User) => void;
  // 用于清除用户信息（登出时用）
  clearUser: () => void;
  // 用于获取用户信息，如果内存中没有，则从API获取
  fetchUser: (forceRefresh?: boolean) => Promise<void>;
}

// 创建并导出Zustand store
export const useUserStore = create<UserState>((set, get) => {
  // 页面可见性监听函数，用于自动刷新用户状态
  const setupVisibilityListener = () => {
    if (typeof window === 'undefined') return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('页面变为可见，自动刷新用户状态');
        // 使用防抖机制，300ms内只执行一次
        setTimeout(() => {
          get().fetchUser(false);
        }, 300);
      }
    };
    
    // 添加事件监听器
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 返回清理函数
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  };
  
  // 初始化页面可见性监听
  const cleanupListener = setupVisibilityListener();
  
  return {
    // 初始状态
    currentUser: null,
    isLoading: false,
    error: null,
    // 新增状态的初始值
    unread_count: 0,
    lastRequestTime: 0,

    // 方法的实现
    setUser: (user) => set({ currentUser: user, isLoading: false, error: null, unread_count: user.unread_count || 0 }),

    clearUser: () => set({ currentUser: null, error: null, unread_count: 0, lastRequestTime: 0 }),

    fetchUser: async (forceRefresh = false) => {
      // 防抖机制：如果不是强制刷新且上次请求时间小于1秒，则跳过
      const now = Date.now();
      const lastRequestTime = get().lastRequestTime;
      if (!forceRefresh && now - lastRequestTime < 1000) {
        console.log('防抖机制触发，跳过API调用');
        return;
      }
      
      // 如果已经有用户信息且不是强制刷新，就不再请求
      if (get().currentUser && !forceRefresh) {
        console.log('已有用户信息且非强制刷新，跳过API调用');
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
        const isAuthPage = currentPath.includes('/commenter/auth/login') || 
                          currentPath.includes('/commenter/auth/register') ||
                          currentPath.includes('/rental/auth/login') ||
                          currentPath.includes('/rental/auth/register');
        if (isAuthPage) {
          console.log('当前在登录注册页面，跳过API调用');
          set({ isLoading: false });
          return;
        }
        
        // 检查是否有登录相关的cookie
        const hasAuthCookie = document.cookie.split(';').some(cookie => 
          cookie.trim().startsWith('token=') || cookie.trim().startsWith('session_id=')
        );
        
        // 对于accountrental和commenter目录下的页面，即使没有cookie也尝试调用API
        // 让API返回真实的认证状态
        const isAccountRentalPage = currentPath.startsWith('/rental');
        const isCommenterPage = currentPath.startsWith('/commenter');
        
        if (!hasAuthCookie && !isAccountRentalPage && !isCommenterPage) {
          console.log('未检测到登录cookie且非rental/commenter页面，跳过API调用');
          set({ isLoading: false });
          return;
        }
      }
      
      console.log('开始调用获取用户信息API');
      set({ isLoading: true, error: null });
      
      try {
        // 1. 调用checkToken API验证登录状态
        let isTokenValid = false;
        let tokenResponseUserData = null;
        
        const tokenResponse = await fetch('/api/auth/checkToken', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });
        
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          console.log('Token验证结果:', tokenData);
          
          if (tokenData.code === 0 && tokenData.data.valid) {
            isTokenValid = true;
            tokenResponseUserData = tokenData.data;
          }
        }
        
        if (!isTokenValid) {
          console.log('Token无效，清除用户信息');
          set({ 
            currentUser: null, 
            isLoading: false, 
            error: null,
            unread_count: 0,
            lastRequestTime: now
          });
          return;
        }
        
        // 2. 调用getUserInfo API获取详细用户信息
        const userInfoResponse = await fetch('/api/users/getUserInfo', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!userInfoResponse.ok) {
          throw new Error(`获取用户信息失败: ${userInfoResponse.status}`);
        }
        
        const userInfoResult: GetUserInfoResponse = await userInfoResponse.json();
        
        console.log('获取用户信息成功:', userInfoResult);
        
        if (userInfoResult.code !== 0 || !userInfoResult.data) {
          throw new Error(userInfoResult.message || '获取用户信息失败');
        }
        
        // 3. 调用getNotificationsList API获取未读消息数量
        let unreadCount = 0;
        try {
          const notificationsResponse = await fetch('/api/notifications/getNotificationsList', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          });
          
          if (notificationsResponse.ok) {
            const notificationsData = await notificationsResponse.json();
            console.log('获取通知列表成功:', notificationsData);
            
            if (notificationsData.success && notificationsData.data) {
              unreadCount = notificationsData.data.unread_count || 0;
              console.log('未读消息数量:', unreadCount);
            }
          }
        } catch (error) {
          console.error('获取未读消息数量失败:', error);
          // 即使获取未读消息数量失败，也不影响用户登录
        }
        
        // 4. 构建完整的用户数据
        const userData: User = {
          // 优先使用getUserInfo返回的数据，其次使用checkToken返回的数据
          id: String(userInfoResult.data.id || tokenResponseUserData?.user_id || ''),
          username: userInfoResult.data.username || tokenResponseUserData?.username || '',
          email: userInfoResult.data.email || tokenResponseUserData?.email || '',
          phone: userInfoResult.data.phone || '',
          role: 'commenter',
          balance: parseFloat(userInfoResult.data.wallet?.balance || '0'),
          status: userInfoResult.data.status === 1 ? 'active' : 'inactive',
          createdAt: userInfoResult.data.created_at || new Date().toISOString(),
          updatedAt: userInfoResult.data.updated_at,
          invitationCode: userInfoResult.data.invite_code || '',
          unread_count: unreadCount // 使用获取到的未读消息数量
        };
        
        console.log('转换后的完整用户数据:', userData);
        
        // 5. 设置用户信息到store
        set({ 
          currentUser: userData, 
          isLoading: false, 
          error: null,
          unread_count: unreadCount,
          lastRequestTime: now
        });
        
      } catch (error) {
        console.error('获取用户信息出错:', error);
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : '获取用户信息失败',
          lastRequestTime: Date.now()
        });
      }
    },
  };
});
