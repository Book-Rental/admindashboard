import axios from "axios";
import { OrderResponse } from "../types/order";

const API_URL = "https://be-book-rental.onrender.com/api/order";

export interface OrderFilters {
    search?: string;
    orderStatus?: string;
    paymentStatus?: string;
}

export const getOrders = async (
    page: number = 1,
    filters: OrderFilters = {}
): Promise<OrderResponse> => {
    const params = new URLSearchParams({ page: String(page) });

    if (filters.search) params.set("search", filters.search);
    if (filters.orderStatus) params.set("orderStatus", filters.orderStatus);
    if (filters.paymentStatus) params.set("paymentStatus", filters.paymentStatus);

    const response = await axios.get(`${API_URL}?${params.toString()}`, {
        withCredentials: true,
    });

    return response.data;
};