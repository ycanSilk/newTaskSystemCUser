// 获取已接受任务列表API处理器
// 用于处理获取已接受任务列表的API请求

// 导入Next.js响应类型
import { NextResponse } from 'next/server';
// 导入API客户端
import apiClient from '../../client';
// 导入API端点
import { MY_ACCEPTED_TASK_LIST_ENDPOINT } from '../../endpoints/task';
// 导入错误处理函数和类型
import { handleApiError, createErrorResponse } from '../../client/errorHandler';
import { ApiError } from '../../client/errorHandler';
// 导入类型定义
import { GetMyAcceptedTaskListRequest, GetMyAcceptedTaskListResponse } from '../../types/task/getMyAccepedTaskListTypes';

/**
 * 处理获取已接受任务列表请求
 * @param request - API请求对象
 * @returns NextResponse - API响应
 */
export async function handleGetMyAcceptedTaskList(request: Request): Promise<NextResponse> {
  try {
    // 从URL中获取查询参数
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const page = url.searchParams.get('page') || '1';
    const size = url.searchParams.get('size') || '20';
    
    // 构建请求参数
    const params: GetMyAcceptedTaskListRequest = {
      page: parseInt(page, 10),
      size: parseInt(size, 10)
    };
    
    // 如果提供了状态参数，添加到请求参数中
    if (status) {
      params.status = parseInt(status, 10);
    }
    
    // 发送GET请求到后端API
    const response = await apiClient.get<GetMyAcceptedTaskListResponse>(
      MY_ACCEPTED_TASK_LIST_ENDPOINT,
      {
        params
      }
    );
    
    // 返回标准化的响应
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    // 处理错误
    const apiError: ApiError = handleApiError(error);
    // 创建错误响应
    const errorResponse = createErrorResponse<GetMyAcceptedTaskListResponse['data']>(apiError);
    // 返回错误响应
    return NextResponse.json(errorResponse, { status: apiError.status });
  }
}
