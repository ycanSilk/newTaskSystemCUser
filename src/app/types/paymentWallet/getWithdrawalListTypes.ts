// 分页信息类型
export interface Pagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

// 提现记录项类型
export interface WithdrawalRecord {
  id: number;
  amount: string;
  withdraw_method: string;
  withdraw_account: string;
  status: number;
  status_text: string;
  reject_reason: string | null;
  img_url: string;
  reviewed_at: string;
  created_at: string;
}

// API响应数据接口
export interface GetWithdrawalListResponse {
  success: boolean;
  message: string;
  data: {
    list: WithdrawalRecord[];
    pagination: Pagination;
  } | null;
}