import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, HardDrive, Cpu, Wifi, AlertTriangle, CheckCircle } from "lucide-react";
import { performanceMonitor, optimizedMarketDataManager } from "@/services/OptimizedWebSocketService";
import { useMemoryMonitor } from "@/hooks/usePerformance";

interface RenderPerformanceData {
  avgRenderTime: string;
  maxRenderTime: string;
  sampleCount: number;
}

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  connectionStatus: string;
  renderPerformance: Record<string, RenderPerformanceData>;
  recommendations: string[];
}

interface WindowWithGC extends Window {
  gc?: () => void;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    connectionStatus: 'unknown',
    renderPerformance: {},
    recommendations: []
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useMemoryMonitor('PerformanceMonitor');

  useEffect(() => {
    if (!isMonitoring) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const updateMetrics = () => {
      const now = performance.now();
      frameCount++;

      // Calculate FPS every second
      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        frameCount = 0;
        lastTime = now;

        // Get performance report
        const report = performanceMonitor.getReport();
        const stats = optimizedMarketDataManager.getPerformanceStats();

        // Get memory usage
        let memoryUsage = 0;
        if (typeof window !== 'undefined' && 'performance' in window) {
          const performance = window.performance as Performance & { 
            memory?: { usedJSHeapSize: number } 
          };
          if (performance.memory) {
            memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
          }
        }

        setMetrics({
          fps,
          memoryUsage,
          connectionStatus: stats.activeConnections.size > 0 ? 'connected' : 'disconnected',
          renderPerformance: report.renderPerformance,
          recommendations: report.recommendations
        });
      }

      animationId = requestAnimationFrame(updateMetrics);
    };

    animationId = requestAnimationFrame(updateMetrics);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isMonitoring]);

  const getPerformanceColor = (value: number, thresholds: [number, number]) => {
    if (value >= thresholds[1]) return "text-red-500";
    if (value >= thresholds[0]) return "text-yellow-500";
    return "text-green-500";
  };

  const getConnectionStatusIcon = () => {
    switch (metrics.connectionStatus) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        <Activity className="h-4 w-4 mr-2" />
        Performance
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 max-h-96 overflow-auto">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance Monitor
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMonitoring(!isMonitoring)}
              className="h-6 px-2"
            >
              {isMonitoring ? 'Stop' : 'Start'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 px-2"
            >
              ×
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* FPS */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            <span className="text-sm">FPS</span>
          </div>
          <Badge variant={metrics.fps >= 50 ? "default" : metrics.fps >= 30 ? "secondary" : "destructive"}>
            {metrics.fps}
          </Badge>
        </div>

        {/* Memory Usage */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              <span className="text-sm">Memory</span>
            </div>
            <span className={`text-sm font-mono ${getPerformanceColor(metrics.memoryUsage, [50, 100])}`}>
              {metrics.memoryUsage.toFixed(1)} MB
            </span>
          </div>
          <Progress 
            value={Math.min(metrics.memoryUsage / 2, 100)} 
            className="h-2"
          />
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            <span className="text-sm">Connection</span>
          </div>
          <div className="flex items-center gap-1">
            {getConnectionStatusIcon()}
            <span className="text-sm capitalize">{metrics.connectionStatus}</span>
          </div>
        </div>

        {/* Render Performance */}
        {Object.keys(metrics.renderPerformance).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Render Performance</h4>
            {Object.entries(metrics.renderPerformance).slice(0, 3).map(([component, data]) => (
              <div key={component} className="flex items-center justify-between text-xs">
                <span className="truncate">{component}</span>
                <span className={getPerformanceColor(parseFloat(data.avgRenderTime), [16, 32])}>
                  {data.avgRenderTime}ms
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {metrics.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-yellow-500" />
              Recommendations
            </h4>
            {metrics.recommendations.slice(0, 2).map((rec, index) => (
              <p key={index} className="text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                {rec}
              </p>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Clear performance data
              performanceMonitor.getReport();
              setMetrics(prev => ({ ...prev, recommendations: [] }));
            }}
            className="flex-1 text-xs"
          >
            Clear Data
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Force garbage collection if available
              const windowWithGC = window as WindowWithGC;
              if (windowWithGC.gc) {
                windowWithGC.gc();
              }
            }}
            className="flex-1 text-xs"
          >
            Force GC
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}