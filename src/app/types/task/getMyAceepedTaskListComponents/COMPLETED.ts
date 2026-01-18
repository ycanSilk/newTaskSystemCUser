// 类型定义：推荐标记接口
export interface RecommendMark {
  at_user: string;
  comment: string;
  image_url: string;
}

// 类型定义：任务进度接口
export interface TaskProgress {
  task_count: number;
  task_done: number;
  task_doing: number;
  task_reviewing: number;
  task_available: number;
  progress_percent: number;
}

// 类型定义：分页信息接口
export interface Pagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

// 类型定义：单个任务数据接口
export interface CompletedTask {
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
  reviewed_at: string;
  deadline: number;
  deadline_text: string;
  time_remaining: number | null;
  is_timeout: boolean;
  task_progress: TaskProgress;
}

// 类型定义：API响应数据接口
export interface CompletedTasksResponseData {
  list: CompletedTask[];
  pagination: Pagination;
}

// 类型定义：API响应接口
export interface CompletedTasksResponse {
  code: number;
  message: string;
  data: CompletedTasksResponseData;
  timestamp: number;
}
