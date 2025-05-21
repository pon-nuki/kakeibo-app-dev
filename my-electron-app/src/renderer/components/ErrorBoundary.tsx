import React, { Component, ReactNode } from 'react';

// ErrorBoundary コンポーネント
interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  // エラーが発生した場合に呼ばれる
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  // 詳細なエラー情報を log 出力するために使用（オプション）
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught in ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // エラーが発生した場合に表示する UI
      return <h1>Something went wrong.</h1>;
    }

    // 通常の子コンポーネントを表示
    return this.props.children;
  }
}

export default ErrorBoundary;
