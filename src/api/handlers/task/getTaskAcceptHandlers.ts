// 获取任务模板API处理器
// 用于处理获取任务模板的API请求

// 导入Next.js响应类型
import { NextResponse } from 'next/server';
// 导入API客户端
import apiClient from '../../client';
// 导入API端点
import { GET_TASK_ACCEPT_ENDPOINT } from '../../endpoints/task';
// 导入错误处理函数和类型
import { handleApiError, createErrorResponse } from '../../client/errorHandler';
import { ApiError } from '../../client/errorHandler';
// 导入类型定义
import { GetTaskAcceptRequest, GetTaskAcceptResponse } from '../../types/task/getTaskAcceptTypes';

/**
 * 处理获取任务模板请求
 * @param request - API请求对象，包含请求体
 * @returns NextResponse - API响应
 */
export async function handleGetTaskAccept(request: Request): Promise<NextResponse> {
  try {
    // 解析请求体
    const requestBody: GetTaskAcceptRequest = await request.json();
    
    // 发送POST请求到后端API
    const response = await apiClient.post<GetTaskAcceptResponse>(
      GET_TASK_ACCEPT_ENDPOINT,
      requestBody
    );
    
    // 返回标准化的响应
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    // 处理错误
    const apiError: ApiError = handleApiError(error);
    // 创建错误响应
    const errorResponse = createErrorResponse<GetTaskAcceptResponse['data']>(apiError);
    // 返回错误响应
    return NextResponse.json(errorResponse, { status: apiError.status });
  }
}
