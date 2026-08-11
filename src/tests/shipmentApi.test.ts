import axios from "axios";

import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    getShipments,
    getShipmentById,
    updateShipmentStatus,
    assignAgentToShipments,
} from "../api/shipmentApi";

/* -----------------------------------------
   MOCK AXIOS
------------------------------------------ */

vi.mock("axios", () => ({
    default: {
        get: vi.fn(),
        patch: vi.fn(),
        post: vi.fn(),
    },
}));

const mockedAxios = vi.mocked(axios);

/* -----------------------------------------
   TESTS
------------------------------------------ */

describe("shipmentApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    /* -----------------------------------------
       getShipments
    ------------------------------------------ */

    describe("getShipments", () => {
        it("fetches shipments successfully", async () => {
            const mockResponse = {
                status: "Success",
                message: "Shipments fetched successfully",
                data: {
                    shipments: [],
                    meta: {
                        totalRecords: 0,
                        totalPages: 0,
                        currentPage: 1,
                        limit: 10,
                        hasMore: false,
                    },
                },
            };

            mockedAxios.get.mockResolvedValueOnce({
                data: mockResponse,
            });

            const result = await getShipments(
                "hub-123"
            );

            expect(
                mockedAxios.get
            ).toHaveBeenCalledWith(
                expect.stringContaining(
                    "/hub/shipment/hub-123?journeyType=Pickup"
                ),
                {
                    params: {
                        page: 1,
                        currentStatus: "",
                        paymentMode: "",
                        search: "",
                    },
                    withCredentials: true,
                }
            );

            expect(result).toEqual(
                mockResponse
            );
        });

        it("passes pagination and filters correctly", async () => {
            const mockResponse = {
                status: "Success",
                message: "Shipments fetched successfully",
                data: {
                    shipments: [],
                    meta: {
                        totalRecords: 0,
                        totalPages: 0,
                        currentPage: 2,
                        limit: 10,
                        hasMore: false,
                    },
                },
            };

            mockedAxios.get.mockResolvedValueOnce({
                data: mockResponse,
            });

            const result = await getShipments(
                "hub-123",
                2,
                "In Transit",
                "COD",
                "AWB000001"
            );

            expect(
                mockedAxios.get
            ).toHaveBeenCalledWith(
                expect.stringContaining(
                    "/hub/shipment/hub-123?journeyType=Pickup"
                ),
                {
                    params: {
                        page: 2,
                        currentStatus: "In Transit",
                        paymentMode: "COD",
                        search: "AWB000001",
                    },
                    withCredentials: true,
                }
            );

            expect(result).toEqual(
                mockResponse
            );
        });

        it("uses default parameters", async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    shipments: [],
                },
            });

            await getShipments(
                "hub-123"
            );

            expect(
                mockedAxios.get
            ).toHaveBeenCalledWith(
                expect.stringContaining(
                    "/hub/shipment/hub-123?journeyType=Pickup"
                ),
                {
                    params: {
                        page: 1,
                        currentStatus: "",
                        paymentMode: "",
                        search: "",
                    },
                    withCredentials: true,
                }
            );
        });

        it("propagates API error", async () => {
            const error = new Error(
                "Network Error"
            );

            mockedAxios.get.mockRejectedValueOnce(
                error
            );

            await expect(
                getShipments("hub-123")
            ).rejects.toThrow(
                "Network Error"
            );
        });
    });

    /* -----------------------------------------
       getShipmentById
    ------------------------------------------ */

    describe("getShipmentById", () => {
        it("fetches shipment by id successfully", async () => {
            const mockResponse = {
                status: "Success",
                message:
                    "Shipment fetched successfully",
                data: {
                    shipmentId:
                        "shipment-123",
                    awbNumber:
                        "AWB000001",
                },
            };

            mockedAxios.get.mockResolvedValueOnce({
                data: mockResponse,
            });

            const result =
                await getShipmentById(
                    "shipment-123"
                );

            expect(
                mockedAxios.get
            ).toHaveBeenCalledWith(
                expect.stringContaining(
                    "/shipment/shipment-123"
                ),
                {
                    withCredentials: true,
                }
            );

            expect(result).toEqual(
                mockResponse
            );
        });

        it("propagates API error", async () => {
            const error = new Error(
                "Shipment not found"
            );

            mockedAxios.get.mockRejectedValueOnce(
                error
            );

            await expect(
                getShipmentById(
                    "shipment-123"
                )
            ).rejects.toThrow(
                "Shipment not found"
            );
        });
    });

    /* -----------------------------------------
       updateShipmentStatus
    ------------------------------------------ */

    describe("updateShipmentStatus", () => {
        it("updates shipment status successfully", async () => {
            const requestData = {
                hubId: "hub-123",
                status: "In Transit",
                event: "Shipment In Transit",
                remarks: "Shipment moved to next hub",
                updatedBy: "admin-123",
            };

            const mockResponse = {
                status: "Success",
                message:
                    "Shipment status updated successfully",
            };

            mockedAxios.patch.mockResolvedValueOnce({
                data: mockResponse,
            });

            const result =
                await updateShipmentStatus(
                    "shipment-123",
                    requestData
                );

            expect(
                mockedAxios.patch
            ).toHaveBeenCalledWith(
                expect.stringContaining(
                    "/shipment/shipment-123/status"
                ),
                requestData,
                {
                    withCredentials: true,
                }
            );

            expect(result).toEqual({
                data: mockResponse,
            });
        });

        it("supports optional status fields", async () => {
            const requestData = {
                hubId: "hub-123",
            };

            mockedAxios.patch.mockResolvedValueOnce({
                data: {
                    status: "Success",
                },
            });

            await updateShipmentStatus(
                "shipment-123",
                requestData
            );

            expect(
                mockedAxios.patch
            ).toHaveBeenCalledWith(
                expect.stringContaining(
                    "/shipment/shipment-123/status"
                ),
                requestData,
                {
                    withCredentials: true,
                }
            );
        });

        it("propagates API error", async () => {
            const error = new Error(
                "Failed to update shipment"
            );

            mockedAxios.patch.mockRejectedValueOnce(
                error
            );

            await expect(
                updateShipmentStatus(
                    "shipment-123",
                    {
                        hubId: "hub-123",
                        status: "Delivered",
                    }
                )
            ).rejects.toThrow(
                "Failed to update shipment"
            );
        });
    });

    /* -----------------------------------------
       assignAgentToShipments
    ------------------------------------------ */

    describe("assignAgentToShipments", () => {
        it("assigns agent to shipments successfully", async () => {
            const agentId =
                "agent-123";

            const shipmentIds = [
                "shipment-1",
                "shipment-2",
            ];

            const updatedBy =
                "admin-123";

            const mockResponse = {
                status: "Success",
                message:
                    "Delivery agent assigned successfully",
            };

            mockedAxios.post.mockResolvedValueOnce({
                data: mockResponse,
            });

            const result =
                await assignAgentToShipments(
                    agentId,
                    shipmentIds,
                    updatedBy
                );

            expect(
                mockedAxios.post
            ).toHaveBeenCalledWith(
                expect.stringContaining(
                    "/shipment/bulk-update"
                ),
                {
                    agentId,
                    shipmentIds,
                    updatedBy,
                    status:
                        "Delivery Agent Assigned",
                    remarks:
                        "Delivery agent is assigned ",
                }
            );

            expect(result).toEqual(
                mockResponse
            );
        });

        it("sends all selected shipment ids", async () => {
            mockedAxios.post.mockResolvedValueOnce({
                data: {
                    status: "Success",
                },
            });

            await assignAgentToShipments(
                "agent-456",
                [
                    "shipment-1",
                    "shipment-2",
                    "shipment-3",
                ],
                "admin-456"
            );

            expect(
                mockedAxios.post
            ).toHaveBeenCalledWith(
                expect.stringContaining(
                    "/shipment/bulk-update"
                ),
                {
                    agentId: "agent-456",
                    shipmentIds: [
                        "shipment-1",
                        "shipment-2",
                        "shipment-3",
                    ],
                    updatedBy: "admin-456",
                    status:
                        "Delivery Agent Assigned",
                    remarks:
                        "Delivery agent is assigned ",
                }
            );
        });

        it("propagates API error", async () => {
            const error = new Error(
                "Failed to assign agent"
            );

            mockedAxios.post.mockRejectedValueOnce(
                error
            );

            await expect(
                assignAgentToShipments(
                    "agent-123",
                    ["shipment-123"],
                    "admin-123"
                )
            ).rejects.toThrow(
                "Failed to assign agent"
            );
        });
    });
});