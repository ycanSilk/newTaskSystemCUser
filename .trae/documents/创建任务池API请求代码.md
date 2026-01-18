# 创建任务池API请求代码

## 1. 任务概述
根据用户需求，我需要创建获取"任务池"的API请求代码，包括类型定义、API处理函数和中间件路由。

## 2. 实现计划

### 2.1 创建类型定义文件
**文件路径：** `src/api/types/task/taskPoolListTypes.ts`

根据响应示例，定义以下类型：
- `TaskPoolListItem`：任务池列表项类型
- `TaskPoolPagination`：任务池分页信息类型
- `TaskPoolListResponseData`：任务池响应数据类型
- `TaskPoolListResponse`：任务池响应类型

### 2.2 创建API处理函数
**文件路径：** `src/api/handlers/task/taskPoolListHandlers.ts`

实现以下功能：
- 导入必要的依赖（NextResponse、apiClient、TASK_POOL_LIST_ENDPOINT等）
- 定义`handleGetTaskPoolList`函数，使用apiClient发送GET请求
- 遵循统一的错误处理机制
- 返回标准化的响应格式

### 2.3 创建中间件路由
**文件路径：** `src/app/api/task/taskPoolList/route.ts`

实现以下功能：
- 导入handleGetTaskPoolList函数
- 实现GET方法，调用handleGetTaskPoolList函数
- 实现其他HTTP方法的处理，返回405错误

## 3. 技术规范

- 严格遵循`API_REQUEST_STANDARD.md`的规范
- 使用TypeScript进行类型定义
- 模块化、统一化标准
- 不做其余任何修改

## 4. 代码示例

### 4.1 类型定义示例
```typescript
// 任务池列表项类型
export interface TaskPoolListItem {
  id: number;
  title: string;
  is_combo: boolean;
  stage: number;
  stage_text: string;
  video_url: string;
  deadline: number;
  deadline_text: string;
  task_count: number;
  task_done: number;
  task_doing: number;
  task_reviewing: number;
  remain_count: number;
  unit_price: number;
  total_price: number;
  status: number;
  created_at: string;
}
```

### 4.2 API处理函数示例
```typescript
export async function handleGetTaskPoolList(req: NextRequest): Promise<NextResponse> {
  try {
    const response = await apiClient.get<TaskPoolListResponse>(TASK_POOL_LIST_ENDPOINT);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const apiError: ApiError = handleApiError(error);
    const errorResponse: ApiResponse = createErrorResponse(apiError);
    return NextResponse.json(errorResponse, { status: apiError.status });
  }
}
```

### 4.3 中间件路由示例
```typescript
export async function GET(): Promise<NextResponse> {
  return handleGetTaskPoolList();
}

export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      code: 405,
      message: '方法不允许，请使用GET请求',
      timestamp: Date.now(),
      data: null
    },
    { status: 405 }
  );
}
```