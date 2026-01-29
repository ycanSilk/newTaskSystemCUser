import React from 'react';
import { usePathname } from 'next/navigation';
import { HomeOutlined, FileTextOutlined, DollarOutlined, PropertySafetyOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';

interface BottomNavigationBarProps {
  // 可以添加需要的props
}

export default function BottomNavigationBar({}: BottomNavigationBarProps) {
  const pathname = usePathname();

  // 检查当前路由是否激活
  const isActive = (path: string) => {
    return pathname?.includes(path) ?? false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-500">
      <div className="grid grid-cols-5 py-2">   
        <Link
          href="/commenter/tasks?tab=ACCEPTED"
          className="flex flex-col items-center"
        >
          <span className={`text-lg w-6 h-6 flex items-center justify-center ${isActive('/tasks?tab=ACCEPTED') ? 'text-blue-500' : 'text-black'}`}>
            <FileTextOutlined />
          </span>
          <span className={`text-xs ${isActive('/tasks?tab=ACCEPTED') ? 'text-blue-500' : 'text-black'}`}>评论进行</span>
        </Link>
        <Link
          href="/rental/rental_market"
          className="flex flex-col items-center"
        >
          <span className={`text-lg w-6 h-6 flex items-center justify-center ${isActive('/rental/rental_market') ? 'text-blue-500' : 'text-black'}`}>
            <PropertySafetyOutlined />
          </span>
          <span className={`text-xs ${isActive('/rental/rental_market') ? 'text-blue-500' : 'text-black'}`}>租赁市场</span>
        </Link>
         <Link
          href="/commenter/hall"
          className="flex flex-col items-center"
        >
          <span className={`text-lg w-6 h-6 flex items-center justify-center ${isActive('/hall') ? 'text-blue-500' : 'text-black'}`}>
            <HomeOutlined />
          </span>
          <span className={`text-xs ${isActive('/hall') ? 'text-blue-500' : 'text-black'}`}>评论抢单</span>
        </Link>
        <Link
          href="/commenter/invite"
          className="flex flex-col items-center"
        >
          <span className={`text-lg w-6 h-6 flex items-center justify-center ${isActive('/invite') ? 'text-blue-500' : 'text-black'}`}>
            <UserAddOutlined />
          </span>
          <span className={`text-xs ${isActive('/invite') ? 'text-blue-500' : 'text-black'}`}>邀请分佣</span>
        </Link>
        <Link
          href="/commenter/profile"
          className="flex flex-col items-center"
        >
          <span className={`text-lg w-6 h-6 flex items-center justify-center ${isActive('/profile') ? 'text-blue-500' : 'text-black'}`}>
            <UserOutlined />
          </span>
          <span className={`text-xs ${isActive('/profile') ? 'text-blue-500' : 'text-black'}`}>我的</span>
        </Link>
      </div>
    </div>
  );
}