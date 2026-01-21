export interface ApplyLevelLeaderApiResponse {
  success: boolean;
  message: string;
  data: ApplyLevelLeaderResponseData | null;
  code?: number;
  timestamp?: number;
}

export interface ApplyLevelLeaderResponseData {
  // 根据实际API响应结构定义字段
  leader_id?: string;
  application_id?: number;
  valid_invites?: number;
  total_invites?: number;
  status?: number;
  status_text?: string;
  created_at?: string;
  message?: string;
}