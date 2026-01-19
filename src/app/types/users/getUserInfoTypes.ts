// 钱包信息接口
export interface Wallet {
  /** 钱包余额，字符串类型，保留两位小数 */
  balance: string;
}

// 用户信息接口
export interface UserInfo {
  /** 用户ID，数字类型 */
  id: number;
  /** 用户名，字符串类型 */
  username: string;
  /** 邮箱，字符串类型 */
  email: string;
  /** 手机号，字符串类型 */
  phone: string;
  /** 邀请码，字符串类型 */
  invite_code: string;
  /** 上级用户ID，数字类型 */
  parent_id: number;
  /** 是否为代理，数字类型，1表示是，0表示否 */
  is_agent: number;
  /** 钱包ID，数字类型 */
  wallet_id: number;
  /** 钱包信息，Wallet类型 */
  wallet: Wallet;
  /** 用户状态，数字类型，1表示正常，0表示禁用 */
  status: number;
  /** 状态变更原因，字符串类型，可能为null */
  reason: string | null;
  /** 注册IP，字符串类型 */
  create_ip: string;
  /** 创建时间，字符串类型，格式为YYYY-MM-DD HH:MM:SS */
  created_at: string;
  /** 更新时间，字符串类型，格式为YYYY-MM-DD HH:MM:SS */
  updated_at: string;
}

// API响应数据接口
export interface GetUserInfoResponseData {
  /** 用户ID，数字类型 */
  id: number;
  /** 用户名，字符串类型 */
  username: string;
  /** 邮箱，字符串类型 */
  email: string;
  /** 手机号，字符串类型 */
  phone: string;
  /** 邀请码，字符串类型 */
  invite_code: string;
  /** 上级用户ID，数字类型 */
  parent_id: number;
  /** 是否为代理，数字类型，1表示是，0表示否 */
  is_agent: number;
  /** 钱包ID，数字类型 */
  wallet_id: number;
  /** 钱包信息，Wallet类型 */
  wallet: Wallet;
  /** 用户状态，数字类型，1表示正常，0表示禁用 */
  status: number;
  /** 状态变更原因，字符串类型，可能为null */
  reason: string | null;
  /** 注册IP，字符串类型 */
  create_ip: string;
  /** 创建时间，字符串类型，格式为YYYY-MM-DD HH:MM:SS */
  created_at: string;
  /** 更新时间，字符串类型，格式为YYYY-MM-DD HH:MM:SS */
  updated_at: string;
}

// API响应接口
export interface GetUserInfoResponse {
  /** 响应码，数字类型，0表示成功，非0表示失败 */
  code: number;
  /** 响应消息，字符串类型，描述响应结果 */
  message: string;
  /** 响应数据，GetUserInfoResponseData类型 */
  data: GetUserInfoResponseData;
  /** 时间戳，数字类型，表示响应时间 */
  timestamp: number;
}
