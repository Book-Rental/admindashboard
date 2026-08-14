import { useQuery } from "@tanstack/react-query";

import type {
    DestinationShipmentResponse,
} from "../types/destinationShipment";

import {
    getHubShipmentsByPincode,
} from "../api/destinationShipmentApi";
import { getHubById } from "../api/hubService";

import type {
    DestinationShipmentFilters,
} from "../api/destinationShipmentApi";
import { GetHubByIdResponse } from "../types/hub";

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