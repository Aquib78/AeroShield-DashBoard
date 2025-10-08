export type UserRole = 'operator' | 'commander' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  unit?: string;
  token?: string;
}


export interface ThreatAlert {
  id: string;
  timestamp: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  description: string;
  cameraId: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'acknowledged' | 'resolved';
  assignedTo?: string;
  metadata?: Record<string, any>;
}

export interface TrackedObject {
  id: string;
  type: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  path: Array<{
    lat: number;
    lng: number;
    timestamp: string;
  }>;
  cameraId: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  target?: string;
  details?: Record<string, any>;
}

export interface BackendConfig {
  apiBaseUrl: string;
  wsUrl: string;
  authToken?: string;
}
