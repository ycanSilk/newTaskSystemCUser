'use client';
import React, { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const ChangePaymentPasswordPage: React.FC = () => {
  const router = useRouter();
  
  // 状态管理
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 输入处理函数 - 只允许输入6位数字
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6); // 只允许数字且最多6位
      setter(value);
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    // 旧支付密码验证
    if (!oldPassword) newErrors.oldPassword = '请输入旧支付密码';
    else if (oldPassword.length !== 6) newErrors.oldPassword = '旧支付密码必须是6位数字';
    
    // 新支付密码验证
    if (!newPassword) newErrors.newPassword = '请输入新支付密码';
    else if (newPassword.length !== 6) newErrors.newPassword = '新支付密码必须是6位数字';
    else if (newPassword === oldPassword) newErrors.newPassword = '新支付密码不能与旧支付密码相同';
    
    // 确认支付密码验证
    if (!confirmNewPassword) newErrors.confirmNewPassword = '请确认新支付密码';
    else if (confirmNewPassword.length !== 6) newErrors.confirmNewPassword = '确认支付密码必须是6位数字';
    else if (confirmNewPassword !== newPassword) newErrors.confirmNewPassword = '两次输入的新支付密码不一致';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || loading) return;
    
    setLoading(true);
    
    try {
      // 准备请求数据
      const data = { 
        oldPassword, 
        newPassword, 
        confirmNewPassword 
      };
      
      // 调用修改支付密码API
      const response = await fetch('/api/walletmanagement/changepaymentpwd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('支付密码修改成功！');
        router.back();
      } else {
        // 处理API返回的错误
        if (result.error === 'oldPasswordError') {
          setErrors(prev => ({ ...prev, oldPassword: '旧支付密码错误' }));
        } else {
          alert(result.message || '修改失败，请重试');
        }
      }
    } catch (error) {
      console.error('请求错误:', error);
      alert('网络请求失败，请检查网络连接后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <button 
            className="mr-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => router.back()}
            aria-label="返回"
          >
            <ArrowLeftOutlined className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">修改支付密码</h1>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="flex-1 py-6 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 旧支付密码输入框 */}
            <div className="space-y-2">
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                旧支付密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="oldPassword"
                  name="oldPassword"
                  value={oldPassword}
                  onChange={handleInputChange(setOldPassword, 'oldPassword')}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.oldPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                  placeholder="请输入旧支付密码（6位数字）"
                  autoComplete="off"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? '隐藏' : '显示'}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <span className="mr-1">⚠️</span>{errors.oldPassword}
                </p>
              )}
            </div>

            {/* 新支付密码输入框 */}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                新支付密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={handleInputChange(setNewPassword, 'newPassword')}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                  placeholder="请设置新支付密码（6位数字）"
                  autoComplete="off"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? '隐藏' : '显示'}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <span className="mr-1">⚠️</span>{errors.newPassword}
                </p>
              )}
            </div>

            {/* 确认支付密码输入框 */}
            <div className="space-y-2">
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                确认支付密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={handleInputChange(setConfirmNewPassword, 'confirmNewPassword')}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.confirmNewPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                  placeholder="请再次输入新支付密码"
                  autoComplete="off"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? '隐藏' : '显示'}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <span className="mr-1">⚠️</span>{errors.confirmNewPassword}
                </p>
              )}
            </div>

            {/* 安全提示 */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-amber-800 mb-1">安全提示</h3>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• 支付密码用于保护您的资金安全，请妥善保管</li>
                <li>• 请勿使用生日、手机号等容易猜测的数字组合</li>
                <li>• 不要向他人透露您的支付密码</li>
              </ul>
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed shadow-inner' : 'shadow-sm hover:shadow'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  修改中...
                </span>
              ) : '确认修改'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChangePaymentPasswordPage;