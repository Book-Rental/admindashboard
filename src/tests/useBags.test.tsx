
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import {
    useBags,
    useBag,
    useBagParcels,
    BAGS_QUERY_KEY,
} from "../hooks/useBags";

import {
    getBags,
    getBagById,
} from "../api/bagApi";

import { getShipmentById } from "../api/shipmentApi";

vi.mock("../api/bagApi", () => ({
    getBags: vi.fn(),
    getBagById: vi.fn(),
}));

vi.mock("../api/shipmentApi", () => ({
    getShipmentById: vi.fn(),
}));

const mockedGetBags = vi.mocked(getBags);
const mockedGetBagById = vi.mocked(getBagById);
const mockedGetShipmentById = vi.mocked(getShipmentById);

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    return { wrapper, queryClient };
};

describe("useBags", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("exports the correct bags query key", () => {
        expect(BAGS_QUERY_KEY).toEqual(["bags"]);
    });

    it("fetches bags successfully", async () => {
        const bags = {
            status: "success",
            message: "Bags fetched successfully",
            data: [
                {
                    _id: "mongo-1",
                    bagId: "BAG-001",
                    fromHubId: "hub-1",
                    toHubId: "hub-2",
                    shipmentIds: ["shipment-1"],
                    verifiedShipmentIds: [],
                    status: "CREATED",
                    createdAt: "2026-10-22T10:00:00.000Z",
                    updatedAt: "2026-10-22T10:00:00.000Z",
                },
            ],
        } satisfies Awaited<ReturnType<typeof getBags>>;

        mockedGetBags.mockResolvedValue(bags);

        const { wrapper } = createWrapper();
        const { result } = renderHook(() => useBags(), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(bags);
        expect(mockedGetBags).toHaveBeenCalledTimes(1);
    });

    it("exposes an error when fetching bags fails", async () => {
        mockedGetBags.mockRejectedValue(new Error("Failed to fetch bags"));

        const { wrapper } = createWrapper();
        const { result } = renderHook(() => useBags(), { wrapper });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeInstanceOf(Error);
    });
});

describe("useBag", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches a bag by ID", async () => {
        const bag = {
            status: "success",
            message: "Bag fetched successfully",
            data: {
                _id: "mongo-1",
                bagId: "BAG-001",
                fromHubId: "hub-1",
                toHubId: "hub-2",
                shipmentIds: ["shipment-1"],
                verifiedShipmentIds: [],
                status: "CREATED",
                createdAt: "2026-10-22T10:00:00.000Z",
                updatedAt: "2026-10-22T10:00:00.000Z",
            },
        } satisfies Awaited<ReturnType<typeof getBagById>>;

        mockedGetBagById.mockResolvedValue(bag);

        const { wrapper } = createWrapper();
        const { result } = renderHook(() => useBag("bag-1"), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockedGetBagById).toHaveBeenCalledWith("bag-1");
        expect(result.current.data).toEqual(bag);
    });

    it("does not fetch when the bag ID is empty", async () => {
        const { wrapper } = createWrapper();
        const { result } = renderHook(() => useBag(""), { wrapper });

        expect(result.current.fetchStatus).toBe("idle");
        expect(mockedGetBagById).not.toHaveBeenCalled();
    });
});

describe("useBagParcels", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches each shipment by ID", async () => {
        mockedGetShipmentById.mockImplementation(async (id) => ({
            id,
        }) as Awaited<ReturnType<typeof getShipmentById>>);

        const { wrapper } = createWrapper();
        const { result } = renderHook(
            () => useBagParcels(["shipment-1", "shipment-2"]),
            { wrapper },
        );

        await waitFor(() => {
            expect(result.current.every((query) => query.isSuccess)).toBe(true);
        });

        expect(mockedGetShipmentById).toHaveBeenCalledTimes(2);
        expect(mockedGetShipmentById).toHaveBeenCalledWith("shipment-1");
        expect(mockedGetShipmentById).toHaveBeenCalledWith("shipment-2");
        expect(result.current.map((query) => query.data?.id)).toEqual([
            "shipment-1",
            "shipment-2",
        ]);
    });

    it("returns an empty array when there are no shipment IDs", () => {
        const { wrapper } = createWrapper();
        const { result } = renderHook(() => useBagParcels([]), { wrapper });

        expect(result.current).toEqual([]);
        expect(mockedGetShipmentById).not.toHaveBeenCalled();
    });
});
