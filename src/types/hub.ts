export interface HubResponse {
  success: boolean;
  data: Hub[];
}

export interface HubAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface HubLocation {
  type: string;
  coordinates: number[];
}

export interface Hub {
  _id: string;
  hubId: string;
  hubCode: string;
  hubName: string;
  managerName: string;
  email: string;
  phoneNumber: string;

  address: HubAddress;
  location: HubLocation;

  serviceablePincodes: string[];

  capacity: number;
  currentLoad: number;
  status: string;

  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetHubByIdResponse {
  status: string;
  message: string;
  data: Hub;
}


export type EmployeeRole =
  | "MANAGER"
  | "HUB_MANAGER"
  | "CASHIER"
  | "TEAM_LEAD"
  | "AGENT"
  | "cashier"
  | "agent"
  | string;

export type EmployeeStatus =
  | "Active"
  | "Inactive"
  | string;

export interface EmployeeHub {
  _id: string;
  hubCode: string;
}

export interface EmployeeVehicle {
  type: string | null;
  number: string;
}

export interface EmployeeLocation {
  type: string;
  coordinates: number[];
  updatedAt: string | null;
}

export interface HubEmployee {
  _id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  isAvailable: boolean;
  isActive: boolean;
  hub: EmployeeHub;
  vehicle: EmployeeVehicle;
  currentLocation: EmployeeLocation;
  currentShipmentId: string | null;
  photo: string | null;
  joinedOn: string;
  createdAt: string;
  updatedAt: string;
}

export interface HubEmployeesMeta {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasMore: boolean;
}

export interface HubEmployeesData {
  employees: HubEmployee[];
  meta: HubEmployeesMeta;
}

export interface HubEmployeesResponse {
  status: string;
  message: string;
  data: HubEmployeesData;
}