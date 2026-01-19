import React, { useState } from 'react';

interface TimeOrderProps {
  /** 排序字段名，用于传递给父组件 */
  sortField: string;
  /** 当前排序顺序，用于初始化组件状态 */
  currentOrder?: 'asc' | 'desc';
  /** 按钮文本，可选，默认显示"时间排序" */
  buttonText?: string;
  /** 排序变化时的回调函数 */
  onSortChange: (field: string, order: 'asc' | 'desc') => void;
  /** 按钮样式，可选，用于自定义按钮外观 */
  className?: string;
}

const TimeOrder: React.FC<TimeOrderProps> = ({
  sortField,
  currentOrder = 'desc',
  buttonText = '时间排序',
  onSortChange,
  className = ''
}) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(currentOrder);

  // 处理排序按钮点击事件
  const handleSortClick = () => {
    // 切换排序顺序
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    // 调用回调函数，通知父组件排序变化
    onSortChange(sortField, newOrder);
  };

  return (
    <button
      onClick={handleSortClick}
      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${className}
        bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-300`}
    >
      {buttonText}
      <span className="ml-1 flex items-center">
        {/* 显示当前排序箭头 */}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </span>
    </button>
  );
};

export default TimeOrder;