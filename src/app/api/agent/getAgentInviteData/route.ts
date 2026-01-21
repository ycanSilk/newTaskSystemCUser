// API路由：获取我邀请的用户的详细数据

import { NextResponse } from 'next/server';
import { handleGetAgentInviteData } from '../../../../api/handlers/agent/getAgentInviteDataHandlers';

/**
 * GET请求处理函数
 * 获取我邀请的用户的详细数据
 * @returns NextResponse - 包含邀请数据的响应
 */
export async function GET(): Promise<NextResponse> {
  return handleGetAgentInviteData();
}

/**
 * POST请求处理函数
 * 返回405错误，不允许使用POST方法
 * @returns NextResponse - 405错误响应
 */
export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      code: 405,
      message: '方法不允许，请使用GET请求',
      timestamp: Date.now(),
      data: null
    },
    { status: 405 }
  );
}

/**
 * PUT请求处理函数
 * 返回405错误，不允许使用PUT方法
 * @returns NextResponse - 405错误响应
 */
export async function PUT(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      code: 405,
      message: '方法不允许，请使用GET请求',
      timestamp: Date.now(),
      data: null
    },
    { status: 405 }
  );
}

/**
 * DELETE请求处理函数
 * 返回405错误，不允许使用DELETE方法
 * @returns NextResponse - 405错误响应
 */
export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      code: 405,
      message: '方法不允许，请使用GET请求',
      timestamp: Date.now(),
      data: null
    },
    { status: 405 }
  );
}