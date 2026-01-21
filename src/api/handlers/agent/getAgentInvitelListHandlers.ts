// 获取代理邀请列表API处理函数
// 遵循API_REQUEST_STANDARD.md的规范，负责处理获取代理邀请列表的API请求

import { NextResponse } from 'next/server';
import axiosInstance from '../../client';
import { GET_AGENT_INVITE_LIST_ENDPOINT } from '../../endpoints/agent';
import { GetAgentInviteListResponseData, GetAgentInviteListResponse } from '../../types/agent/getAgentInvitelListTypes';
import { handleApiError, createErrorResponse, type ApiErrorType } from '../../client';

/**
 * 获取代理邀请列表的API处理函数
 * @returns NextResponse - 包含代理邀请列表的标准化响应
 */
export async function handleGetAgentInviteList(): Promise<NextResponse> {
  try {
    // 使用API客户端发送GET请求，不直接使用axios
    const response = await axiosInstance.get<GetAgentInviteListResponseData>(GET_AGENT_INVITE_LIST_ENDPOINT);
    
    // 解构原始响应数据
    const { code, message, data, timestamp } = response.data;
    
    // 检查API返回的状态码
    if (code === 0) {
      // 请求成功，创建标准化的成功响应
      const successResponse: GetAgentInviteListResponse = {
        success: true,
        message,
        data,
        code,
        timestamp
      };
      
      // 使用NextResponse.json()包装响应，不直接返回原始响应
      return NextResponse.json(successResponse, { status: 200 });
    } else {
      // API返回错误码，创建标准化的错误响应
      const errorResponse = createErrorResponse({
        type: 'SERVER_ERROR' as ApiErrorType,
        status: 400,
        message,
        code
      });
      
      return NextResponse.json(errorResponse, { status: 400 });
    }
  } catch (error) {
    // 捕获所有异常，转换为标准化的错误响应
    const apiError = handleApiError(error);
    const errorResponse = createErrorResponse(apiError);
    
    return NextResponse.json(errorResponse, { status: apiError.status });
  }
}
