'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card } from 'antd';

// 导入提现记录类型定义
import { WithdrawalRecord } from '@/app/types/paymentWallet/getWithdrawalListTypes';

const TransactionDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transaction, setTransaction] = useState<WithdrawalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  // 图片放大查看状态
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  
  // 显示图片放大模态框
  const handleImageClick = (imageUrl: string) => {
    setCurrentImageUrl(imageUrl);
    setIsImageModalVisible(true);
  };
  
  // 关闭图片放大模态框
  const handleCloseImageModal = () => {
    setIsImageModalVisible(false);
    setCurrentImageUrl('');
  };

  // 从URL查询参数中获取交易记录数据
  useEffect(() => {
    const fetchTransactionDetail = () => {
      try {
        setLoading(true);
        
        // 从URL查询参数中获取交易记录数据
        const transactionDataStr = searchParams.get('data');
        console.log('transactionDataStr from URL:', transactionDataStr);
        
        if (transactionDataStr) {
          // 解析JSON字符串
          const transactionData: WithdrawalRecord = JSON.parse(decodeURIComponent(transactionDataStr));
          console.log('transactionData:', transactionData);
          setTransaction(transactionData);
        } else {
          setTransaction(null);
        }
      } catch (error) {
        console.error('解析交易详情失败:', error);
        setTransaction(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactionDetail();
  }, [searchParams]);
  
  // 格式化日期时间
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-');
  };

  // 格式化提现方式显示
  const formatWithdrawMethod = (method: string): string => {
    switch (method.toLowerCase()) {
      case 'alipay':
        return '支付宝';
      case 'wechat':
        return '微信';
      default:
        return method;
    }
  };

  // 返回上一页
  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-12 px-4 text-center">
          <div className="text-5xl mb-3">⏳</div>
          <h3 className="text-lg font-medium text-gray-800">加载中...</h3>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-12 px-4 text-center">
          <div className="text-5xl mb-3">❌</div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">交易不存在</h3>
          <p className=" text-sm mb-4">未找到对应的交易记录</p>
          <Button onClick={handleBack} className="mt-2">返回</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主要内容 */}
      <div className="px-4 py-4">
        <Card className="shadow-sm border-0 rounded-xl">
          <div className="py-3 px-2">
            {/* 交易类型图标和名称 */}
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                <span className="text-2xl text-amber-500">¥</span>
              </div>
              <h2 className="text-lg font-medium ">
                提现
              </h2>
            </div>

            {/* 交易金额 */}
            <div className="flex justify-center mb-4">
              <span className="text-3xl font-bold text-red-600">
                - {transaction.amount}
              </span>
            </div>

            {/* 交易信息列表 */}            
            <div className="space-y-1">
              {/* 金额 */}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="">提现金额：</span>
                <span className=" font-medium">{transaction.amount}</span>
              </div>
              {/* 提现时间 */}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="">提现时间：</span>
                <span className=" font-medium">{formatDateTime(transaction.created_at)}</span>
              </div>

              {/* 审核时间 */}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="">审核时间：</span>
                <span className=" font-medium">
                  {transaction.reviewed_at ? formatDateTime(transaction.reviewed_at) : '-'}
                </span>
              </div>

              {/* 提现状态 */}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="">提现状态：</span>
                <span className=" font-medium">{transaction.status_text}</span>
              </div>

              {/* 提现账户 */}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="">提现账户：</span>
                <span className=" font-medium">{transaction.withdraw_account}</span>
              </div>

              {/* 提现方式 */}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="">提现方式：</span>
                <span className=" font-medium">{formatWithdrawMethod(transaction.withdraw_method)}</span>
              </div>

              

              {/* 拒绝原因 - 只有状态为2时显示 */}
              {transaction.status === 2 && (
                <div className="flex justify-between py-2">
                  <span className="">拒绝原因</span>
                  <span className=" font-medium">
                    {transaction.reject_reason || '-'}
                  </span>
                </div>
              )}
            </div>
            
            {/* 转账截图查看区域 */}
            {transaction.img_url && (
              <div className="mt-4">
                <div className=" mb-2">转账截图：</div>
                <div className="border rounded-lg overflow-hidden cursor-pointer" onClick={() => handleImageClick(transaction.img_url)}>
                  <img 
                    src={transaction.img_url} 
                    alt="转账截图" 
                    className="w-full max-h-60 object-contain transition-transform duration-300 hover:scale-105" 
                  />
                </div>
              </div>
            )}
            
            {/* 图片放大模态框 */}
            {isImageModalVisible && currentImageUrl && (
              <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={handleCloseImageModal}>
                <div className="max-w-4xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                  <img 
                    src={currentImageUrl} 
                    alt="放大的转账截图" 
                    className="w-full h-auto object-contain" 
                  />
                  <button 
                    onClick={handleCloseImageModal} 
                    className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors duration-200"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDetailPage;