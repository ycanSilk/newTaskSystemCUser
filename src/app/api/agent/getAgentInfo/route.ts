// 获取代理信息API路由中间件
// 负责处理/api/agent/getAgentInfo路径的请求，调用对应的API处理函数
// 遵循API_REQUEST_STANDARD.md的规范

import { NextResponse } from 'next/server';
import { handleGetAgentInfo } from '../../../../api/handlers/agent/getAgentInfoHandlers';

/**
 * GET请求处理函数
 * 调用handleGetAgentInfo处理函数获取代理信息
 * @returns NextResponse - 包含代理信息的标准化响应
 */
export async function GET(): Promise<NextResponse> {
  return handleGetAgentInfo();
}

/**
 * POST请求处理函数
 * 不支持POST方法，返回405错误
 * @returns NextResponse - 包含错误信息的标准化响应
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
 * 不支持PUT方法，返回405错误
 * @returns NextResponse - 包含错误信息的标准化响应
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
 * 不支持DELETE方法，返回405错误
 * @returns NextResponse - 包含错误信息的标准化响应
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