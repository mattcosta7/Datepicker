import * as React from 'react';

export class ErrorBoundary extends React.Component<any, any> {
  state = {
    error: undefined,
  };
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }
  componentDidCatch(error: any, info: any) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }
  render() {
    const { children } = this.props;
    const { error } = this.state;
    if (error) {
      return <div>{(error as Error).message}</div>;
    }
    return children;
  }
}
