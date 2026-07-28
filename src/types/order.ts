export interface OrderItem {
    bookId: string;
    bookName: string;
    author: string;
    coverImage: string;
    quantity: number;
    itemStatus: string;
    rentalDuration: number;
}


export interface Order {
    orderId: string;
    orderNumber: string;
    orderDate: string;
    orderStatus: string;
    paymentStatus: string;
    totalAmount: number;
    items: OrderItem[];
}


export interface OrderResponse {
    status: string;
    message: string;
    data: {
        orders: Order[];
        meta: {
            totalRecords: number;
            totalPages: number;
            currentPage: number;
            limit: number;
            hasMore: boolean;
        };
    };
}
export enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    RETURN_REQUESTED = "return_requested",
    RETURNED = "returned",
    CANCELLED = "cancelled",
}
