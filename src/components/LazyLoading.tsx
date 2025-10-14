import React, { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Default loading fallback for trading components
export function ComponentFallback({ 
  height = "h-96", 
  title = "Loading..." 
}: { 
  height?: string; 
  title?: string; 
}) {
  return (
    <div className={`${height} w-full p-6 space-y-4`}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <div className="flex justify-center items-center mt-8">
        <div className="animate-pulse text-muted-foreground text-sm">
          {title}
        </div>
      </div>
    </div>
  );
}

// Chart-specific loading fallback
export function ChartFallback() {
  return (
    <div className="h-96 w-full bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>
      <div className="relative h-80 bg-muted/20 rounded flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading chart...</p>
        </div>
      </div>
    </div>
  );
}

// Table-specific loading fallback
export function TableFallback({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/20 p-3 border-b border-border">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      {/* Rows */}
      <div className="space-y-0">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-3 border-b border-border/50 last:border-b-0">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}