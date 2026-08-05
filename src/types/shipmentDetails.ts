export interface HubAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface Hub {
  _id: string;
  hubCode: string;
  hubName: string;
  address: HubAddress;
}


export interface Infrastructure {
  originHub: Hub;
  destinationHub: Hub;
  currentHub: Hub;
}


export interface AssignedAgent {
  _id: string;
  fullName: string;
  phoneNumber: string;
  vehicleType: string;
  status: string;
}


export interface JourneyHistory {
  _id: string;
  event: string;
  status: string;
  hubId: string;
  tripId: string | null;
  agentId: string | null;
  remarks: string;
  updatedBy: string | null;
  eventAt: string;
}


export interface SenderReceiver {
  name: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}


export interface ShipmentDetailsData {
  shipmentId: string;
  awbNumber: string;
  orderId: string;
  shipmentType: string;
  currentStatus: string;
  paymentMode: string;
  codAmount: number;
  expectedDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
  sender: SenderReceiver;
  receiver: SenderReceiver;
  infrastructure: Infrastructure;
  assignedAgent: AssignedAgent | null;
  journeyHistory: JourneyHistory[];

  orderDetails: null | {
    orderId: string;
    orderItem: OrderItem;
  };
}
export interface OrderItem {
  orderItemId: string;
  bookId: string;
  bookName: string;
  author: string;
  coverImage: string;
  quantity: number;
  itemStatus: string;
}