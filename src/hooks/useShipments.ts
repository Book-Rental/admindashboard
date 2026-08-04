import { useQuery } from "@tanstack/react-query";
import { getShipments } from "../api/shipmentApi";

export const useShipments = (
    hubId: string,
    page: number
) => {

    return useQuery({
        queryKey: ["shipments", hubId, page],
        queryFn: () => getShipments(hubId, page),
        placeholderData: (previous) => previous,
        enabled: !!hubId,
    });

};