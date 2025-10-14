import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Trading Error Boundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center h-64 p-8 text-center glass-panel">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h2 className="text-xl font-semibold">Something went wrong</h2>
          </div>
          
          <p className="text-muted-foreground mb-6 max-w-md">
            {this.state.error?.message || "An unexpected error occurred in the trading interface"}
          </p>
          
          <div className="flex gap-3">
            <Button 
              onClick={this.handleRetry}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 p-4 bg-muted rounded-lg text-left max-w-full overflow-auto">
              <summary className="cursor-pointer text-sm font-medium">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Trading-specific error boundary
export const TradingErrorBoundary = ({ children }: { children: ReactNode }) => {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Log trading-specific errors
    console.error('Trading Error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
    
    // In production, you might want to send this to an error tracking service
    // trackError('trading_interface_error', error, errorInfo);
  };

  return (
    <ErrorBoundary 
      onError={handleError}
      fallback={
        <div className="flex flex-col items-center justify-center h-64 p-8 text-center glass-panel border-destructive/20">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h2 className="text-xl font-semibold">Trading Interface Error</h2>
          </div>
          
          <p className="text-muted-foreground mb-6 max-w-md">
            There was an error with the trading interface. Your account and positions are safe.
          </p>
          
          <div className="flex gap-3">
            <Button onClick={() => window.location.reload()}>
              Refresh Trading Interface
            </Button>
            
            <Button variant="outline" asChild>
              <a href="/portfolio">View Portfolio</a>
            </Button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};