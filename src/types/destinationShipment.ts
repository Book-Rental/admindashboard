export interface DestinationShipmentReceiver {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    location: {
        type: string;
        coordinates: number[];
    };
}

export interface DestinationShipmentHub {
    _id: string;
    hubCode: string;
    hubName: string;
}

export interface DestinationShipmentAgent {
    fullName: string;
    phoneNumber: string;
}

export interface DestinationShipment {
    shipmentId: string;
    awbNumber: string;
    orderId: string;
    orderItemId: string;
    shipmentType: string;
    journeyType: string;
    currentStatus: string;
    paymentMode: string;
    codAmount: number;
    receiver: DestinationShipmentReceiver;
    originHub: DestinationShipmentHub;
    destinationHub: DestinationShipmentHub;
    assignedAgent: DestinationShipmentAgent | null;
    expectedDeliveryDate: string;
    createdAt: string;
}

export interface DestinationShipmentMeta {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasMore: boolean;
}

export interface DestinationShipmentResponse {
    status: string;
    message: string;
    data: {
        shipments: DestinationShipment[];
        meta: DestinationShipmentMeta;
    };
}

