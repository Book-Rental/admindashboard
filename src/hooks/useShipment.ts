import { useQuery } from "@tanstack/react-query";
import { getShipmentById } from "../api/shipmentApi";

export const useShipment = (shipmentId: string) => {
  return useQuery({
    queryKey: ["shipment", shipmentId],
    queryFn: () => getShipmentById(shipmentId),
    enabled: !!shipmentId,
  });
};