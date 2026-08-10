import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";

import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import DestinationShipment from "../pages/DestinationShipment";

import {
    useDestinationShipments,
    useHubById,
} from "../hooks/useDestinationShipment";

/* -----------------------------------------
   MOCK HOOKS
------------------------------------------ */

vi.mock(
    "../hooks/useDestinationShipment",
    () => ({
        useDestinationShipments: vi.fn(),
        useHubById: vi.fn(),
    })
);

/* -----------------------------------------
   MOCK TABLE
------------------------------------------ */

vi.mock(
    "../components/DestinationShipmentTable",
    () => ({
        default: ({
            shipments,
            selectedShipments,
            onToggleShipment,
            onToggleAll,
        }: {
            shipments: Array<{
                shipmentId: string;
                awbNumber: string;
                receiver: {
                    name: string;
                    pincode: string;
                };
            }>;
            selectedShipments: string[];
            onToggleShipment: (
                shipmentId: string
            ) => void;
            onToggleAll: () => void;
        }) => (
            <div data-testid="shipment-table">

                <button
                    data-testid="toggle-all"
                    onClick={onToggleAll}
                >
                    Toggle All
                </button>

                {shipments.map(
                    (shipment) => (
                        <div
                            key={
                                shipment.shipmentId
                            }
                        >
                            <span>
                                {
                                    shipment.awbNumber
                                }
                            </span>

                            <button
                                data-testid={`toggle-${shipment.shipmentId}`}
                                onClick={() =>
                                    onToggleShipment(
                                        shipment.shipmentId
                                    )
                                }
                            >
                                Toggle
                            </button>

                            {selectedShipments.includes(
                                shipment.shipmentId
                            ) && (
                                    <span>
                                        Selected
                                    </span>
                                )}
                        </div>
                    )
                )}
            </div>
        ),
    })
);

/* -----------------------------------------
   MOCK UI LIBRARY
------------------------------------------ */

vi.mock(
    "@rentbook/rentbook-ui-lib",
    () => ({
        Rb_LoadingSpinner: () => (
            <div data-testid="loading-spinner">
                Loading...
            </div>
        ),

        Rb_Button: ({
            children,
            onClick,
            ...props
        }: {
            children: React.ReactNode;
            onClick?: () => void;
            [key: string]: unknown;
        }) => (
            <button
                onClick={onClick}
                {...props}
            >
                {children}
            </button>
        ),

        Dropdown: ({
            value,
            onChange,
            options,
            placeholder,
            disabled,
        }: {
            value: string;
            onChange: (
                value: string
            ) => void;
            options: Array<{
                label: string;
                value: string;
            }>;
            placeholder?: string;
            disabled?: boolean;
        }) => (
            <select
                data-testid="pincode-dropdown"
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                disabled={disabled}
            >
                <option value="">
                    {placeholder}
                </option>

                {options.map(
                    (option) => (
                        <option
                            key={
                                option.value
                            }
                            value={
                                option.value
                            }
                        >
                            {option.label}
                        </option>
                    )
                )}
            </select>
        ),
    })
);

/* -----------------------------------------
   MOCK HOST USER INFO
------------------------------------------ */

beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(
        window,
        "HOST_USER_INFO",
        {
            writable: true,
            value: {
                referenceId:
                    "6a6b1209fe8ab709826c1291",
            },
        }
    );

    vi.mocked(useHubById).mockReturnValue({
        data: {
            status: "Success",
            message:
                "HUb fetched successfully",
            data: {
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
        },

        isLoading: false,
        isError: false,
    } as ReturnType<
        typeof useHubById
    >);

    vi.mocked(
        useDestinationShipments
    ).mockReturnValue({
        data: {
            status: "Success",
            message:
                "Shipments fetched successfully",
            data: {
                shipments: [
                    {
                        shipmentId:
                            "shipment-1",
                        awbNumber:
                            "AWB000001",
                        orderId:
                            "order-1",
                        orderItemId:
                            "item-1",
                        shipmentType:
                            "Forward",
                        journeyType:
                            "Delivery",
                        currentStatus:
                            "Pending",
                        paymentMode:
                            "Prepaid",
                        codAmount: 0,

                        receiver: {
                            name:
                                "John Doe",
                            phone:
                                "9876543210",
                            addressLine1:
                                "123 Main Street",
                            addressLine2:
                                "",
                            city:
                                "Bengaluru",
                            state:
                                "Karnataka",
                            pincode:
                                "560093",
                            country:
                                "India",
                            location: {
                                type:
                                    "Point",
                                coordinates: [
                                    77.5937,
                                    12.9716,
                                ],
                            },
                        },

                        originHub: {
                            _id:
                                "origin-hub",
                            hubCode:
                                "HUB001",
                            hubName:
                                "Origin Hub",
                        },

                        destinationHub: {
                            _id:
                                "6a6b1209fe8ab709826c1291",
                            hubCode:
                                "HUB004",
                            hubName:
                                "Bengaluru East Central Hub",
                        },

                        assignedAgent: null,

                        expectedDeliveryDate:
                            "2026-08-15T00:00:00.000Z",

                        createdAt:
                            "2026-08-01T00:00:00.000Z",
                    },
                ],

                meta: {
                    totalRecords: 1,
                    totalPages: 1,
                    currentPage: 1,
                    limit: 10,
                    hasMore: false,
                },
            },
        },

        isLoading: false,
        isFetching: false,
        isError: false,
    } as ReturnType<
        typeof useDestinationShipments
    >);
});

/* -----------------------------------------
   TESTS
------------------------------------------ */

describe(
    "DestinationShipment",
    () => {

        it(
            "renders shipment list heading",
            () => {
                render(
                    <DestinationShipment />
                );

                expect(
                    screen.getByText(
                        "Shipment List"
                    )
                ).toBeInTheDocument();
            }
        );

        it(
            "calls useHubById with hub id",
            () => {
                render(
                    <DestinationShipment />
                );

                expect(
                    useHubById
                ).toHaveBeenCalledWith(
                    "6a6b1209fe8ab709826c1291"
                );
            }
        );

        it(
            "renders serviceable pincodes from hub response",
            () => {
                render(
                    <DestinationShipment />
                );

                const dropdown =
                    screen.getByTestId(
                        "pincode-dropdown"
                    );

                expect(
                    dropdown
                ).toBeInTheDocument();

                expect(
                    screen.getByRole(
                        "option",
                        {
                            name: "560038",
                        }
                    )
                ).toBeInTheDocument();

                expect(
                    screen.getByRole(
                        "option",
                        {
                            name: "560008",
                        }
                    )
                ).toBeInTheDocument();

                expect(
                    screen.getByRole(
                        "option",
                        {
                            name: "560093",
                        }
                    )
                ).toBeInTheDocument();

                expect(
                    screen.getByRole(
                        "option",
                        {
                            name: "560075",
                        }
                    )
                ).toBeInTheDocument();
            }
        );

        it(
            "renders all serviceable pincodes",
            () => {
                render(
                    <DestinationShipment />
                );

                const expectedPincodes = [
                    "560038",
                    "560008",
                    "560093",
                    "560075",
                    "560016",
                    "560033",
                    "560001",
                    "560042",
                    "560102",
                ];

                expectedPincodes.forEach(
                    (pincode) => {
                        expect(
                            screen.getByRole(
                                "option",
                                {
                                    name: pincode,
                                }
                            )
                        ).toBeInTheDocument();
                    }
                );
            }
        );

        it(
            "calls shipment hook with hub id and selected pincode",
            async () => {
                render(
                    <DestinationShipment />
                );

                const dropdown =
                    screen.getByTestId(
                        "pincode-dropdown"
                    );

                fireEvent.change(
                    dropdown,
                    {
                        target: {
                            value: "560093",
                        },
                    }
                );

                await waitFor(
                    () => {
                        expect(
                            useDestinationShipments
                        ).toHaveBeenLastCalledWith(
                            "6a6b1209fe8ab709826c1291",
                            "560093"
                        );
                    }
                );
            }
        );

        it(
            "renders shipment data",
            () => {
                render(
                    <DestinationShipment />
                );

                expect(
                    screen.getByText(
                        "AWB000001"
                    )
                ).toBeInTheDocument();
            }
        );

        it(
            "shows total shipment count",
            () => {
                render(
                    <DestinationShipment />
                );

                expect(
                    screen.getByText(
                        /Showing 1 of 1 shipments/i
                    )
                ).toBeInTheDocument();
            }
        );

        it(
            "shows loading spinner while hub is loading",
            () => {
                vi.mocked(
                    useHubById
                ).mockReturnValue({
                    data: undefined,
                    isLoading: true,
                    isError: false,
                } as ReturnType<
                    typeof useHubById
                >);

                render(
                    <DestinationShipment />
                );

                expect(
                    screen.getByTestId(
                        "loading-spinner"
                    )
                ).toBeInTheDocument();
            }
        );

        it(
            "shows loading spinner while shipments are loading",
            () => {
                vi.mocked(
                    useDestinationShipments
                ).mockReturnValue({
                    data: undefined,
                    isLoading: true,
                    isFetching: true,
                    isError: false,
                } as ReturnType<
                    typeof useDestinationShipments
                >);

                render(
                    <DestinationShipment />
                );

                expect(
                    screen.getByTestId(
                        "loading-spinner"
                    )
                ).toBeInTheDocument();
            }
        );

        it(
            "disables pincode dropdown when hub is loading",
            () => {
                vi.mocked(
                    useHubById
                ).mockReturnValue({
                    data: undefined,
                    isLoading: true,
                    isError: false,
                } as ReturnType<
                    typeof useHubById
                >);

                render(
                    <DestinationShipment />
                );

                expect(
                    screen.getByTestId(
                        "pincode-dropdown"
                    )
                ).toBeDisabled();
            }
        );

        it(
            "disables pincode dropdown when hub request fails",
            () => {
                vi.mocked(
                    useHubById
                ).mockReturnValue({
                    data: undefined,
                    isLoading: false,
                    isError: true,
                } as ReturnType<
                    typeof useHubById
                >);

                render(
                    <DestinationShipment />
                );

                expect(
                    screen.getByTestId(
                        "pincode-dropdown"
                    )
                ).toBeDisabled();
            }
        );

        it(
            "shows hub error message through toast event",
            async () => {
                const dispatchSpy =
                    vi.spyOn(
                        window,
                        "dispatchEvent"
                    );

                vi.mocked(
                    useHubById
                ).mockReturnValue({
                    data: undefined,
                    isLoading: false,
                    isError: true,
                } as ReturnType<
                    typeof useHubById
                >);

                render(
                    <DestinationShipment />
                );

                await waitFor(
                    () => {
                        expect(
                            dispatchSpy
                        ).toHaveBeenCalledWith(
                            expect.objectContaining(
                                {
                                    type:
                                        "app-toast-notification",
                                }
                            )
                        );
                    }
                );

                expect(
                    dispatchSpy
                ).toHaveBeenCalledWith(
                    expect.objectContaining(
                        {
                            type:
                                "app-toast-notification",
                        }
                    )
                );
            }
        );

        it(
            "shows shipment error through toast event",
            async () => {
                const dispatchSpy =
                    vi.spyOn(
                        window,
                        "dispatchEvent"
                    );

                vi.mocked(
                    useDestinationShipments
                ).mockReturnValue({
                    data: undefined,
                    isLoading: false,
                    isFetching: false,
                    isError: true,
                } as ReturnType<
                    typeof useDestinationShipments
                >);

                render(
                    <DestinationShipment />
                );

                await waitFor(
                    () => {
                        expect(
                            dispatchSpy
                        ).toHaveBeenCalledWith(
                            expect.objectContaining(
                                {
                                    type:
                                        "app-toast-notification",
                                }
                            )
                        );
                    }
                );
            }
        );

        it(
            "selects a shipment",
            () => {
                render(
                    <DestinationShipment />
                );

                fireEvent.click(
                    screen.getByTestId(
                        "toggle-shipment-1"
                    )
                );

                expect(
                    screen.getByText(
                        "1 selected"
                    )
                ).toBeInTheDocument();
            }
        );

        it(
            "clears selected shipments",
            () => {
                render(
                    <DestinationShipment />
                );

                fireEvent.click(
                    screen.getByTestId(
                        "toggle-shipment-1"
                    )
                );

                expect(
                    screen.getByText(
                        "1 selected"
                    )
                ).toBeInTheDocument();

                fireEvent.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                "Clear Selection",
                        }
                    )
                );

                expect(
                    screen.queryByText(
                        "1 selected"
                    )
                ).not.toBeInTheDocument();
            }
        );

        it(
            "shows agents button when shipment is selected",
            () => {
                render(
                    <DestinationShipment />
                );

                fireEvent.click(
                    screen.getByTestId(
                        "toggle-shipment-1"
                    )
                );

                expect(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                "Show Agents",
                        }
                    )
                ).toBeInTheDocument();
            }
        );

        it(
            "clears selected shipments when pincode changes",
            () => {
                render(
                    <DestinationShipment />
                );

                fireEvent.click(
                    screen.getByTestId(
                        "toggle-shipment-1"
                    )
                );

                expect(
                    screen.getByText(
                        "1 selected"
                    )
                ).toBeInTheDocument();

                fireEvent.change(
                    screen.getByTestId(
                        "pincode-dropdown"
                    ),
                    {
                        target: {
                            value: "560093",
                        },
                    }
                );

                expect(
                    screen.queryByText(
                        "1 selected"
                    )
                ).not.toBeInTheDocument();
            }
        );

        it(
            "handles empty shipment response",
            () => {
                vi.mocked(useDestinationShipments).mockReturnValue({
                    data: {
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
                    },
                    isLoading: false,
                    isFetching: false,
                    isError: false,
                } as unknown as ReturnType<
                    typeof useDestinationShipments
                >);
                render(
                    <DestinationShipment />
                );

                expect(
                    screen.getByTestId(
                        "shipment-table"
                    )
                ).toBeInTheDocument();

                expect(
                    screen.getByText(
                        /Showing 0 of 0 shipments/i
                    )
                ).toBeInTheDocument();
            }
        );

        it(
            "dispatches loading status when loading",
            () => {
                const dispatchSpy =
                    vi.spyOn(
                        window,
                        "dispatchEvent"
                    );

                vi.mocked(
                    useHubById
                ).mockReturnValue({
                    data: undefined,
                    isLoading: true,
                    isError: false,
                } as ReturnType<
                    typeof useHubById
                >);

                render(
                    <DestinationShipment />
                );

                expect(
                    dispatchSpy
                ).toHaveBeenCalledWith(
                    expect.objectContaining(
                        {
                            type:
                                "widget-loading-status",
                        }
                    )
                );
            }
        );

        it(
            "dispatches loading false when data is loaded",
            () => {
                const dispatchSpy =
                    vi.spyOn(
                        window,
                        "dispatchEvent"
                    );

                render(
                    <DestinationShipment />
                );

                expect(
                    dispatchSpy
                ).toHaveBeenCalledWith(
                    expect.objectContaining(
                        {
                            type:
                                "widget-loading-status",
                        }
                    )
                );
            }
        );

        it(
            "handles show agents button click",
            () => {
                const consoleSpy =
                    vi.spyOn(
                        console,
                        "log"
                    ).mockImplementation(
                        () => undefined
                    );

                render(
                    <DestinationShipment />
                );

                fireEvent.click(
                    screen.getByTestId(
                        "toggle-shipment-1"
                    )
                );

                fireEvent.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                "Show Agents",
                        }
                    )
                );

                expect(
                    consoleSpy
                ).toHaveBeenCalledWith(
                    "Selected shipment IDs:",
                    ["shipment-1"]
                );

                consoleSpy.mockRestore();
            }
        );
    }
);

