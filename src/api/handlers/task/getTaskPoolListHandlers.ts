// Task模块 - 任务池列表请求处理逻辑
// 这个文件包含了处理获取任务池列表请求的核心逻辑

// 导入Next.js的请求和响应类型
import { NextRequest, NextResponse } from 'next/server';
// 导入API客户端实例，用于发送HTTP请求
import apiClient from '../../client';
// 导入任务池列表端点常量，用于构建请求URL
import { TASK_POOL_LIST_ENDPOINT } from '../../endpoints/task';
// 导入任务池列表响应的类型定义
import { TaskPoolListResponse } from '../../types/task/getTaskPoolListTypes';
// 导入错误处理相关的函数和类型
import { ApiError, handleApiError, createErrorResponse } from '../../client/errorHandler';
// 导入通用API响应类型
import { ApiResponse } from '../../types/common';

/**
 * 处理获取任务池列表请求
 * @param req - Next.js请求对象，包含客户端发送的请求数据
 * @returns Next.js响应对象，包含任务池列表或错误信息
 */
export async function handleGetTaskPoolList(req: NextRequest): Promise<NextResponse> {
  try {
    // 调用API客户端发送GET请求到任务池列表端点
    // 使用TASK_POOL_LIST_ENDPOINT常量作为URL
    // 类型参数TaskPoolListResponse表示期望的响应数据类型
    const response = await apiClient.get<TaskPoolListResponse>(TASK_POOL_LIST_ENDPOINT);
    
    // 创建标准化的响应对象
    // 当后端返回code: 0时，success为true，否则为false
    const standardResponse = {
      code: response.data.code,
      message: response.data.message,
      data: response.data.data,
      timestamp: response.data.timestamp,
      success: response.data.code === 0
    };
    
    // 返回响应给客户端
    return NextResponse.json(standardResponse, { status: response.status });
  } catch (error) {
    // 捕获并处理请求过程中发生的错误
    // 使用handleApiError函数将原始错误转换为标准化的ApiError对象
    const apiError: ApiError = handleApiError(error);
    // 使用createErrorResponse函数创建标准化的错误响应
    const errorResponse: ApiResponse = createErrorResponse(apiError);
    
    // 返回错误响应给客户端
    return NextResponse.json(errorResponse, { status: apiError.status });
  }
}
