'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
// 导入检查支付密码API类型定义
import { CheckWalletPwdResponse } from '../app/types/paymentWallet/checkWalletPwdTypes';

const PaymentPasswordCheck = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, fetchUser } = useUserStore();
  
  // 支付密码校验状态
  const [isChecking, setIsChecking] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  // 记录用户是否已设置支付密码，避免重复校验
  const [hasSetPaymentPassword, setHasSetPaymentPassword] = useState(false);
  
  // 公共路径，不需要校验支付密码
  const publicPaths = ['/commenter/auth/login', '/commenter/auth/register', '/commenter/profile/paymentsettings/setpaymentpwd'];
  
  // 检查是否需要校验支付密码
  const shouldCheckPaymentPassword = () => {
    // 已登录用户、不在公共路径、且未记录已设置支付密码
    const shouldCheck = currentUser && !publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`)) && !hasSetPaymentPassword;
    console.log('shouldCheckPaymentPassword:', shouldCheck, 'currentUser:', currentUser?.id, 'pathname:', pathname, 'hasSetPaymentPassword:', hasSetPaymentPassword);
    return shouldCheck;
  };
  
  // 检查支付密码
  const checkWalletPassword = async () => {
    if (isChecking || !shouldCheckPaymentPassword()) {
      console.log('跳过检查支付密码:', { isChecking, shouldCheck: shouldCheckPaymentPassword() });
      return;
    }
    
    setIsChecking(true);
    console.log('开始检查支付密码...');
    
    try {
      // 调用检查支付密码API
      const response = await fetch('/api/paymentWallet/checkWalletPwd', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result: CheckWalletPwdResponse = await response.json();
      
      console.log('检查支付密码API返回结果:', result);
      
      // 如果请求成功
      if (result.code === 0) {
        // 直接基于API响应结果控制模态框显示
        if (!result.data.has_password) {
          console.log('用户未设置支付密码，显示提示');
          setShowPasswordModal(true);
        } else {
          console.log('用户已设置支付密码，记录状态并停止重复校验');
          setShowPasswordModal(false);
          // 记录用户已设置支付密码，避免重复校验
          setHasSetPaymentPassword(true);
        }
      } else {
        console.error('检查支付密码API返回错误:', result.message);
        // API返回错误时，不显示模态框
        setShowPasswordModal(false);
      }
    } catch (error) {
      console.error('检查支付密码失败:', error);
      // 发生异常时，不显示模态框
      setShowPasswordModal(false);
    } finally {
      setIsChecking(false);
      console.log('检查支付密码结束');
    }
  };
  
  // 处理确认按钮点击
  const handleConfirm = () => {
    setShowPasswordModal(false);
    console.log('用户点击立即设置，跳转到设置支付密码页面');
    // 跳转到设置支付密码页面
    router.push('/commenter/profile/paymentsettings/setpaymentpwd');
  };
  
  // 处理取消按钮点击
  const handleCancel = () => {
    console.log('用户点击稍后设置，关闭模态框');
    setShowPasswordModal(false);
  };
  
  // 当用户信息变化、路径变化或页面重新加载时，检查支付密码
  useEffect(() => {
    // 延迟检查，确保页面完全加载
    const timer = setTimeout(() => {
      console.log('useEffect触发，检查支付密码');
      // 如果还没有用户信息，先获取用户信息
      if (!currentUser) {
        console.log('没有用户信息，调用fetchUser');
        fetchUser();
      } else {
        // 有用户信息时，检查支付密码
        checkWalletPassword();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentUser, pathname, fetchUser]);
  
  // 当组件重新挂载时，重置检查状态，确保每次页面加载都能重新检查
  useEffect(() => {
    console.log('组件重新挂载，重置检查状态');
    // 重置状态，确保每次页面加载都能重新检查
  }, []);
  
  // 渲染模态框
  return (
    showPasswordModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
          <h3 className="text-xl font-medium mb-4 text-center">提示</h3>
          <p className="text-gray-700 mb-6 text-center">
            您尚未设置支付密码，请先设置支付密码
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
            >
              稍后设置
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              立即设置
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default PaymentPasswordCheck;