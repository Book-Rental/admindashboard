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
        message: "Employee fetched successfully.",
        data: {
            employees: [
                {
                    _id: "6a8431ddb3d10cde02cb648e",
                    employeeId: "EMP260818446441",
                    fullName: "Divya Srinivasan",
                    email: "divya.srinivasan@gmail.com",
                    phoneNumber: "9876543272",
                    role: "cashier",
                    status: "Active",
                    isAvailable: true,
                    isActive: true,
                    hub: {
                        _id: "6a6b1b99f447531ecb350f64",
                        hubCode: "HUB007",
                    },
                    vehicle: {
                        type: null,
                        number: "",
                    },
                    currentLocation: {
                        type: "Point",
                        coordinates: [0, 0],
                        updatedAt: null,
                    },
                    currentShipmentId: null,
                    photo: null,
                    joinedOn: "2026-08-18T10:20:13.944Z",
                    createdAt: "2026-08-18T10:20:13.945Z",
                    updatedAt: "2026-08-18T10:20:14.087Z",
                },
                {
                    _id: "6a8431cbb3d10cde02cb6485",
                    employeeId: "EMP260818230198",
                    fullName: "Suresh Krishnan",
                    email: "suresh.krishnan@gmail.com",
                    phoneNumber: "9876543271",
                    role: "HUB_MANAGER",
                    status: "Active",
                    isAvailable: true,
                    isActive: true,
                    hub: {
                        _id: "6a6b1b99f447531ecb350f64",
                        hubCode: "HUB007",
                    },
                    vehicle: {
                        type: null,
                        number: "",
                    },
                    currentLocation: {
                        type: "Point",
                        coordinates: [0, 0],
                        updatedAt: null,
                    },
                    currentShipmentId: null,
                    photo: null,
                    joinedOn: "2026-08-18T10:19:55.074Z",
                    createdAt: "2026-08-18T10:19:55.075Z",
                    updatedAt: "2026-08-18T10:19:55.225Z",
                },
                {
                    _id: "6a843208b3d10cde02cb6497",
                    employeeId: "EMP260818420944",
                    fullName: "Manoj Kumar",
                    email: "manoj.kumar@gmail.com",
                    phoneNumber: "9876543281",
                    role: "HUB_MANAGER",
                    status: "Active",
                    isAvailable: true,
                    isActive: true,
                    hub: {
                        _id: "6a6b1b99f447531ecb350f64",
                        hubCode: "HUB007",
                    },
                    vehicle: {
                        type: null,
                        number: "",
                    },
                    currentLocation: {
                        type: "Point",
                        coordinates: [0, 0],
                        updatedAt: null,
                    },
                    currentShipmentId: null,
                    photo: null,
                    joinedOn: "2026-08-18T10:20:56.065Z",
                    createdAt: "2026-08-18T10:20:56.066Z",
                    updatedAt: "2026-08-18T10:20:56.206Z",
                },
            ],
            meta: {
                totalRecords: 3,
                totalPages: 1,
                currentPage: 1,
                limit: 10,
                hasMore: false,
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
            expect.stringContaining(`/api/employee/hub/${hubId}`)
        );
    });

    it("should return all employees", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: mockResponse,
        });

        const result = await getHubEmployees(hubId);

        expect(result.data.employees).toHaveLength(3);

        expect(result.data.employees[0]).toEqual(
            mockResponse.data.employees[0]
        );
    });

    it("should return employee details", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: mockResponse,
        });

        const result = await getHubEmployees(hubId);

        const employee = result.data.employees[0];

        expect(employee.fullName).toBe("Divya Srinivasan");
        expect(employee.email).toBe(
            "divya.srinivasan@gmail.com"
        );
        expect(employee.phoneNumber).toBe("9876543272");
        expect(employee.role).toBe("cashier");
        expect(employee.status).toBe("Active");
        expect(employee.isAvailable).toBe(true);
        expect(employee.isActive).toBe(true);
    });

    it("should return employee hub information", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: mockResponse,
        });

        const result = await getHubEmployees(hubId);

        expect(
            result.data.employees[0].hub._id
        ).toBe(hubId);

        expect(
            result.data.employees[0].hub.hubCode
        ).toBe("HUB007");
    });

    it("should return employee vehicle information", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: mockResponse,
        });

        const result = await getHubEmployees(hubId);

        expect(
            result.data.employees[0].vehicle
        ).toEqual({
            type: null,
            number: "",
        });
    });

    it("should return correct employee count", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: mockResponse,
        });

        const result = await getHubEmployees(hubId);

        expect(
            result.data.meta.totalRecords
        ).toBe(3);
    });

    it("should return pagination metadata", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: mockResponse,
        });

        const result = await getHubEmployees(hubId);

        expect(result.data.meta).toEqual({
            totalRecords: 3,
            totalPages: 1,
            currentPage: 1,
            limit: 10,
            hasMore: false,
        });
    });

    it("should use the provided hub ID", async () => {
        const anotherHubId =
            "6a6aeb9b18b80d35a476f97d";

        vi.mocked(axios.get).mockResolvedValue({
            data: mockResponse,
        });

        await getHubEmployees(anotherHubId);

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining(
                `/api/employee/hub/${anotherHubId}`
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