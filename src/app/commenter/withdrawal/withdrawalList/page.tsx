'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';
import { WithdrawalRecord, GetWithdrawalListResponse } from '@/app/types/paymentWallet/getWithdrawalListTypes';
// 导入Tabs组件
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

const WithdrawalRecordList = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 标签页状态管理
  const [activeTab, setActiveTab] = useState('all');
  
  // 分页状态管理
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredTransactions, setFilteredTransactions] = useState<WithdrawalRecord[]>([]);
  const [paginatedTransactions, setPaginatedTransactions] = useState<WithdrawalRecord[]>([]);

  // 从created_at中提取日期和时间
  const extractDateTime = (createTime: string) => {
    const date = new Date(createTime);
    return {
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().split(' ')[0].substring(0, 5)
    };
  };

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit'
      });
    }
  };

  // 获取交易图标（统一使用￥符号和黄色背景）
  const getTransactionIcon = () => {
    return {
      icon: '￥',
      color: 'text-white',
      bgColor: 'bg-yellow-500'
    };
  };

  // 处理查看交易详情
  const handleViewTransaction = (transaction: WithdrawalRecord) => {
    // 将交易记录转换为URL编码的JSON字符串，作为查询参数传递
    const transactionParams = encodeURIComponent(JSON.stringify(transaction));
    router.push(`/commenter/balance/transaction-details/${transaction.id}?data=${transactionParams}` as any);
  };

  // 根据标签页过滤交易记录
  const filterTransactions = (tab: string) => {
    let filtered: WithdrawalRecord[] = [];
    
    switch (tab) {
      case 'all':
        filtered = [...transactions];
        break;
      case 'pending':
        filtered = transactions.filter(t => t.status === 0);
        break;
      case 'approved':
        filtered = transactions.filter(t => t.status === 1);
        break;
      case 'rejected':
        filtered = transactions.filter(t => t.status === 2);
        break;
      default:
        filtered = [...transactions];
    }
    
    setFilteredTransactions(filtered);
    return filtered;
  };

  // 分页处理
  const paginateTransactions = (filtered: WithdrawalRecord[]) => {
    const total = filtered.length;
    const pages = Math.ceil(total / pageSize);
    setTotalPages(pages);
    
    // 确保当前页不超过总页数
    if (currentPage > pages) {
      setCurrentPage(1);
    }
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filtered.slice(startIndex, endIndex);
    
    setPaginatedTransactions(paginated);
  };

  // 处理标签页切换
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // 切换标签页时重置到第一页
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 处理每页条数变化
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // 改变每页条数时重置到第一页
  };

  // 获取提现记录数据
  useEffect(() => {
    const fetchWithdrawalRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 调用后端API获取提现记录
        const response = await fetch('/api/paymentWallet/getWithdrawalList', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: GetWithdrawalListResponse = await response.json();
        
        if (!data.success || !data.data) {
          throw new Error(data.message || '获取提现记录失败');
        }
        
        // 计算一年前的日期
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        // 按创建时间倒序排序，并只保留一年以内的记录
        const sortedTransactions = data.data.list
          // 只保留最近一年的记录
          .filter(transaction => new Date(transaction.created_at) >= oneYearAgo)
          // 按创建时间倒序排序
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setTransactions(sortedTransactions);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取提现记录失败');
        console.error('获取提现记录失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawalRecords();
  }, []);

  // 当交易记录或标签页变化时，重新过滤和分页
  useEffect(() => {
    const filtered = filterTransactions(activeTab);
    paginateTransactions(filtered);
  }, [transactions, activeTab, currentPage, pageSize]);

  // 返回上一页
  const handleBack = () => {
    router.back();
  };

  // 渲染交易记录列表组件
  const renderTransactionList = () => {
    return (
      <div>
        {/* 交易记录列表 */}
        <div>
          {loading ? (
            // 加载状态 - 优化为显示8个骨架屏，更接近实际内容数量
            <div className="px-4 py-3">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-gray-500 animate-pulse">加载中...</div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center py-3 animate-pulse">
                    <div className="h-8 w-8 rounded-full bg-yellow-100 mr-3" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 rounded w-1/6" />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            // 错误状态
            <div className="py-12 px-4 text-center">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">获取失败</h3>
              <p className="text-gray-500 text-sm mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                重试
              </Button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            // 空状态
            <div className="py-12 px-4 text-center">
              <div className="text-5xl mb-3">📝</div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">暂无交易记录</h3>
              <p className="text-gray-500 text-sm mb-4">您还没有任何交易记录</p>
            </div>
          ) : (
            // 显示提现记录
            <div>
              {/* 显示交易记录总数信息 */}
              <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                <div className="text-xs text-red-500">
                  共显示 {filteredTransactions.length} 条{activeTab !== 'all' && ` ${activeTab === 'pending' ? '待审核' : activeTab === 'approved' ? '审核通过' : '审核拒绝'}`}提现记录
                </div>
              </div>
              
              {paginatedTransactions
                .map((transaction) => {
                  const iconInfo = getTransactionIcon();
                  const { date, time } = extractDateTime(transaction.created_at);
                  
                  return (
                    <div 
                      key={transaction.id}
                      onClick={() => handleViewTransaction(transaction)}
                      className="px-4 py-3 border-b border-gray-50 hover:bg-blue-50 flex items-center transition-colors duration-200"
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${iconInfo.bgColor} mr-3 text-lg font-bold`}>
                        <span className={iconInfo.color}>{iconInfo.icon}</span>
                      </div>
                          
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium text-gray-900 truncate max-w-[60%]">提现：{transaction.status_text}</h3>
                          <span className="font-medium text-red-600">
                            -{transaction.amount}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-500">
                            {formatDate(date)} {time}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}            
              {/* 分页 */}
              <div className="px-4 py-3 flex justify-between items-center border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  第 {currentPage} / {totalPages} 页，共 {filteredTransactions.length} 条记录
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="small" 
                    disabled={currentPage === 1} 
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    上一页
                  </Button>
                  <Button 
                    size="small" 
                    disabled={currentPage === totalPages} 
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    下一页
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
     
      {/* 交易记录 */}
      <div className="mt-3 bg-white">
        {/* 选项卡 */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">全部明细</TabsTrigger>
            <TabsTrigger value="pending">待审核</TabsTrigger>
            <TabsTrigger value="approved">审核通过</TabsTrigger>
            <TabsTrigger value="rejected">审核拒绝</TabsTrigger>
          </TabsList>
          
          {/* 全部明细 */}
          <TabsContent value="all">
            {renderTransactionList()}
          </TabsContent>
          
          {/* 待审核 */}
          <TabsContent value="pending">
            {renderTransactionList()}
          </TabsContent>
          
          {/* 审核通过 */}
          <TabsContent value="approved">
            {renderTransactionList()}
          </TabsContent>
          
          {/* 审核拒绝 */}
          <TabsContent value="rejected">
            {renderTransactionList()}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* 底部提示 */}
      <div className="px-4 py-4 text-center text-xs text-gray-500">
        <p>交易记录保存期限为12个月</p>
      </div>
    </div>
  );
}

export default WithdrawalRecordList;
