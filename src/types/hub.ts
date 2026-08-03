export interface HubResponse {
  success: boolean;
  data: Hub[];
}

export interface Hub {
  _id: string;
  hubId: string;
  hubCode: string;
  hubName: string;
  managerName: string;
  email: string;
  phoneNumber: string;
  capacity: number;
  currentLoad: number;
  status: string;

  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
}