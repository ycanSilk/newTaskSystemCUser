// 提交任务API处理函数
// 用于处理提交任务的API请求

// 导入Next.js响应类型
import { NextResponse } from 'next/server';
// 导入API客户端
import apiClient from '@/api/client';
// 导入请求端点
import { POST_TASK_SUBMIT_COMMENT_ENDPOINT } from '@/api/endpoints/task';
// 导入错误处理相关函数和类型
import { ApiError, handleApiError, createErrorResponse } from '@/api/client/errorHandler';
// 导入API响应通用类型
import { ApiResponse } from '@/api/types/common';
// 导入提交任务相关类型
import { SubmitTaskRequest, SubmitTaskResponse } from '@/api/types/task/submitTaskTypes';

/**
 * 提交任务API处理函数
 * @param request - API请求对象
 * @returns NextResponse - API响应
 */
export async function handleSubmitTask(request: Request): Promise<NextResponse> {
  try {
    // 解析请求体
    const requestBody: SubmitTaskRequest = await request.json();
    
    // 调用API客户端发送POST请求
    const response = await apiClient.post<SubmitTaskResponse>(
      POST_TASK_SUBMIT_COMMENT_ENDPOINT,
      requestBody
    );
    
    // 返回成功响应
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    // 处理错误
    const apiError: ApiError = handleApiError(error);
    const errorResponse: ApiResponse = createErrorResponse(apiError);
    
    // 返回错误响应
    return NextResponse.json(errorResponse, { status: apiError.status });
  }
}
