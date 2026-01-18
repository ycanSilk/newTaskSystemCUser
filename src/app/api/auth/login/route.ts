import { NextRequest, NextResponse } from 'next/server';
import { handleLogin } from '../../../../api/handlers/auth/loginHandler';

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log('请求API路径: POST /api/auth/login', {
    timestamp: Date.now(),
    method: req.method,
    url: req.url,
    headers: {
      'content-type': req.headers.get('content-type'),
      'user-agent': req.headers.get('user-agent')
    }
  });
  
  try {
    const result = await handleLogin(req);
    console.log('请求API路径: POST /api/auth/login - Success', {
      status: result.status,
      timestamp: Date.now()
    });
    return result;
  } catch (error) {
    console.error('请求API路径: POST /api/auth/login - Error', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: Date.now()
    });
    throw error;
  }
}

export async function GET(): Promise<NextResponse> {
  console.log('请求API路径: GET /api/auth/login - Method Not Allowed', {
    timestamp: Date.now()
  });
  
  return NextResponse.json(
    { 
      success: false, 
      code: 405, 
      message: '请使用POST方法进行登录',
      timestamp: Date.now()
    }, 
    { status: 405 }
  );
}
