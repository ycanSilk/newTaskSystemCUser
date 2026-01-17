import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import SizeContext from 'antd/es/config-provider/SizeContext';
const config = require('../../apiconfig/config.json');
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // 获取token
  const cookieStore = await cookies();
  const tokenKeys = ['AcceptTask_token'];
  let token: string | undefined;
  
  for (const key of tokenKeys) {
    token = cookieStore.get(key)?.value;
    if (token) break;
  }
  
  if (!token) {
    return NextResponse.json({ success: false, message: '认证失败，请先登录' }, { status: 401 });
  }
  

  const url = new URL(request.url);
  const msgId = url.searchParams.get('msgId');
  
  if (!msgId) {
    return NextResponse.json({ success: false, message: '缺少必要参数msgId' }, { status: 400 });
  }

  try {
    // 直接转发前端的数据结构给外部API，不做转换
    const apiUrl = `${config.baseUrl}/msgNotice/${msgId}/read`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(config.headers || {})
      }
    });
    const responseData = await response.json();
    console.log('外部API响应:', responseData); // 移到return之前
    console.log('请求url:', apiUrl); // 新增日志
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('处理请求错误:', error);
    return NextResponse.json({ success: false, message: '服务器内部错误' }, { status: 500 });
  }
}
