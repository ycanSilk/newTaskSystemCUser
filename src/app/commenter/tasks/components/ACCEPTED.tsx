import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EditOutlined, CopyOutlined, LinkOutlined } from '@ant-design/icons';

// 导入图片上传组件
import ImageUpload from '@/components/imagesUpload/ImageUpload';
// 导入空状态组件
import EmptyState from '@/components/NoTaskHint/NoTaskHint';
// 导入时间排序组件
import TimeOrder from '@/components/TimeOrder/TimeOrder';
// 导入任务按钮组件
import { CopyCommentButton, OpenVideoButton } from '@/components/button/taskbutton';

// 导入外部类型定义
import {
  Task,
  GetMyAcceptedTaskListResponse,
  SubmitTaskRequest,
  SubmitTaskResponse
} from '@/app/types/task/getMyAceepedTaskListComponents/ACCEPTED';

const defaultUrl='https://www.douyin.com/video/7598199346240228614'

interface ProgressTasksTabProps {
  handleViewImage?: (imageUrl: string) => void;
  setModalMessage: (message: string) => void;
  setShowModal: (show: boolean) => void;
  handleCopyComment?: (taskId: string, comment?: string) => void;
  handleUploadScreenshot?: (taskId: string) => void;
  handleRemoveImage?: (taskId: string) => void;
  handleSubmitOrder?: (taskId: string) => void;
  isSubmitting?: boolean;
  uploadStatus?: Record<string, 'compressing' | 'uploading' | 'success' | 'error'>;
}


const ProgressTasksTab: React.FC<ProgressTasksTabProps> = ({
  handleViewImage,
  setModalMessage,
  setShowModal,
  handleCopyComment,
  handleUploadScreenshot,
  handleRemoveImage,
  handleSubmitOrder,
  isSubmitting
}) => {
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
  
  // 状态管理
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // 排序状态管理
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // 组件加载时调用API获取数据
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      
      try {
        // 调用API，传入status=1，添加cache-control头防止浏览器缓存
        const response = await fetch('/api/task/getMyAccepedTaskList?status=1', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        const responseData: GetMyAcceptedTaskListResponse = await response.json();
        
        if (responseData.code === 0) {
          // API成功时，显示API返回的数据
          console.log('API请求成功，显示API返回的数据');
          const sortedTasks = sortTasks(responseData.data.list, sortField, sortOrder);
          setTasks(sortedTasks);
        } else {
          // API失败时，显示空数据并显示错误信息
          console.log('API返回失败，显示空数据');
          setTasks([]);
          setErrorMessage(responseData.message || '获取任务失败');
          setModalMessage('获取任务失败: ' + (responseData.message || '未知错误'));
          setShowModal(true);
        }
      } catch (error) {
        console.error('获取任务失败，显示空数据:', error);
        // 网络异常时显示空数据
        setTasks([]);
        setErrorMessage('网络异常，请稍后重试');
        setModalMessage('网络异常，请稍后重试');
        setShowModal(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
    
    // 添加轮询功能，每10分钟检测一次任务状态变化
    const pollingInterval = setInterval(fetchTasks, 10 * 60 * 1000);
    // 组件卸载时清除定时器
    return () => clearInterval(pollingInterval);
  }, [setModalMessage, setShowModal, sortField, sortOrder]);
  
  // 排序变化处理函数
  const handleSortChange = (field: string, order: 'asc' | 'desc') => {
    setSortField(field);
    setSortOrder(order);
  };
    // 组件内部状态管理
    const [reviewLinks, setReviewLinks] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
    // 视频模态框状态
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVideoUrl, setCurrentVideoUrl] = useState('');
    const [currentComment, setCurrentComment] = useState('');
    // 提交成功模态框状态
    const [isSubmitSuccessModalOpen, setIsSubmitSuccessModalOpen] = useState(false);
    
  // 处理评论链接输入变化
  const handleReviewLinkChange = (taskId: string, value: string) => {
    setReviewLinks(prev => ({ ...prev, [taskId]: value }));
    // 清除相关错误提示
    if (errors[taskId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[taskId];
        return newErrors;
      });
    }
  };

  //打开视频按钮跳转函数
  const handleOpenVideoModal = async (videoUrl: string) => {
    console.log('传入的url', videoUrl);
    // 打开新标签页跳转到指定URL
    const defaultUrl='https://www.douyin.com/video/7598199346240228614'
    const newWindow = window.open(defaultUrl);
    console.log('新标签页已打开');
    // 复制URL到剪贴板（兼容PC和手机端，支持HTTP和HTTPS）
    try {
      // 优先尝试现代剪贴板API（确保navigator.clipboard和writeText方法都存在）
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        try {
          await navigator.clipboard.writeText(videoUrl);
          console.log('URL已复制到剪贴板（现代API）', videoUrl);
        } catch (clipboardError) {
          console.log('现代剪贴板API失败，尝试传统方法:', clipboardError);
          // 现代API失败时回退到传统方法
          useTraditionalCopyMethod(videoUrl);
        }
      } else {
        // 不支持现代剪贴板API时使用传统方法
        useTraditionalCopyMethod(videoUrl);
      }
    } catch (error) {
      console.error('复制到剪贴板失败:', error);
    }
  };
  
  // 传统复制方法（支持HTTP和HTTPS环境）
  const useTraditionalCopyMethod = (text: string) => {
    try {
      // 创建临时textarea元素
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // 设置样式使其不可见
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      
      // 添加到文档
      document.body.appendChild(textArea);
      
      // 选择并复制文本
      textArea.focus();
      textArea.select();
      
      // 对于移动设备，尝试设置选择范围
      if (typeof textArea.setSelectionRange === 'function') {
        textArea.setSelectionRange(0, text.length);
      } else {
        // 对于不支持setSelectionRange的浏览器
        (textArea as any).createTextRange().select();
      }
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          console.log('URL已复制到剪贴板（传统方法）', text);
        } else {
          console.error('传统复制方法失败: execCommand返回false');
        }
      } catch (err) {
        console.error('传统复制方法失败:', err);
      } finally {
        // 清理临时元素
        setTimeout(() => {
          document.body.removeChild(textArea);
        }, 100);
      }
    } catch (error) {
      console.error('传统复制方法执行失败:', error);
    }
  };

  // 打开评论链接按钮跳转函数
  const handleOpenCommentLink = async (commentUrl: string) => {
    console.log('打开评论链接:', commentUrl);
    if (commentUrl) {
      const newWindow = window.open(commentUrl, '_blank');
      if (newWindow) {
        console.log('评论链接已打开');
        newWindow.focus();
      }
    }
  };
  
  // 刷新任务列表函数
  const handleRefreshTasks = async () => {
    setIsLoading(true);
    try {
      // 调用API，传入status=1
      const response = await fetch('/api/task/getMyAccepedTaskList?status=1', {
        method: 'GET',
        credentials: 'include'
      });
      
      const responseData: GetMyAcceptedTaskListResponse = await response.json();
      
      if (responseData.code === 0) {
        setTasks(responseData.data.list);
      } else {
        setModalMessage('刷新任务失败: ' + (responseData.message || '未知错误'));
        setShowModal(true);
      }
    } catch (error) {
      console.error('刷新任务失败:', error);
      setModalMessage('网络异常，请稍后重试');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };
    // 提交任务函数
    const handleSubmitTask = async (task: Task) => {
      // 构建请求数据
      const requestData: SubmitTaskRequest = {
        b_task_id: task.b_task_id,
        record_id: task.record_id,
        comment_url: reviewLinks[task.id] || '',
        screenshots: Array.isArray(task.screenshots) ? task.screenshots : []
      };
      
      // 验证必填字段
      if (!requestData.comment_url) {
        setErrors(prev => ({ ...prev, [task.id]: '请输入评论链接' }));
        return;
      }
      
      if (!requestData.screenshots || requestData.screenshots.length === 0) {
        setErrors(prev => ({ ...prev, [task.id]: '请上传截图' }));
        return;
      }
      
      try {
        // 调用API
        const response = await fetch('/api/task/submitTask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(requestData),
        });
        
        const responseData: SubmitTaskResponse = await response.json();
        
        if (responseData.code === 0) {
          // 提交成功
          console.log('提交成功', responseData);
          // 显示提交成功模态框
          setIsSubmitSuccessModalOpen(true);
          // 延迟刷新任务列表
          setTimeout(() => {
            handleRefreshTasks();
          }, 1000);

        } else {
          // 提交失败
          setModalMessage(responseData.message || '任务提交失败');
          setShowModal(true);
        }
      } catch (error) {
        console.error('提交任务失败:', error);
        setModalMessage('网络异常，请稍后重试');
        setShowModal(true);
      }
    };

    // 图片上传组件相关状态
    const [images, setImages] = useState<Record<string, File[]>>({});
    const [imageUrls, setImageUrls] = useState<Record<string, string[]>>({});
    const [currentTaskId, setCurrentTaskId] = useState<string>('');
    
  // 页面跳转逻辑
  const router = useRouter();

  return (
    <div className="mt-6">
      {/* 加载状态显示 */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-blue-600">加载中...</span>
        </div>
      )}

      {/* 空状态显示 */}
      {!isLoading && tasks.length === 0 && (
        <EmptyState
          message="暂无进行中的任务"
          buttonText="刷新任务列表"
          showButton={true}
          onButtonClick={() => handleRefreshTasks()}
        />
      )}

      {/* 排序按钮 */}
      {!isLoading && tasks.length > 0 && (
        <div className="mb-1 flex justify-end">
          <TimeOrder
            sortField={sortField}
            currentOrder={sortOrder}
            onSortChange={handleSortChange}
            buttonText="接取时间"
          />
        </div>
      )}

      {/* 任务列表 */}
      {!isLoading && tasks.length > 0 && tasks.map((task) => (
        <div key={task.id || 'unknown'} className="rounded-lg p-4 mb-1 shadow-sm transition-all hover:shadow-md bg-white">
          {/* 添加任务操作按钮组 */}
          
          <div className=" mb-2">
            <h3 className="">
              任务标题：{task.template_title}
            </h3>
            <p>任务ID：{task.b_task_id}</p>
          </div>
           
          {/* 价格和任务信息区域 - 显示单价、任务状态和发布时间 */}
          <div className="mb-2">
            <div className="text-sm mb-1 inline-block">奖励金额：<span className="font-bold text-red-500 ">¥{(task.reward_amount)}</span></div>
              <div className="space-y-2 mb-1">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {task.status_text}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 ml-2">
                    {task.template_title}
                  </span>
                </div>
                <div className="text-sm text-black block">
                  接受时间：{task.created_at}
                </div>  
                <div className="text-sm text-black block">
                  截止时间：{task.deadline_text}
                </div>
              </div>
          </div>

          {/* 推荐评论区域 - 所有任务都显示 */}
        <div className="mb-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <div className="flex justify-between items-center mb-1">
            <div>@用户名称：{task.recommend_mark?.at_user || '无'}</div>
            <h4 className="text-sm font-medium text-blue-700"><EditOutlined className="inline-block mr-1" /> 要求：</h4>
            <CopyCommentButton
              comment={task.recommend_mark?.comment || ''}
              className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-500 transition-colors"
              buttonText="复制评论"
            />
          </div>
          <p className="text-sm text-black bg-white p-3 rounded border border-blue-100 overflow-hidden text-ellipsis whitespace-normal max-h-[72px] line-clamp-3">
            {task.recommend_mark?.comment || '无'}
          </p>
        </div>
      
      <div className="mb-2 bg-blue-50 border border-blue-500 py-2 px-3 rounded-lg">
          <p className='mb-1  text-sm text-blue-600'>任务视频点击进入：</p>
          <OpenVideoButton 
            videoUrl={task.video_url}
            defaultUrl="https://www.douyin.com/video/7597258174059613481"
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm  inline-flex items-center"
            buttonText="打开抖音"
          />
      </div>    

      {/* 评论链接输入框 - 新增 */}
      <div className="mb-1 border border-blue-200 rounded-lg p-3 bg-blue-50">
        <label className="block text-sm font-medium mb-1 text-blue-700">
          <LinkOutlined className="inline-block mr-1" /> 完成任务评论的链接输入:
        </label>
        <input
          type="text"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors[task.id] ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="完成任务评论的链接输入"
          value={reviewLinks[task.id] || task.comment_url || ''}
          onChange={(e) => handleReviewLinkChange(task.id, e.target.value)}
        />
      </div>

          {/* 截图上传区域 - 使用新的上传图片组件 */}
          <div className="mb-1 border border-blue-200 rounded-lg p-3 bg-blue-50">
            <div className='text-sm text-blue-600 pl-2 py-2'>完成任务截图上传：</div>
            <div>
              <ImageUpload
                maxCount={1}
                onImagesChange={(newImages, urls) => {
                  // 更新任务的截图URL
                  if (urls.length > 0) {
                    setTasks(prevTasks => 
                      prevTasks.map(t => 
                        t.id === task.id 
                          ? { ...t, screenshots: urls } 
                          : t
                      )
                    );
                  } else {
                    // 清空截图
                    setTasks(prevTasks => 
                      prevTasks.map(t => 
                        t.id === task.id 
                          ? { ...t, screenshots: [] } 
                          : t
                      )
                    );
                  }
                }}
                itemSize="100x100"
                title=""
              />
            </div>
            
            {/* 提交任务按钮 */}
            <div className="flex justify-end mt-4">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                onClick={() => handleSubmitTask(task)}
                disabled={isSubmitting}
              >
                {isSubmitting ? '提交中...' : '提交任务'}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* 提交成功模态框 */}
      {isSubmitSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-[90%] mx-auto">
            <h3 className="text-xl font-bold text-center mb-1 text-blue-600">提交成功</h3>
            <p className="text-center mb-6">您的任务已成功提交，正在等待审核</p>
            <div className="flex flex-col space-y-3">
              <button
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                onClick={() => {
                  setIsSubmitSuccessModalOpen(false);
                  // 跳转到待审核任务页面
                  router.push('/commenter/tasks');
                }}
              >
                查看待审核的任务
              </button>
              <button
                className="w-full bg-gray-600 text-white py-2.5 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm"
                onClick={() => {
                  setIsSubmitSuccessModalOpen(false);
                  // 跳转到继续接取任务页面
                  router.push('/commenter/hall-content');
                }}
              >
                继续接取任务
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgressTasksTab;