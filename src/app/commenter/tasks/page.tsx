'use client';

import React, { useState } from 'react';
import { BulbOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import ProgressTasksTab from './components/ACCEPTED';
import PendingReviewTasksTab from './components/SUBMITTED';
import CompletedTasksTab from './components/COMPLETED';
import RejectedTasksTab from './components/SUB_Rejected';

// 导入类型定义
import { TaskStatus } from '@/app/types/task/getMyAccepedTaskListTypes';

export default function CommenterTasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 从URL参数中获取初始tab值，如果没有则默认为ACCEPTED
  const tabFromUrl = (searchParams?.get('tab') || '')?.trim() as TaskStatus | null;
  const [activeTab, setActiveTab] = useState<TaskStatus>(tabFromUrl || 'ACCEPTED');
  
  // 状态管理 - 只保留必要的UI状态
  const [showModal, setShowModal] = useState(false); // 控制模态框显示
  const [modalMessage, setModalMessage] = useState(''); // 模态框消息内容
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // 用于放大查看的图片URL
  
  // 查看大图功能
  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  // 关闭大图查看
  const handleCloseImageViewer = () => {
    setSelectedImage(null);
  };

  // 处理标签切换，同时更新URL参数
  const handleTabChange = (tab: TaskStatus) => {
    setActiveTab(tab);
    
    // 更新URL参数
    router.replace(`/commenter/tasks?tab=${tab}`);
  };

  // 获取按钮样式
  const getTabButtonStyle = (status: TaskStatus) => {
    const isActive = activeTab === status;
    return `flex-1 p-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-blue-500 text-white shadow-md' : 'bg-white border text-gray-600 hover:bg-blue-50'}`;
  };

  
  return (
    <>
      {/* 图片查看器 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={handleCloseImageViewer}
        >
          <div className="absolute top-4 right-4 text-white">
            <button 
              className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseImageViewer();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div 
            className="relative max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage} 
              alt="预览图片" 
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
      
      <div className="pb-20">
        {/* 提示信息 */}
        <div className='px-4 py-2 bg-white text-red-500 text-xs'>单个抖音账号每天评论任务次数5次以内。超过5次可能会影响抖音账号权重导致无法正常显示评论影响个人账号的完成率。如个人有多个家庭抖音账号，可以注册多个平台账号。</div>
        
        {/* 任务状态筛选（合并统计和筛选功能） */}
        <div className="mx-4 mt-4 flex space-x-2">
          <button 
            onClick={() => handleTabChange('ACCEPTED')}
            className={getTabButtonStyle('ACCEPTED')}
          >
            <span>进行中</span>
          </button>
          <button 
            onClick={() => handleTabChange('SUBMITTED')}
            className={getTabButtonStyle('SUBMITTED')}
          >
            <span>待审核</span>
          </button>
          <button 
            onClick={() => handleTabChange('COMPLETED')}
            className={getTabButtonStyle('COMPLETED')}
          >
            <span>已完成</span>
          </button>
          <button 
            onClick={() => handleTabChange('SUB_Rejected')}
            className={getTabButtonStyle('SUB_Rejected')}
          >
            <span>驳回订单</span>
          </button>
        </div>
        
        {/* 主内容区域 - 根据activeTab渲染对应的组件 */}
        <div className="mx-4 mt-6">
          {activeTab === 'ACCEPTED' && (
            <ProgressTasksTab 
              setModalMessage={setModalMessage}
              setShowModal={setShowModal}
            />
          )}
          
          {activeTab === 'SUBMITTED' && (
            <PendingReviewTasksTab
              handleViewImage={handleViewImage}
              setModalMessage={setModalMessage}
              setShowModal={setShowModal}
            />
          )}
          
          {activeTab === 'COMPLETED' && (
            <CompletedTasksTab
              handleViewImage={handleViewImage}
              setModalMessage={setModalMessage}
              setShowModal={setShowModal}
            />
          )}
          
          {activeTab === 'SUB_Rejected' && (
            <RejectedTasksTab
              handleViewImage={handleViewImage}
              setModalMessage={setModalMessage}
              setShowModal={setShowModal}
            />
          )}
        </div>
        
        {/* 任务提示 */}
        <div className="mx-4 mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <BulbOutlined className="text-blue-500 text-xl" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">任务小贴士</h4>
              <p className="text-sm text-blue-600">
                按时完成任务可以提高信誉度，获得更多高价值任务推荐。记得在截止时间前提交哦！
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}