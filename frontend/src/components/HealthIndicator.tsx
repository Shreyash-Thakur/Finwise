import { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface HealthStatus {
  backend: boolean;
  database: boolean;
  lastChecked: Date;
}

export function HealthIndicator() {
  const [health, setHealth] = useState<HealthStatus>({
    backend: false,
    database: false,
    lastChecked: new Date()
  });

  const checkHealth = async () => {
    try {
      const response = await fetch('http://localhost:5001/health');
      const data = await response.json();
      
      setHealth({
        backend: response.ok,
        database: data.status === 'ok', // Assuming backend returns this
        lastChecked: new Date()
      });
    } catch (error) {
      console.error('Health check failed:', error);
      setHealth(prev => ({
        ...prev,
        backend: false,
        database: false,
        lastChecked: new Date()
      }));
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="p-3 shadow-lg border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Badge variant={health.backend ? 'success' : 'danger'}>
              Backend: {health.backend ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <div className="text-xs text-slate-500">
            Last: {health.lastChecked.toLocaleTimeString()}
          </div>
        </div>
      </Card>
    </div>
  );
}