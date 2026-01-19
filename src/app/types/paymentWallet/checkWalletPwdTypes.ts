// 检查支付密码响应数据接口
export interface CheckWalletPwdResponseData {
  has_password: boolean;
}

// 检查支付密码API响应接口
export interface CheckWalletPwdResponse {
  code: number;
  message: string;
  data: CheckWalletPwdResponseData;
  timestamp: number;
}