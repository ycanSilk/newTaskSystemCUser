// Task模块 - 任务池列表类型定义
// 这个文件包含了获取任务池列表相关的响应类型定义，用于前端页面渲染

/**
 * 任务池列表项类型
 * 用于定义任务池列表中每个任务的详细信息
 */
export interface TaskPoolListItem {
  /**
   * 任务ID
   * 任务的唯一标识
   */
  id: number;
  
  /**
   * 任务标题
   * 任务的名称或描述
   */
  title: string;
  
  /**
   * 是否为组合任务
   * true表示是组合任务，false表示是单任务
   */
  is_combo: boolean;
  
  /**
   * 任务阶段
   * 0表示单任务，1表示阶段1，2表示阶段2
   */
  stage: number;
  
  /**
   * 任务阶段文本
   * 对任务阶段的文字描述，如"单任务"、"阶段1"等
   */
  stage_text: string;
  
  /**
   * 视频URL
   * 任务相关的视频链接
   */
  video_url: string;
  
  /**
   * 截止时间
   * 任务的截止时间，Unix时间戳格式
   */
  deadline: number;
  
  /**
   * 截止时间文本
   * 任务截止时间的文字描述，如"2026-08-12 16:53:20"
   */
  deadline_text: string;
  
  /**
   * 任务总数量
   * 任务的总数量
   */
  task_count: number;
  
  /**
   * 已完成任务数量
   * 已经完成的任务数量
   */
  task_done: number;
  
  /**
   * 进行中任务数量
   * 正在进行中的任务数量
   */
  task_doing: number;
  
  /**
   * 审核中任务数量
   * 正在审核中的任务数量
   */
  task_reviewing: number;
  
  /**
   * 剩余任务数量
   * 还未被领取的任务数量
   */
  remain_count: number;
  
  /**
   * 单价
   * 每个任务的单价
   */
  unit_price: number;
  

  /**
   * 佣金
   * 每个任务的佣金,C端用户接单显示的价格。
   */
  commission:number;
  /**
   * 总价
   * 任务的总价，计算公式：unit_price * task_count
   */
  total_price: number;
  
  /**
   * 任务状态
   * 1表示任务有效，0表示任务无效
   */
  status: number;
  
  /**
   * 创建时间
   * 任务的创建时间，如"2026-01-11 16:04:19"
   */
  created_at: string;
}

/**
 * 任务池分页信息类型
 * 用于定义任务池列表的分页信息
 */
export interface TaskPoolPagination {
  /**
   * 当前页码
   * 当前返回的是第几页数据
   */
  page: number;
  
  /**
   * 每页数量
   * 每页显示的数据条数
   */
  limit: number;
  
  /**
   * 总数量
   * 所有符合条件的数据总条数
   */
  total: number;
  
  /**
   * 总页数
   * 所有数据总共需要多少页才能显示完
   */
  total_pages: number;
}

/**
 * 任务池响应数据类型
 * 用于定义任务池API返回的响应数据结构
 */
export interface TaskPoolListResponseData {
  /**
   * 任务池列表
   * 包含所有符合条件的任务池列表项
   */
  list: TaskPoolListItem[];
  
  /**
   * 分页信息
   * 任务池列表的分页数据
   */
  pagination: TaskPoolPagination;
}

/**
 * 任务池响应类型
 * 用于定义任务池API返回的完整响应结构
 */
export interface TaskPoolListResponse {
  /**
   * 状态码
   * 0表示成功，其他表示失败
   */
  code: number;
  
  /**
   * 消息
   * 对请求结果的文字描述，如"ok"、"请求失败"等
   */
  message: string;
  
  /**
   * 数据
   * 响应的实际数据，包含任务池列表和分页信息
   */
  data: TaskPoolListResponseData;
  
  /**
   * 时间戳
   * 响应生成的时间，Unix时间戳格式
   */
  timestamp: number;
  
  /**
   * 成功标识
   * true表示请求成功，false表示请求失败
   */
  success: boolean;
}
