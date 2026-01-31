import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RejectedTask, RejectedTasksResponse } from '@/app/types/task/getMyAceepedTaskListComponents/SUB_Rejected';
// 导入时间排序组件
import TimeOrder from '@/components/TimeOrder/TimeOrder';

interface RejectedTasksTabProps {
  handleViewImage: (imageUrl: string) => void;
  setModalMessage: (message: string) => void;
  setShowModal: (show: boolean) => void;
}

const RejectedTasksTab: React.FC<RejectedTasksTabProps> = ({
  handleViewImage,
  setModalMessage,
  setShowModal
}) => {
  const router = useRouter();
  const [tasks, setTasks] = useState<RejectedTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // 排序状态管理
  const [sortField, setSortField] = useState<string>('reviewed_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 任务排序函数
  const sortTasks = (tasks: RejectedTask[], field: string, order: 'asc' | 'desc'): RejectedTask[] => {
    return [...tasks].sort((a, b) => {
      const aValue = a[field as keyof RejectedTask] as string;
      const bValue = b[field as keyof RejectedTask] as string;
      
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

  // 获取已拒绝任务列表
  const fetchRejectedTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/task/getMyAccepedTaskList?status=4`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: RejectedTasksResponse = await response.json();
      
      if (data.code === 0) {
        // 对任务列表进行排序
        const sortedTasks = sortTasks(data.data.list, sortField, sortOrder);
        setTasks(sortedTasks);
      } else {
        setModalMessage(data.message || '获取任务列表失败');
        setShowModal(true);
      }
    } catch (error) {
      console.error('获取已拒绝任务列表失败:', error);
      setModalMessage('获取任务列表失败，请稍后重试');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 页面加载时获取数据
  useEffect(() => {
    fetchRejectedTasks();
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

      {/* 排序按钮 */}
      {!isLoading && tasks.length > 0 && (
        <div className="mb-4 flex justify-end">
          <TimeOrder
            sortField={sortField}
            currentOrder={sortOrder}
            onSortChange={handleSortChange}
            buttonText="驳回时间"
          />
        </div>
      )}

      {/* 无任务状态 */}
      {!isLoading && tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">暂无被驳回任务</div>
      )}

      {/* 任务列表 */}
      {!isLoading && tasks.length > 0 && tasks.map((task) => (
        <div key={task.record_id} className="rounded-lg p-4 mb-2 shadow-sm transition-all hover:shadow-md bg-white border border-red-100">
          <div className="text-lg font-bold text-red-600">{task.title}</div>          
          {/* 价格和任务信息区域 */}
          <div className="mb-1">
            <div className="text-sm">奖励金额：<span className='text-red-500 font-bold'>¥{task.reward_amount}</span></div>
            <div className='text-sm'>接受时间: {task.created_at || '-'}</div>
            <div className='text-sm'>提交时间: {task.submitted_at || '-'}</div>
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
          
          {/* 驳回原因 */}
          <div className="mb-2 border border-red-200 rounded-lg p-3 bg-red-50">
            <div className="text-sm text-red-700 block mb-1">驳回原因：</div>
            <div className="text-sm bg-white p-2 rounded border border-red-200 text-gray-800">
              {task.reject_reason || '无'}
            </div>
          </div>
          
          {/* 截图显示区域 */}
          {task.screenshots && task.screenshots.length > 0 && (
            <div className="mb-4 border border-blue-200 rounded-lg p-3 bg-blue-50">
              <div className="text-sm text-blue-700 mb-1">已上传截图：</div>
              <div 
                className={`w-[100px] h-[100px] relative cursor-pointer overflow-hidden rounded-lg border border-gray-300 bg-gray-50 transition-colors hover:border-blue-400 hover:shadow-md flex items-center justify-center`}
                onClick={() => handleViewImage(task.screenshots[0])}
              >
                <img 
                  src={task.screenshots[0]} 
                  alt="任务截图"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center transition-all">
                  <span className="text-blue-500 text-lg opacity-0 hover:opacity-100 transition-opacity">点击放大</span>
                </div>
              </div>
              <p className="text-xs text-blue-500 mt-1">
                点击可放大查看截图
              </p>
            </div>
          )}
          
          {/* 任务操作区 */}
          <div className="flex justify-end mt-4 gap-2">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-4 rounded text-sm font-medium transition-colors"
              onClick={() => {
                // 跳转到任务详情页进行修改
                router.push(`/commenter/task-detail/${task.record_id}`);
              }}
            >
              联系客服
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RejectedTasksTab;