import { Loader2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({ size = "md", className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <Loader2 
      className={cn(
        "animate-spin text-primary",
        sizeClasses[size],
        className
      )} 
    />
  );
};

interface LoadingStateProps {
  message?: string;
  description?: string;
  className?: string;
}

export const LoadingState = ({ 
  message = "Loading...", 
  description,
  className 
}: LoadingStateProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      className
    )}>
      <div className="flex items-center gap-3 mb-4">
        <LoadingSpinner size="lg" />
        <span className="text-lg font-medium">{message}</span>
      </div>
      
      {description && (
        <p className="text-muted-foreground text-sm max-w-md">
          {description}
        </p>
      )}
    </div>
  );
};

export const TradingLoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 p-8 text-center glass-panel">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <TrendingUp className="h-8 w-8 text-primary animate-pulse" />
          <div className="absolute inset-0 blur-md opacity-50 bg-primary rounded-full animate-ping" />
        </div>
        <span className="text-lg font-medium">Processing Trade...</span>
      </div>
      
      <p className="text-muted-foreground text-sm max-w-md">
        Please wait while we process your trading request. This may take a few moments.
      </p>
    </div>
  );
};

export const MarketDataLoadingState = () => {
  return (
    <div className="space-y-3 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-3">
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            <div className="h-3 w-12 bg-muted animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const PositionsLoadingState = () => {
  return (
    <div className="space-y-2 p-4">
      <div className="grid grid-cols-9 gap-4 py-2 text-xs text-muted-foreground">
        <span>Market</span>
        <span>Side</span>
        <span>Size</span>
        <span>Leverage</span>
        <span>Entry</span>
        <span>Current</span>
        <span>PnL</span>
        <span>Liq.</span>
        <span>Actions</span>
      </div>
      
      {[...Array(3)].map((_, i) => (
        <div key={i} className="grid grid-cols-9 gap-4 py-3 border-b border-border/50">
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
};

interface InlineLoadingProps {
  text?: string;
  size?: "sm" | "md";
}

export const InlineLoading = ({ text = "Loading", size = "sm" }: InlineLoadingProps) => {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size={size} />
      <span className={cn(
        "text-muted-foreground",
        size === "sm" ? "text-xs" : "text-sm"
      )}>
        {text}...
      </span>
    </div>
  );
};

// Higher-order component for adding loading states
interface WithLoadingProps {
  isLoading: boolean;
  loadingComponent?: React.ReactNode;
  children: React.ReactNode;
}

export const WithLoading = ({ 
  isLoading, 
  loadingComponent, 
  children 
}: WithLoadingProps) => {
  if (isLoading) {
    return loadingComponent || <LoadingState />;
  }
  
  return <>{children}</>;
};