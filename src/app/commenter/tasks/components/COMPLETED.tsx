import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageOutlined } from '@ant-design/icons';

// 导入时间排序组件
import TimeOrder from '@/components/TimeOrder/TimeOrder';
// 导入任务按钮组件
import { OpenVideoButton } from '@/components/button/taskbutton';
// 导入类型定义
import { CompletedTask, CompletedTasksResponse } from '../../../types/task/getMyAceepedTaskListComponents/COMPLETED';

interface CompletedTasksTabProps {
  handleViewImage?: (imageUrl: string) => void;
  setModalMessage?: (message: string) => void;
  setShowModal?: (show: boolean) => void;
}

const CompletedTasksTab: React.FC<CompletedTasksTabProps> = ({
  handleViewImage,
  setModalMessage,
  setShowModal
}) => {
  const router = useRouter();
  const [tasks, setTasks] = useState<CompletedTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // 排序状态管理
  const [sortField, setSortField] = useState<string>('reviewed_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 任务排序函数
  const sortTasks = (tasks: CompletedTask[], field: string, order: 'asc' | 'desc'): CompletedTask[] => {
    return [...tasks].sort((a, b) => {
      const aValue = a[field as keyof CompletedTask] as string;
      const bValue = b[field as keyof CompletedTask] as string;
      
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
        // 调用API，传入status=3
         const response = await fetch('/api/task/getMyAccepedTaskList?status=3', {
            method: 'GET',
            credentials: 'include'
        });
        
        const responseData: CompletedTasksResponse = await response.json();
        
        if (responseData.code === 0) {
          // 对任务列表进行排序
          const sortedTasks = sortTasks(responseData.data.list, sortField, sortOrder);
          setTasks(sortedTasks);
        } else {
          setErrorMessage(responseData.message || '获取任务失败');
          if (setModalMessage && setShowModal) {
            setModalMessage('获取任务失败: ' + (responseData.message || '未知错误'));
            setShowModal(true);
          }
          setTasks([]);
        }
      } catch (error) {
        console.error('获取任务失败:', error);
        setErrorMessage('网络异常，请稍后重试');
        if (setModalMessage && setShowModal) {
          setModalMessage('网络异常，请稍后重试');
          setShowModal(true);
        }
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [setModalMessage, setShowModal, sortField, sortOrder]);

  return (
    <div className="mt-6">
      {isLoading ? (
        <div className="text-center py-8">加载中...</div>
      ) : errorMessage ? (
        <div className="text-center py-8 text-red-500">{errorMessage}</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">暂无已完成任务</div>
      ) : (
        <>
          {/* 排序按钮 */}
          <div className="mb-4 flex justify-end">
            <TimeOrder
              sortField={sortField}
              currentOrder={sortOrder}
              onSortChange={handleSortChange}
              buttonText="完成时间"
            />
          </div>
          
          {tasks.map((task) => (
          <div key={task.record_id} className="rounded-lg p-4 shadow-sm transition-all hover:shadow-md bg-white">
            <div className="flex justify-between items-start">
              <h3 className="text-sm text-black inline-block flex items-center">任务标题：{task.template_title || ''}</h3>
            </div>
            
            {/* 价格和任务信息区域 - 显示单价、任务状态和发布时间 */}
            <div className=" mb-1">
              <div className="text-sm inline-block">奖励金额：<span className="font-bold text-red-500 ">¥{(task.reward_amount)}</span></div>
              <div className="">
                <div className="text-sm text-black ">提交时间：{task.submitted_at}</div>            
                <div className="text-sm text-black ">审核通过时间：{task.reviewed_at}</div>
                <div className='text-sm text-blue-500 '>
                  @用户名称：<span className="font-bold text-blue-500">{task.recommend_mark.at_user || '无'}</span>
                </div>
                  <div>
                    <p>要求：</p>
                    <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded border border-blue-100 overflow-hidden text-ellipsis whitespace-normal max-h-[72px] line-clamp-3">
                      {task.recommend_mark?.comment || '无'}
                    </p>
                  </div>
                
              </div>
            </div>

            {/* 完成任务评论的链接输入区域 */}
            {task.comment_url && (
              <div className="mb-1 border border-blue-200 rounded-lg p-3 bg-blue-50">
                <span className="text-sm text-blue-700 mr-2">提交的链接:</span>
                  <OpenVideoButton
                    videoUrl={task.comment_url}
                    defaultUrl="https://www.douyin.com/video/7597258174059613481"
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm  inline-flex items-center"
                    buttonText="打开抖音"
                  />
              </div>
            )}
            
            {/* 截图显示区域 - 自适应高度，居中显示 */}
            {task.screenshots && task.screenshots.length > 0 && (
              <div className="mb-4 border border-blue-200 rounded-lg p-3 bg-blue-50">
                <div className='text-sm text-blue-500 pl-2 py-2'>完成任务截图上传：</div>
                <div 
                  className={`w-[100px] h-[100px] relative cursor-pointer overflow-hidden rounded-lg border border-gray-300 bg-gray-50 transition-colors hover:border-blue-400 hover:shadow-md flex items-center justify-center`}
                  onClick={() => handleViewImage && handleViewImage(task.screenshots[0])}
                >
                  <img 
                    src={task.screenshots[0]} 
                    alt="" 
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center transition-all">
                    <span className="text-blue-500 text-lg opacity-0 hover:opacity-100 transition-opacity">点击放大</span>
                  </div>
                </div>
                <p className="text-xs text-blue-500 mt-1 pl-2">
                  点击可放大查看截图
                </p>
              </div>
            )}
            
            {/* 查看详情按钮 
            <div className="flex space-x-2">
              <button 
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                onClick={() => router.push(`/commenter/task-detail`)}
              >
                查看详情
              </button>
            </div>
            */}
          </div>
        ))}
        </>
      )}
    </div>
  );
};

export default CompletedTasksTab;