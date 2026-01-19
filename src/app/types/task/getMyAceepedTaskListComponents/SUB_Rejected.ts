// API响应类型定义

// 推荐标记类型
export interface RecommendMark {
  comment: string;
  image_url: string;
}

// 任务进度类型
export interface TaskProgress {
  task_count: number;
  task_done: number;
  task_doing: number;
  task_reviewing: number;
  task_available: number;
  progress_percent: number;
}

// 分页类型
export interface Pagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

// 任务列表项类型
export interface RejectedTask {
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
  reject_reason: string;
  created_at: string;
  submitted_at: string;
  reviewed_at: string;
  deadline: number;
  deadline_text: string;
  time_remaining: number | null;
  is_timeout: boolean;
  task_progress: TaskProgress;
}

// 数据响应类型
export interface RejectedTasksData {
  list: RejectedTask[];
  pagination: Pagination;
}

// 完整API响应类型
export interface RejectedTasksResponse {
  code: number;
  message: string;
  data: RejectedTasksData;
  timestamp: number;
}
