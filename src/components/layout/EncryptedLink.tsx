'use client';

import React from 'react';
import Link from 'next/link';
import { encryptRoute } from '@/lib/routeEncryption';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface EncryptedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

const EncryptedLink: React.FC<EncryptedLinkProps> = ({ href, children, className, ...props }) => {
  const pathname = usePathname();
  
  // 加密路径
  const getEncryptedPath = (path: string): string => {
    // 如果是外部链接或已经加密的链接，直接返回
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // 如果是哈希链接，直接返回
    if (path.startsWith('#')) {
      return path;
    }
    
    // 解析路径，提取查询参数
    const [pathWithoutQuery, query] = path.split('?');
    
    // 只加密路径部分，保留查询参数
    const pathParts = pathWithoutQuery.split('/').filter(Boolean);
    
    // 检查是否需要加密（如果是encryptableRoutes中的一级路由）
    const encryptableRoutes = ['accountrental', 'commenter'];
    if (pathParts.length > 0 && encryptableRoutes.includes(pathParts[0])) {
      // 获取第一级路由
      const firstLevel = `/${pathParts[0]}`;
      // 加密第一级路由
      const encrypted = encryptRoute(firstLevel);
      // 构建新的路径
      const remainingPath = pathParts.slice(1).join('/');
      const newPath = `/${encrypted}${remainingPath ? `/${remainingPath}` : ''}`;
      
      // 添加查询参数
      return query ? `${newPath}?${query}` : newPath;
    }
    
    return path;
  };
  
  const encryptedHref = getEncryptedPath(href);
  
  return (
    <Link href={encryptedHref} className={className} {...props}>
      {children}
    </Link>
  );
};

export default EncryptedLink;