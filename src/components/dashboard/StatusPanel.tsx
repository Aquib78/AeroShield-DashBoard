import { Card } from '@/components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  Signal, 
  Clock, 
  MapPin, 
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Detection } from '../../types/detection';

interface StatusPanelProps {
  detections: Detection[];
  lastDetection: Detection | null;
  isOnline: boolean;
  droneActive?: boolean;
}

const StatusPanel = ({ detections, lastDetection, isOnline }: StatusPanelProps) => {
  const stats = {
    total: detections.length,
    today: detections.filter(d => {
      const today = new Date();
      const detectionDate = new Date(d.timestamp);
      return detectionDate.toDateString() === today.toDateString();
    }).length,
    lastHour: detections.filter(d => {
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return new Date(d.timestamp) > hourAgo;
    }).length
  };

  return (
    <div className="space-y-4">
      {/* System Status */}
      <Card className="glass-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4" />
            System Status
          </h3>
          <Badge 
            variant={isOnline ? "default" : "destructive"}
            className={isOnline ? "bg-success text-success-foreground pulse-accent" : ""}
          >
            {isOnline ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                ONLINE
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3 mr-1" />
                OFFLINE
              </>
            )}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">LoRa Module</span>
            <span className="flex items-center gap-1">
              <Signal className="h-3 w-3 text-success" />
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Map Service</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-success" />
              Active
            </span>
          </div>
        </div>
      </Card>

      {/* Latest Detection */}
      {lastDetection && (
        <Card className="glass-panel p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Latest Detection
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID</span>
              <Badge variant="secondary">#{lastDetection.id}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-mono">
                {lastDetection.localTime} {/* ✅ Use localTime */}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Date</span>
              <div className="font-mono">{lastDetection.localDate}</div> {/* ✅ Use localDate */}
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Coordinates</span>
              <div className="font-mono text-xs bg-secondary p-2 rounded">
                <div>Lat: {lastDetection.latitude.toFixed(6)}</div>
                <div>Lng: {lastDetection.longitude.toFixed(6)}</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Statistics */}
      <Card className="glass-panel p-4">
        <h3 className="text-sm font-semibold mb-3">Statistics</h3>
        
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-success">{stats.today}</div>
            <div className="text-xs text-muted-foreground">Today</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-warning">{stats.lastHour}</div>
            <div className="text-xs text-muted-foreground">Last Hour</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatusPanel;
