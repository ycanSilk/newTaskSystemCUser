## 修改任务页面实现选项卡切换时调用API

### 1. 任务分析

- **当前实现**：页面加载时调用一次API获取所有任务，通过前端过滤显示不同状态的任务
- **目标实现**：点击选项卡时调用API，只获取对应状态的任务
- **API端点**：`src/app/api/task/getMyAccepedTaskList/route.ts`
- **状态映射**：
  - ACCEPTED → status=1（进行中）
  - SUBMITTED → status=2（待审核）
  - COMPLETED → status=3（已完成）
  - sub_rejected → status=4（驳回订单）

### 2. 具体修改步骤

#### 步骤1：创建类型定义文件
- **文件路径**：`src/app/types/task/getMyAccepedTaskListTypes.ts`
- **内容**：
  - 定义任务接口，与API响应格式匹配
  - 定义API响应接口
  - 定义推荐标记接口
  - 定义任务进度接口

#### 步骤2：修改主页面代码
- **文件路径**：`src/app/commenter/tasks/page.tsx`
- **修改内容**：
  1. 删除页面内部的任务类型定义
  2. 导入新创建的类型定义
  3. 修改API调用逻辑，实现点击选项卡时调用API
  4. 修改状态管理，只存储当前选项卡的任务
  5. 保留UI布局和样式

#### 步骤3：修改组件调用方式
- 保持子组件不变
- 传递完整任务列表给子组件，不再在主页面过滤

### 3. 类型定义设计

```typescript
// src/app/types/task/getMyAccepedTaskListTypes.ts

// 推荐标记接口
interface RecommendMark {
  comment: string;
  image_url: string;
}

// 任务进度接口
interface TaskProgress {
  task_count: number;
  task_done: number;
  task_doing: number;
  task_reviewing: number;
  task_available: number;
  progress_percent: number;
}

// 分页信息接口
interface Pagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

// 任务接口
interface Task {
  record_id: number;
  b_task_id: number;
  template_title: string;
  video_url: string;
  recommend_mark: RecommendMark;
  comment_url: string | null;
  screenshots: any | null;
  reward_amount: string;
  status: number;
  status_text: string;
  reject_reason: string | null;
  created_at: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  deadline: number;
  deadline_text: string;
  time_remaining: number;
  is_timeout: boolean;
  task_progress: TaskProgress;
  // 前端需要的字段
  screenshotUrl?: string;
}

// 响应数据接口
interface GetMyAcceptedTaskListResponseData {
  list: Task[];
  pagination: Pagination;
}

// API响应接口
export interface GetMyAcceptedTaskListResponse {
  code: number;
  message: string;
  data: GetMyAcceptedTaskListResponseData;
  timestamp: number;
}

// 任务状态类型
export type TaskStatus = 'ACCEPTED' | 'COMPLETED' | 'SUBMITTED' | 'sub_rejected';

// 标签页到状态码的映射
export const TAB_TO_STATUS_MAP = {
  ACCEPTED: 1,
  SUBMITTED: 2,
  COMPLETED: 3,
  'sub_rejected': 4
};
```

### 4. 主页面修改设计

```typescript
// src/app/commenter/tasks/page.tsx

// 导入新创建的类型定义
import { GetMyAcceptedTaskListResponse, TaskStatus, TAB_TO_STATUS_MAP } from '@/app/types/task/getMyAccepedTaskListTypes';

// 修改状态管理
const [tasks, setTasks] = useState<Task[]>([]);
const [isLoading, setIsLoading] = useState(false);

// 修改API调用逻辑
const fetchTasksByStatus = async (status: number) => {
  setIsLoading(true);
  try {
    // 调用API获取对应状态的任务
    const response = await fetch(`/api/task/getMyAccepedTaskList?status=${status}`, {
      method: 'GET',
      credentials: 'include'
    });
    const data: GetMyAcceptedTaskListResponse = await response.json();
    if (data.code === 0) {
      setTasks(data.data.list);
    } else {
      setErrorMessage(data.message || '获取任务失败');
    }
  } catch (error) {
    setErrorMessage('网络异常，请稍后重试');
  } finally {
    setIsLoading(false);
  }
};

// 修改标签切换逻辑
const handleTabChange = async (tab: TaskStatus) => {
  setActiveTab(tab);
  // 更新URL参数
  router.replace(`/commenter/tasks?tab=${tab}`);
  // 获取对应状态码
  const statusCode = TAB_TO_STATUS_MAP[tab];
  // 调用API获取任务
  await fetchTasksByStatus(statusCode);
};

// 修改初始化逻辑
useEffect(() => {
  // 获取当前标签页对应的状态码
  const statusCode = TAB_TO_STATUS_MAP[activeTab];
  // 调用API获取任务
  fetchTasksByStatus(statusCode);
}, [])
```

### 5. 组件调用修改

```typescript
// 根据当前选中的标签渲染对应的组件
<div className="mx-4 mt-6">
  {activeTab === 'ACCEPTED' && (
    <ProgressTasksTab 
      tasks={tasks} // 不再过滤，直接传递所有任务
      // ... 其他props
    />
  )}
  
  {activeTab === 'SUBMITTED' && (
    <PendingReviewTasksTab
      tasks={tasks} // 不再过滤，直接传递所有任务
      // ... 其他props
    />
  )}
  
  {activeTab === 'COMPLETED' && (
    <CompletedTasksTab
      tasks={tasks} // 不再过滤，直接传递所有任务
      // ... 其他props
    />
  )}
  
  {activeTab === 'sub_rejected' && (
    <RejectedTasksTab
      tasks={tasks} // 不再过滤，直接传递所有任务
      // ... 其他props
    />
  )}
</div>
```

### 6. 预期效果

- 页面加载时默认激活 `tasks?tab=ACCEPTED`，调用API获取status=1的任务
- 点击选项卡时，调用API获取对应状态的任务
- 保留原有UI布局和样式
- 类型定义与API响应格式匹配
- 严格按照API_REQUEST_STANDARD.md规范执行

### 7. 注意事项

- 保留原有UI布局和样式，不做多余修改
- 删除页面内部的现有任务类型字段定义
- 确保API调用时传递正确的status参数
- 处理加载状态和错误状态
- 确保类型定义与API响应格式完全匹配

### 8. 测试要点

- 页面初始加载时是否调用API获取status=1的任务
- 点击不同选项卡时是否调用API获取对应状态的任务
- 加载状态是否正确显示
- 错误状态是否正确处理
- 任务列表是否正确渲染
- URL参数是否正确更新

### 9. 风险评估

- **风险**：选项卡切换时的加载延迟
- **缓解措施**：添加加载指示器，提供视觉反馈

- **风险**：API调用失败
- **缓解措施**：添加错误处理，显示错误提示

- **风险**：类型定义与API响应格式不匹配
- **缓解措施**：严格按照API响应格式定义类型

### 10. 代码规范遵循

- 严格按照API_REQUEST_STANDARD.md规范执行
- 使用TypeScript类型定义确保类型安全
- 遵循React最佳实践
- 代码结构清晰，易于维护
- 注释完整，便于理解