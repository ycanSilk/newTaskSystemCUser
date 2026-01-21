// 申请等级领导人请求类型
export interface ApplyLevelLeaderRequest {
  // 该接口不需要请求参数
}

// 申请等级领导人响应数据类型
export interface ApplyLevelLeaderResponseData {
  application_id: number;
  valid_invites: number;
  total_invites: number;
  status: number;
  status_text: string;
  created_at: string;
}

// 申请等级领导人API响应类型
export interface ApplyLevelLeaderResponse {
  code: number;
  message: string;
  data: ApplyLevelLeaderResponseData;
  timestamp: number;
}

// 标准化的API响应类型
export interface ApiResponse {
  success: boolean;
  message: string;
  data: ApplyLevelLeaderResponseData | null;
}