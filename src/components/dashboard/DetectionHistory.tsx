import { Detection } from "@/types/detection";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Target } from "lucide-react";

interface DetectionHistoryProps {
  detections: Detection[];
  selectedDetection: Detection | null;
  onDetectionSelect: (detection: Detection) => void;
}

const DetectionHistory = ({
  detections,
  selectedDetection,
  onDetectionSelect,
}: DetectionHistoryProps) => {
  return (
    <Card className="glass-panel h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Detection History</h2>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {detections.length} Total
        </Badge>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-2">
        {detections.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No detections yet</p>
            <p className="text-sm">Waiting for drone data...</p>
          </div>
        ) : (
          detections.map((detection, index) => {
            const isSelected = selectedDetection?.id === detection.id;
            const isLatest = index === 0;

            return (
              <div
                key={detection.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-secondary/50 ${
                  isSelected
                    ? "border-warning bg-warning/10"
                    : isLatest
                    ? "border-success bg-success/10"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => onDetectionSelect(detection)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isLatest ? "default" : "secondary"}
                      className={isLatest ? "bg-success text-success-foreground pulse-accent" : ""}
                    >
                      #{detection.id}
                    </Badge>
                    {isLatest && (
                      <Badge variant="outline" className="text-xs border-success text-success">
                        LATEST
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {detection.localTime}
                    </div>
                    <div>{detection.localDate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-mono">
                    {detection.latitude.toFixed(6)}, {detection.longitude.toFixed(6)}
                  </span>
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                  <span>Detected by Drone Unit</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default DetectionHistory;
