// 标记为动态路由，因为使用了request.cookies
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { handlePostWithdrawal } from '@/api/handlers/paymentWallet/postWithdrawalHandler';
import { PostWithdrawalRequest } from '@/api/types/paymentWallet/postWithdrawalTypes';

/**
 * 提现请求的API路由
 * @param req - Next.js请求对象
 * @returns Next.js响应对象
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 解析请求体
    const requestBody: PostWithdrawalRequest = await req.json();
    
    // 调用API处理函数
    return await handlePostWithdrawal(requestBody);
  } catch (error) {
    console.error('POST /api/paymentWallet/postWithdrawal 错误:', error);
    
    // 返回错误响应
    return NextResponse.json(
      {
        success: false,
        code: 400,
        message: error instanceof Error ? error.message : '请求参数错误',
        timestamp: Date.now(),
        data: null
      },
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

/**
 * 处理不支持的HTTP方法
 * @returns Next.js响应对象
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      code: 405,
      message: '方法不允许，请使用POST请求',
      timestamp: Date.now(),
      data: null
    },
    { status: 405 }
  );
}

/**
 * 处理不支持的HTTP方法
 * @returns Next.js响应对象
 */
export async function PUT(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      code: 405,
      message: '方法不允许，请使用POST请求',
      timestamp: Date.now(),
      data: null
    },
    { status: 405 }
  );
}

/**
 * 处理不支持的HTTP方法
 * @returns Next.js响应对象
 */
export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      code: 405,
      message: '方法不允许，请使用POST请求',
      timestamp: Date.now(),
      data: null
    },
    { status: 405 }
  );
}
