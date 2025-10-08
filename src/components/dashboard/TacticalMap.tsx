import { MapContainer, TileLayer, Marker, Polyline, LayersControl, LayerGroup, useMap } from "react-leaflet";
import L, { Map as LeafletMap } from "leaflet";
import type { Camera } from "@/types/camera";
import type { WeatherData } from "@/hooks/useWeather";
import "leaflet/dist/leaflet.css";
import { useRef, useEffect } from "react";

interface TacticalMapProps {
  cameras: Camera[];
  selectedCamera?: Camera;
  onCameraSelect?: (camera: Camera) => void;
  weather?: WeatherData;
  showWaypoints?: boolean;
  showCameraControls?: boolean;
}

const TacticalMap = ({
  cameras,
  selectedCamera,
  onCameraSelect,
  showWaypoints = true,
  showCameraControls = true,
}: TacticalMapProps) => {
  const mapRef = useRef<LeafletMap | null>(null);

  const defaultCenter: L.LatLngTuple = cameras.length
    ? [cameras[0].location.lat, cameras[0].location.lng]
    : [13.0735, 77.5741];

  const arrowIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Jump to selected camera when it changes
  useEffect(() => {
    if (selectedCamera && mapRef.current) {
      mapRef.current.flyTo(
        [selectedCamera.location.lat, selectedCamera.location.lng],
        mapRef.current.getZoom(),
        { animate: true }
      );
    }
  }, [selectedCamera]);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      className="h-full w-full"
      ref={mapRef} // Use ref instead of whenCreated
      whenReady={() => { mapRef.current = mapRef.current; }} // just to satisfy the callback
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Street Map">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Terrain Map">
          <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" subdomains={['mt0','mt1','mt2','mt3']} />
        </LayersControl.BaseLayer>
      </LayersControl>

      <LayerGroup>
        {cameras.map((camera) => (
          <Marker
            key={camera.id}
            position={[camera.location.lat, camera.location.lng]}
            icon={arrowIcon}
            eventHandlers={{
              click: () => onCameraSelect?.(camera),
            }}
          />
        ))}

        {showWaypoints && cameras.length > 1 && (
          <Polyline
            positions={cameras.map(c => [c.location.lat, c.location.lng])}
            color="lime"
            weight={3}
            dashArray="5,5"
          />
        )}
      </LayerGroup>
    </MapContainer>
  );
};

export default TacticalMap;
