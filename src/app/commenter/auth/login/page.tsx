'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginFormData, LoginRequest, LoginApiResponse } from '../../../types/auth/loginTypes';


const getCommenterHomePath = () => '/commenter/hall';
// 表单验证规则
const validationRules = {
  username: {
    minLength: 3,
    maxLength: 10,
    pattern: /^[a-zA-Z0-9_]{3,10}$/,
    message: '用户名必须包含3-10个字符，且只能包含字母、数字和下划线'
  },
  password: {
    minLength: 6,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]{6,20}$/,
    message: '密码必须包含6-20个字符'
  },
  captcha: {
    minLength: 4,
    maxLength: 4,
    message: '验证码必须是4个字符'
  }
};

export default function CommenterLoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    captcha: ''
  });
  const [captchaCode, setCaptchaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  // 移除与登录成功提示框相关的状态
  // const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const [loginSuccessMessage, setLoginSuccessMessage] = useState('');
  const router = useRouter();

  // 生成随机验证码
  function generateCaptcha(length = 4) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // 验证单个字段
  const validateField = (fieldName: keyof LoginFormData, value: string): string => {
    if (fieldName === 'captcha') {
      if (!value.trim()) {
        return '验证码不能为空';
      }
      const rules = validationRules[fieldName];
      if (value.length < rules.minLength || value.length > rules.maxLength) {
        return rules.message;
      }
      return '';
    }
    
    const rules = validationRules[fieldName];
    
    if (!value.trim()) {
      return '此字段不能为空';
    }
    
    if (!rules) {
      return '无效的字段规则';
    }
    
    if (value.length < rules.minLength || value.length > rules.maxLength) {
      return rules.message;
    }
    
    if (!rules.pattern.test(value)) {
      return rules.message;
    }
    
    return '';
  };
  
  // 全面验证表单
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof LoginFormData, string>> = {};
    let isValid = true;
    
    // 验证所有字段，包括验证码
    Object.keys(formData).forEach(key => {
      const fieldName = key as keyof LoginFormData;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      }
    });
    
    setFieldErrors(errors);
    return isValid;
  };

  // 初始化验证码
  useEffect(() => {
    // 确保在客户端环境中运行
    if (typeof window !== 'undefined') {
      const initialCaptcha = generateCaptcha();
      setCaptchaCode(initialCaptcha);
      // 不自动填充验证码，让用户自己输入
      setFormData(prev => ({ ...prev, captcha: '' }));
    }
  }, []);

  // 自动填充测试账号（仅填充用户名和密码，不填充验证码）
  useEffect(() => {
    // 设置默认测试账号信息
    setFormData(prev => ({
      ...prev,
      username: '',
      password: '',
      // captcha 不自动填充
    }));
  }, []); // 只在组件挂载时设置一次

  // 验证码60秒自动刷新
  useEffect(() => {
    // 设置定时器，每60秒刷新一次验证码
    const interval = setInterval(() => {
      refreshCaptcha();
    }, 60000);
    // 组件卸载时清除定时器
    return () => clearInterval(interval);
  }, []);

  // 刷新验证码
  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setCaptchaCode(newCaptcha);
    // 刷新验证码时清空用户输入的验证码
    setFormData(prev => ({
      ...prev,
      captcha: ''
    }));
    // 清除验证码相关的错误提示
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.captcha;
      return newErrors;
    });
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof LoginFormData;
    
    // 更新表单数据
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // 实时验证当前字段，包括验证码
    const error = validateField(fieldName, value);
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validateForm()) {
      return;
    }
    // 验证码校验
    if (formData.captcha.toUpperCase() !== captchaCode) {
      setFieldErrors(prev => ({ ...prev, captcha: '验证码错误' }));
      return;
    }
    setIsLoading(true);
    const startTime = Date.now();
    try {
      // 调用登录API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          account: formData.username.trim(), // 转换为后端需要的account字段
          password: formData.password
        } as LoginRequest),
        signal: AbortSignal.timeout(10000),
        credentials: 'include' // 允许浏览器处理认证Cookie
      });
      
      const responseTime = Date.now() - startTime;
      setResponseTime(responseTime);
      
      // 无论响应状态如何，都先解析JSON响应
      const data: LoginApiResponse = await response.json();
      console.log('登录响应数据:', data);

      // 检查登录是否成功（使用code字段判断）
      if (data.code === 0) {
        console.log('登录成功，完整响应数据:', data);
        
        // 登录成功后1秒跳转到指定页面
        setTimeout(() => {
          // 获取重定向参数
          const urlParams = new URLSearchParams(window.location.search);
          const redirectPath = urlParams.get('redirect') || getCommenterHomePath();
          console.log(`登录成功，跳转到 ${redirectPath}`);
          router.push(redirectPath);
        }, 1000);

      } else {
        // 登录失败，显示API返回的错误信息
        throw new Error(data.message || `登录失败`);
      }
    } catch (error) {
      let errorMsg = '登录过程中出现错误，请稍后再试';
      const typedError = error as Error;
      if (typedError.name === 'AbortError') {
        errorMsg = '请求超时，请检查网络连接';
      } else if (typedError.message && typedError.message.includes('Failed to fetch')) {
        errorMsg = '无法连接到服务器，请稍后再试';
      } else if (typedError.message) {
        errorMsg = typedError.message;
      }
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部装饰 */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-12 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-white text-4xl font-bold mb-3">
            登录
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 -mt-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 用户名输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  用户名
                </label>
                <input
                    type="text"
                    placeholder="请输入用户名"
                    value={formData.username}
                    onChange={handleInputChange}
                    name="username"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  />
                  {fieldErrors.username && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>
                  )}
              </div>

              {/* 密码输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  密码
                </label>
                <input
                    type="password"
                    placeholder="请输入密码"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    name="password"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  />
                  {fieldErrors.password && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                  )}
              </div>

              {/* 验证码 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  验证码
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="请输入验证码"
                    value={formData.captcha}
                    onChange={handleInputChange}
                    name="captcha"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.captcha ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    autoComplete="off"
                  />
                  <div 
                    className="w-24 h-10 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg font-bold text-lg cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={refreshCaptcha}
                    title="刷新验证码"
                  >
                    {captchaCode}
                  </div>
                </div>
                {fieldErrors.captcha && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.captcha}</p>
                )}
              </div>

              {/* 错误信息 */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600">⚠️</span>
                    <span className="text-sm text-red-700">{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '登录中...' : '登录'}
              </button>
            </form>

            {/* 注册提示 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                还没有账户？{' '}
                <button 
                  onClick={() => router.push('/commenter/auth/register')}
                  className="text-blue-500 hover:underline"
                >
                  立即注册
                </button>
                <button 
                  onClick={() => router.push('/commenter/auth/resetpwd')}
                  className="text-blue-500 hover:underline ml-3"
                >
                  忘记密码
                </button>
              </p>
            </div>
          </div>

          {/* 底部信息 */}
          <div className="text-center text-xs text-gray-500 mb-8">
            <p>© 2024 微任务系统 v2.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}