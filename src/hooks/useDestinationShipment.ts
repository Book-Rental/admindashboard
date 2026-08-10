import { useQuery } from "@tanstack/react-query";

import type {
    DestinationShipmentResponse,
} from "../types/destinationShipment";

import {
    getHubById,
    getHubShipmentsByPincode,
} from "../api/destinationShipmentApi";

export const useHubById = (
    hubId: string
) => {
    return useQuery({
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
    pincode?: string
) => {
    return useQuery<DestinationShipmentResponse>({
        queryKey: [
            "hubShipments",
            hubId,
            pincode ?? "all",
        ],

        queryFn: () => {
            return getHubShipmentsByPincode(
                hubId,
                pincode
            );
        },

        enabled: Boolean(hubId),
    });
};