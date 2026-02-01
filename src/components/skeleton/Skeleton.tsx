'use client';

import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 基础骨架屏组件
 * 用于显示加载状态的占位符
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
    />
  );
};

interface SkeletonCardProps {
  className?: string;
}

/**
 * 卡片骨架屏组件
 * 用于显示卡片加载状态
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
      <div className="space-y-3">
        <Skeleton height="24px" className="w-3/4" />
        <Skeleton height="16px" className="w-full" />
        <Skeleton height="16px" className="w-5/6" />
        <Skeleton height="40px" className="w-full" />
      </div>
    </div>
  );
};

interface SkeletonListProps {
  count?: number;
  className?: string;
}

/**
 * 列表骨架屏组件
 * 用于显示列表加载状态
 */
export const SkeletonList: React.FC<SkeletonListProps> = ({ count = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

interface SkeletonTaskCardProps {
  className?: string;
}

/**
 * 任务卡片骨架屏组件
 * 用于显示任务列表加载状态
 */
export const SkeletonTaskCard: React.FC<SkeletonTaskCardProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton height="20px" className="w-1/2" />
          <Skeleton height="20px" className="w-1/4" />
        </div>
        <div className="flex space-x-2">
          <Skeleton height="16px" className="w-20 rounded-full" />
          <Skeleton height="16px" className="w-20 rounded-full" />
        </div>
        <Skeleton height="16px" className="w-full" />
        <Skeleton height="16px" className="w-full" />
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <Skeleton height="16px" className="w-1/3" />
            <Skeleton height="32px" className="w-24 rounded" />
          </div>
          <Skeleton height="48px" className="w-full rounded" />
        </div>
        <Skeleton height="40px" className="w-full rounded" />
      </div>
    </div>
  );
};

interface SkeletonTaskListProps {
  count?: number;
  className?: string;
}

/**
 * 任务列表骨架屏组件
 * 用于显示任务列表加载状态
 */
export const SkeletonTaskList: React.FC<SkeletonTaskListProps> = ({ count = 2, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonTaskCard key={index} />
      ))}
    </div>
  );
};

export default Skeleton;
