// 类型定义：获取代理邀请数据响应数据接口
export interface GetAgentInviteDataResponseData {
  total_invites: number;
  valid_invites: number;
  total_tasks_completed: number;
  total_commission_earned: string;
}

// 类型定义：API响应接口
export interface GetAgentInviteDataResponse {
  code: number;
  message: string;
  data: GetAgentInviteDataResponseData;
  timestamp: number;
}

// 类型定义：前端API响应接口
export interface GetAgentInviteDataApiResponse {
  success: boolean;
  message: string;
  data: GetAgentInviteDataResponseData | null;
  timestamp: number;
}