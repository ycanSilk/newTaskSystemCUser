// 提现请求参数接口
export interface PostWithdrawalRequest {
  amount: number;
  withdraw_account: string;
  withdraw_method: string;
  pswd: string;
}

// 提现响应数据接口
export interface PostWithdrawalResponseData {
  code: number;
  message: string;
  data: any;
  timestamp: number;
}

// 提现API响应接口
export interface PostWithdrawalResponse {
  success: boolean;
  code: number;
  message: string;
  timestamp: number;
  data: any;
}