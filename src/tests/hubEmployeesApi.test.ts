import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";

import type { HubEmployeesResponse } from "../types/hub";
import { getHubEmployees } from "../api/hubEmployeesApi";

vi.mock("axios", () => ({
    default: {
        get: vi.fn(),
    },
}));

describe("getHubEmployees", () => {
    const hubId = "6a6b1b99f447531ecb350f64";

    const mockResponse: HubEmployeesResponse = {
        status: "Success",
        message: "Hub employees fetched successfully.",
        data: {
            hub: {
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

                _id: "6a6b1b99f447531ecb350f64",
                hubId: "HUB000007",
                hubCode: "HUB007",
                hubName: "Chennai South Logistics Hub",
                managerName: "Arun Kumar",
                email: "arun.k@example.com",
                phoneNumber: "9840012345",

                serviceablePincodes: [
                    "600113",
                    "600096",
                    "600097",
                    "600041",
                    "600100",
                    "600119",
                    "600042",
                    "600032",
                    "600020",
                    "600036",
                ],

                capacity: 1900,
                currentLoad: 0,
                status: "Active",

                createdBy: null,
                updatedBy: null,
                createdAt: "2026-07-30T09:38:33.567Z",
                updatedAt: "2026-07-30T09:38:33.567Z",
                __v: 0,
            },

            employees: [
                {
                    fullName: "Arun Kumar",
                    email: "arun.k@example.com",
                    phoneNumber: "9840012345",
                    role: "MANAGER",
                },
                {
                    fullName: "Arun Kumar",
                    email: "arun.kumar@gmail.com",
                    phoneNumber: "9840010001",
                    role: "AGENT",
                },
                {
                    fullName: "xyz",
                    email: "sdhfk@gmail.com",
                    phoneNumber: "7989456131",
                    role: "AGENT",
                },
            ],

            summary: {
                totalEmployees: 3,
            },
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch hub employees successfully", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: mockResponse,
        });

        const result = await getHubEmployees(hubId);

        expect(result).toEqual(mockResponse);
    });

    it("should call the correct API endpoint", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: mockResponse,
        });

        await getHubEmployees(hubId);

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining(
                `/hub/employees/${hubId}`
            )
        );
    });

    it("should return hub details", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: mockResponse,
        });

        const result = await getHubEmployees(hubId);

        expect(result.data.hub.hubName).toBe(
            "Chennai South Logistics Hub"
        );

        expect(result.data.hub.hubCode).toBe("HUB007");

        expect(result.data.hub.status).toBe("Active");

        expect(result.data.hub.capacity).toBe(1900);

        expect(result.data.hub.currentLoad).toBe(0);
    });

    it("should return all employees", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: mockResponse,
        });

        const result = await getHubEmployees(hubId);

        expect(result.data.employees).toHaveLength(3);

        expect(result.data.employees[0]).toEqual({
            fullName: "Arun Kumar",
            email: "arun.k@example.com",
            phoneNumber: "9840012345",
            role: "MANAGER",
        });
    });

    it("should return the correct employee count", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: mockResponse,
        });

        const result = await getHubEmployees(hubId);

        expect(result.data.summary.totalEmployees).toBe(3);
    });

    it("should return serviceable pincodes", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: mockResponse,
        });

        const result = await getHubEmployees(hubId);

        expect(
            result.data.hub.serviceablePincodes
        ).toHaveLength(10);

        expect(
            result.data.hub.serviceablePincodes
        ).toContain("600113");

        expect(
            result.data.hub.serviceablePincodes
        ).toContain("600096");
    });

    it("should use the provided hub ID", async () => {
        const anotherHubId =
            "6a6b1b99f447531ecb350f90";

        vi.mocked(axios.get).mockResolvedValue({
            data: mockResponse,
        });

        await getHubEmployees(anotherHubId);

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining(
                `/hub/employees/${anotherHubId}`
            )
        );
    });

    it("should throw an error when the API request fails", async () => {
        const apiError = new Error(
            "Failed to fetch hub employees"
        );

        vi.mocked(axios.get).mockRejectedValue(apiError);

        await expect(
            getHubEmployees(hubId)
        ).rejects.toThrow(
            "Failed to fetch hub employees"
        );
    });
});