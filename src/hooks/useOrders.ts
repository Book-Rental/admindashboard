import { useQuery } from "@tanstack/react-query";
import { getOrders, OrderFilters } from "../api/orderApi";

export const useOrders = (page: number = 1, filters: OrderFilters = {}) => {
    return useQuery({
        queryKey: ["orders", page, filters],
        queryFn: () => getOrders(page, filters),
        placeholderData: (previousData) => previousData,
    });
};