export type BagStatus =
  | "CREATED"
  | "SEALED"
  | "ASSIGNED"
  | "IN_TRANSIT"
  | "ARRIVED"
  | "RECEIVED"
  | "OPENED"
  | "VERIFIED"
  | "RELEASED";

export interface Bag {
  _id: string;
  bagId: string;
  fromHubId: string;
  toHubId: string;
  shipmentIds: string[];
  verifiedShipmentIds: string[];
  status: BagStatus;
  assignedAgentId?: string;
  sealedAt?: string;
  dispatchedAt?: string;
  arrivedAt?: string;
  receivedAt?: string;
  releasedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BagListResponse {
  status: string;
  message: string;
  data: Bag[];
}

export interface CreateBagResponse {
  message: string;
  bag: Bag;
}

export interface BagResponse {
  status?: string;
  message: string;
  data: Bag;
}
