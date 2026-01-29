'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserOutlined } from '@ant-design/icons';
import { CustomerServiceButton } from '../../../components/button/CustomerServiceButton';
import SearchBar from '../../../components/button/SearchBar';
import { BellOutlined } from '@ant-design/icons';
// 导入useUser钩子
import { useUser } from '@/hooks/useUser';

// 定义路由表，映射路径到标题
const routeTitleMap: Record<string, string> = {
  '/commenter/hall': '评论抢单',
  '/commenter/tasks': '评论进行',
  '/commenter/invite': '邀请分佣',
  '/commenter/profile': '个人中心',
  '/commenter/profile/userinfo': '个人信息',
  '/commenter/profile/paymentsettings': '支付设置',
  '/commenter/notification': '通知提醒',
  '/commenter/customer-service': '联系客服',
  '/commenter/balance': '账户余额',
  '/commenter/withdrawal/withdrawalList': '提现明细',
  '/commenter/earnings/overview': '收益概览',
  '/commenter/earnings/order-earnings': '订单收益',
  '/commenter/earnings/withdraw': '提现管理',
  '/commenter/douyin-version': '抖音版本下载'
  // 可以根据需要添加更多路由
};

interface TopNavigationBarProps {
  user: any | null;
}

export default function TopNavigationBar({ user }: TopNavigationBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 使用useUser钩子获取用户信息，包括unread_count
  const { user: userWithUnreadCount } = useUser();
  
  // 点击外部关闭下拉菜单 - 确保只有一个事件监听器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    // 监听全局点击事件
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // 清理事件监听器
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 获取当前路径的标题
  const getCurrentTitle = () => {
    // 移除查询参数，只匹配路径部分
    const pathWithoutQuery = pathname.split('?')[0];
    
    // 精确匹配
    if (routeTitleMap[pathWithoutQuery]) {
      return routeTitleMap[pathWithoutQuery];
    }
    
    // 尝试匹配父路径
    const pathParts = pathWithoutQuery.split('/').filter(Boolean);
    for (let i = pathParts.length; i > 0; i--) {
      const parentPath = '/' + pathParts.slice(0, i).join('/');
      if (routeTitleMap[parentPath]) {
        return routeTitleMap[parentPath];
      }
    }
    
    // 默认标题
    return '接单中心';
  };

  // 处理返回按钮点击事件
  const handleBack = () => {
    // 使用浏览器级别的history.back()
    window.history.back();
  };

  // 检查是否显示返回按钮
  const shouldShowBackButton = () => {
    // 默认显示返回按钮，只有特殊路由隐藏
    const specialRoutes = [
      '/commenter/hall',
      '/commenter/tasks',
      '/commenter/invite',
      '/commenter/profile'
    ];
    
    // 检查是否为特殊路由
    for (const route of specialRoutes) {
      if (pathname === route || pathname.startsWith(route + '?')) {
        return false;
      }
    }
    
    return true;
  };

  const handleLogout = async () => {
    try {
      // 调用退出登录API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' // 包含Cookie信息
      });
      if(response.ok){console.log('退出登录成功')}
      // 解析响应数据
      const data = await response.json();

      const clearAllAuth = () => {
        if (typeof localStorage !== 'undefined') {
          try {
            localStorage.removeItem('commenter_user_info');
            localStorage.removeItem('commenter_active_session');
            localStorage.removeItem('commenter_active_session_last_activity');
          } catch (error) {
            console.error('清除认证信息失败:', error);
          }
        }
      };
      
      // 无论成功还是失败，都清除本地认证状态并跳转登录页
      // 在实际应用中，可以根据响应状态提供不同的用户反馈
      if (data.success) {
        console.log('退出登录成功', data);
        clearAllAuth();
      } else {
        console.warn('退出登录时遇到问题', data);
        // 即使API返回错误，也继续执行本地登出逻辑
      }

      
    } catch (error) {
      console.error('退出登录请求失败', error);
      // 即使请求失败，也执行本地登出逻辑
    } finally {
      // 清除本地状态并跳转到登录页面
      router.push('/commenter/auth/login');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-500 text-white px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-2">
        {shouldShowBackButton() && (
          <button 
            onClick={handleBack} 
            className="text-white p-1 hover:bg-blue-600 rounded-full"
            aria-label="返回"
          >
            <span className="sr-only">返回</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex items-center space-x-1">
          {isClient && <span className="text-xl font-medium">{getCurrentTitle()}</span>}
        </div>
      </div>
      <div className="flex items-center space-x-3" ref={dropdownRef}>
        <CustomerServiceButton 
          buttonText="联系客服" 
          modalTitle="在线客服"
          CustomerServiceId="admin"
          className="text-white"
        />
      
        <div className="mr-2 relative">
          {/* 通知图标按钮，点击跳转到通知页面 */}
          <button
            onClick={() => router.push('/commenter/notification')}
            className="cursor-pointer hover:bg-blue-600 rounded-full p-1 transition-colors"
            aria-label="通知"
          >
            <BellOutlined className="text-3xl text-white" />
          </button>
          {/* 通知数量提示，只有当unread_count大于0时显示 */}
          {userWithUnreadCount && userWithUnreadCount.unread_count > 0 && (
            <div className="absolute top-0 left-5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {userWithUnreadCount.unread_count}
            </div>
          )}
        </div>

        {/* 用户头像和下拉菜单 */}
        <div className="relative ml-3">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
            aria-label="用户菜单"
          >
            <img 
              src={user?.avatar || '/images/default.png'} 
              alt="用户头像" 
              className="w-full h-full rounded-full object-cover"
            />
          </button>
          
          {/* 下拉菜单 */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-[100px] bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-10 transform transition-all duration-200 origin-top-right animate-fade-in-down">
              {/* 个人中心按钮 */}
              <button 
                onClick={() => {
                  router.push('/commenter/profile/userinfo');
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-3 border-b border-gray-100 text-gray-800 font-medium text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
              >
                个人信息
              </button>
              
              {/* 退出登录按钮 */}
              <button 
                onClick={() => {
                  handleLogout();
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 text-sm"
              >
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}