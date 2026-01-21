'use client';

import React from 'react';
import { DollarOutlined } from '@ant-design/icons';

const CommissionEarnings: React.FC = () => {
  return (
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
  );
};

export default CommissionEarnings;