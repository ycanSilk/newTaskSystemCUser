import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 导入类型定义
import { Task, GetMyPendingTasksResponse } from '@/app/types/task/getMyAceepedTaskListComponents/SUBMITTED';
// 导入无任务提示组件
import NoTaskHint from '@/components/NoTaskHint/NoTaskHint';
// 导入时间排序组件
import TimeOrder from '@/components/TimeOrder/TimeOrder';

// 导入任务按钮组件
import { CopyCommentButton, OpenVideoButton } from '@/components/button/taskbutton';

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
            buttonText="审核时间"
          />
        </div>
      )}

      {/* 任务列表 */}
      {!isLoading && !errorMessage && tasks.length > 0 && tasks.map((task) => (
        <div key={task.id || 'unknown'} className="rounded-lg p-4 mb-4 shadow-sm transition-all hover:shadow-md bg-white">
          <div className="flex justify-between items-start">
            <h3 className="text-sm text-black inline-block flex items-center">
              任务标题：{task.template_title || '未命名任务'}
            </h3>
          </div>
          
          {/* 价格和任务信息区域 - 显示单价、任务状态和发布时间 */}
          <div className="">
            <div className="text-sm inline-block">奖励金额：<span className="font-bold text-red-500 ">¥{(task.reward_amount)}</span></div>
            <div className="text-sm">
              <span>提交时间: {task.submitted_at || '-'}</span>
            </div>
          </div>
          <div className='text-sm text-blue-500 '>@用户名称：{task.recommend_mark?.at_user || '无'}</div>
          <p>要求：</p>
          <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded border border-blue-100 overflow-hidden text-ellipsis whitespace-normal max-h-[72px] line-clamp-3">
            {task.recommend_mark?.comment || '无'}
          </p>
          {/* 提交的链接显示 */}
          {task.comment_url && (
            <div className="mb-1 mt-2 p-3 bg-blue-50 border border-blue-100 rounded">
              <span className="text-sm text-blue-700 mr-2">提交的链接：</span>
              <CopyCommentButton
              comment={task.comment_url || ''}
              className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-500 transition-colors"
              buttonText="复制评论"
            />
              
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