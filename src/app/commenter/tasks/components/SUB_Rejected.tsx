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
            buttonText="按驳回时间排序"
          />
        </div>
      )}

      {/* 无任务状态 */}
      {!isLoading && tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">暂无被驳回任务</div>
      )}

      {/* 任务列表 */}
      {!isLoading && tasks.length > 0 && tasks.map((task) => (
        <div key={task.record_id} className="rounded-lg p-4 mb-4 shadow-sm transition-all hover:shadow-md bg-white border border-red-100">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm text-black inline-block flex items-center">
              订单号：{task.record_id || '未命名任务'}
              <button 
                className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(task.record_id.toString()).then(() => {
                    setModalMessage('订单号已复制到剪贴板');
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
                <span className="text-xs inline-block">复制</span>
              </button>
            </h3>
          </div>
          
          {/* 价格和任务信息区域 */}
          <div className="mb-2">
            <div className="text-sm mb-1 inline-block">奖励金额：<span className='text-red-500 font-bold'>¥{task.reward_amount}</span></div>
            <div className="space-y-2">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 mr-2">
                  {task.status_text || '已驳回'}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {task.template_title}
                </span>
              </div>
              
              <div className='text-sm'>接受时间: {task.created_at || '-'}</div>
              <div className='text-sm'>提交时间: {task.submitted_at || '-'}</div>
            </div>
          </div>

          <div className="text-sm mb-2 overflow-hidden text-ellipsis whitespace-normal max-h-[72px] line-clamp-3">
            要求：{task.recommend_mark.comment || '无特殊要求'}
          </div>
          
          {/* 驳回原因 */}
          <div className="mb-4 border border-red-200 rounded-lg p-3 bg-red-50">
            <div className="text-sm text-red-700 block mb-2">驳回原因：</div>
            <div className="text-sm bg-white p-2 rounded border border-red-200 text-gray-800">
              {task.reject_reason || '无'}
            </div>
          </div>
          
          {/* 截图显示区域 */}
          {task.screenshots && task.screenshots.length > 0 && (
            <div className="mb-4 border border-blue-200 rounded-lg p-3 bg-blue-50">
              <div className="text-sm text-blue-700 mb-2">已上传截图：</div>
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