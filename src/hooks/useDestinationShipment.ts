import { useQuery } from "@tanstack/react-query";

import type {
    DestinationShipmentResponse,
} from "../types/destinationShipment";

import {
    getHubShipmentsByPincode,
} from "../api/DestinationShipment";

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