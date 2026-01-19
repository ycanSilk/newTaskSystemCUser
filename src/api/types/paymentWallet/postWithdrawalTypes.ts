// 提现请求数据类型
export interface PostWithdrawalRequest {
  /** 提现金额，数字类型 */
  amount: number;
  /** 提现方式，字符串类型，如alipay */
  withdraw_method: string;
  /** 提现账号，字符串类型 */
  withdraw_account: string;
  /** 支付密码，字符串类型，MD5加密后的值 */
  pswd: string;
}

// 提现响应数据类型
export interface PostWithdrawalResponseData {
  /** 提现ID，数字类型 */
  withdraw_id: number;
  /** 提现金额，字符串类型 */
  amount: string;
  /** 提现方式，字符串类型 */
  withdraw_method: string;
  /** 提现账号，字符串类型 */
  withdraw_account: string;
  /** 提现状态，数字类型，0表示待审核 */
  status: number;
  /** 状态文本，字符串类型，如"待审核" */
  status_text: string;
  /** 当前余额，字符串类型 */
  current_balance: string;
}

// API响应接口
export interface PostWithdrawalResponse {
  /** 响应码，数字类型，0表示成功 */
  code: number;
  /** 响应消息，字符串类型 */
  message: string;
  /** 响应数据，PostWithdrawalResponseData类型 */
  data: PostWithdrawalResponseData;
  /** 时间戳，数字类型 */
  timestamp: number;
}
