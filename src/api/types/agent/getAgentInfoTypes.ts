// 获取代理信息API的类型定义

// API响应数据接口 - AgentInfo
export interface AgentInfo {
  user_id: number;
  username: string;
  invite_code: string;
  is_agent: number;
  is_agent_text: string;
  parent_id: number;
  parent_username: string;
  created_at: string;
}

// 原始API响应数据接口
export interface GetAgentInfoResponseData {
  code: number;
  message: string;
  data: AgentInfo;
  timestamp: number;
}

// 标准化API响应接口
export interface GetAgentInfoResponse {
  success: boolean;
  message: string;
  data: AgentInfo | null;
  code: number;
  timestamp: number;
}