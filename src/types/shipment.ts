export interface Shipment {
    shipmentId: string;
    awbNumber: string;
    orderId: string;
    orderItemId: string;
    shipmentType: string;
    currentStatus: string;
    paymentMode: string;
    codAmount: number;
    expectedDeliveryDate: string;
    createdAt: string;
    receiverName: string;
    receiverCity: string;

    originHub: {
        _id: string;
        hubCode: string;
    };

    destinationHub: {
        _id: string;
        hubCode: string;
    };

    assignedAgent: {
        _id: string;
        fullName: string;
        phoneNumber: string;
        status: string;
    } | null;
}

export interface ShipmentResponse {
    status: string;
    message: string;

    data: {
        shipments: Shipment[];

        meta: {
            totalRecords: number;
            totalPages: number;
            currentPage: number;
            limit: number;
            hasMore: boolean;
        };
    };
}