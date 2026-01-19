"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// 导入类型定义
import { GetUserInfoResponse } from '@/app/types/users/getUserInfoTypes';

export default function PersonalInfoPage() {
  const router = useRouter();
  
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
  
  // 获取用户信息函数
  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 执行API请求，调用中间件路由
      const apiUrl = '/api/users/getUserInfo';
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        signal: AbortSignal.timeout(10000),
        credentials: 'include' // 确保跨域请求时携带凭证（Cookie）
      });
      
      // 处理API响应
      if (!response.ok) {
        try {
          const errorData = await response.json();
          const errorMsg = errorData.message || `请求失败：${response.status}`;
          throw new Error(errorMsg);
        } catch (jsonError) {
          throw new Error(`请求失败：${response.status}`);
        }
      }
      
      // 解析成功响应，使用指定的类型定义
      const data: GetUserInfoResponse = await response.json();
      
      // 验证数据结构
      if (data.code === 0 && data.data) {
        const userInfo = data.data;
        
        // 更新用户信息状态
        setUserProfile({
          id: String(userInfo.id || ''),
          name: userInfo.username || '',
          phone: userInfo.phone || '',
          email: userInfo.email,
          invitationCode: userInfo.invite_code || '',
          createdAt: userInfo.created_at ? new Date(userInfo.created_at).toLocaleDateString() : '',
          avatar: '/images/default.png' // 暂时使用默认头像
        });
      } else {
        throw new Error(data.message || '获取用户信息失败');
      }
    } catch (err) {
      // 错误处理
      const errorMessage = err instanceof Error ? err.message : '获取用户信息失败';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 组件加载时执行
  useEffect(() => {
    fetchUserInfo();
  }, []);
  
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
    router.back();
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
      {/* 个人信息表单 */}
      {userProfile.id && (
        <div className="mt-4 bg-white shadow-sm">
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