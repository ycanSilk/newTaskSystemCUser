// 获取已接受任务列表API类型定义
// 用于定义获取已接受任务列表API的请求和响应类型

// 推荐标记类型，包含评论内容和图片URL
interface RecommendMark {
  // 评论内容
  comment: string;
  // 图片URL，可选
  image_url: string;
  //@用户标识
  at_user:string;
}

// 任务进度类型，包含任务总数、已完成数、进行中数等
interface TaskProgress {
  // 任务总数
  task_count: number;
  // 已完成任务数
  task_done: number;
  // 进行中任务数
  task_doing: number;
  // 审核中任务数
  task_reviewing: number;
  // 可用任务数
  task_available: number;
  // 进度百分比
  progress_percent: number;
}

// 分页信息类型
interface Pagination {
  // 当前页码
  page: number;
  // 每页大小
  page_size: number;
  // 总记录数
  total: number;
  // 总页数
  total_pages: number;
}

// 已接受任务项类型
interface AcceptedTaskItem {
  // 记录ID
  record_id: number;
  // 任务ID
  b_task_id: number;
  // 模板标题
  template_title: string;
  // 视频URL
  video_url: string;
  // 推荐标记
  recommend_mark: RecommendMark;
  // 评论URL，可选
  comment_url: string | null;
  // 截图，可选
  screenshots: any | null;
  // 奖励金额
  reward_amount: string;
  // 状态
  status: number;
  // 状态文本
  status_text: string;
  // 拒绝原因，可选
  reject_reason: string | null;
  // 创建时间
  created_at: string;
  // 提交时间，可选
  submitted_at: string | null;
  // 审核时间，可选
  reviewed_at: string | null;
  // 截止时间（时间戳）
  deadline: number;
  // 截止时间文本
  deadline_text: string;
  // 剩余时间
  time_remaining: number;
  // 是否已超时
  is_timeout: boolean;
  // 任务进度
  task_progress: TaskProgress;
}

// 响应数据类型
interface GetMyAcceptedTaskListResponseData {
  // 已接受任务列表
  list: AcceptedTaskItem[];
  // 分页信息
  pagination: Pagination;
}

// API响应类型
export interface GetMyAcceptedTaskListResponse {
  // 状态码
  code: number;
  // 消息
  message: string;
  // 响应数据
  data: GetMyAcceptedTaskListResponseData;
  // 时间戳
  timestamp: number;
}

// API请求参数类型
export interface GetMyAcceptedTaskListRequest {
  // 任务状态，可选
  status?: number;
  // 页码，可选
  page?: number;
  // 每页大小，可选
  size?: number;
}

// 通用API响应类型
export interface ApiResponse<T = any> {
  // 是否成功
  success: boolean;
  // 状态码
  code: number;
  // 消息
  message: string;
  // 响应数据
  data: T;
  // 时间戳
  timestamp: number;
  // 错误类型，可选
  errorType?: string;
}
