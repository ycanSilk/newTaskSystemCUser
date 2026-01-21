"use client"

import React, { useState } from 'react';
import InviteFriend from './inviteCompenter/InviteFriend';
import InvitedFriends from './inviteCompenter/InvitedFriendsList';
import CommissionEarnings from './inviteCompenter/CommissionEarnings';

// 邀请页面组件
const InvitePage = () => {
  const [activeTab, setActiveTab] = useState<'invite' | 'invited' | 'commission'>('invite');
  const [error, setError] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 错误提示 */}
      {error && (
        <div className="fixed top-6 right-6 bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-lg shadow-lg z-50 max-w-md animate-slide-in transition-all duration-300">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-xl">⚠️</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="font-bold text-red-800">操作失败</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
            <button 
              className="ml-4 flex-shrink-0 text-red-400 hover:text-red-600 transition-colors" 
              onClick={() => setError(null)}
              aria-label="关闭"
            >
              <span className="text-lg font-semibold">×</span>
            </button>
          </div>
        </div>
      )}

      {/* 标签页切换 - 美化样式 */}
      <div className="bg-white px-4 py-4 shadow-sm mb-4">
        <div className="flex gap-5 mt-2 max-w-3xl mx-auto">
          <button
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${activeTab === 'invite' 
              ? 'bg-blue-500 text-white shadow-md transform scale-105' 
              : 'bg-blue-100  hover:bg-blue-200'}`}
            onClick={() => setActiveTab('invite')}
          >
            <span className="flex items-center justify-center">
              邀请好友
            </span>
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${activeTab === 'invited' 
              ? 'bg-blue-500 text-white shadow-md transform scale-105' 
              : 'bg-blue-100 hover:bg-blue-200'}`}
            onClick={() => setActiveTab('invited')}
          >
            <span className="flex items-center justify-center">
              已邀请好友
            </span>
          </button>
          {/*<button
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${activeTab === 'commission' 
              ? 'bg-blue-500 text-white shadow-md transform scale-105' 
              : 'bg-blue-100 hover:bg-blue-200'}`}
            onClick={() => setActiveTab('commission')}
          >
            <span className="flex items-center justify-center">
              佣金收益
            </span>
          </button>
          */}
        </div>
      </div>

      {/* 邀请好友标签页 */}
      {activeTab === 'invite' && <InviteFriend setError={setError} />}

      {/* 已邀请好友标签页 */}
      {activeTab === 'invited' && <InvitedFriends />}

      {/* 佣金收益标签页 */}
      {activeTab === 'commission' && <CommissionEarnings />}

      {/* 底部间距，确保内容不被遮挡 */}
      <div className="pb-20"></div>
    </div>
  );
};

export default InvitePage;