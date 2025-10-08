import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target } from "lucide-react";
import { PersonDetection } from "@/hooks/usePersonDetections";

interface PersonDetectionHistoryProps {
  detections: PersonDetection[];
}

const PersonDetectionHistory = ({ detections }: PersonDetectionHistoryProps) => {
  return (
    <Card className="glass-panel h-full">
      {/* Header with Total and Persons Detected */}
      <div className="flex justify-between items-center p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Person Count History</h2>
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-lg font-bold">{detections.length}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Persons Detected</span>
            <span className="text-lg font-bold">
              {detections.reduce((acc, d) => acc + d.person_count, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Detection List */}
      <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
        {detections.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No data yet</p>
          </div>
        ) : (
          detections.map(d => (
            <div
              key={d.id}
              className="flex justify-between items-center p-2 border rounded hover:bg-secondary/20 transition text-sm"
            >
              <div>#{d.id}</div>
              <div>{d.person_count} person(s)</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{d.localTime} | {d.localDate}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default PersonDetectionHistory;
