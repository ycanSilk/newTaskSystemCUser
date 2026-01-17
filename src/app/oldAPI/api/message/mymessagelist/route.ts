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
  
  try {
    // 直接使用前端发送的数据结构
    const data = await request.json();
    
    const requestData = {
        page: data.page || 0,
        size: data.size || 10,
        sortField: data.sortField || "createTime",
        sortOrder: data.sortOrder || "DESC"
    };
    
    // 直接转发前端的数据结构给外部API，不做转换
    const apiUrl = `${config.baseUrl}${config.endpoints.message.mymessagelist}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(config.headers || {})
      },
      body: JSON.stringify(requestData) // 直接发送原始数据
    });
    const responseData = await response.json();
    console.log('外部API响应:', responseData); // 移到return之前
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('处理请求错误:', error);
    return NextResponse.json({ success: false, message: '服务器内部错误' }, { status: 500 });
  }
}
