// API处理函数：获取我邀请的用户的详细数据

import { NextResponse } from 'next/server';
import apiClient from '../../client';
import { GET_AGENT_INVITE_DATA_ENDPOINT } from '../../endpoints/agent';
import { ApiError, handleApiError, createErrorResponse } from '../../client/errorHandler';
import { GetAgentInviteDataResponse, GetAgentInviteDataApiResponse } from '../../types/agent/getAgentInviteDataTypes';

/**
 * 获取我邀请的用户的详细数据
 * @returns NextResponse - 包含邀请数据的响应
 */
export async function handleGetAgentInviteData(): Promise<NextResponse> {
  try {
    // 使用API客户端发送GET请求
    const response = await apiClient.get<GetAgentInviteDataResponse>(GET_AGENT_INVITE_DATA_ENDPOINT);
  
    // 构建成功响应
    const successResponse: GetAgentInviteDataApiResponse = {
      success: true,
      message: response.data.message || '获取邀请数据成功',
      data: response.data.data,
      timestamp: Date.now()
    };
    
    return NextResponse.json(successResponse, { status: 200 });
  } catch (error) {
    // 处理错误
    const apiError: ApiError = handleApiError(error);
    const errorResponse = createErrorResponse(apiError);
    
    return NextResponse.json(errorResponse, { status: apiError.status });
  }
}