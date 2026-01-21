// 获取代理邀请列表API的类型定义

// API响应数据接口 - InvitedUser
interface InvitedUser {
  username: string;
  email: string;
  completed_tasks: number;
  created_at: string;
}

// 分页信息接口
interface Pagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

// API响应数据结构接口
interface InviteListData {
  list: InvitedUser[];
  pagination: Pagination;
}

// 原始API响应数据接口
export interface GetAgentInviteListResponseData {
  code: number;
  message: string;
  data: InviteListData;
  timestamp: number;
}

// 标准化API响应接口
export interface GetAgentInviteListResponse {
  success: boolean;
  message: string;
  data: InviteListData | null;
  code: number;
  timestamp: number;
}
