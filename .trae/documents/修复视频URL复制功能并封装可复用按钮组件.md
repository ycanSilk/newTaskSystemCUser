# 修复视频URL复制功能并封装可复用按钮组件

## 问题分析

1. **视频URL复制功能问题**：`handleOpenVideoModal` 函数可以正确跳转URL，但复制传入的URL地址失败
2. **代码重复**：两个复制功能（评论和视频URL）使用相似的逻辑，需要封装成可复用组件

## 解决方案

### 1. 修复视频URL复制功能

* 修改 `handleOpenVideoModal` 函数，确保使用与评论复制相同的跨环境兼容解决方案

* 确保正确处理传入的 videoUrl 参数

* 保持跳转功能不变

### 2. 封装可复用组件

#### 组件1：复制评论组件 (`CopyCommentButton`)

* **功能**：点击按钮复制指定的评论文本到剪贴板

* **兼容性**：支持PC和手机端，支持HTTP和HTTPS

* **参数**：

  * `comment`：要复制的评论文本

  * `className`：可选的CSS类名

* **实现**：使用与当前评论复制相同的跨环境兼容逻辑

#### 组件2：打开视频复制地址组件 (`OpenVideoButton`)

* **功能**：点击按钮跳转到指定URL并复制URL到剪贴板

* 注意：要先复制URL到剪贴板后，再执行跳转到指定URL的操作

* **兼容性**：支持PC和手机端，支持HTTP和HTTPS

* **参数**：

  * `videoUrl`：视频的URL地址

  * defaultUrl：默认跳转的指定URL地址

  * `className`：可选的CSS类名

* **实现**：结合跳转功能和跨环境兼容的复制逻辑

### 3. 组件目录结构

```
src/components/button/taskbutton/
├── CopyCommentButton.tsx       # 复制评论按钮组件
├── OpenVideoButton.tsx         # 打开视频复制地址按钮组件
└── index.ts                    # 导出组件
```

### 4. 代码修改步骤

1. 创建组件目录结构
2. 实现 `CopyCommentButton` 组件
3. 实现 `OpenVideoButton` 组件
4. 修改 `ACCEPTED.tsx` 文件，导入并使用新组件
5. 测试组件功能

### 5. 技术要点

* 使用相同的跨环境兼容复制逻辑

* 确保组件的可复用性和灵活性

* 保持与现有代码的兼容性

* 提供清晰的组件接口和文档

