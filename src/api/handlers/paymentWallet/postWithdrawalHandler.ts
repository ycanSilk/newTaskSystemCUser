import { NextResponse } from 'next/server';
import apiClient from '../../client';
import { WITHDRAWAL_WALLET_ENDPOINT } from '../../endpoints/paymentWallet';
import { ApiError, handleApiError, createErrorResponse } from '../../client/errorHandler';
import { PostWithdrawalRequest, PostWithdrawalResponse } from '../../types/paymentWallet/postWithdrawalTypes';

/**
 * 处理提现请求的API处理函数
 * @param requestBody - 提现请求数据
 * @returns NextResponse - API响应
 */
export async function handlePostWithdrawal(requestBody: PostWithdrawalRequest): Promise<NextResponse> {
  try {
    // 使用API客户端发送请求，不直接使用axios
    const response = await apiClient.post<PostWithdrawalResponse>(WITHDRAWAL_WALLET_ENDPOINT, requestBody);
    
    // 返回标准化的响应
    return NextResponse.json(response.data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // 统一处理错误
    const apiError: ApiError = handleApiError(error);
    const errorResponse = createErrorResponse(apiError);
    
    // 返回错误响应
    return NextResponse.json(errorResponse, {
      status: apiError.status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
