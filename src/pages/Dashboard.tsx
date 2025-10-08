import { useState, useEffect } from "react";
import type { Detection } from "@/types/detection";
import type { Camera, CameraStatus } from "@/types/camera";
import useDetections from "@/hooks/useDetections";
import useSystemStatus from "@/hooks/useSystemStatus";
import usePersonDetections, { PersonDetection } from "@/hooks/usePersonDetections";

import TacticalMap from "@/components/dashboard/TacticalMap";
import DetectionHistory from "@/components/dashboard/DetectionHistory";
import StatusPanel from "@/components/dashboard/StatusPanel";
import PersonDetectionHistory from "@/components/dashboard/PersonDetectionHistory";

import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Target, Satellite, Activity, Plane } from "lucide-react";

const Dashboard = () => {
  const { detections, lastDetection } = useDetections();
  const personDetections: PersonDetection[] = usePersonDetections();
  const status = useSystemStatus();
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

  const handleDetectionSelect = (detection: Detection) => setSelectedDetection(detection);

  const handleMapDetectionClick = (camera: Camera) => {
    // Map back to original Detection by id
    const selected = detections.find((d) => d.id.toString() === camera.id);
    if (selected) setSelectedDetection(selected);
  };

  // Map Detection[] → Camera[] for TacticalMap
  const detectionCameras: Camera[] = detections.map((d) => ({
    id: d.id.toString(),
    name: `Detection-${d.id}`,
    location: {
      lat: (d as any).latitude ?? 0,
      lng: (d as any).longitude ?? 0,
    },
    status: "online" as CameraStatus,
    ptzCapable: false,
    sector: "Sector-1",
  }));

  // Map selected Detection → Camera
  const selectedCamera: Camera | undefined = selectedDetection
    ? {
        id: selectedDetection.id.toString(),
        name: `Detection-${selectedDetection.id}`,
        location: {
          lat: (selectedDetection as any).latitude ?? 0,
          lng: (selectedDetection as any).longitude ?? 0,
        },
        status: "online" as CameraStatus,
        ptzCapable: false,
        sector: "Sector-1",
      }
    : undefined;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f1115] text-[#e0e0e0] overflow-hidden">

      {/* AeroShield Header */}
      <div className="px-6 py-3 border-b border-[#2a2d36] bg-[#1a1c22] flex items-center justify-between">
        <h1 className="text-2xl font-bold font-mono bg-gradient-to-r from-green-400 via-lime-400 to-green-600 bg-clip-text text-transparent">
          AeroShield
        </h1>
        <Badge variant="secondary" className="text-xs">
          Border Surveillance Dashboard
        </Badge>
      </div>

      {/* Top Tactical Status Bar */}
      <div className="h-10 px-4 flex items-center justify-between bg-[#1a1c22] border-b border-[#2a2d36]">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-[10px] h-6">
            {new Date().toLocaleTimeString()}
          </Badge>
          <Badge variant="outline" className="text-[10px] h-6 hidden sm:flex">
            UTC {new Date().toISOString().split("T")[0]}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {status.monitoring ? (
            <div className="flex items-center gap-1.5 text-xs text-success">
              <Wifi className="h-4 w-4" />
              <span className="hidden sm:inline">Live Monitoring</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-destructive">
              <WifiOff className="h-4 w-4" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Rail */}
        <div className="w-16 bg-[#16181f] flex flex-col items-center py-4 border-r border-[#2a2d36] space-y-4">
          <Target className="h-6 w-6 text-emerald-400 cursor-pointer" />
          <Satellite className="h-6 w-6 text-cyan-400 cursor-pointer" />
        </div>

        {/* Center Map */}
        <div className="flex-1 relative overflow-hidden">
          <TacticalMap
            cameras={detectionCameras}
            selectedCamera={selectedCamera}
            onCameraSelect={handleMapDetectionClick}
          />
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-[#16181f] border-l border-[#2a2d36] p-3 flex flex-col gap-4 overflow-y-auto">
          <StatusPanel
            detections={detections}
            lastDetection={lastDetection}
            isOnline={status.monitoring}
            droneActive={status.drone_active}
          />
          <DetectionHistory
            detections={detections}
            selectedDetection={selectedDetection}
            onDetectionSelect={handleDetectionSelect}
          />
          <PersonDetectionHistory detections={personDetections} />
        </div>
      </div>

      {/* Bottom Tactical Bar */}
      <div className="h-10 bg-[#1a1c22] border-t border-[#2a2d36] flex items-center px-4 justify-between">
        <span className="text-xs text-[#a0a0a0]">Mission Control Panel</span>
        <span className="text-xs text-[#a0a0a0]">All systems nominal</span>
      </div>
    </div>
  );
};

export default Dashboard;
