import { useState } from "react";
import useDetections from "@/hooks/useDetections";
import DetectionHistory from "@/components/dashboard/DetectionHistory"; // your existing component
import { Detection } from "@/types/detection";

const DetectionsPage = () => {
  const { detections } = useDetections();
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

  return (
    <div className="p-4 h-full">
      <DetectionHistory
        detections={detections}
        selectedDetection={selectedDetection}
        onDetectionSelect={setSelectedDetection}
      />
    </div>
  );
};

export default DetectionsPage;
