// Check Token API 类型定义

// 响应数据类型
export interface CheckTokenResponseData {
  valid: boolean;     // 是否有效
  user_id: number;      // 用户ID
  username: string;     // 用户名
  email: string;        // 邮箱
  invite_code: string;  // 邀请码
  parent_id: number | null;      // 邀请我的用户的ID
  is_agent: number;     // 是否为代理商（0或1）
  token_expired_at: string; // 令牌过期时间
  expires_in: number;   // 过期时间（秒）
}

// API响应数据接口
export interface CheckTokenApiResponse {
  code: number;
  message: string;
  data: CheckTokenResponseData;
  timestamp: number;
}

// 前端API响应接口
export interface CheckTokenResponse {
  code: number;
  message: string;
  data: CheckTokenResponseData;
  timestamp: number;
}
