'use client';

import React, { useState, useEffect } from 'react';
import { UserAddOutlined } from '@ant-design/icons';
import { GetAgentInviteListResponse } from '@/app/types/agent/getAgentInviteListTypes';

const InvitedFriends: React.FC = () => {
  const [inviteData, setInviteData] = useState<GetAgentInviteListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 页面加载时获取邀请列表数据
  useEffect(() => {
    const fetchInviteList = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/agent/getAgentInvitelList', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        setInviteData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? `获取邀请列表失败: ${err.message}` : '获取邀请列表时发生未知错误';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInviteList();
  }, []);

  return (
    <div className="mx-4 space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="text-center">
            <h3 className="font-bold text-gray-800">已邀请好友 ({inviteData?.data?.list.length || 0}人)</h3>
          </div>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 border-opacity-70 mx-auto mb-4"></div>
            <div className="text-gray-600">加载中...</div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <div className="text-red-600 font-medium mb-2">加载失败</div>
            <div className="text-gray-500 text-sm">{error}</div>
          </div>
        ) : inviteData?.success && inviteData.data?.list && inviteData.data.list.length > 0 ? (
          <div className="divide-y">
            {inviteData.data.list.map((user, index) => (
              <div key={index} className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="">
                    <div className="font-medium text-gray-800">邀请用户：{user.username}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600">完成任务数量: {user.completed_tasks}</div>
                  <div className="text-xs text-gray-400">邀请时间: {user.created_at}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y">
            <div className="p-8 text-center">
              <UserAddOutlined className="text-gray-400 text-5xl mb-4" />
              <div className="">您还没有邀请任何好友</div>
              <div className="text-gray-400 text-sm mt-2">快去邀请好友加入吧，一起赚取佣金！</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitedFriends;