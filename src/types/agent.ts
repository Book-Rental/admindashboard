export type VehicleType =
    | "Bike"
    | "Scooter"
    | "Car";

export type AgentStatus =
    | "Active"
    | "On Delivery"
    | "Inactive";

export interface CurrentLocation {
    type: "Point";
    coordinates: [number, number];
    updatedAt: string | null;
}

/* GET ALL AGENTS */
export interface Agent {
    agentId: string;
    hubId: string;
    name: string;
    email: string;
    phone: string;
    agentStatus: AgentStatus;
    vehicleType: VehicleType;
    currentLocation: CurrentLocation;
    joinedAt: string;
}

/* GET AGENT BY ID */
export interface AgentDetails {
    _id: string;

    hubId: {
        _id: string;
        hubCode: string;
    } | string;

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

/* FORM */
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