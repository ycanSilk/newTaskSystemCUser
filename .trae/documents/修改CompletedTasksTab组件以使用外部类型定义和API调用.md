# 修改CompletedTasksTab组件计划

## 目标
修改`src/app/commenter/tasks/components/CompletedTasksTab.tsx`组件，使其：
1. 保留UI布局和样式
2. 删除内部任务类型定义
3. 使用外部类型定义
4. 在页面加载时调用API获取数据

## 修改步骤

### 1. 删除内部任务类型定义
- 删除组件内定义的`Task`接口
- 删除组件内定义的`CompletedTasksTabProps`接口

### 2. 导入外部类型定义
- 从`src/app/types/task/getMyAccepedTaskListTypes.ts`导入`Task`类型
- 定义新的`CompletedTasksTabProps`接口，使用导入的`Task`类型

### 3. 添加API调用逻辑
- 添加状态管理：
  - `tasks`：存储API返回的任务列表
  - `isLoading`：表示API请求状态
- 添加`useEffect`钩子，在组件加载时调用API
- API调用细节：
  - 调用`/api/task/getMyAccepedTaskList`端点
  - 使用`fetch`方法
  - 传入`status=1`参数
  - 处理响应数据
  - 处理错误情况

### 4. 数据渲染
- 使用API返回的`tasks`数据渲染UI
- 确保保持原有UI布局和样式不变

## 代码示例

```typescript
// 导入外部类型定义
import type { Task } from '@/app/types/task/getMyAccepedTaskListTypes';

// 定义组件属性接口
interface CompletedTasksTabProps {
  // 组件属性
}

const CompletedTasksTab: React.FC<CompletedTasksTabProps> = () => {
  // 状态管理
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // API调用
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/task/getMyAccepedTaskList?status=1`);
        const data = await response.json();
        setTasks(data.data.list);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // UI渲染保持不变
  return (
    // 原有UI代码
  );
};

export default CompletedTasksTab;
```

## 注意事项
- 严格遵循API_REQUEST_STANDARD.md规范
- 保留原有UI布局和样式
- 只修改必要的代码
- 确保类型定义正确