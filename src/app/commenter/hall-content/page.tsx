'use client';

import React, { useState, useEffect, useRef } from 'react';
import CoolingTimer from '@/components/timer/CoolingTimer';
import { useRouter } from 'next/navigation';
import { ClockCircleOutlined, WarningOutlined, CloseCircleOutlined, BulbOutlined, CheckCircleOutlined, DollarOutlined, MailOutlined, ReloadOutlined, LoadingOutlined } from '@ant-design/icons';
import AlertModal from '../../../components/ui/AlertModal';
import { TaskPoolListResponse, TaskPoolListItem } from '@/app/types/task/getTaskPoolList';

export default function CommenterHallContentPage() {
  const [sortBy, setSortBy] = useState('time'); // 'time' | 'price'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const [tasks, setTasks] = useState<TaskPoolListItem[]>([]);
  const [grabbingTasks, setGrabbingTasks] = useState(new Set<number>()); // 正在抢单的任务ID
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误状态
  const [currentPage, setCurrentPage] = useState(0); // 当前页码
  const [totalItems, setTotalItems] = useState(0); // 总任务数
  const [totalPages, setTotalPages] = useState(0); // 总页数
  const [loadingMore, setLoadingMore] = useState(false); // 加载更多的状态
  const [hasMore, setHasMore] = useState(true); // 是否还有更多数据
  const itemsPerPage = 10;
  
  // 冷却计时器引用
  const coolingTimerRef = useRef<any>(null);
  
  // 从冷却计时器获取冷却状态
  const isCoolingDown = () => coolingTimerRef.current?.isCoolingDown || false;
  const getRemainingTime = () => coolingTimerRef.current?.remainingTime || { minutes: 0, seconds: 0 };
  const [showCoolingModal, setShowCoolingModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    icon: <WarningOutlined className="text-yellow-500" />
  });
  
  // 显示通用提示框
  const showAlert = (title: string, message: string, iconType: 'warning' | 'error' | 'success' | 'info' = 'warning') => {
    let icon;
    switch (iconType) {
      case 'warning':
        icon = <WarningOutlined className="text-yellow-500" />;
        break;
      case 'error':
        icon = <CloseCircleOutlined className="text-red-500" />;
        break;
      case 'success':
        icon = <CheckCircleOutlined className="text-green-500" />;
        break;
      case 'info':
        icon = <BulbOutlined className="text-blue-500" />;
        break;
      default:
        icon = <WarningOutlined className="text-yellow-500" />;
    }
    setAlertConfig({ title, message, icon });
    setShowAlertModal(true);
  };

  // 排序功能 - 使用正确的字段名
  const sortTasks = (tasks: TaskPoolListItem[], sortBy: string, sortOrder: string) => {
    const sorted = [...tasks].sort((a, b) => {
      if (sortBy === 'time') {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      } else if (sortBy === 'price') {
        const priceA = typeof a.unit_price === 'number' ? a.unit_price : 0;
        const priceB = typeof b.unit_price === 'number' ? b.unit_price : 0;
        return sortOrder === 'desc' ? priceB - priceA : priceA - priceB;
      }
      return 0;
    });
    return sorted;
  };
  
  // 从API获取待领取订单
  const fetchAvailableTasks = async (page: number = 0) => {
    if (page === 0) {
      setIsLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    
    try {
      // 构建请求URL，使用GET方法，将参数作为查询字符串传递
      const url = new URL('/api/task/getTaskPoolList', window.location.origin);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('size', '20');
      url.searchParams.append('sortField', sortBy === 'time' ? 'createTime' : 'unitPrice');
      url.searchParams.append('sortOrder', sortOrder.toUpperCase());

      // 调用后端API
      const response = await fetch(url.toString(), {
        method: 'GET',
        credentials: 'include'
      });

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 解析响应数据
      const responseData: TaskPoolListResponse = await response.json();
      // 检查API调用是否成功
      if (responseData.success) {
        // 处理返回的任务数据
        const formattedTasks = responseData.data.list || [];
        // 过滤掉title为"放大镜搜索词"的任务
        const filteredTasks = formattedTasks.filter(task => task.title !== '放大镜搜索词');
        
        // 如果是第一页，替换任务列表；否则，追加任务
        if (page === 0) {
          setTasks(filteredTasks);
        } else {
          setTasks(prevTasks => [...prevTasks, ...filteredTasks]);
        }
        
        setTotalItems(filteredTasks.length);
        setTotalPages(Math.ceil(filteredTasks.length / 20)); // 每页20条
        setCurrentPage(page);
        setLastUpdated(new Date());
        
        // 更新是否还有更多数据
        setHasMore(filteredTasks.length >= 20);
      } else {
        throw new Error(responseData.message || '获取任务列表失败');
      }
    } catch (error) {
      console.error('获取任务列表失败:', error);
      const errorMessage = error instanceof Error ? error.message : '加载任务列表时发生未知错误';
      setError(errorMessage);
      showAlert('错误', errorMessage, 'error');
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };
  
  // 分页导航功能
  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages && page !== currentPage) {
      fetchAvailableTasks(page);
    }
  };
  
  // 上一页
  const goToPrevPage = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  };
  
  // 下一页
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  };
  
  // 生成页码数组
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    // 调整起始页，确保显示足够的页码
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  // 刷新任务
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAvailableTasks(0); // 刷新时回到第一页
    setIsRefreshing(false);
  };

  // 冷却计时器回调函数
  const handleCoolingStart = (endTime: number) => {
    console.log('页面组件: 冷却开始', { endTime });
  };
  
  const handleCoolingEnd = () => {
    console.log('页面组件: 冷却结束');
  };
  
  // 抢单功能
  const handleGrabTask = async (taskId: number) => {
    console.log('=== 抢单功能开始 ===', { taskId });
    
    // 检查是否处于冷却状态
    if (isCoolingDown()) {
      console.log('当前处于冷却状态，显示冷却模态框');
      setShowCoolingModal(true);
      return;
    }

    if (grabbingTasks.has(taskId)) {
      console.log('该任务正在抢单中，忽略重复点击');
      return;
    }

    try {
      setGrabbingTasks(prev => new Set(prev).add(taskId));
      console.log('设置任务为正在抢单状态');

      // 调用后端抢单API
      console.log('发送抢单请求到后端API');
      const response = await fetch('/api/task/getTaskAccept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ b_task_id: taskId }),
        credentials: 'include'
      });

      // 解析响应数据
      const responseData = await response.json();
      console.log('抢单API响应数据:', responseData);
      
      // 检查API调用是否成功
      if (responseData.code === 0) {
        // 抢单成功
        console.log('抢单成功');
        
        // 显示成功消息
        showAlert('抢单成功', responseData.message || '接单成功', 'success');
        
        // 开始冷却计时
        console.log('调用冷却计时器开始5分钟冷却');
        coolingTimerRef.current?.startCooling(3);
        
        // 抢单成功后延迟1秒跳转到任务页面
        setTimeout(() => {
          console.log('跳转到任务页面');
          router.push('/commenter/tasks?tab=ACCEPTED');
        }, 1000);
        
        // 抢单成功后立即刷新列表
        await fetchAvailableTasks(0);
      } else {
        // 抢单失败
        console.error('抢单API返回失败标志:', responseData.message);
        // 显示API返回的错误消息，不包含状态码等后端信息
        showAlert('抢单失败', responseData.message || '抢单失败', 'error');
      }
      
    } catch (error) {
      console.error('抢单错误:', error);
      // 捕获网络错误等其他错误
      let errorMessage = '抢单时发生错误，请稍后重试';
      
      // 尝试提取API返回的错误信息
      if (error instanceof Error) {
        // 如果是Fetch错误，尝试解析错误信息
        if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
          errorMessage = '网络连接失败，请检查网络设置';
        } else {
          // 其他错误，使用通用错误信息
          errorMessage = '抢单失败，请稍后重试';
        }
      }
      
      // 显示友好的错误消息，不包含后端信息
      showAlert('错误', errorMessage, 'error');
    } finally {
      setGrabbingTasks(prev => {
        const newSet = new Set<number>(prev);
        newSet.delete(taskId);
        return newSet;
      });
      console.log('=== 抢单功能结束 ===');
    }
  };

  // 初始加载订单和排序变化时重新获取数据
  useEffect(() => {
    fetchAvailableTasks(0);
  }, [sortBy, sortOrder]); // 当排序方式改变时重新获取数据

  // 滚动懒加载
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore || isLoading) return;
      
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // 当滚动到距离底部100px时加载更多
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreTasks();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, isLoading]);

  // 加载更多任务
  const loadMoreTasks = async () => {
    if (currentPage < totalPages - 1 && !loadingMore) {
      setLoadingMore(true);
      await fetchAvailableTasks(currentPage + 1);
      setLoadingMore(false);
    }
  };
 
  const sortedTasks = sortTasks(tasks, sortBy, sortOrder);
  
  return (
    <div className="pb-32">
      {/* 冷却计时器组件 */}
      <CoolingTimer 
        ref={coolingTimerRef}
        onCoolingStart={handleCoolingStart}
        onCoolingEnd={handleCoolingEnd}/>
      {/* 排序功能按钮 */}
      <div className="bg-white mx-4 rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">任务排序</h3>
        </div>
        
        <div className="flex space-x-2">
          {/* 按时间排序 */}
          <button
            onClick={() => {
              if (sortBy === 'time') {
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
              } else {
                setSortBy('time');
                setSortOrder('desc');
              }
            }}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm ${sortBy === 'time' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            <span>
                <ClockCircleOutlined className="" />
              </span>
            <span>发布时间</span>
            {sortBy === 'time' && (
              <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
            )}
          </button>
          
          {/* 按价格排序 */}
          <button
            onClick={() => {
              if (sortBy === 'price') {
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
              } else {
                setSortBy('price');
                setSortOrder('desc');
              }
            }}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm ${sortBy === 'price' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            <span>
                <DollarOutlined className="" />
              </span>
            <span>单价</span>
            {sortBy === 'price' && (
              <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
            )}
          </button>
        </div>
      </div>

      {/* 任务列表 */}
      <div className="mx-4 mt-3">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-gray-800">全部任务 ({error ? '加载失败' : isLoading ? '加载中...' : totalItems})</span>
          <div className="text-xs text-gray-500">
            最后更新: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        {/* 错误状态显示 */}
        {error && !isLoading && (
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-5xl mb-3">
              <CloseCircleOutlined className="text-red-500" />
            </div>
            <h3 className="font-medium text-red-600 mb-2">加载失败</h3>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              重试
            </button>
          </div>
        )}

        {/* 加载状态显示 */}
        {isLoading && !error && (
          <div className="bg-white rounded-lg p-6 text-center">
            <h3 className="font-medium text-gray-800 mb-2">加载中</h3>
            <p className="text-gray-500 text-sm">正在获取任务列表，请稍候...</p>
          </div>
        )}

        {/* 无任务状态显示 */}
        {!isLoading && !error && sortedTasks.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-5xl mb-3">
              <MailOutlined className="text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-800 mb-2">暂无待领取订单</h3>
            <p className="text-gray-500 text-sm mb-4">请稍后刷新或关注新发布的任务</p>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              立即刷新
            </button>
          </div>
        ) : (
          <div>
            {!isLoading && !error && sortedTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold">任务标题：{task.title}</h3>
                    <div>订单号：{task.id}</div>
                    <div className="flex gap-2 mt-1">
                      {task.status === 1 && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded inline-block">
                          有效
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs  text-gray-600 px-2 py-1">
                    到期时间：{task.deadline_text}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="text-2xl font-bold text-orange-500">¥{task.commission||'0.00'}</div>
                </div>
                <button 
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${grabbingTasks.has(task.id) ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                  onClick={() => handleGrabTask(task.id)}
                  disabled={grabbingTasks.has(task.id)}
                >
                  {grabbingTasks.has(task.id) ? '抢单中...' : '抢单'}
                </button>
              </div>
            ))}
            
            {/* 加载更多指示器 */}
            {loadingMore && (
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm">加载更多任务...</p>
              </div>
            )}
            
            {/* 没有更多数据提示 */}
            {!loadingMore && !hasMore && sortedTasks.length > 0 && (
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm">没有更多任务了</p>
              </div>
            )}
          </div>
        )}
      </div>
      {/* 任务提示 */}
      <div className="mx-4 mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-red-600 text-xl">
            <BulbOutlined />
          </span>
          <div>
            <h4 className="font-medium text-red-600 mb-1">接单小贴士</h4>
            <p className="text-sm text-red-600">
              请按照要求及时完成任务，高价值任务数量有限，建议关注抢单。如果遇到问题联系客服解决。
            </p>
          </div>
        </div>
      </div>
      
      {/* 分页导航 */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 mb-6">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-lg transition-colors ${currentPage === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            上一页
          </button>
          
          <div className="flex items-center space-x-1">
            {/* 页码按钮 */}
            {generatePageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {pageNum + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages - 1}
            className={`px-4 py-2 rounded-lg transition-colors ${currentPage >= totalPages - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            下一页
          </button>
        </div>
      )}
      
      {/* 页码信息显示 */}
      {totalPages > 0 && (
        <div className="text-center text-sm text-gray-500 mb-6">
          第 {currentPage + 1} / {totalPages} 页，共 {totalItems} 条任务
        </div>
      )}
      
      {/* 底部固定刷新按钮 */}
      <div className="fixed bottom-14 left-0 right-0 p-2 bg-white shadow-md">
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className={`w-full py-3 rounded-lg transition-colors ${isLoading ? 'bg-blue-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          {isLoading ? '刷新中...' : '刷新任务列表'}
        </button>
      </div>

      {/* 通用提示模态框 */}
      <AlertModal
        isOpen={showAlertModal}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        onClose={() => setShowAlertModal(false)}
      />
    </div>
  );
}