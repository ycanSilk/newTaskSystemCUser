import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 导入类型定义
import { Task, GetMyPendingTasksResponse } from '@/app/types/task/getMyAceepedTaskListComponents/SUBMITTED';
// 导入无任务提示组件
import NoTaskHint from '@/components/NoTaskHint/NoTaskHint';
// 导入时间排序组件
import TimeOrder from '@/components/TimeOrder/TimeOrder';

interface PendingReviewTasksTabProps {
  handleViewImage: (imageUrl: string) => void;
  setModalMessage: (message: string) => void;
  setShowModal: (show: boolean) => void;
}

const PendingReviewTasksTab: React.FC<PendingReviewTasksTabProps> = ({
  handleViewImage,
  setModalMessage,
  setShowModal
}) => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // 排序状态管理
  const [sortField, setSortField] = useState<string>('submitted_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 任务排序函数
  const sortTasks = (tasks: Task[], field: string, order: 'asc' | 'desc'): Task[] => {
    return [...tasks].sort((a, b) => {
      const aValue = a[field as keyof Task] as string;
      const bValue = b[field as keyof Task] as string;
      
      if (order === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  };

  // 排序变化处理函数
  const handleSortChange = (field: string, order: 'asc' | 'desc') => {
    setSortField(field);
    setSortOrder(order);
  };

  // 组件加载时调用API获取数据
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      
      try {
        // 调用API，传入status=2
        const response = await fetch('/api/task/getMyAccepedTaskList?status=2', {
          method: 'GET',
          credentials: 'include'
        });
        
        const responseData: GetMyPendingTasksResponse = await response.json();
        
        if (responseData.code === 0) {
          // 对任务列表进行排序
          const sortedTasks = sortTasks(responseData.data.list, sortField, sortOrder);
          setTasks(sortedTasks);
        } else {
          setErrorMessage(responseData.message || '获取任务失败');
          setModalMessage('获取任务失败: ' + (responseData.message || '未知错误'));
          setShowModal(true);
          setTasks([]);
        }
      } catch (error) {
        console.error('获取任务失败:', error);
        setErrorMessage('网络异常，请稍后重试');
        setModalMessage('网络异常，请稍后重试');
        setShowModal(true);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [setModalMessage, setShowModal, sortField, sortOrder]);

  return (
    <div className="mt-6">
      {/* 加载状态 */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-blue-600">加载中...</p>
        </div>
      )}

      {/* 错误状态 */}
      {!isLoading && errorMessage && (
        <div className="text-center py-8 bg-red-50 rounded-lg">
          <p className="text-red-500">{errorMessage}</p>
        </div>
      )}

      {/* 无任务状态 */}
      {!isLoading && !errorMessage && tasks.length === 0 && (
        <NoTaskHint
          message="暂无待审核任务"
          buttonText="刷新任务列表"
          showButton={false}
          onButtonClick={() => {
            const fetchTasks = async () => {
              setIsLoading(true);
              setErrorMessage(null);
              
              try {
                // 调用API，传入status=2
                const response = await fetch('/api/task/getMyAccepedTaskList?status=2', {
                  method: 'GET',
                  credentials: 'include'
                });
                
                const responseData: GetMyPendingTasksResponse = await response.json();
                
                if (responseData.code === 0) {
                  setTasks(responseData.data.list);
                } else {
                  setErrorMessage(responseData.message || '获取任务失败');
                  setModalMessage('获取任务失败: ' + (responseData.message || '未知错误'));
                  setShowModal(true);
                  setTasks([]);
                }
              } catch (error) {
                console.error('获取任务失败:', error);
                setErrorMessage('网络异常，请稍后重试');
                setModalMessage('网络异常，请稍后重试');
                setShowModal(true);
                setTasks([]);
              } finally {
                setIsLoading(false);
              }
            };
            
            fetchTasks();
          }}
        />
      )}

      {/* 排序按钮 */}
      {!isLoading && !errorMessage && tasks.length > 0 && (
        <div className="mb-4 flex justify-end">
          <TimeOrder
            sortField={sortField}
            currentOrder={sortOrder}
            onSortChange={handleSortChange}
            buttonText="按提交时间排序"
          />
        </div>
      )}

      {/* 任务列表 */}
      {!isLoading && !errorMessage && tasks.length > 0 && tasks.map((task) => (
        <div key={task.id || 'unknown'} className="rounded-lg p-4 mb-4 shadow-sm transition-all hover:shadow-md bg-white">
          <div className="flex justify-between items-start">
            <h3 className="text-sm text-black inline-block flex items-center">
              任务标题：{task.template_title || '未命名任务'}
              <button 
                className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                onClick={() => {
                  const taskIdToCopy = task.record_id.toString();
                  
                  // 检查navigator.clipboard是否可用
                  if (!navigator.clipboard) {
                    // 如果clipboard API不可用，使用传统的复制方法
                    const textArea = document.createElement('textarea');
                    textArea.value = taskIdToCopy;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    document.body.appendChild(textArea);
                    textArea.select();
                    
                    try {
                      document.execCommand('copy');
                      setModalMessage('任务ID已复制到剪贴板');
                      setShowModal(true);
                    } catch (err) {
                      console.error('复制失败:', err);
                      setModalMessage('复制失败，请手动复制');
                      setShowModal(true);
                    } finally {
                      document.body.removeChild(textArea);
                    }
                    return;
                  }
                  
                  // 如果clipboard API可用，使用它
                  navigator.clipboard.writeText(taskIdToCopy).then(() => {
                    // 使用模态框显示复制成功提示
                    setModalMessage('任务ID已复制到剪贴板');
                    setShowModal(true);
                  }).catch(err => {
                    console.error('复制失败:', err);
                    setModalMessage('复制失败，请手动复制');
                    setShowModal(true);
                  });
                }}
              >
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-xs inline-block">复制任务ID</span>
              </button>
            </h3>
          </div>
          
          {/* 价格和任务信息区域 - 显示单价、任务状态和发布时间 */}
          <div className="">
            <div className="text-sm inline-block">奖励金额：<span className="font-bold text-red-500 ">¥{(task.reward_amount)}</span></div>
            <div className="text-sm">
              <span>提交时间: {task.submitted_at || '-'}</span>
            </div>
          </div>
          {/* 提交的链接显示 */}
          {task.comment_url && (
            <div className="mb-4 mt-2 border border-blue-200 rounded-lg p-3 bg-blue-50">
              <span className="text-sm text-blue-700 mr-2">提交的链接：</span>
              <button
                className="mt-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                onClick={() => task.comment_url && window.open(task.comment_url, '_blank')}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                打开链接
              </button>
            </div>
          )}
          
          {/* 已上传截图显示 - 只显示第一个 */}
          {task.screenshots && Array.isArray(task.screenshots) && task.screenshots.length > 0 && (
            <div className="mb-4 border border-green-200 rounded-lg p-3 bg-green-50">
              <span className="text-sm text-green-700 block mb-2">已上传截图：</span>
              <div>
                <img
                  src={task.screenshots[0]}
                  alt="任务截图"
                  className="w-[100px] h-[100px] object-cover rounded-lg border border-gray-300 cursor-pointer hover:shadow-md"
                  onClick={() => handleViewImage(task.screenshots[0])}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PendingReviewTasksTab;