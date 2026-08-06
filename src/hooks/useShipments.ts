import { useQuery } from "@tanstack/react-query";
import { getShipments } from "../api/shipmentApi";

export const useShipments = (
    hubId: string,
    page: number,
    status:string,
     paymentMode: string,
  search: string
) => {

    return useQuery({
        queryKey: ["shipments", hubId, page,status,paymentMode,search,],
        queryFn: () => getShipments(hubId, page,status,paymentMode,search,),
        placeholderData: (previous) => previous,
        enabled: !!hubId,
    });

};