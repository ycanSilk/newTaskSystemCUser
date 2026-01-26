"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// 导入useUserStore状态管理
import { useUserStore } from '@/store/userStore';

export default function PersonalInfoPage() {
  const router = useRouter();
  
  // 使用useUserStore获取用户信息
  const { currentUser, isLoading: storeLoading, error: storeError } = useUserStore();
  
  // 用户个人信息状态
  const [userProfile, setUserProfile] = useState({
    id: '',
    avatar: '/images/default.png',
    name: '',
    phone: '',
    email: '',
    invitationCode: '',
    createdAt: ''
  });
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 更新用户信息状态
  useEffect(() => {
    if (currentUser) {
      setUserProfile({
        id: currentUser.id || '',
        name: currentUser.username || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        invitationCode: currentUser.invitationCode || '',
        createdAt: currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : '',
        avatar: '/images/default.png' // 暂时使用默认头像
      });
      setIsLoading(false);
    } else if (storeError) {
      setError(storeError);
      setIsLoading(false);
    }
  }, [currentUser, storeError]);
  
  // 组件加载时执行
  useEffect(() => {
    // 如果store中没有用户信息，手动获取
    if (!currentUser && !storeLoading) {
      // 可以在这里添加手动获取用户信息的逻辑
      setIsLoading(false);
    }
  }, [currentUser, storeLoading]);
  
  // 手机号脱敏处理
  const maskPhone = (phone: string): string => {
    if (!phone || phone.length !== 11) return phone;
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  };

  // 处理头像上传
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 本地预览
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserProfile(prev => ({
          ...prev,
          avatar: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理返回
  const handleBack = () => {
    // 跳转到评论大厅页面
    router.push('/commenter/hall');
  };

  // 信息项组件
  const InfoItem = ({ 
    label, 
    value, 
    editable = true 
  }: { 
    label: string; 
    value: string; 
    editable?: boolean;
  }) => (
    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
      <span className="text-gray-800">{label}</span>
      <div className="flex items-center text-gray-500">
        <span className="whitespace-nowrap">{value}</span>
      </div>
    </div>
  );

  // 处理加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }
  
  // 处理错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => router.push('/commenter/auth/login')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          前往登录
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面顶部导航 */}
      <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white p-4 shadow-md z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* 返回按钮 */}
            <button 
              onClick={handleBack} 
              className="text-white p-1 hover:bg-blue-600 rounded-full"
              aria-label="返回"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {/* 页面标题 */}
            <h1 className="text-xl font-medium">个人信息</h1>
          </div>
        </div>
      </div>
      
      {/* 个人信息表单 */}
      {userProfile.id && (
        <div className="mt-20 bg-white shadow-sm mx-4 rounded-lg overflow-hidden">
          {/* 头像 */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <span className="text-gray-800">头像</span>
            <div className="relative">
              <img 
                src={userProfile.avatar} 
                alt="头像" 
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          
          {/* 名字 */}
          <InfoItem label="用户名" value={userProfile.name || '未设置'} editable={false} />

          {/* 手机号 */}
          <InfoItem label="手机号" value={maskPhone(userProfile.phone) || '未绑定'} editable={false} />

          {/* 邮箱 */}
          <InfoItem label="邮箱" value={userProfile.email || '未填写'} editable={false} />
          
          {/* 邀请码 */}
          <InfoItem label="邀请码" value={userProfile.invitationCode || '未设置'} editable={false} />

          {/* 注册时间 */}
          <InfoItem label="注册时间" value={userProfile.createdAt || '未获取'} editable={false} />

          <div onClick={() => router.push('/commenter/profile/changepwd')} className="p-4 border-b border-gray-100 bg-blue-500 hover:bg-blue-600 text-white text-center shadow">
            修改密码
          </div>
        </div>
        
      )}
    </div>
  );
}