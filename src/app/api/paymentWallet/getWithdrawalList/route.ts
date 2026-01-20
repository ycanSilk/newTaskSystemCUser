import { NextResponse } from 'next/server';
import { handleGetWithdrawalList } from '../../../../api/handlers/paymentWallet/getWithdrawalListHandler';

/**
 * 获取提现记录列表的API路由处理函数
 * @returns NextResponse - 包含提现记录列表的响应
 */
export async function GET(): Promise<NextResponse> {
  return handleGetWithdrawalList();
}

/**
 * 不支持的HTTP方法处理
 * @returns NextResponse - 405方法不允许的响应
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
 * 不支持的HTTP方法处理
 * @returns NextResponse - 405方法不允许的响应
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
 * 不支持的HTTP方法处理
 * @returns NextResponse - 405方法不允许的响应
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
 * 不支持的HTTP方法处理
 * @returns NextResponse - 405方法不允许的响应
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