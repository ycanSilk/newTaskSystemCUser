'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOutlined, ReloadOutlined, HomeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * 全局错误边界组件
 * 用于捕获和处理React组件树中的错误
 * 提供友好的错误提示界面
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新状态，下次渲染时显示错误界面
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 记录错误信息
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error info:', errorInfo);

    // 可以在这里添加错误日志上报
    // 例如：logErrorToService(error, errorInfo);

    this.setState({
      errorInfo,
    });
  }

  handleReload = (): void => {
    // 重置错误状态，重新渲染子组件
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    // 导航到首页
    const router = useRouter();
    router.push('/');
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 自定义错误界面
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
                <AlertOutlined className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                页面出错了
              </h1>
              <p className="text-gray-600 mb-4">
                很抱歉，页面加载过程中出现了错误。
              </p>
              {this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 text-left">
                  <p className="text-sm text-red-800 font-medium mb-1">错误信息：</p>
                  <p className="text-xs text-red-600 font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-3">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <ReloadOutlined className="mr-2" />
                重试
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <HomeOutlined className="mr-2" />
                返回首页
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 如果没有错误，正常渲染子组件
    return this.props.children;
  }
}

/**
 * 函数式组件包装器，使用错误边界
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export default ErrorBoundary;
