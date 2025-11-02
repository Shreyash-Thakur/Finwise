import React, { Component } from 'react';
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error;
}
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div className="p-6 rounded-lg text-center" style={{
        backgroundColor: 'rgb(var(--card))',
        borderColor: 'rgb(var(--border))',
        border: '1px solid'
      }}>
            <p style={{
          color: 'rgb(var(--negative))'
        }} className="font-semibold mb-2">
              Something broke. Please refresh.
            </p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg mt-2" style={{
          backgroundColor: 'rgb(var(--accent))',
          color: 'white'
        }}>
              Refresh Page
            </button>
          </div>;
    }
    return this.props.children;
  }
}