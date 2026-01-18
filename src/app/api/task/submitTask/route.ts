// 提交任务API路由
// 用于处理提交任务的API请求

// 导入Next.js响应类型
import { NextResponse } from 'next/server';
// 导入API处理器函数
import { handleSubmitTask } from '@/api/handlers/task/submitTaskHandlers';

/**
 * POST请求处理函数
 * 用于处理提交任务的POST请求
 * @param request - API请求对象
 * @returns NextResponse - API响应
 */
export async function POST(request: Request): Promise<NextResponse> {
  // 调用API处理器函数
  return handleSubmitTask(request);
}

/**
 * GET请求处理函数
 * 用于处理提交任务的GET请求，返回405错误
 * @returns NextResponse - 405错误响应
 */
export async function GET(): Promise<NextResponse> {
  // 返回405错误，说明方法不允许
  return NextResponse.json(
    {
      // 成功状态为false
      success: false,
      // 状态码为405
      code: 405,
      // 错误信息
      message: '方法不允许，请使用POST请求',
      // 时间戳
      timestamp: Date.now(),
      // 数据为null
      data: null
    },
    // HTTP状态码为405
    { status: 405 }
  );
}

/**
 * PUT请求处理函数
 * 用于处理提交任务的PUT请求，返回405错误
 * @returns NextResponse - 405错误响应
 */
export async function PUT(): Promise<NextResponse> {
  // 返回405错误，说明方法不允许
  return NextResponse.json(
    {
      // 成功状态为false
      success: false,
      // 状态码为405
      code: 405,
      // 错误信息
      message: '方法不允许，请使用POST请求',
      // 时间戳
      timestamp: Date.now(),
      // 数据为null
      data: null
    },
    // HTTP状态码为405
    { status: 405 }
  );
}

/**
 * DELETE请求处理函数
 * 用于处理提交任务的DELETE请求，返回405错误
 * @returns NextResponse - 405错误响应
 */
export async function DELETE(): Promise<NextResponse> {
  // 返回405错误，说明方法不允许
  return NextResponse.json(
    {
      // 成功状态为false
      success: false,
      // 状态码为405
      code: 405,
      // 错误信息
      message: '方法不允许，请使用POST请求',
      // 时间戳
      timestamp: Date.now(),
      // 数据为null
      data: null
    },
    // HTTP状态码为405
    { status: 405 }
  );
}
