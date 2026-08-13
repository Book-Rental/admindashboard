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
  | "CASHIER"
  | "TEAM_LEAD"
  | "AGENT";

export interface HubEmployeeDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: EmployeeRole;
}

export interface HubEmployeesData {
  hub: Hub;
  employees: HubEmployeeDetails[];
  summary: {
    totalEmployees: number;
  };
}

export interface HubEmployeesResponse {
  status: string;
  message: string;
  data: HubEmployeesData;
}