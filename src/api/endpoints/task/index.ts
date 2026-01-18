// Task模块 - 任务相关端点定义
// 这个文件定义了任务模块的所有API端点，用于前后端通信


//获取任务池的列表，包含所有待接取的任务
export const TASK_POOL_LIST_ENDPOINT = '/c/v1/tasks.php';


//接取任务池的任务，接取任务端点
export const GET_TASK_ACCEPT_ENDPOINT = '/c/v1/tasks/accept.php';
