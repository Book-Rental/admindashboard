import { describe, it, expect, vi, beforeEach } from "vitest";
import { useQuery } from "@tanstack/react-query";
import { getHubById, getHubs } from "../api/hubService";
import { useHubById } from "../hooks/useHubById";
import { useHubs } from "../hooks/useHubs";

vi.mock("@tanstack/react-query", () => ({
    useQuery: vi.fn(),
}));

vi.mock("../api/hubService", () => ({
    getHubById: vi.fn(),
    getHubs: vi.fn(),
}));

describe("useHubById", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("configures the query with the hub ID and enables it when an ID is provided", () => {
        useHubById("hub-123");

        expect(useQuery).toHaveBeenCalledWith({
            queryKey: ["hub", "hub-123"],
            queryFn: expect.any(Function),
            enabled: true,
        });
    });

    it("disables the query when no hub ID is provided", () => {
        useHubById();

        expect(useQuery).toHaveBeenCalledWith({
            queryKey: ["hub", undefined],
            queryFn: expect.any(Function),
            enabled: false,
        });
    });

    it("calls getHubById with the provided hub ID when the query function runs", async () => {
        vi.mocked(getHubById).mockResolvedValue(
            {} as Awaited<ReturnType<typeof getHubById>>
        );

        useHubById("hub-456");

        const queryConfig = vi.mocked(useQuery).mock.calls[0][0];

        if (typeof queryConfig.queryFn !== "function") {
            throw new Error("Expected queryFn to be a function");
        }

        await queryConfig.queryFn({
            queryKey: ["hub", "hub-456"],
            signal: new AbortController().signal,
            meta: undefined,
            client: {} as never,
        });

        expect(getHubById).toHaveBeenCalledWith("hub-456");
    });
});

describe("useHubs", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("configures the hubs query", () => {
        useHubs();

        expect(useQuery).toHaveBeenCalledWith({
            queryKey: ["hubs"],
            queryFn: getHubs,
        });
    });
});