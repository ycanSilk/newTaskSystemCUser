"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserOutlined, CodeOutlined, MessageOutlined, MobileOutlined, LaptopOutlined, ShareAltOutlined, BulbOutlined, RightOutlined, UserAddOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { User } from '@/types';
import { generateInviteCode } from '@/lib/utils';
import { GetAgentInfoResponse } from '@/app/types/agent/getAgentInfoTypes';

// 邀请页面组件
const InvitePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'invite' | 'invited' | 'commission'>('invite');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [agentInfo, setAgentInfo] = useState<any>(null);

  // 页面加载时获取代理信息
  useEffect(() => {
    const fetchAgentInfo = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 调用getAgentInfo API
        const response = await fetch('/api/agent/getAgentInfo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const result: GetAgentInfoResponse = await response.json();
        

        console.log('请求获取代理API的结果',result)
        if (result.success) {
          setAgentInfo(result.data);
        } else {
          setError(result.message || '获取代理信息失败');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? `网络或系统错误: ${err.message}` : '获取代理信息时发生未知错误';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgentInfo();
  }, []);

  // 复制邀请码
  const copyInviteLink = async () => {
    try {
      const inviteCode = agentInfo?.invite_code || '';
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true); 
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      alert('复制失败，请手动复制');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 加载状态 */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 transition-all duration-300">
          <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500 border-opacity-70 mb-4"></div>
            <div className="text-gray-700 font-medium">加载中...</div>
          </div>
        </div>
      )}

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
          <button
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${activeTab === 'commission' 
              ? 'bg-blue-500 text-white shadow-md transform scale-105' 
              : 'bg-blue-100 hover:bg-blue-200'}`}
            onClick={() => setActiveTab('commission')}
          >
            <span className="flex items-center justify-center">
              佣金收益
            </span>
          </button>
        </div>
      </div>

      {/* 邀请好友标签页 */}
      {activeTab === 'invite' && (
        <div className="mx-4 space-y-6">
          {/* 我的邀请数据 - 美化样式 */}
          <div className="rounded-xl shadow-md p-6 bg-white transition-all hover:shadow-lg">
            <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center">
              <CodeOutlined className="mr-2 text-blue-500" />
              我的邀请数据
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-100 rounded-xl p-2">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm">累计邀请</div>
              </div>
              <div className="bg-blue-100 rounded-xl p-2 ">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm ">活跃用户</div>
              </div>
              <div className="bg-blue-100 rounded-xl p-2 ">
                <div className="text-2xl font-bold text-orange-600">¥0.00</div>
                <div className="text-sm ">累计佣金</div>
              </div>
            </div>
          </div>
          
          {/* 我的专属邀请码 - 美化样式 */}
          <div className="rounded-xl w-full shadow-md p-6 bg-white transition-all hover:shadow-lg">
            <h3 className="font-bold text-xl text-gray-800 mb-5 flex items-center">
              <CodeOutlined className="mr-2 text-blue-500" />
              我的专属邀请码
            </h3>
            <div className="w-full items-center mb-6">
              <div className="text-center py-5 px-6 rounded-xl mb-6 border border-blue-200 bg-blue-100">
                <span className="text-3xl font-bold text-blue-600 tracking-wider">{agentInfo?.invite_code || '暂无邀请码'}</span>
              </div>
            </div>
            <div className="w-full items-center mb-4 space-y-4">
              {agentInfo?.invite_code && (
                <button 
                  onClick={copyInviteLink}
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 w-full transform hover:scale-[1.02] flex items-center justify-center"
                >
                  <ShareAltOutlined className="mr-2" />
                  {copied ? '已复制' : '复制邀请码'}
                </button>
              )}
            </div>
          </div>
          {/* 邀请奖励规则 */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center">
              <BulbOutlined className="mr-2 text-yellow-500" />
              邀请奖励规则
            </h3>
            <div className="text-gray-700 space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 mt-0.5 flex-shrink-0">1</div>
                <div>邀请新用户,指导新用户完成首个100元提现，可获得10元系统奖励</div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 mt-0.5 flex-shrink-0">2</div>
                <div>被邀请用户每完成一个任务，邀请者获得该任务收益5%的佣金</div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 mt-0.5 flex-shrink-0">3</div>
                <div>邀请者可获得被邀请用户长期的任务佣金，无时间限制</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 italic">
              * 活动最终解释权归平台所有
            </div>
          </div>
        </div>
      )}

      {/* 已邀请好友标签页 */}
      {activeTab === 'invited' && (
        <div className="mx-4 space-y-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="text-center">
                <h3 className="font-bold text-gray-800">已邀请好友 (0人)</h3>
              </div>
            </div>
            <div className="divide-y">
              <div className="p-8 text-center">
                <UserAddOutlined className="text-gray-400 text-5xl mb-4" />
                <div className="">您还没有邀请任何好友</div>
                <div className="text-gray-400 text-sm mt-2">快去邀请好友加入吧，一起赚取佣金！</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 佣金收益标签页 */}
      {activeTab === 'commission' && (
        <div className="mx-4 mt-6">
          {/* 佣金统计 */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <h3 className="font-bold text-gray-800 mb-4">佣金统计</h3>
            <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-lg font-bold text-gray-600">¥0.00</div>
            <div className="text-xs ">累计佣金</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-600">¥0.00</div>
            <div className="text-xs ">本月佣金</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">¥0.00</div>
            <div className="text-xs ">昨日佣金</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded">
            <div className="text-lg font-bold text-purple-600">¥0.00</div>
            <div className="text-xs ">今日佣金</div>
          </div>
        </div>
          </div>
          
          {/* 佣金明细 */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800">佣金明细</h3>
                <span className="text-xs ">最近0条记录</span>
              </div>
            </div>
            <div className="divide-y overflow-y-auto">
              <div className="p-8 text-center">
                <DollarOutlined className="text-gray-400 text-5xl mb-4" />
                <div className="">暂无佣金记录</div>
                <div className="text-gray-400 text-sm mt-2">邀请好友完成任务，即可获得佣金奖励！</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 底部间距，确保内容不被遮挡 */}
      <div className="pb-20"></div>
    </div>
  );
};

export default InvitePage;