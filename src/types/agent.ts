export type VehicleType =
  | "Bike"
  | "Scooter"
  | "Car";

export type AgentStatus =
  | "Active"
  | "OnDelivery"
  | "Inactive"
  | "Off Duty";

export interface CurrentLocation {
  type: "Point";
  coordinates: [number, number];
  updatedAt: string | null;
};

/* ===========================
   GET AGENTS BY HUB
=========================== */

export interface Agent {
  agentId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: AgentStatus;
  isAvailable: boolean;

  vehicle: {
    type: VehicleType;
    number: string;
  };

  currentLocation: CurrentLocation;
  currentShipmentId: string | null;
  photo: string | null;
  joinedOn: string;
}

export interface AgentMeta {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasMore: boolean;
}

export interface AgentResponse {
  status: string;
  message: string;
  data: {
    agents: Agent[];
    analytics: AgentAnalytics;
    meta: AgentMeta;
  };
}

/* ===========================
   GET AGENT BY ID
=========================== */

export interface AgentDetails {
  _id: string;

  hubId:
  | {
    _id: string;
    hubCode: string;
  }
  | string;

  fullName: string;
  email: string;
  phoneNumber: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  address: string;
  emergencyContact: string;
  notes: string;
  photo: string | null;
  currentShipmentId: string | null;
  isAvailable: boolean;
  isActive: boolean;
  currentLocation: CurrentLocation;
  status: AgentStatus;
  createdBy: string;
  joinedOn: string;
  createdAt: string;
  updatedAt: string;
}

/* ===========================
   CREATE AGENT
=========================== */

export interface AgentFormData {
  hubId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  vehicleType: VehicleType | "";
  vehicleNumber: string;
  address: string;
  emergencyContact: string;
  notes: string;
  photo: File | string | null;
  isActive: boolean;
}

/* ===========================
   UPDATE AGENT
=========================== */

export interface UpdateAgentData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  vehicleType?: VehicleType | "";
  vehicleNumber?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;
  photo?: File | string | null;
  status?: AgentStatus;
  hubId?: string;
  isActive?: boolean;
  updatedBy?: string;
}
export interface AgentAnalytics {
  totalAgents: number;
  activeAgents: number;
  inactiveAgents: number;
  offDutyAgents: number;
}