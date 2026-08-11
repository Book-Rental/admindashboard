import { useQuery } from "@tanstack/react-query";

import type {
    DestinationShipmentResponse,
    GetHubByIdResponse,
} from "../types/destinationShipment";

import {
    getHubById,
    getHubShipmentsByPincode,
} from "../api/destinationShipmentApi";

import type {
    DestinationShipmentFilters,
} from "../api/destinationShipmentApi";

export const useHubById = (
    hubId: string
) => {
    return useQuery<GetHubByIdResponse>({
        queryKey: [
            "hub",
            hubId,
        ],

        queryFn: () => {
            return getHubById(hubId);
        },

        enabled: Boolean(hubId),
    });
};

export const useDestinationShipments = (
    hubId: string,
    filters?: DestinationShipmentFilters
) => {
    return useQuery<DestinationShipmentResponse>({
        queryKey: [
            "hubShipments",
            hubId,
            filters?.pincode ?? "all",
            filters?.status ?? "all",
            filters?.agentId ?? "all",
            filters?.page ?? 1,
            filters?.limit ?? 10,
        ],

        queryFn: () => {
            return getHubShipmentsByPincode(
                hubId,
                filters
            );
        },

        enabled: Boolean(hubId),
    });
};