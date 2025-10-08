export type CameraStatus = "online" | "offline" | "degraded";

export interface Camera {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  status: CameraStatus;
  ptzCapable: boolean;
  sector: string; // always defined
}
