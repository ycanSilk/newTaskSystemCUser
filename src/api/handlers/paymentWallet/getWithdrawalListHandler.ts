import { NextResponse } from 'next/server';
import apiClient from '../../client';
import { GET_WITHDRAWAL_RECORD_ENDPOINT } from '../../endpoints/paymentWallet';
import { ApiError, handleApiError, createErrorResponse } from '../../client/errorHandler';
import { GetWithdrawalListResponseData, GetWithdrawalListResponse } from '../../types/paymentWallet/getWithdrawalListTypes';

/**
 * 获取提现记录列表的API处理函数
 * @returns NextResponse - 包含提现记录列表的响应
 */
export async function handleGetWithdrawalList(): Promise<NextResponse> {
  try {
    // 使用apiClient发送GET请求获取提现记录列表
    const response = await apiClient.get<GetWithdrawalListResponseData>(GET_WITHDRAWAL_RECORD_ENDPOINT);
    
    // 检查响应数据是否有效
    if (response.data.code === 0 && response.data.data) {
      // 返回成功响应
      const successResponse: GetWithdrawalListResponse = {
        success: true,
        message: response.data.message || '获取提现记录成功',
        data: response.data.data
      };
      
      return NextResponse.json(successResponse, { status: response.status });
    } else {
      // 返回错误响应
      const errorResponse: GetWithdrawalListResponse = {
        success: false,
        message: response.data.message || '获取提现记录失败',
        data: null
      };
      
      return NextResponse.json(errorResponse, { status: 200 });
    }
  } catch (error) {
    // 处理API错误
    const apiError: ApiError = handleApiError(error);
    const errorResponse: GetWithdrawalListResponse = createErrorResponse(apiError);
    
    return NextResponse.json(errorResponse, { status: apiError.status });
  }
}