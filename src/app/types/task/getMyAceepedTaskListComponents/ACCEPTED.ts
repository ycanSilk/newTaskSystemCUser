// 获取已接受任务列表类型定义
// 用于定义获取已接受任务列表API的请求和响应类型

// 推荐标记接口，包含评论内容和图片URL
interface RecommendMark {
  // 评论内容
  comment: string;
  // 图片URL
  image_url: string;
  //@用户标识
  at_user: string;
}

// 任务进度接口，包含任务总数、已完成数、进行中数等
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

  // C端用户前端提交上传的截图URL，给提交任务接口使用的
  screenshots: string | null;

  // C端用户提交上来的评论URL
 comment_url: string | null;
}

// 分页信息接口
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

// 任务接口，与API响应格式完全匹配，只保留必要字段
export interface Task {
  // 记录ID
  record_id: number;

  // 任务ID
  b_task_id: number;
  
  // 前端组件使用的id字段
  id: string;
  
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

  // 状态码
  status: number;

  // 状态文本
  status_text: string;

  // 驳回原因
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

// API响应数据接口
export interface GetMyAcceptedTaskListResponseData {
  // 任务列表 - 具体Task类型由组件定义
  list: any[];
  // 分页信息
  pagination: Pagination;
}

// 提交任务请求数据类型
export interface SubmitTaskRequest {
  b_task_id: number;
  record_id: number;
  comment_url: string;
  screenshots: string[];
}

// 提交任务响应数据类型
export interface SubmitTaskResponseData {
  record_id: number;
  status: number;
  status_text: string;
  submitted_at: string;
}

// 提交任务完整响应类型
export interface SubmitTaskResponse {
  code: number;
  message: string;
  data: SubmitTaskResponseData;
  timestamp: number;
}

// 提交任务请求类型
export interface SubmitTaskRequest {
  // 业务任务ID
  b_task_id: number;
  // 记录ID
  record_id: number;
  // 评论URL
  comment_url: string;
  // 截图URL数组
  screenshots: string[];
}

// 提交任务响应数据类型
export interface SubmitTaskResponseData {
  // 记录ID
  record_id: number;
  // 状态码
  status: number;
  // 状态文本
  status_text: string;
  // 提交时间
  submitted_at: string;
}

// 提交任务响应类型
export interface SubmitTaskResponse {
  // 状态码
  code: number;
  // 消息
  message: string;
  // 响应数据
  data: SubmitTaskResponseData;
  // 时间戳
  timestamp: number;
}

// API响应接口
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
