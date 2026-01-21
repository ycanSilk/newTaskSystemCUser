'use client';

import React, { useState, useEffect } from 'react';
import { CodeOutlined, ShareAltOutlined, BulbOutlined } from '@ant-design/icons';
import { GetAgentInfoResponse } from '@/app/types/agent/getAgentInfoTypes';
import { GetAgentInviteDataApiResponse } from '@/app/types/agent/getAgentInviteDataTypes';

interface InviteFriendProps {
  setError: (error: string | null) => void;
}

const InviteFriend: React.FC<InviteFriendProps> = ({ setError }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [agentInfo, setAgentInfo] = useState<any>(null);
  const [inviteData, setInviteData] = useState<any>(null);

  // 组件加载时获取代理信息和邀请数据
  useEffect(() => {
    const fetchAgentData = async () => {
      setLoading(true);
      
      try {
        // 并行调用两个API
        const [agentInfoResponse, inviteDataResponse] = await Promise.all([
          // 调用getAgentInfo API
          fetch('/api/agent/getAgentInfo', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }),
          // 调用getAgentInviteData API获取邀请用户数据
          fetch('/api/agent/getAgentInviteData', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          })
        ]);
        
        const agentInfoResult: GetAgentInfoResponse = await agentInfoResponse.json();
        const inviteDataResult: GetAgentInviteDataApiResponse = await inviteDataResponse.json();
        
        if (agentInfoResult.success) {
          setAgentInfo(agentInfoResult.data);
        } else {
          setError(agentInfoResult.message || '获取代理信息失败');
        }
        
        if (inviteDataResult.success) {
          setInviteData(inviteDataResult.data);
        } else {
          console.error('获取邀请数据失败:', inviteDataResult.message);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? `网络或系统错误: ${err.message}` : '获取数据时发生未知错误';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgentData();
  }, [setError]);

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
    <div className="mx-4 space-y-3">
      {/* 我的邀请数据 - 美化样式 */}
      <div className="rounded-xl shadow-md p-6 bg-white transition-all hover:shadow-lg">
        <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center">
          <CodeOutlined className="mr-2 text-blue-500" />
          我的邀请数据
        </h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-blue-100 rounded-xl p-2">
            <div className="text-2xl font-bold text-blue-600">{inviteData?.total_invites || 0}</div>
            <div className="text-sm">累计邀请</div>
          </div>
          <div className="bg-blue-100 rounded-xl p-2 ">
            <div className="text-2xl font-bold text-green-600">{inviteData?.valid_invites || 0}</div>
            <div className="text-sm ">活跃用户</div>
          </div>
          <div className="bg-blue-100 rounded-xl p-2 ">
            <div className="text-2xl font-bold text-orange-600">{inviteData?.total_tasks_completed || 0}</div>
            <div className="text-sm ">累计完成任务</div>
          </div>
          <div className="bg-blue-100 rounded-xl p-2 ">
            <div className="text-2xl font-bold text-orange-600">{inviteData?.total_commission_earned || 0}</div>
            <div className="text-sm ">累计佣金</div>
          </div>
        </div>
      </div>
      
      {/* 我的专属邀请码 - 美化样式 */}
      <div className="rounded-xl w-full shadow-md p-3 bg-white transition-all hover:shadow-lg">
        <h3 className="font-bold text-xl text-gray-800 mb-5 flex items-center">
          <CodeOutlined className="mr-2 text-blue-500" />
          我的专属邀请码
        </h3>
        <div className="w-full items-center mb-3">
          <div className="text-center py-2 px-6 rounded-xl mb-6 border border-blue-200 bg-blue-100">
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


      {/* 申请成为团长 */}
      <div className="rounded-xl w-full shadow-md p-3 bg-white transition-all hover:shadow-lg">
        <h3 className="font-bold text-xl text-gray-800 mb-5 flex items-center">
          <CodeOutlined className="mr-2 text-blue-500" />
          申请成为团长
        </h3>
        
        <div className="space-y-6">
          {/* 申请条件 */}
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
              达成以下条件即可申请成为团长：
            </h4>
            <ul className="space-y-1 ml-8">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></div>
                <span className="text-gray-700">累计邀请用户数达到5人以上</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></div>
                <span className="text-gray-700">被邀请的用户要在24小时内完成20个任务</span>
              </li>
            </ul>
          </div>
          
          {/* 成为团长的优势 */}
          <div className="bg-green-50 rounded-xl p-3 border border-green-100">
            <h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
              申请成为团长后，您将获得以下优势：
            </h4>
            <ul className="space-y-1 ml-8">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-2 flex-shrink-0"></div>
                <span className="text-gray-700">可以获取被邀请用户的任务佣金</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-2 flex-shrink-0"></div>
                <span className="text-gray-700">专属的任务奖励和佣金奖励</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="w-full mt-3">
          <button 
              onClick={copyInviteLink}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 w-full transform hover:scale-[1.02] flex items-center justify-center font-medium"
            >
              申请成为团长
          </button>
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
  );
};

export default InviteFriend;