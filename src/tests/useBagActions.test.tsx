
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import {
  useCreateBag,
  useAddShipmentsToBag,
  useUpdateBagStatus,
  useVerifyScannedShipment,
  useVerifyShipmentInBag,
  useCompleteBagVerification,
} from "../hooks/useBagActions";

import {
  createBag,
  addShipmentsToBag,
  updateBagStatus,
  verifyScannedShipment,
  verifyShipmentInBag,
  completeBagVerification,
} from "../api/bagApi";

vi.mock("../api/bagApi", () => ({
  createBag: vi.fn(),
  addShipmentsToBag: vi.fn(),
  updateBagStatus: vi.fn(),
  verifyScannedShipment: vi.fn(),
  verifyShipmentInBag: vi.fn(),
  completeBagVerification: vi.fn(),
}));

const mockedCreateBag = vi.mocked(createBag);
const mockedAddShipmentsToBag = vi.mocked(addShipmentsToBag);
const mockedUpdateBagStatus = vi.mocked(updateBagStatus);
const mockedVerifyScannedShipment = vi.mocked(verifyScannedShipment);
const mockedVerifyShipmentInBag = vi.mocked(verifyShipmentInBag);
const mockedCompleteBagVerification = vi.mocked(completeBagVerification);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  return { wrapper, queryClient };
};

describe("BAG mutation hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a bag and invalidates related queries on success", async () => {
    mockedCreateBag.mockResolvedValue({} as Awaited<
      ReturnType<typeof createBag>
    >);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useCreateBag(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({} as Parameters<typeof createBag>[0]);
    });

    expect(mockedCreateBag).toHaveBeenCalledTimes(1);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["bags"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["bag"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["shipments"] });
  });

  it("adds shipments to a bag", async () => {
    mockedAddShipmentsToBag.mockResolvedValue({} as Awaited<
      ReturnType<typeof addShipmentsToBag>
    >);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useAddShipmentsToBag(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        bagId: "bag-1",
        shipmentIds: ["shipment-1", "shipment-2"],
      });
    });

    expect(mockedAddShipmentsToBag).toHaveBeenCalledWith("bag-1", [
      "shipment-1",
      "shipment-2",
    ]);
  });

  it("updates bag status and forwards the assigned agent ID", async () => {
    mockedUpdateBagStatus.mockResolvedValue({} as Awaited<
      ReturnType<typeof updateBagStatus>
    >);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useUpdateBagStatus(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        bagId: "bag-1",
        status: "IN_TRANSIT",
        assignedAgentId: "agent-1",
      });
    });

    expect(mockedUpdateBagStatus).toHaveBeenCalledWith("bag-1", {
      status: "IN_TRANSIT",
      assignedAgentId: "agent-1",
    });
  });

  it("verifies a scanned shipment", async () => {
    mockedVerifyScannedShipment.mockResolvedValue({} as Awaited<
      ReturnType<typeof verifyScannedShipment>
    >);

    const { wrapper } = createWrapper();
    const { result } = renderHook(
      () => useVerifyScannedShipment(),
      { wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync({
        bagId: "bag-1",
        awbNumber: "AWB-123",
      });
    });

    expect(mockedVerifyScannedShipment).toHaveBeenCalledWith(
      "bag-1",
      "AWB-123",
    );
  });

  it("verifies a shipment in a bag", async () => {
    mockedVerifyShipmentInBag.mockResolvedValue({} as Awaited<
      ReturnType<typeof verifyShipmentInBag>
    >);

    const { wrapper } = createWrapper();
    const { result } = renderHook(
      () => useVerifyShipmentInBag(),
      { wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync({
        bagId: "bag-1",
        shipmentId: "shipment-1",
      });
    });

    expect(mockedVerifyShipmentInBag).toHaveBeenCalledWith(
      "bag-1",
      "shipment-1",
    );
  });

  it("completes bag verification", async () => {
    mockedCompleteBagVerification.mockResolvedValue({} as Awaited<
      ReturnType<typeof completeBagVerification>
    >);

    const { wrapper } = createWrapper();
    const { result } = renderHook(
      () => useCompleteBagVerification(),
      { wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync({} as Parameters<
        typeof completeBagVerification
      >[0]);
    });

    expect(mockedCompleteBagVerification).toHaveBeenCalledTimes(1);
  });

  it("does not invalidate queries when a mutation fails", async () => {
    mockedCreateBag.mockRejectedValue(new Error("Create failed"));

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useCreateBag(), { wrapper });

    await act(async () => {
      await expect(
        result.current.mutateAsync({} as Parameters<typeof createBag>[0]),
      ).rejects.toThrow("Create failed");
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
