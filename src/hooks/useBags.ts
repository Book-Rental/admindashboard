import { useQueries, useQuery } from "@tanstack/react-query";
import { getBagById, getBags } from "../api/bagApi";
import { getShipmentById } from "../api/shipmentApi";

export const BAGS_QUERY_KEY = ["bags"];

export const useBags = () => {
  return useQuery({
    queryKey: BAGS_QUERY_KEY,
    queryFn: getBags,
  });
};

export const useBag = (bagId: string) => {
  return useQuery({
    queryKey: ["bag", bagId],
    queryFn: () => getBagById(bagId),
    enabled: Boolean(bagId),
  });
};

// The bag API returns shipment ids only, so load each parcel
// to show its AWB, receiver and status.
export const useBagParcels = (shipmentIds: string[]) => {
  return useQueries({
    queries: shipmentIds.map((id) => ({
      queryKey: ["shipment", id],
      queryFn: () => getShipmentById(id),
    })),
  });
};
