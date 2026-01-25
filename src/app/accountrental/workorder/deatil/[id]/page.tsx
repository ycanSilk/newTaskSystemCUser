'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button, Tag, Space, Input, message, Upload, Image, Divider } from 'antd';
import { SendOutlined, PaperClipOutlined, CloseOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

// 引入工单详情类型定义
import { WorkOrderDetail, WorkOrderDetailResponse } from '../../../types/workorder/getOrderDetailInfoTypes';

const WorkOrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  
  // 从路由参数和查询参数中获取数据
  const ticketIdFromPath = params.id as string;
  const [ticketId, setTicketId] = useState<string>(ticketIdFromPath);
  const [ticket, setTicket] = useState<string>('');
  
  // 状态管理
  const [loading, setLoading] = useState<boolean>(true);
  const [workOrder, setWorkOrder] = useState<WorkOrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  // 获取URL查询参数
  useEffect(() => {
    const url = new URL(window.location.href);
    const ticketNoParam = url.searchParams.get('ticket_no') || '';
    const ticketIdParam = url.searchParams.get('ticket_id') || ticketIdFromPath;
    
    console.log('从URL获取到的ticket_no:', ticketNoParam);
    setTicket(ticketNoParam);
    setTicketId(ticketIdParam);
  }, [ticketIdFromPath]);
  
  // 消息列表滚动到底部的引用
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // 页面加载时获取工单详情
  useEffect(() => {
    // 只有当ticket有值时才调用API
    if (ticket) {
      fetchWorkOrderDetail();
    }
  }, [ticketId, ticket]);  
  //ticket就是从url获取的ticket_no字段的值，这里改成ticket是为了保持和API中间件的get字段一致；const ticket = url.searchParams.get('ticket') || '';
  
  // 消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [workOrder?.recent_messages]);
  
  // 获取工单详情
  const fetchWorkOrderDetail = async () => {
    // 如果ticket为空，不发送请求
    if (!ticket) {
      console.log('ticket值为空，不发送API请求');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
        console.log('从url获取的ticketNo', ticket);
      // 调用实际的API请求获取工单详情
      const response = await fetch(`/api/workOrder/getOrderDetailInfo?ticket=${ticket}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data: WorkOrderDetailResponse = await response.json();
      
      if (data.code === 0) {
        // API调用成功，更新工单详情
        setWorkOrder(data.data);
        message.success(data.message || '获取工单详情成功');
      } else {
        // API调用失败，显示错误信息
        setError(data.message || '获取工单详情失败');
        message.error(data.message || '获取工单详情失败');
      }
    } catch (err) {
      setError('获取工单详情失败，请稍后重试');
      message.error('获取工单详情失败，请稍后重试');
      console.error('获取工单详情失败:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 发送消息
  const handleSendMessage = () => {
    if (!messageContent.trim() && uploadedImages.length === 0) {
      message.warning('请输入消息内容或上传图片');
      return;
    }
    
    // 模拟发送消息
    message.success('消息发送成功');
    setMessageContent('');
    setUploadedImages([]);
  };
  
  // 关闭工单
  const handleCloseWorkOrder = () => {
    message.info('关闭工单功能开发中');
  };
  
  // 上传图片
  const handleImageUpload = (file: File) => {
    // 模拟图片上传
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (uploadedImages.length < 3) {
        setUploadedImages([...uploadedImages, result]);
      } else {
        message.warning('最多只能上传3张图片');
      }
    };
    reader.readAsDataURL(file);
    return false; // 阻止自动上传
  };
  
  // 删除已上传的图片
  const handleRemoveImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };
  
  // 渲染工单详情
  const renderWorkOrderDetail = () => {
    if (!workOrder) return null;
    
    return (
      <Card className="border-0 rounded-lg shadow-sm mb-4">
        {/* 工单基本信息 */}
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-semibold">{workOrder.title}</h2>
            <Tag color={workOrder.status === 0 ? 'warning' : workOrder.status === 1 ? 'processing' : 'success'}>
              {workOrder.status_text}
            </Tag>
          </div>
          <div className="text-xs text-gray-500 mb-3">
            工单编号：{workOrder.ticket_no} | 创建时间：{workOrder.created_at} | 更新时间：{workOrder.updated_at}
          </div>
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md mb-3">
            <p className="text-sm font-medium mb-1">工单描述：</p>
            <p className="text-xs">{workOrder.description}</p>
          </div>
        </div>
        
        <Divider className="my-4" />
        
        {/* 订单信息 */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-3">订单信息</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-gray-500 mb-1">订单ID</p>
              <p className="text-sm font-medium">{workOrder.order_info.order_id}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-gray-500 mb-1">订单类型</p>
              <p className="text-sm font-medium">{workOrder.order_info.source_type_text}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-gray-500 mb-1">订单金额</p>
              <p className="text-sm font-medium text-red-500">¥{workOrder.order_info.total_amount_yuan}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-gray-500 mb-1">租赁天数</p>
              <p className="text-sm font-medium">{workOrder.order_info.days} 天</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-gray-500 mb-1">订单状态</p>
              <p className="text-sm font-medium">{workOrder.order_info.order_status_text}</p>
            </div>
          </div>
        </div>
        
        <Divider className="my-4" />
        
        {/* 参与人信息 */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-3">参与人信息</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-gray-500 mb-1">买家</p>
              <p className="text-sm font-medium">{workOrder.order_info.buyer_username}</p>
              <p className="text-xs text-gray-500">ID: {workOrder.order_info.buyer_user_id}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-gray-500 mb-1">卖家</p>
              <p className="text-sm font-medium">{workOrder.order_info.seller_username}</p>
              <p className="text-xs text-gray-500">ID: {workOrder.order_info.seller_user_id}</p>
            </div>
          </div>
        </div>
      </Card>
    );
  };
  
  // 渲染消息列表
  const renderMessageList = () => {
    if (!workOrder?.recent_messages) return null;
    
    return (
      <Card className="border-0 rounded-lg shadow-sm mb-4">
        <h3 className="text-sm font-semibold mb-3">消息记录</h3>
        
        {/* 消息列表 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4" style={{ height: '400px', overflowY: 'auto' }}>
          {workOrder.recent_messages.map((message) => (
            <div key={message.id} className="mb-4">
              {/* 系统消息 */}
              {message.sender_type === 4 && (
                <div className="text-center mb-3">
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-700">
                    {message.created_at}
                  </span>
                </div>
              )}
              
              <div className={`flex ${message.sender_type === 4 ? 'justify-center' : 'justify-start'}`}>
                <div className={`max-w-[95%] ${message.sender_type === 4 ? 'bg-gray-200' : 'bg-white'} rounded-lg p-3 shadow-sm`}>
                  <div className="text-xs text-gray-500 mb-1">
                    {message.sender_type_text} | {message.message_type_text}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  {/* 消息附件 */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {message.attachments.map((attachment, index) => (
                        <Image
                          key={index}
                          src={attachment}
                          alt={`消息图片 ${index + 1}`}
                          width={100}
                          className="rounded cursor-pointer"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* 发送消息区域 */}
        <div>
          {/* 已上传图片预览 */}
          {uploadedImages.length > 0 && (
            <div className="flex gap-2 mb-2">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative w-16 h-16">
                  <Image src={image} alt={`已上传图片 ${index + 1}`} width={64} height={64} className="rounded" />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            {/* 上传图片按钮 */}
            <Upload
              beforeUpload={handleImageUpload}
              fileList={[]}
              accept="image/*"
              maxCount={3 - uploadedImages.length}
            >
              <Button icon={<PaperClipOutlined />} size="small" type="default">
                上传图片
              </Button>
            </Upload>
            
            {/* 输入框 */}
            <Input.TextArea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="输入消息内容..."
              rows={2}
              className="flex-1"
            />
            
            {/* 发送按钮 */}
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700"
            >
              发送
            </Button>
          </div>
          
          {/* 底部按钮 */}
          <div className="flex justify-end mt-3">
            {workOrder.can_close && (
              <Button
                type="default"
                onClick={handleCloseWorkOrder}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                关闭工单
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 px-3 pt-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-lg font-semibold text-gray-800 mb-6">工单详情</h1>
          <div className="bg-white p-8 text-center">
            <p className="text-sm text-black">正在加载数据，请稍候...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 px-3 pt-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-lg font-semibold text-gray-800 mb-6">工单详情</h1>
          <div className="bg-white p-8 text-center">
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <Button 
              type="default" 
              onClick={fetchWorkOrderDetail} 
              size="small" 
              className="mt-2"
            >
              重试
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 px-3 pt-8 pb-16">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold text-gray-800">工单详情</h1>
          <Button
            type="default"
            onClick={() => router.push('/accountrental/workorder')}
            size="small"
          >
            返回列表
          </Button>
        </div>
        
        {/* 工单详情 */}
        {renderWorkOrderDetail()}
        
        {/* 消息列表 */}
        {renderMessageList()}
      </div>
    </div>
  );
};

export default WorkOrderDetailPage;