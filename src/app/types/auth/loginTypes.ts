// 登录页面类型定义

/**
 * 登录表单数据类型
 * 用于定义登录表单的字段结构
 */
export interface LoginFormData {
  /**
   * 用户名/账号
   * 用于登录的用户名或账号
   */
  username: string;
  
  /**
   * 密码
   * 用于登录的密码
   */
  password: string;
  
  /**
   * 验证码
   * 用于前端验证码验证
   */
  captcha: string;
}

/**
 * 登录API请求类型
 * 用于定义发送给后端的登录请求数据结构
 */
export interface LoginRequest {
  /**
   * 账号
   * 与后端API字段名保持一致
   */
  account: string;
  
  /**
   * 密码
   * 与后端API字段名保持一致
   */
  password: string;
}

/**
 * 登录API响应类型
 * 用于定义登录API返回的数据结构
 * 与后端API响应格式保持一致
 */
export interface LoginApiResponse {
  /**
   * 状态码
   * 0表示成功，其他表示失败
   */
  code: number;
  
  /**
   * 消息
   * 登录结果的文字描述
   */
  message: string;
  
  /**
   * 数据
   * 登录成功时返回的用户信息和token
   */
  data: {
    /**
     * 认证令牌
     * 用户登录后用于身份验证的token
     */
    token: string;
    
    /**
     * 用户ID
     * 用户的唯一标识
     */
    user_id: number;
    
    /**
     * 用户名
     * 用户的用户名
     */
    username: string;
    
    /**
     * 邮箱
     * 用户的邮箱地址
     */
    email: string;
    
    /**
     * 手机号
     * 用户的手机号，可能为null
     */
    phone: string | null;
    
    /**
     * 邀请码
     * 用户的邀请码
     */
    invite_code: string;
    
    /**
     * 上级ID
     * 用户的上级ID，可能为null
     */
    parent_id: number | null;
    
    /**
     * 是否为代理
     * 0表示不是代理，1表示是代理
     */
    is_agent: number;
    
    /**
     * 钱包ID
     * 用户的钱包ID
     */
    wallet_id: number;
  };
  
  /**
   * 时间戳
   * 响应生成的时间，单位为秒
   */
  timestamp: number;
}
