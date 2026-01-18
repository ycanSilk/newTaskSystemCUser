// Task模块 - 任务相关端点定义
// 这个文件定义了任务模块的所有API端点，用于前后端通信


//获取任务池的列表，包含所有待接取的任务
export const TASK_POOL_LIST_ENDPOINT = '/c/v1/tasks.php';


//接取任务池的任务，接取任务端点
export const GET_TASK_ACCEPT_ENDPOINT = '/c/v1/tasks/accept.php';


/*我接取的任务列表端点
post方法
 status = 1 进行中 2 = 待审核 3 = 已通过 4 = 已驳回
 */
export const MY_ACCEPTED_TASK_LIST_ENDPOINT = '/c/v1/tasks/my-tasks.php';

//提交任务的评论端点
export const POST_TASK_SUBMIT_COMMENT_ENDPOINT = '/c/v1/tasks/submit.php';
