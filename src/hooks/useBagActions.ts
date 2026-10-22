import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addShipmentsToBag,
  completeBagVerification,
  createBag,
  updateBagStatus,
  verifyScannedShipment,
  verifyShipmentInBag,
} from "../api/bagApi";
import { BagStatus } from "../types/bag";

const useRefreshBags = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["bags"] });
    queryClient.invalidateQueries({ queryKey: ["bag"] });
    queryClient.invalidateQueries({ queryKey: ["shipments"] });
  };
};

export const useCreateBag = () => {
  const refresh = useRefreshBags();
  return useMutation({
    mutationFn: createBag,
    onSuccess: refresh,
  });
};

export const useAddShipmentsToBag = () => {
  const refresh = useRefreshBags();
  return useMutation({
    mutationFn: (p: { bagId: string; shipmentIds: string[] }) =>
      addShipmentsToBag(p.bagId, p.shipmentIds),
    onSuccess: refresh,
  });
};

export const useUpdateBagStatus = () => {
  const refresh = useRefreshBags();
  return useMutation({
    mutationFn: (p: {
      bagId: string;
      status: BagStatus;
      assignedAgentId?: string;
    }) =>
      updateBagStatus(p.bagId, {
        status: p.status,
        assignedAgentId: p.assignedAgentId,
      }),
    onSuccess: refresh,
  });
};

export const useVerifyScannedShipment = () => {
  const refresh = useRefreshBags();
  return useMutation({
    mutationFn: (p: { bagId: string; awbNumber: string }) =>
      verifyScannedShipment(p.bagId, p.awbNumber),
    onSuccess: refresh,
  });
};

export const useVerifyShipmentInBag = () => {
  const refresh = useRefreshBags();
  return useMutation({
    mutationFn: (p: { bagId: string; shipmentId: string }) =>
      verifyShipmentInBag(p.bagId, p.shipmentId),
    onSuccess: refresh,
  });
};

export const useCompleteBagVerification = () => {
  const refresh = useRefreshBags();
  return useMutation({
    mutationFn: completeBagVerification,
    onSuccess: refresh,
  });
};
