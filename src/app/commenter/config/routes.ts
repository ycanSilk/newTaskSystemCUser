// Commenter模块路由配置管理

/**
 * 路由配置项接口
 */
export interface RouteConfig {
  path: string;
  title: string;
  isDynamic?: boolean;
}

/**
 * Commenter模块路由配置 - 硬解码映射
 * 统一管理所有路由路径和标题的直接映射关系
 */
export const commenterRoutes: Record<string, RouteConfig> = {
  // 主页面
  commenter: { path: '/commenter', title: '接单中心' },
  
  // 大厅相关路由
  hall: { path: '/commenter/hall', title: '任务大厅' },
  hallContent: { path: '/commenter/hall-content', title: '大厅内容' },
  
  // 任务相关路由
  tasks: { path: '/commenter/tasks', title: '我的任务' },
  tasksProgress: { path: '/commenter/tasks/progress', title: '进行中任务' },
  tasksPendingReview: { path: '/commenter/tasks/pending-review', title: '待审核任务' },
  tasksCompleted: { path: '/commenter/tasks/completed', title: '已完成任务' },
  tasksRejected: { path: '/commenter/tasks/rejected', title: '已拒绝任务' },
  taskDetail: { path: '/commenter/task-detail', title: '任务详情' },
  rejectedTaskDetail: { path: '/commenter/rejected-task-detail', title: '拒绝任务详情' },
  
  // 订单管理相关路由
  orderManagement: { path: '/commenter/order-management', title: '订单管理' },
  orderManagementDetail: { path: '/commenter/order-management/[id]', title: '订单详情', isDynamic: true },
  
  // 收益相关路由
  earnings: { path: '/commenter/earnings', title: '我的收益' },
  earningsOverview: { path: '/commenter/earnings/overview', title: '收益概览' },
  earningsOrderEarnings: { path: '/commenter/earnings/order-earnings', title: '订单收益' },
  earningsWithdraw: { path: '/commenter/earnings/withdraw', title: '提现' },
  earningsDetails: { path: '/commenter/earnings/details', title: '收益明细' },
  earningsWithdrawalDetails: { path: '/commenter/earnings/withdrawal-details/[id]', title: '提现详情', isDynamic: true },
  
  // 余额相关路由
  balance: { path: '/commenter/balance', title: '我的余额' },
  balanceTransactionList: { path: '/commenter/balance/transaction-list', title: '余额记录' },
  balanceTransactionDetails: { path: '/commenter/balance/transaction-details/[id]', title: '交易详情', isDynamic: true },
  
  // 提现相关路由
  withdrawal: { path: '/commenter/withdrawal', title: '提现' },
  withdrawalList: { path: '/commenter/withdrawal/list', title: '提现记录' },
  withdrawalDetail: { path: '/commenter/withdrawal/detail/[id]', title: '提现详情', isDynamic: true },
  
  // 银行卡相关路由
  bankCards: { path: '/commenter/bank-cards', title: '银行卡管理' },
  bankCardsDetail: { path: '/commenter/bank-cards/bank-cardlist/[id]', title: '银行卡详情', isDynamic: true },
  bindBankCard: { path: '/commenter/bind-bank-card', title: '绑定银行卡' },
  
  // 邀请相关路由
  invite: { path: '/commenter/invite', title: '邀请好友' },
  inviteDetails: { path: '/commenter/invite/details/[id]', title: '邀请详情', isDynamic: true },
  inviteCommissionDetails: { path: '/commenter/invite/commission-details/[id]', title: '佣金详情', isDynamic: true },
  
  // 租赁相关路由
  lease: { path: '/commenter/lease', title: '账号租赁' },
  leaseCreate: { path: '/commenter/lease/create', title: '创建租赁' },
  leaseEdit: { path: '/commenter/lease/edit/[id]', title: '编辑租赁', isDynamic: true },
  leaseDetail: { path: '/commenter/lease/[id]', title: '租赁详情', isDynamic: true },
  
  // 个人中心相关路由
  profile: { path: '/commenter/profile', title: '个人中心' },
  profileSettings: { path: '/commenter/profile/settings', title: '个人设置' },
  
  // 其他路由
  notification: { path: '/commenter/notification', title: '通知提醒' },
  douyinVersion: { path: '/commenter/douyin-version', title: '下载中心' },
  transactionDetails: { path: '/commenter/transaction-details/[id]', title: '交易详情', isDynamic: true },
  transactionList: { path: '/commenter/transaction-list', title: '交易记录' }
};

/**
 * 路由层级关系和返回路径映射
 */
export const routeHierarchyMap: Record<string, string> = {
  // 任务相关路由层级
  '/commenter/task-detail': '/commenter/hall',
  '/commenter/rejected-task-detail': '/commenter/tasks/rejected',
  
  // 订单管理相关路由层级
  '/commenter/order-management/[id]': '/commenter/order-management',
  
  // 收益相关路由层级
  '/commenter/earnings/overview': '/commenter/earnings',
  '/commenter/earnings/order-earnings': '/commenter/earnings',
  '/commenter/earnings/withdraw': '/commenter/earnings',
  '/commenter/earnings/details': '/commenter/earnings',
  '/commenter/earnings/withdrawal-details/[id]': '/commenter/earnings',
  '/commenter/earnings/order-earnings/earnings-detail': '/commenter/earnings/order-earnings',
  
  // 余额相关路由层级
  '/commenter/balance/transaction-list': '/commenter/balance',
  '/commenter/balance/transaction-details/[id]': '/commenter/balance/transaction-list',
  
  // 提现相关路由层级
  '/commenter/withdrawal/list': '/commenter/withdrawal',
  '/commenter/withdrawal/detail/[id]': '/commenter/withdrawal/list',
  
  // 银行卡相关路由层级
  '/commenter/bank-cards/bank-cardlist/[id]': '/commenter/bank-cards',
  '/commenter/bind-bank-card': '/commenter/bank-cards',
  
  // 邀请相关路由层级
  '/commenter/invite/details/[id]': '/commenter/invite',
  '/commenter/invite/commission-details/[id]': '/commenter/invite',
  
  // 租赁相关路由层级
  '/commenter/lease/create': '/commenter/lease',
  '/commenter/lease/edit/[id]': '/commenter/lease',
  '/commenter/lease/[id]': '/commenter/lease',
  
  // 个人中心相关路由层级
  '/commenter/profile/settings': '/commenter/profile',
  
  // 其他路由层级
  '/commenter/transaction-details/[id]': '/commenter/transaction-list',
  '/commenter/hall-content': '/commenter/hall',
  '/commenter/tasks/progress': '/commenter/tasks',
  '/commenter/tasks/pending-review': '/commenter/tasks',
  '/commenter/tasks/completed': '/commenter/tasks',
  '/commenter/tasks/rejected': '/commenter/tasks'
};

/**
 * Commenter模块的一级页面
 */
export const firstLevelPages = [
  '/commenter',
  '/commenter/hall',
  '/commenter/tasks',
  '/commenter/order-management',
  '/commenter/earnings',
  '/commenter/balance',
  '/commenter/withdrawal',
  '/commenter/bank-cards',
  '/commenter/invite',
  '/commenter/lease',
  '/commenter/profile',
  '/commenter/notification',
  '/commenter/douyin-version',
  '/commenter/transaction-list'
];

/**
 * 所有路由路径到标题的硬解码映射
 * 用于快速查找路由标题
 */
export const flatRouteTitleMap: Record<string, string> = {
  '/commenter': '接单中心',
  '/commenter/hall': '任务大厅',
  '/commenter/hall-content': '大厅内容',
  '/commenter/tasks': '我的任务',
  '/commenter/tasks/progress': '进行中任务',
  '/commenter/tasks/pending-review': '待审核任务',
  '/commenter/tasks/completed': '已完成任务',
  '/commenter/tasks/rejected': '已拒绝任务',
  '/commenter/task-detail': '任务详情',
  '/commenter/rejected-task-detail': '拒绝任务详情',
  '/commenter/order-management': '订单管理',
  '/commenter/order-management/[id]': '订单详情',
  '/commenter/earnings': '我的收益',
  '/commenter/earnings/overview': '收益概览',
  '/commenter/earnings/order-earnings': '订单收益',
  '/commenter/earnings/withdraw': '提现',
  '/commenter/earnings/details': '收益明细',
  '/commenter/earnings/withdrawal-details/[id]': '提现详情',
  '/commenter/earnings/order-earnings/earnings-detail': '收益明细详情',
  '/commenter/balance': '我的余额',
  '/commenter/balance/transaction-list': '余额记录',
  '/commenter/balance/transaction-details/[id]': '交易详情',
  '/commenter/withdrawal': '提现',
  '/commenter/withdrawal/list': '提现记录',
  '/commenter/withdrawal/detail/[id]': '提现详情',
  '/commenter/bank-cards': '银行卡管理',
  '/commenter/bank-cards/bank-cardlist/[id]': '银行卡详情',
  '/commenter/bind-bank-card': '绑定银行卡',
  '/commenter/invite': '邀请好友',
  '/commenter/invite/details/[id]': '邀请详情',
  '/commenter/invite/commission-details/[id]': '佣金详情',
  '/commenter/lease': '账号租赁',
  '/commenter/lease/create': '创建租赁',
  '/commenter/lease/edit/[id]': '编辑租赁',
  '/commenter/lease/[id]': '租赁详情',
  '/commenter/profile': '个人中心',
  '/commenter/profile/settings': '个人设置',
  '/commenter/notification': '通知提醒',
  '/commenter/douyin-version': '下载中心',
  '/commenter/transaction-details/[id]': '交易详情',
  '/commenter/transaction-list': '交易记录'
};

/**
 * 动态路由模式配置
 */
export const dynamicRoutePatterns = [
  // 订单详情动态路由
  { 
    pattern: /^commenter\/order-management\/(.*)$/, 
    target: '/commenter/order-management' 
  },
  // 收益详情动态路由
  { 
    pattern: /^commenter\/earnings\/withdrawal-details\/(.*)$/, 
    target: '/commenter/earnings' 
  },
  // 余额交易详情动态路由
  { 
    pattern: /^commenter\/balance\/transaction-details\/(.*)$/, 
    target: '/commenter/balance/transaction-list' 
  },
  // 提现详情动态路由
  { 
    pattern: /^commenter\/withdrawal\/detail\/(.*)$/, 
    target: '/commenter/withdrawal/list' 
  },
  // 银行卡详情动态路由
  { 
    pattern: /^commenter\/bank-cards\/bank-cardlist\/(.*)$/, 
    target: '/commenter/bank-cards' 
  },
  // 邀请详情动态路由
  { 
    pattern: /^commenter\/invite\/details\/(.*)$/, 
    target: '/commenter/invite' 
  },
  // 佣金详情动态路由
  { 
    pattern: /^commenter\/invite\/commission-details\/(.*)$/, 
    target: '/commenter/invite' 
  },
  // 租赁编辑动态路由
  { 
    pattern: /^commenter\/lease\/edit\/(.*)$/, 
    target: '/commenter/lease' 
  },
  // 租赁详情动态路由
  { 
    pattern: /^commenter\/lease\/(.*)$/, 
    target: '/commenter/lease' 
  },
  // 交易详情动态路由
  { 
    pattern: /^commenter\/transaction-details\/(.*)$/, 
    target: '/commenter/transaction-list' 
  }
];

/**
 * 返回按钮URL硬解码映射
 * 定义每个路由点击返回按钮时应该跳转到的URL
 */
export const backButtonUrlMap: Record<string, string> = {
  // 任务相关返回路径
  '/commenter/task-detail': '/commenter/hall',
  '/commenter/rejected-task-detail': '/commenter/tasks/rejected',
  
  // 订单管理相关返回路径
  '/commenter/order-management/[id]': '/commenter/order-management',
  
  // 收益相关返回路径
  '/commenter/earnings/overview': '/commenter/earnings',
  '/commenter/earnings/order-earnings': '/commenter/earnings',
  '/commenter/earnings/withdraw': '/commenter/earnings',
  '/commenter/earnings/details': '/commenter/earnings',
  '/commenter/earnings/withdrawal-details/[id]': '/commenter/earnings',
  '/commenter/earnings/order-earnings/earnings-detail': '/commenter/earnings/order-earnings',
  
  // 余额相关返回路径
  '/commenter/balance/transaction-list': '/commenter/balance',
  '/commenter/balance/transaction-details/[id]': '/commenter/balance/transaction-list',
  
  // 提现相关返回路径
  '/commenter/withdrawal/list': '/commenter/withdrawal',
  '/commenter/withdrawal/detail/[id]': '/commenter/withdrawal/list',
  
  // 银行卡相关返回路径
  '/commenter/bank-cards/bank-cardlist/[id]': '/commenter/bank-cards',
  '/commenter/bind-bank-card': '/commenter/bank-cards',
  
  // 邀请相关返回路径
  '/commenter/invite/details/[id]': '/commenter/invite',
  '/commenter/invite/commission-details/[id]': '/commenter/invite',
  
  // 租赁相关返回路径
  '/commenter/lease/create': '/commenter/lease',
  '/commenter/lease/edit/[id]': '/commenter/lease',
  '/commenter/lease/[id]': '/commenter/lease',
  
  // 个人中心相关返回路径
  '/commenter/profile/settings': '/commenter/profile',
  
  // 其他返回路径
  '/commenter/transaction-details/[id]': '/commenter/transaction-list',
  '/commenter/hall-content': '/commenter/hall',
  '/commenter/tasks/progress': '/commenter/tasks',
  '/commenter/tasks/pending-review': '/commenter/tasks',
  '/commenter/tasks/completed': '/commenter/tasks',
  '/commenter/tasks/rejected': '/commenter/tasks'
};