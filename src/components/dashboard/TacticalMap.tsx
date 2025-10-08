import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Camera, CameraStatus } from "@/types/camera";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Marker Icon
const cameraIcon = new Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Map layers
const mapLayers = {
  Satellite: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  Terrain: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  Street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
};

const layerAttribution = {
  Satellite: "&copy; Carto &copy; OpenStreetMap contributors",
  Terrain: "&copy; OpenTopoMap &copy; OpenStreetMap contributors",
  Street: "&copy; OpenStreetMap contributors",
};

interface TacticalMapProps {
  cameras?: Camera[];
  selectedCamera?: Camera;
  onCameraSelect?: (camera: Camera) => void;
}

// Auto-center helper component
const MapAutoFocus = ({ selectedCamera }: { selectedCamera?: Camera }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedCamera) {
      map.flyTo([selectedCamera.location.lat, selectedCamera.location.lng], 15, { duration: 1.5 });
    }
  }, [selectedCamera, map]);
  return null;
};

const TacticalMap = ({ cameras = [], selectedCamera, onCameraSelect }: TacticalMapProps) => {
  const [mapType, setMapType] = useState<keyof typeof mapLayers>("Terrain");
  const center: [number, number] = [32.0, -110.0];

  const getStatusColor = (status: CameraStatus) => {
    switch (status) {
      case "online":
        return "hsl(160, 40%, 35%)";
      case "degraded":
        return "hsl(38, 92%, 50%)";
      case "offline":
        return "hsl(0, 72%, 51%)";
      default:
        return "hsl(210, 10%, 55%)";
    }
  };

  return (
    <div className="h-full w-full relative">
      {/* Map Type Switcher on right */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
        {Object.keys(mapLayers).map((type) => (
          <button
            key={type}
            onClick={() => setMapType(type as keyof typeof mapLayers)}
            className={`px-2 py-1 text-xs rounded ${
              mapType === type ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <MapContainer center={center} zoom={11} className="h-full w-full" zoomControl={true}>
        <TileLayer url={mapLayers[mapType]} attribution={layerAttribution[mapType]} />

        {/* Auto-focus on latest selection */}
        {selectedCamera && <MapAutoFocus selectedCamera={selectedCamera} />}

        {cameras.map((camera) => (
          <Marker
            key={camera.id}
            position={[camera.location.lat, camera.location.lng]}
            icon={cameraIcon}
            eventHandlers={{
              click: () => onCameraSelect?.(camera),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-mono font-bold text-sm">{camera.name}</h3>
                  <Badge
                    variant={camera.status === "online" ? "default" : "destructive"}
                    className="text-[10px] h-4"
                  >
                    {camera.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Sector: {camera.sector}</p>
                <p className="text-xs text-muted-foreground mb-3">
                  PTZ: {camera.ptzCapable ? "Yes" : "No"}
                </p>
                <Button
                  size="sm"
                  className="w-full text-xs h-7"
                  onClick={() => onCameraSelect?.(camera)}
                >
                  View Feed
                </Button>
              </div>
            </Popup>
            <Circle
              center={[camera.location.lat, camera.location.lng]}
              radius={500}
              pathOptions={{
                color: getStatusColor(camera.status),
                fillColor: getStatusColor(camera.status),
                fillOpacity: 0.1,
              }}
            />
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TacticalMap;
