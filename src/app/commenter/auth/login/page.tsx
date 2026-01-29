'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginFormData, LoginRequest, LoginApiResponse } from '../../../types/auth/loginTypes';
// 导入useUser钩子
import { useUser } from '@/hooks/useUser';


const redirectPath = '/commenter/hall';
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
  // 密码可见性状态
  const [showPassword, setShowPassword] = useState(false);
  // 移除与登录成功提示框相关的状态
  // const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const [loginSuccessMessage, setLoginSuccessMessage] = useState('');
  const router = useRouter();
  // 使用useUser钩子
  const { saveUserOnLogin } = useUser();

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

      // 检查登录是否成功（使用code字段判断）
      if (data.code === 0) {
        console.log('登录成功，完整响应数据:', data);
        
        // 登录成功后保存用户信息
        if (data.data) {
          console.log('保存用户信息:', data.data);
          saveUserOnLogin(data.data);
        }
        
        // 登录成功后1秒跳转到指定页面
        setTimeout(() => {
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
                    autoComplete="username"
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
                <div className="relative">
                  <input
                      type={showPassword ? "text" : "password"}
                      placeholder="请输入密码"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleInputChange}
                      name="password"
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    />
                  {/* 眼睛按钮 */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none ${showPassword ? 'bg-blue-100 text-blue-600 p-1 rounded-full' : 'text-gray-500 hover:text-gray-700'}`}
                    aria-label={showPassword ? "隐藏密码" : "显示密码"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {showPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878l3.125-3.125M8.25 3a10.05 10.05 0 00-7.5 11.227m13.5-4.073a10.05 10.05 0 01-7.5-11.227M8.25 3a11.94 11.94 0 015.547 2.912" 
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      )}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
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