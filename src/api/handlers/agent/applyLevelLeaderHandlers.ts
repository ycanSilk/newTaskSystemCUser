import { NextResponse } from 'next/server';
import apiClient from '../../client';
import { APPLY_LEVEL_LEADER_ENDPOINT } from '../../endpoints/agent';
import { ApiError, handleApiError, createErrorResponse } from '../../client/errorHandler';
import { ApplyLevelLeaderRequest, ApplyLevelLeaderResponse, ApplyLevelLeaderResponseData } from '../../types/agent/applyLevelLeaderTypes';

/**
 * 申请等级领导人的API处理函数
 * @returns NextResponse - 包含申请结果的响应
 */
export async function handleApplyLevelLeader(): Promise<NextResponse> {
  try {
    // 使用apiClient发送POST请求申请等级领导人
    const response = await apiClient.post<ApplyLevelLeaderResponse>(APPLY_LEVEL_LEADER_ENDPOINT);
    
    // 检查响应数据是否有效
    if (response.data.code === 0 && response.data.data) {
      // 返回成功响应
      return NextResponse.json(
        {
          success: true,
          message: response.data.message || '申请提交成功',
          data: response.data.data
        }, 
        { status: response.status }
      );
    } else {
      // 返回错误响应
      return NextResponse.json(
        {
          success: false,
          message: response.data.message || '申请提交失败',
          data: null
        }, 
        { status: response.status }
      );
    }
  } catch (error) {
    // 处理API错误
    const apiError: ApiError = handleApiError(error);
    const errorResponse = createErrorResponse(apiError);
    
    return NextResponse.json(errorResponse, { status: apiError.status });
  }
}