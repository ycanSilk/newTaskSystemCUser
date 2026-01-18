import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageOutlined } from '@ant-design/icons';

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
          setTasks(responseData.data.list);
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
  }, [setModalMessage, setShowModal]);

  return (
    <div className="mt-6">
      {isLoading ? (
        <div className="text-center py-8">加载中...</div>
      ) : errorMessage ? (
        <div className="text-center py-8 text-red-500">{errorMessage}</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">暂无已完成任务</div>
      ) : (
        tasks.map((task) => (
          <div key={task.record_id} className="rounded-lg p-4 shadow-sm transition-all hover:shadow-md bg-white">
            <div className="flex justify-between items-start">
              <h3 className="text-sm text-black inline-block flex items-center">
                任务标题：{task.template_title || '未命名任务'}
                <button 
                  className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(task.record_id.toString()).then(() => {
                      // 使用模态框显示复制成功提示
                      if (setModalMessage && setShowModal) {
                        setModalMessage('任务ID已复制到剪贴板');
                        setShowModal(true);
                      }
                    }).catch(err => {
                      console.error('复制失败:', err);
                      if (setModalMessage && setShowModal) {
                        setModalMessage('复制失败，请手动复制');
                        setShowModal(true);
                      }
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
            <div className=" mb-1">
              <div className="text-sm inline-block">奖励金额：<span className="font-bold text-red-500 ">¥{(task.reward_amount)}</span></div>
              <div className="space-y-1">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 mr-2">
                    {task.status_text}
                  </span>
                </div>
                <div className="text-sm text-black ">
                    提交时间：{task.submitted_at}
                </div>
            
                <div className="text-sm text-black ">
                    审核通过时间：{task.reviewed_at}
                </div>
        
                <div className="text-sm text-black mb-2 overflow-hidden text-ellipsis whitespace-normal max-h-[72px] line-clamp-3 block">
                  推荐发布的评论：{task.recommend_mark.comment || ''}
                </div>
            
                <div className='text-sm text-blue-500 block'>
                  @用户名称：<span className="font-bold text-blue-500">{task.recommend_mark.at_user || '无'}</span>
                </div>
              </div>
            </div>

            {/* 完成任务评论的链接输入区域 */}
            {task.comment_url && (
              <div className="mb-4 border border-blue-200 rounded-lg p-3 bg-blue-50">
                <span className="text-sm text-blue-700 mr-2">提交的链接</span>
                <button
                  className="bg-blue-600 mt-1 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                  onClick={() => task.comment_url && window.open(task.comment_url, '_blank')}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  打开视频
                </button>
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
            
            {/* 查看详情按钮 */}
            <div className="flex space-x-2">
              <button 
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                onClick={() => router.push(`/commenter/task-detail`)}
              >
                查看详情
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CompletedTasksTab;