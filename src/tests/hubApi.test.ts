import axios from "axios";
import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

;

import type {
    HubResponse,
    GetHubByIdResponse,
} from "../types/hub";
import { getHubById, getHubs } from "../api/hubService";

vi.mock("axios", () => ({
    default: {
        get: vi.fn(),
    },
}));

describe("Hub API", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockHub = {
        _id: "6a6b1b99f447531ecb350f64",
        hubId: "HUB000007",
        hubCode: "HUB007",
        hubName: "Chennai South Logistics Hub",
        managerName: "Arun Kumar",
        email: "arun.k@example.com",
        phoneNumber: "9840012345",

        address: {
            street: "OMR Road, Near Tidel Park",
            city: "Chennai",
            state: "Tamil Nadu",
            country: "India",
            pincode: "600113",
        },

        location: {
            type: "Point",
            coordinates: [80.241, 12.9854],
        },

        serviceablePincodes: [
            "600113",
            "600096",
            "600097",
        ],

        capacity: 1900,
        currentLoad: 0,
        status: "Active",

        createdBy: null,
        updatedBy: null,
        createdAt: "2026-07-30T09:38:33.567Z",
        updatedAt: "2026-07-30T09:38:33.567Z",
        __v: 0,
    };

    describe("getHubs", () => {
        const mockResponse: HubResponse = {
            success: true,
            data: [mockHub],
        };

        it("should fetch all hubs successfully", async () => {
            vi.mocked(axios.get).mockResolvedValue({
                data: mockResponse,
            });

            const result = await getHubs();

            expect(result).toEqual(mockResponse);
        });

        it("should call the correct API endpoint", async () => {
            vi.mocked(axios.get).mockResolvedValue({
                data: mockResponse,
            });

            await getHubs();

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining("/hub")
            );
        });

        it("should return hub data", async () => {
            vi.mocked(axios.get).mockResolvedValue({
                data: mockResponse,
            });

            const result = await getHubs();

            expect(result.success).toBe(true);
            expect(result.data).toHaveLength(1);
            expect(result.data[0].hubName).toBe(
                "Chennai South Logistics Hub"
            );
            expect(result.data[0].hubCode).toBe(
                "HUB007"
            );
        });

        it("should throw an error when fetching hubs fails", async () => {
            const apiError = new Error(
                "Failed to fetch hubs"
            );

            vi.mocked(axios.get).mockRejectedValue(
                apiError
            );

            await expect(getHubs()).rejects.toThrow(
                "Failed to fetch hubs"
            );
        });
    });

    describe("getHubById", () => {
        const hubId = "6a6b1b99f447531ecb350f64";

        const mockResponse: GetHubByIdResponse = {
            status: "Success",
            message: "Hub fetched successfully.",
            data: mockHub,
        };

        it("should fetch a hub by ID successfully", async () => {
            vi.mocked(axios.get).mockResolvedValue({
                data: mockResponse,
            });

            const result = await getHubById(hubId);

            expect(result).toEqual(mockResponse);
        });

        it("should call the correct API endpoint with hub ID", async () => {
            vi.mocked(axios.get).mockResolvedValue({
                data: mockResponse,
            });

            await getHubById(hubId);

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining(
                    `/hub/${hubId}`
                )
            );
        });

        it("should return the correct hub details", async () => {
            vi.mocked(axios.get).mockResolvedValue({
                data: mockResponse,
            });

            const result = await getHubById(hubId);

            expect(result.data._id).toBe(hubId);
            expect(result.data.hubId).toBe(
                "HUB000007"
            );
            expect(result.data.hubName).toBe(
                "Chennai South Logistics Hub"
            );
            expect(result.data.status).toBe(
                "Active"
            );
        });

        it("should throw an error when fetching hub by ID fails", async () => {
            const apiError = new Error(
                "Hub not found"
            );

            vi.mocked(axios.get).mockRejectedValue(
                apiError
            );

            await expect(
                getHubById(hubId)
            ).rejects.toThrow("Hub not found");
        });
    });
});