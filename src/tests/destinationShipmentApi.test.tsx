import axios from "axios";

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    getHubById,
    getHubShipmentsByPincode,
} from "../api/destinationShipmentApi";

import type {
    GetHubByIdResponse,
    DestinationShipmentResponse,
} from "../types/destinationShipment";

vi.mock("axios");

const mockedAxios = vi.mocked(axios);

describe("DestinationShipment API", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    /* -----------------------------------------
       getHubById
    ------------------------------------------ */

    describe("getHubById", () => {
        it("should fetch hub details by hub id", async () => {
            const mockResponse: GetHubByIdResponse = {
                status: "Success",
                message: "HUb fetched successfully",
                data: {
                    address: {
                        street:
                            "100 Feet Road, HAL II Stage, Indiranagar",
                        city: "Bengaluru",
                        state: "Karnataka",
                        country: "India",
                        pincode: "560038",
                    },
                    location: {
                        type: "Point",
                        coordinates: [
                            77.6412,
                            12.9718,
                        ],
                    },
                    _id:
                        "6a6b1209fe8ab709826c1291",
                    hubId: "HUB000004",
                    hubCode: "HUB004",
                    hubName:
                        "Bengaluru East Central Hub",
                    managerName:
                        "Anand Narayanan",
                    email:
                        "anand.n@example.com",
                    phoneNumber:
                        "9845012345",
                    serviceablePincodes: [
                        "560038",
                        "560008",
                        "560093",
                        "560075",
                        "560016",
                        "560033",
                        "560001",
                        "560042",
                        "560102",
                    ],
                    capacity: 2500,
                    currentLoad: 0,
                    status: "Active",
                    createdBy: null,
                    updatedBy: null,
                    createdAt:
                        "2026-07-30T08:57:45.584Z",
                    updatedAt:
                        "2026-07-30T08:57:45.584Z",
                    __v: 0,
                },
            };

            mockedAxios.get.mockResolvedValueOnce({
                data: mockResponse,
            });

            const result = await getHubById(
                "6a6b1209fe8ab709826c1291"
            );

            expect(
                mockedAxios.get
            ).toHaveBeenCalledTimes(1);

            expect(
                mockedAxios.get
            ).toHaveBeenCalledWith(
                expect.stringContaining(
                    "/hub/6a6b1209fe8ab709826c1291"
                )
            );

            expect(result).toEqual(
                mockResponse
            );
        });

        it("should return serviceable pincodes from hub response", async () => {
            const mockResponse: GetHubByIdResponse = {
                status: "Success",
                message: "HUb fetched successfully",
                data: {
                    address: {
                        street:
                            "100 Feet Road, HAL II Stage, Indiranagar",
                        city: "Bengaluru",
                        state: "Karnataka",
                        country: "India",
                        pincode: "560038",
                    },
                    location: {
                        type: "Point",
                        coordinates: [
                            77.6412,
                            12.9718,
                        ],
                    },
                    _id:
                        "6a6b1209fe8ab709826c1291",
                    hubId: "HUB000004",
                    hubCode: "HUB004",
                    hubName:
                        "Bengaluru East Central Hub",
                    managerName:
                        "Anand Narayanan",
                    email:
                        "anand.n@example.com",
                    phoneNumber:
                        "9845012345",
                    serviceablePincodes: [
                        "560038",
                        "560008",
                        "560093",
                        "560075",
                        "560016",
                        "560033",
                        "560001",
                        "560042",
                        "560102",
                    ],
                    capacity: 2500,
                    currentLoad: 0,
                    status: "Active",
                    createdBy: null,
                    updatedBy: null,
                    createdAt:
                        "2026-07-30T08:57:45.584Z",
                    updatedAt:
                        "2026-07-30T08:57:45.584Z",
                    __v: 0,
                },
            };

            mockedAxios.get.mockResolvedValueOnce({
                data: mockResponse,
            });

            const result = await getHubById(
                "6a6b1209fe8ab709826c1291"
            );

            expect(
                result.data.serviceablePincodes
            ).toEqual([
                "560038",
                "560008",
                "560093",
                "560075",
                "560016",
                "560033",
                "560001",
                "560042",
                "560102",
            ]);
        });

        it("should propagate error when fetching hub fails", async () => {
            const error = new Error(
                "Failed to fetch hub"
            );

            mockedAxios.get.mockRejectedValueOnce(
                error
            );

            await expect(
                getHubById(
                    "6a6b1209fe8ab709826c1291"
                )
            ).rejects.toThrow(
                "Failed to fetch hub"
            );

            expect(
                mockedAxios.get
            ).toHaveBeenCalledTimes(1);
        });
    });

    /* -----------------------------------------
       getHubShipmentsByPincode
    ------------------------------------------ */

    describe(
        "getHubShipmentsByPincode",
        () => {
            it(
                "should fetch shipments by hub id and pincode",
                async () => {
                    const mockResponse: DestinationShipmentResponse =
                    {
                        status: "Success",
                        message:
                            "Shipments fetched successfully",
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

                    mockedAxios.get.mockResolvedValueOnce(
                        {
                            data: mockResponse,
                        }
                    );

                    const result =
                        await getHubShipmentsByPincode(
                            "6a6b1209fe8ab709826c1291",
                            "560093"
                        );

                    expect(
                        mockedAxios.get
                    ).toHaveBeenCalledTimes(1);

                    expect(
                        mockedAxios.get
                    ).toHaveBeenCalledWith(
                        expect.stringContaining(
                            "/hub/shipment/bypincode/6a6b1209fe8ab709826c1291"
                        ),
                        {
                            params: {
                                pincode: "560093",
                            },
                        }
                    );

                    expect(result).toEqual(
                        mockResponse
                    );
                }
            );

            it(
                "should send the selected pincode correctly",
                async () => {
                    const mockResponse: DestinationShipmentResponse =
                    {
                        status: "Success",
                        message:
                            "Shipments fetched successfully",
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

                    mockedAxios.get.mockResolvedValueOnce(
                        {
                            data: mockResponse,
                        }
                    );

                    await getHubShipmentsByPincode(
                        "6a6b1209fe8ab709826c1291",
                        "560093"
                    );

                    expect(
                        mockedAxios.get
                    ).toHaveBeenCalledWith(
                        expect.stringContaining(
                            "/hub/shipment/bypincode/6a6b1209fe8ab709826c1291"
                        ),
                        expect.objectContaining({
                            params: {
                                pincode:
                                    "560093",
                            },
                        })
                    );
                }
            );

            it(
                "should not send pincode params when pincode is not provided",
                async () => {
                    const mockResponse: DestinationShipmentResponse =
                    {
                        status: "Success",
                        message:
                            "Shipments fetched successfully",
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

                    mockedAxios.get.mockResolvedValueOnce(
                        {
                            data: mockResponse,
                        }
                    );

                    await getHubShipmentsByPincode(
                        "6a6b1209fe8ab709826c1291"
                    );

                    expect(
                        mockedAxios.get
                    ).toHaveBeenCalledWith(
                        expect.stringContaining(
                            "/hub/shipment/bypincode/6a6b1209fe8ab709826c1291"
                        ),
                        {
                            params: undefined,
                        }
                    );
                }
            );

            it(
                "should return shipment response data",
                async () => {
                    const mockResponse: DestinationShipmentResponse =
                    {
                        status: "Success",
                        message:
                            "Shipments fetched successfully",
                        data: {
                            shipments: [],
                            meta: {
                                totalRecords: 5,
                                totalPages: 1,
                                currentPage: 1,
                                limit: 10,
                                hasMore: false,
                            },
                        },
                    };

                    mockedAxios.get.mockResolvedValueOnce(
                        {
                            data: mockResponse,
                        }
                    );

                    const result =
                        await getHubShipmentsByPincode(
                            "6a6b1209fe8ab709826c1291",
                            "560093"
                        );

                    expect(
                        result.status
                    ).toBe("Success");

                    expect(
                        result.data.meta
                            .totalRecords
                    ).toBe(5);
                }
            );

            it(
                "should propagate error when shipment request fails",
                async () => {
                    const error = new Error(
                        "Failed to fetch shipments"
                    );

                    mockedAxios.get.mockRejectedValueOnce(
                        error
                    );

                    await expect(
                        getHubShipmentsByPincode(
                            "6a6b1209fe8ab709826c1291",
                            "560093"
                        )
                    ).rejects.toThrow(
                        "Failed to fetch shipments"
                    );

                    expect(
                        mockedAxios.get
                    ).toHaveBeenCalledTimes(
                        1
                    );
                }
            );
        }
    );
});
