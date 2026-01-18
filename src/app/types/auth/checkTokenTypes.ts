// 检查Token响应类型定义
// 这个文件定义了checkToken API的响应数据结构

/**
 * 检查Token响应数据类型
 * 定义了checkToken API返回的数据格式
 */
export interface CheckTokenResponseData {
  /**
   * Token是否有效
   */
  valid: boolean;
  
  /**
   * 用户ID
   */
  user_id: number;
  
  /**
   * 用户名
   */
  username: string;
  
  /**
   * 邮箱
   */
  email: string;
  
  /**
   * 邀请码
   */
  invite_code: string;
  
  /**
   * 邀请人ID
   */
  parent_id: number | null;
  
  /**
   * 是否为代理商
   * 0表示否，1表示是
   */
  is_agent: number;
  
  /**
   * Token过期时间
   */
  token_expired_at: string;
  
  /**
   * Token剩余有效期（秒）
   */
  expires_in: number;
}

/**
 * 检查Token响应类型
 * 定义了checkToken API的完整响应格式
 */
export interface CheckTokenResponse {
  /**
   * 状态码
   * 0表示成功，其他表示失败
   */
  code: number;
  
  /**
   * 消息
   * 操作结果的文字描述
   */
  message: string;
  
  /**
   * 数据
   * 包含Token有效性和用户信息
   */
  data: CheckTokenResponseData;
  
  /**
   * 时间戳
   * 响应生成的时间，单位为秒
   */
  timestamp: number;
}