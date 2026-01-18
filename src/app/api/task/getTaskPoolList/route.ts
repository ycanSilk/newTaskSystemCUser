// Task模块 - 任务池列表API路由
// 这个文件是获取任务池列表的API路由，处理客户端的请求

// 导入Next.js的响应类型
import { NextResponse } from 'next/server';
// 导入获取任务池列表的处理函数
import { handleGetTaskPoolList } from '../../../../api/handlers/task/getTaskPoolListHandlers';

/**
 * 处理GET请求，获取任务池列表
 * @param req - Next.js请求对象，包含客户端发送的请求数据
 * @returns NextResponse - 包含任务池列表或错误信息的响应
 */
export async function GET(req: Request): Promise<NextResponse> {
  return handleGetTaskPoolList(req as any);
}

/**
 * 处理POST请求，返回方法不允许错误
 * @returns NextResponse - 包含405错误的响应
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
 * 处理PUT请求，返回方法不允许错误
 * @returns NextResponse - 包含405错误的响应
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
 * 处理DELETE请求，返回方法不允许错误
 * @returns NextResponse - 包含405错误的响应
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

/**
 * 处理PATCH请求，返回方法不允许错误
 * @returns NextResponse - 包含405错误的响应
 */
export async function PATCH(): Promise<NextResponse> {
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
 * 处理OPTIONS请求，返回方法不允许错误
 * @returns NextResponse - 包含405错误的响应
 */
export async function OPTIONS(): Promise<NextResponse> {
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
