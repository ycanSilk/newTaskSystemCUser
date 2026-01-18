// 提交任务API类型定义
// 用于定义提交任务API的请求和响应类型

// 提交任务请求数据类型
export interface SubmitTaskRequest {
  b_task_id: number;    //B端用户发布的主任务 ，任务ID
  record_id: number;    //任务记录ID
  comment_url: string;    //评论链接
  screenshots: string[];    //任务截图链接数组
}

// 提交任务响应数据类型
export interface SubmitTaskResponseData {
  record_id: number;    //任务记录ID
  status: number;        //任务状态 1 = 待审核 2 = 已通过 3 = 已驳回
  status_text: string;    //任务状态文本描述
  submitted_at: string;    //任务提交时间
}

// 提交任务完整响应类型
export interface SubmitTaskResponse {
  code: number;
  message: string;
  data: SubmitTaskResponseData;
  timestamp: number;
}
