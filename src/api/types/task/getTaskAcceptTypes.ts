// 获取任务模板API类型定义
// 用于定义获取任务模板API的请求和响应类型

// 推荐标记类型，包含评论内容和图片URL
interface RecommendMark {
  // 评论内容
  comment: string;
  // 图片URL，可选
  image_url: string;
}

// 响应数据类型
interface GetTaskAcceptResponseData {
  // 记录ID
  record_id: number;
  // 任务ID
  b_task_id: number;
  // 视频URL
  video_url: string;
  // 推荐标记
  recommend_mark: RecommendMark;
  // 奖励金额
  reward_amount: string;
  // 截止时间（时间戳）
  deadline: number;
  // 状态
  status: number;
  // 状态文本
  status_text: string;
}

// API请求参数类型
export interface GetTaskAcceptRequest {
  // 任务ID
  b_task_id: number;
}

// API响应类型
export interface GetTaskAcceptResponse {
  // 状态码
  code: number;
  // 消息
  message: string;
  // 响应数据
  data: GetTaskAcceptResponseData;
  // 时间戳
  timestamp: number;
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
