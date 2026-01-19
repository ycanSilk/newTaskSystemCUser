'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InfoCircleOutlined } from '@ant-design/icons';
// 导入userStore
import { useUserStore } from '@/store/userStore';
// 导入提现API类型定义
import { PostWithdrawalRequest, PostWithdrawalResponse } from '@/app/types/paymentWallet/postWithdrawalTypes';

const WithdrawalPage = () => {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [paymentPassword, setPaymentPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  // 支付宝手动输入状态
  const [alipayAccount, setAlipayAccount] = useState('');
  const [alipayName, setAlipayName] = useState('');
  
  // 从userStore获取用户信息和钱包余额
  const { currentUser, fetchUser } = useUserStore();
  const availableBalance = currentUser?.balance || 0;
  
  // 页面加载时获取用户信息
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 验证提现金额
  const validateAmount = (value: string): { isValid: boolean; message: string } => {
    const numAmount = parseFloat(value);

    // 检查是否为有效数字
    if (isNaN(numAmount) || numAmount <= 0) {
      return { isValid: false, message: '请输入有效的提现金额' };
    }

    // 检查最低金额
    if (numAmount < 100) {
      return { isValid: false, message: '最低提现金额为100元' };
    }

    // 检查最高金额
    if (numAmount > 1000) {
      return { isValid: false, message: '最高提现金额为1000元' };
    }

    // 检查是否为100的整数倍
    if (numAmount % 100 !== 0) {
      return { isValid: false, message: '提现金额必须为100的整数倍' };
    }

    // 检查余额是否充足
    if (numAmount > availableBalance) {
      return { isValid: false, message: '提现金额不能超过可用余额' };
    }

    return { isValid: true, message: '' };
  };

  // 处理金额输入变化
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 只允许输入整数
    const filteredValue = value.replace(/[^0-9]/g, '');
    setAmount(filteredValue);
    setError('');
  };

  // 处理提现提交 - 先弹出密码输入框
  const handleSubmit = () => {
    // 验证金额
    const validation = validateAmount(amount);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    // 验证支付宝信息
    if (!alipayAccount || !alipayName) {
      setError('请填写完整的支付宝信息');
      return;
    }

    // 清除之前的密码和错误信息
    setPaymentPassword('');
    setPasswordError('');
    // 显示支付密码输入框
    setShowPasswordModal(true);
  };

  // 处理支付密码验证和实际提现提交
  const handlePasswordConfirm = async () => {
    // 验证支付密码
    if (!paymentPassword || paymentPassword.trim() === '') {
      setPasswordError('请输入支付密码');
      return;
    }
    
    // 验证支付密码为6位数字
    if (!/^\d{6}$/.test(paymentPassword)) {
      setPasswordError('请输入6位数字的支付密码');
      return;
    }

    try {
      setLoading(true);
      setPasswordError('');

      const numAmount = parseFloat(amount);
      
      // 构建提现请求参数
      const withdrawalRequest: PostWithdrawalRequest = {
        amount: numAmount,
        alipay_account: alipayAccount,
        alipay_name: alipayName,
        payment_password: paymentPassword
      };
      
      // 调用提现API
      const response = await fetch('/api/paymentWallet/postWithdrawal', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(withdrawalRequest),
        credentials: 'include'
      });
      
      const result: PostWithdrawalResponse = await response.json();
      
      if (result.success) {
        // 提现成功
        setSuccess('提现申请提交成功');
        setShowPasswordModal(false);
        // 重新获取用户信息，更新余额
        await fetchUser();
        // 清空表单
        setAmount('');
        setAlipayAccount('');
        setAlipayName('');
      } else {
        // 提现失败
        throw new Error(result.message || '提交提现申请失败');
      }
    } catch (err) {
      console.error('提交提现申请失败:', err);
      if (err instanceof Error) {
        setPasswordError(`提交失败: ${err.message}`);
      } else {
        setPasswordError('提交失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  // 关闭密码输入框
  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPaymentPassword('');
    setPasswordError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3">
      <div className="mb-6 border border-gray-200 rounded-lg shadow-sm p-4">
        <div className="">
            <div className='p-4 bg-green-500 flex flex-col items-center justify-center h-[120px] rounded-md mb-4'> 
                <div className=" text-white">余额: </div>
                <div className=" text-white">{availableBalance.toFixed(2)}</div>
            </div>
            <div className="text-lg font-medium mb-2">提现金额:</div>         
            <div className="relative mb-4">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="请输入提现金额"
                  className="pl-8  text-xl  border rounded w-full"
                  disabled={loading || !!success}
                  />
                  {amount && (!/^\d+$/.test(amount) || parseInt(amount) % 100 !== 0) && (
                    <p className="text-red-500 text-sm mt-1">提现金额必须是100的整数倍</p>
                  )}
                  <p className="text-sm text-red-500 mt-1">*提现金额必须是整数且是100的倍数</p>
            </div>
            

            <div className="text-sm  mb-4">
                <p>提现说明：</p>
                <ul className="list-disc list-inside pl-2 mt-1 space-y-1">
                <li>最低提现金额：100元</li>
                <li>最高提现金额：1000元</li>
                <li>提现金额必须为100的整数倍</li>
                <li>提现申请提交后将在1-3个工作日内到账</li>
                </ul>
            </div>

            {/* 快捷金额选项 */}
            <div className="mb-4">
                <p className="text-sm  mb-2">快捷提现金额：</p>
                <div className="grid grid-cols-3 gap-2">
                {[100, 200, 300, 500, 1000].map(value => (
                    <button
                    key={value}
                    type="button"
                    onClick={() => setAmount(value.toString())}
                    disabled={loading || !!success || value > availableBalance}
                    className={`${value > availableBalance ? 'opacity-50 cursor-not-allowed' : ''} bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded w-full`}
                    >
                    {value}元
                    </button>
                ))}
                </div>
            </div>
        </div>
      </div>

      {/* 支付宝手动输入区域 */}
      <div className="mb-6 border border-gray-200 rounded-lg shadow-sm p-4">
        <div className="p-4">
          <h2 className="text-lg text-blue-500 font-medium mb-4">输入要提现转账的支付宝信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">支付宝账号</label>
              <input
                type="text"
                value={alipayAccount}
                onChange={(e) => setAlipayAccount(e.target.value)}
                placeholder="请输入支付宝账号"
                className="w-full px-4 py-2 border border-gray-800 rounded"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">支付宝姓名</label>
              <input
                type="text"
                value={alipayName}
                onChange={(e) => setAlipayName(e.target.value)}
                placeholder="请输入支付宝姓名"
                className="w-full px-4 py-2 border border-gray-800 rounded"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
          <InfoCircleOutlined className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 成功提示 */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-start">
          <InfoCircleOutlined className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* 提现按钮 */}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full py-6 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded"
        disabled={loading || !amount}
      >
        {loading ? '提交中...' : '确认提现'}
      </button>

      {/* 底部提示 */}
      <div className="mt-6 text-center text-xs ">
        <p>提现金额将在1-3个工作日内到账，请耐心等待</p>
        <p className="mt-1">如有疑问，请联系客服</p>
      </div>

      {/* 支付密码输入弹窗 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
            <h3 className="text-xl font-medium mb-4 text-center">输入支付密码</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">支付密码</label>
              <input
                type="password"
                value={paymentPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  // 只允许输入数字
                  const filteredValue = value.replace(/[^0-9]/g, '');
                  // 限制长度为6位
                  setPaymentPassword(filteredValue.slice(0, 6));
                }}
                placeholder="请输入6位数字支付密码"
                className="w-full px-4 py-2 border border-gray-300 rounded"
                disabled={loading}
                // 添加autoComplete属性防止浏览器自动填充干扰
                autoComplete="off"
                maxLength={6}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={closePasswordModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                disabled={loading}
              >
                取消
              </button>
              <button
                type="button"
                onClick={handlePasswordConfirm}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? '验证中...' : '确认'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalPage;