// 推荐评论和图片URL类型
export interface RecommendMark {
  comment: string;
  image_url: string;
  at_user: string;
}

// 任务数据结构
export interface Task {
  record_id: number;
  b_task_id: number;
  template_title: string;
  video_url: string;
  recommend_mark: RecommendMark;
  comment_url: string;
  screenshots: string[];
  reward_amount: string;
  status: number;
  status_text: string;
  reject_reason: string | null;
  created_at: string;
  submitted_at: string;
  reviewed_at: string | null;
  deadline: number;
  deadline_text: string;
  time_remaining: string | null;
  is_timeout: boolean;
  task_progress: {
    task_count: number;
    task_done: number;
    task_doing: number;
    task_reviewing: number;
    task_available: number;
    progress_percent: number;
  };
  // 前端需要的额外字段
  id?: string;
}

// 分页信息类型
export interface Pagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

// API响应数据类型
export interface GetMyPendingTasksResponseData {
  list: Task[];
  pagination: Pagination;
}

// 完整的API响应类型
export interface GetMyPendingTasksResponse {
  code: number;
  message: string;
  data: GetMyPendingTasksResponseData;
  timestamp: number;
}