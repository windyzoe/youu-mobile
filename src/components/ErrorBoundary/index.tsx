import React from 'react';
import errorImg from '@/assets/statusImg/渲染失败.svg';

export default class ErrorBoundary extends React.Component<{}, { hasError: boolean; errorInfo: string }> {
  state = { hasError: false, errorInfo: '' };

  // 更新 state 使下一次渲染能够显示降级后的 UI
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // 将错误日志上报给服务器
  componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    const { hasError, errorInfo } = this.state;
    const { children } = this.props;
    if (hasError) {
      // 自定义降级后的 UI 并渲染
      return <img src={errorImg} style={{ width: '50%', maxWidth: 460 }} alt="渲染失败" title={errorInfo} />;
    }
    return children;
  }
}

/**
 * 装饰器写法
 * @param Component 业务组件
 */
export function withErrorBoundary(Component: React.ComponentClass) {
  const Wrapped = (props: any) => {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  // DevTools 显示的组件名
  const name = Component.displayName || Component.name || 'Unknown';
  Wrapped.displayName = `withErrorBoundary(${name})`;

  return Wrapped;
}
