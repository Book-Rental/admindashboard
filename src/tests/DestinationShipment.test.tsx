import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";

import DestinationShipment from "../pages/DestinationShipment";

import {
    useDestinationShipments,
    useHubById,
} from "../hooks/useDestinationShipment";

import type { DestinationShipment as DestinationShipmentType } from "../types/destinationShipment";

/* =========================================================
   MOCK HOOKS
========================================================= */

vi.mock("../hooks/useDestinationShipment", () => ({
    useDestinationShipments: vi.fn(),
    useHubById: vi.fn(),
}));

/* =========================================================
   MOCK UI LIBRARY
========================================================= */

vi.mock("@rentbook/rentbook-ui-lib", () => ({
    Rb_LoadingSpinner: () => (
        <div data-testid="loading-spinner">
            Loading...
        </div>
    ),

    Rb_Button: ({
        children,
        onClick,
        disabled,
    }: {
        children: React.ReactNode;
        onClick?: () => void;
        disabled?: boolean;
    }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    ),

    Dropdown: ({
        value,
        onChange,
        options,
        disabled,
        placeholder,
    }: {
        value: string;
        onChange: (value: string) => void;
        options: {
            label: string;
            value: string;
        }[];
        disabled?: boolean;
        placeholder?: string;
    }) => (
        <select
            data-testid="pincode-dropdown"
            value={value}
            disabled={disabled}
            onChange={(event) =>
                onChange(event.target.value)
            }
        >
            <option value="">
                {placeholder}
            </option>

            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                >
                    {option.label}
                </option>
            ))}
        </select>
    ),
}));

/* =========================================================
   MOCK DESTINATION SHIPMENT TABLE
========================================================= */

vi.mock(
    "../components/DestinationShipmentTable",
    () => ({
        default: ({
            shipments,
            selectedShipments,
            onToggleShipment,
            onToggleAll,
        }: {
            shipments: DestinationShipmentType[];
            selectedShipments: string[];
            onToggleShipment: (
                shipmentId: string
            ) => void;
            onToggleAll: () => void;
        }) => (
            <div data-testid="shipment-table">
                <button
                    type="button"
                    data-testid="toggle-all"
                    onClick={onToggleAll}
                >
                    Toggle All
                </button>

                {shipments.map((shipment) => (
                    <button
                        type="button"
                        key={shipment.shipmentId}
                        data-testid={`shipment-${shipment.shipmentId}`}
                        onClick={() =>
                            onToggleShipment(
                                shipment.shipmentId
                            )
                        }
                    >
                        {shipment.shipmentId}
                    </button>
                ))}

                <div data-testid="selected-count">
                    {selectedShipments.length}
                </div>
            </div>
        ),
    })
);

/* =========================================================
   MOCKED HOOK REFERENCES
========================================================= */

const mockedUseHubById =
    vi.mocked(useHubById);

const mockedUseDestinationShipments =
    vi.mocked(useDestinationShipments);

/* =========================================================
   MOCK API DATA
========================================================= */

const mockHubData = {
    status: 200,
    message: "Hub details fetched successfully",
    data: {
        serviceablePincodes: [
            "500001",
            "500002",
            "500003",
        ],
    },
};

const mockShipments: DestinationShipmentType[] =
    [
        {
            shipmentId: "shipment-1",
        } as DestinationShipmentType,

        {
            shipmentId: "shipment-2",
        } as DestinationShipmentType,

        {
            shipmentId: "shipment-3",
        } as DestinationShipmentType,
    ];

const mockShipmentData = {
    status: 200,
    message: "Shipments fetched successfully",
    data: {
        shipments: mockShipments,
        meta: {
            totalRecords: 10,
        },
    },
};

/* =========================================================
   QUERY RESULT HELPERS

   `unknown` is intentional here because we are mocking
   TanStack Query's UseQueryResult instead of executing
   the actual query.
========================================================= */

const createHubQueryResult = (
    overrides: Record<string, unknown> = {}
) =>
    ({
        data: mockHubData,
        error: null,

        isError: false,
        isPending: false,
        isLoading: false,
        isSuccess: true,

        isFetching: false,
        isRefetching: false,

        ...overrides,
    } as unknown) as ReturnType<
        typeof useHubById
    >;

const createShipmentQueryResult = (
    overrides: Record<string, unknown> = {}
) =>
    ({
        data: mockShipmentData,
        error: null,

        isError: false,
        isPending: false,
        isLoading: false,
        isSuccess: true,

        isFetching: false,
        isRefetching: false,

        ...overrides,
    } as unknown) as ReturnType<
        typeof useDestinationShipments
    >;

/* =========================================================
   DEFAULT MOCKS
========================================================= */

const setupDefaultMocks = () => {
    mockedUseHubById.mockReturnValue(
        createHubQueryResult()
    );

    mockedUseDestinationShipments.mockReturnValue(
        createShipmentQueryResult()
    );
};

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(
        window,
        "HOST_USER_INFO",
        {
            writable: true,
            configurable: true,
            value: {
                referenceId: "hub-123",
            },
        }
    );

    setupDefaultMocks();
});

/* =========================================================
   TESTS
========================================================= */

describe("DestinationShipment", () => {
    /* =======================================================
       BASIC RENDER
    ======================================================= */

    it("renders shipment list heading", () => {
        render(<DestinationShipment />);

        expect(
            screen.getByRole("heading", {
                name: "Shipment List",
            })
        ).toBeInTheDocument();
    });

    /* =======================================================
       HUB ID
    ======================================================= */

    it("passes hub id to useHubById", () => {
        render(<DestinationShipment />);

        expect(
            mockedUseHubById
        ).toHaveBeenCalledWith("hub-123");
    });

    it("passes hub id and undefined pincode initially", () => {
        render(<DestinationShipment />);

        expect(
            mockedUseDestinationShipments
        ).toHaveBeenCalledWith(
            "hub-123",
            undefined
        );
    });

    /* =======================================================
       PINCODE DROPDOWN
    ======================================================= */

    it("renders serviceable pincodes", () => {
        render(<DestinationShipment />);

        expect(
            screen.getByRole("option", {
                name: "500001",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("option", {
                name: "500002",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("option", {
                name: "500003",
            })
        ).toBeInTheDocument();
    });

    it("renders All Pincodes option", () => {
        render(<DestinationShipment />);

        expect(
            screen.getByRole("option", {
                name: "All Pincodes",
            })
        ).toBeInTheDocument();
    });

    it("changes selected pincode", async () => {
        render(<DestinationShipment />);

        fireEvent.change(
            screen.getByTestId(
                "pincode-dropdown"
            ),
            {
                target: {
                    value: "500001",
                },
            }
        );

        await waitFor(() => {
            expect(
                mockedUseDestinationShipments
            ).toHaveBeenLastCalledWith(
                "hub-123",
                "500001"
            );
        });
    });

    it("passes undefined when All Pincodes is selected", async () => {
        render(<DestinationShipment />);

        const dropdown =
            screen.getByTestId(
                "pincode-dropdown"
            );

        fireEvent.change(dropdown, {
            target: {
                value: "500001",
            },
        });

        fireEvent.change(dropdown, {
            target: {
                value: "",
            },
        });

        await waitFor(() => {
            expect(
                mockedUseDestinationShipments
            ).toHaveBeenLastCalledWith(
                "hub-123",
                undefined
            );
        });
    });

    /* =======================================================
       HUB LOADING
    ======================================================= */

    it("shows loading spinner when hub is loading", () => {
        mockedUseHubById.mockReturnValue(
            createHubQueryResult({
                data: undefined,
                isLoading: true,
                isPending: true,
                isSuccess: false,
                status: "pending",
            })
        );

        render(<DestinationShipment />);

        expect(
            screen.getByTestId(
                "loading-spinner"
            )
        ).toBeInTheDocument();
    });

    it("disables pincode dropdown when hub is loading", () => {
        mockedUseHubById.mockReturnValue(
            createHubQueryResult({
                data: undefined,
                isLoading: true,
                isPending: true,
                isSuccess: false,
                status: "pending",
            })
        );

        render(<DestinationShipment />);

        expect(
            screen.getByTestId(
                "pincode-dropdown"
            )
        ).toBeDisabled();
    });

    /* =======================================================
       HUB ERROR
    ======================================================= */

    it("disables pincode dropdown when hub has an error", () => {
        mockedUseHubById.mockReturnValue(
            createHubQueryResult({
                data: undefined,
                error: new Error(
                    "Failed to load hub"
                ),
                isError: true,
                isSuccess: false,
                status: "error",
            })
        );

        render(<DestinationShipment />);

        expect(
            screen.getByTestId(
                "pincode-dropdown"
            )
        ).toBeDisabled();
    });

    it("dispatches hub error toast", async () => {
        const dispatchSpy = vi.spyOn(
            window,
            "dispatchEvent"
        );

        mockedUseHubById.mockReturnValue(
            createHubQueryResult({
                data: undefined,
                error: new Error(
                    "Failed to load hub"
                ),
                isError: true,
                isSuccess: false,
                status: "error",
            })
        );

        render(<DestinationShipment />);

        await waitFor(() => {
            expect(
                dispatchSpy
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    type:
                        "app-toast-notification",
                })
            );
        });

        const event =
            dispatchSpy.mock.calls.find(
                ([event]) =>
                    event instanceof
                    CustomEvent &&
                    event.type ===
                    "app-toast-notification"
            )?.[0] as
            | CustomEvent
            | undefined;

        expect(event?.detail).toEqual({
            message:
                "Failed to load hub details",
            type: "error",
        });

        dispatchSpy.mockRestore();
    });

    /* =======================================================
       SHIPMENT LOADING
    ======================================================= */

    it("shows loading spinner when shipments are loading", () => {
        mockedUseDestinationShipments.mockReturnValue(
            createShipmentQueryResult({
                data: undefined,
                isLoading: true,
                isPending: true,
                isSuccess: false,
                status: "pending",
            })
        );

        render(<DestinationShipment />);

        expect(
            screen.getByTestId(
                "loading-spinner"
            )
        ).toBeInTheDocument();
    });

    /* =======================================================
       SHIPMENT FETCHING
    ======================================================= */

    it("does not show loading spinner when shipments are only fetching", () => {
        mockedUseDestinationShipments.mockReturnValue(
            createShipmentQueryResult({
                isLoading: false,
                isFetching: true,
                isRefetching: true,
            })
        );

        render(<DestinationShipment />);

        expect(
            screen.queryByTestId(
                "loading-spinner"
            )
        ).not.toBeInTheDocument();

        expect(
            screen.getByTestId(
                "shipment-table"
            )
        ).toBeInTheDocument();
    });

    /* =======================================================
       WIDGET LOADING EVENT
    ======================================================= */

    it("dispatches true loading status when hub is loading", async () => {
        const dispatchSpy = vi.spyOn(
            window,
            "dispatchEvent"
        );

        mockedUseHubById.mockReturnValue(
            createHubQueryResult({
                data: undefined,
                isLoading: true,
                isPending: true,
                isSuccess: false,
                status: "pending",
            })
        );

        render(<DestinationShipment />);

        await waitFor(() => {
            const events =
                dispatchSpy.mock.calls.filter(
                    ([event]) =>
                        event instanceof
                        CustomEvent &&
                        event.type ===
                        "widget-loading-status"
                );

            expect(events.length).toBeGreaterThan(
                0
            );

            const lastEvent =
                events[
                events.length - 1
                ][0] as CustomEvent;

            expect(lastEvent.detail).toBe(true);
        });

        dispatchSpy.mockRestore();
    });

    it("dispatches true loading status when shipments are loading", async () => {
        const dispatchSpy = vi.spyOn(
            window,
            "dispatchEvent"
        );

        mockedUseDestinationShipments.mockReturnValue(
            createShipmentQueryResult({
                data: undefined,
                isLoading: true,
                isPending: true,
                isSuccess: false,
                status: "pending",
            })
        );

        render(<DestinationShipment />);

        await waitFor(() => {
            const events =
                dispatchSpy.mock.calls.filter(
                    ([event]) =>
                        event instanceof
                        CustomEvent &&
                        event.type ===
                        "widget-loading-status"
                );

            expect(events.length).toBeGreaterThan(
                0
            );

            const lastEvent =
                events[
                events.length - 1
                ][0] as CustomEvent;

            expect(lastEvent.detail).toBe(true);
        });

        dispatchSpy.mockRestore();
    });

    it("dispatches true loading status when shipments are fetching", async () => {
        const dispatchSpy = vi.spyOn(
            window,
            "dispatchEvent"
        );

        mockedUseDestinationShipments.mockReturnValue(
            createShipmentQueryResult({
                isLoading: false,
                isFetching: true,
                isRefetching: true,
            })
        );

        render(<DestinationShipment />);

        await waitFor(() => {
            const events =
                dispatchSpy.mock.calls.filter(
                    ([event]) =>
                        event instanceof
                        CustomEvent &&
                        event.type ===
                        "widget-loading-status"
                );

            expect(events.length).toBeGreaterThan(
                0
            );

            const lastEvent =
                events[
                events.length - 1
                ][0] as CustomEvent;

            expect(lastEvent.detail).toBe(true);
        });

        dispatchSpy.mockRestore();
    });

    it("dispatches false loading status when nothing is loading", async () => {
        const dispatchSpy = vi.spyOn(
            window,
            "dispatchEvent"
        );

        render(<DestinationShipment />);

        await waitFor(() => {
            const events =
                dispatchSpy.mock.calls.filter(
                    ([event]) =>
                        event instanceof
                        CustomEvent &&
                        event.type ===
                        "widget-loading-status"
                );

            expect(events.length).toBeGreaterThan(
                0
            );

            const lastEvent =
                events[
                events.length - 1
                ][0] as CustomEvent;

            expect(lastEvent.detail).toBe(false);
        });

        dispatchSpy.mockRestore();
    });

    /* =======================================================
       SHIPMENT ERROR
    ======================================================= */

    it("dispatches shipment error toast", async () => {
        const dispatchSpy = vi.spyOn(
            window,
            "dispatchEvent"
        );

        mockedUseDestinationShipments.mockReturnValue(
            createShipmentQueryResult({
                data: undefined,
                error: new Error(
                    "Failed to load shipments"
                ),
                isError: true,
                isSuccess: false,
                status: "error",
            })
        );

        render(<DestinationShipment />);

        await waitFor(() => {
            const event =
                dispatchSpy.mock.calls.find(
                    ([event]) =>
                        event instanceof
                        CustomEvent &&
                        event.type ===
                        "app-toast-notification"
                )?.[0] as
                | CustomEvent
                | undefined;

            expect(event?.detail).toEqual({
                message:
                    "Failed to load shipments",
                type: "error",
            });
        });

        dispatchSpy.mockRestore();
    });

    it("shows shipment error message", () => {
        mockedUseDestinationShipments.mockReturnValue(
            createShipmentQueryResult({
                data: undefined,
                error: new Error(
                    "Failed to load shipments"
                ),
                isError: true,
                isSuccess: false,
                status: "error",
            })
        );

        render(<DestinationShipment />);

        expect(
            screen.getByText(
                "Failed to load shipments."
            )
        ).toBeInTheDocument();
    });

    /* =======================================================
       EMPTY HUB PINCODES
    ======================================================= */

    it("handles empty hub pincodes", () => {
        mockedUseHubById.mockReturnValue(
            createHubQueryResult({
                data: {
                    status: 200,
                    message:
                        "Hub details fetched successfully",
                    data: {
                        serviceablePincodes: [],
                    },
                },
            })
        );

        render(<DestinationShipment />);

        expect(
            screen.getByRole("option", {
                name: "All Pincodes",
            })
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("option", {
                name: "500001",
            })
        ).not.toBeInTheDocument();
    });

    it("handles missing hub data", () => {
        mockedUseHubById.mockReturnValue(
            createHubQueryResult({
                data: undefined,
            })
        );

        render(<DestinationShipment />);

        expect(
            screen.getByRole("option", {
                name: "All Pincodes",
            })
        ).toBeInTheDocument();
    });

    /* =======================================================
       EMPTY SHIPMENTS
    ======================================================= */

    it("handles empty shipments", () => {
        mockedUseDestinationShipments.mockReturnValue(
            createShipmentQueryResult({
                data: {
                    status: 200,
                    message:
                        "Shipments fetched successfully",
                    data: {
                        shipments: [],
                        meta: {
                            totalRecords: 0,
                        },
                    },
                },
            })
        );

        render(<DestinationShipment />);

        expect(
            screen.getByTestId(
                "shipment-table"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Showing 0 of 0 shipments"
            )
        ).toBeInTheDocument();
    });

    /* =======================================================
       TOTAL COUNT
    ======================================================= */

    it("shows total shipment count", () => {
        render(<DestinationShipment />);

        expect(
            screen.getByText(
                "Showing 3 of 10 shipments"
            )
        ).toBeInTheDocument();
    });

    it("defaults total records to zero when meta is missing", () => {
        mockedUseDestinationShipments.mockReturnValue(
            createShipmentQueryResult({
                data: {
                    status: 200,
                    message:
                        "Shipments fetched successfully",
                    data: {
                        shipments: mockShipments,
                    },
                },
            })
        );

        render(<DestinationShipment />);

        expect(
            screen.getByText(
                "Showing 3 of 0 shipments"
            )
        ).toBeInTheDocument();
    });

    it("defaults shipments to empty array when data is missing", () => {
        mockedUseDestinationShipments.mockReturnValue(
            createShipmentQueryResult({
                data: undefined,
            })
        );

        render(<DestinationShipment />);

        expect(
            screen.getByText(
                "Showing 0 of 0 shipments"
            )
        ).toBeInTheDocument();
    });

    /* =======================================================
       SINGLE SHIPMENT SELECTION
    ======================================================= */

    it("selects a shipment", () => {
        render(<DestinationShipment />);

        fireEvent.click(
            screen.getByTestId(
                "shipment-shipment-1"
            )
        );

        expect(
            screen.getByTestId(
                "selected-count"
            )
        ).toHaveTextContent("1");

        expect(
            screen.getByText("1 selected")
        ).toBeInTheDocument();
    });

    it("deselects an already selected shipment", () => {
        render(<DestinationShipment />);

        const shipment =
            screen.getByTestId(
                "shipment-shipment-1"
            );

        fireEvent.click(shipment);

        expect(
            screen.getByTestId(
                "selected-count"
            )
        ).toHaveTextContent("1");

        fireEvent.click(shipment);

        expect(
            screen.getByTestId(
                "selected-count"
            )
        ).toHaveTextContent("0");
    });

    /* =======================================================
       SELECT ALL
    ======================================================= */

    it("selects all shipments", () => {
        render(<DestinationShipment />);

        fireEvent.click(
            screen.getByTestId("toggle-all")
        );

        expect(
            screen.getByTestId(
                "selected-count"
            )
        ).toHaveTextContent("3");

        expect(
            screen.getByText("3 selected")
        ).toBeInTheDocument();
    });

    it("clears all shipments when toggle all is clicked again", () => {
        render(<DestinationShipment />);

        const toggleAll =
            screen.getByTestId("toggle-all");

        fireEvent.click(toggleAll);

        expect(
            screen.getByTestId(
                "selected-count"
            )
        ).toHaveTextContent("3");

        fireEvent.click(toggleAll);

        expect(
            screen.getByTestId(
                "selected-count"
            )
        ).toHaveTextContent("0");
    });

    it("selects missing shipments when some are already selected", () => {
        render(<DestinationShipment />);

        fireEvent.click(
            screen.getByTestId(
                "shipment-shipment-1"
            )
        );

        expect(
            screen.getByTestId(
                "selected-count"
            )
        ).toHaveTextContent("1");

        fireEvent.click(
            screen.getByTestId("toggle-all")
        );

        expect(
            screen.getByTestId(
                "selected-count"
            )
        ).toHaveTextContent("3");
    });

    /* =======================================================
       CLEAR SELECTION
    ======================================================= */

    it("shows Clear Selection button after selecting shipment", () => {
        render(<DestinationShipment />);

        fireEvent.click(
            screen.getByTestId(
                "shipment-shipment-1"
            )
        );

        expect(
            screen.getByRole("button", {
                name: "Clear Selection",
            })
        ).toBeInTheDocument();
    });

    it("clears selected shipments", () => {
        render(<DestinationShipment />);

        fireEvent.click(
            screen.getByTestId(
                "shipment-shipment-1"
            )
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Clear Selection",
            })
        );

        expect(
            screen.getByTestId(
                "selected-count"
            )
        ).toHaveTextContent("0");

        expect(
            screen.queryByText("1 selected")
        ).not.toBeInTheDocument();
    });

    /* =======================================================
       SHOW AGENTS
    ======================================================= */

    it("shows Show Agents button when shipment is selected", () => {
        render(<DestinationShipment />);

        fireEvent.click(
            screen.getByTestId(
                "shipment-shipment-1"
            )
        );

        expect(
            screen.getByRole("button", {
                name: "Show Agents",
            })
        ).toBeInTheDocument();
    });

    it("logs selected shipment ids when Show Agents is clicked", () => {
        const consoleSpy = vi
            .spyOn(console, "log")
            .mockImplementation(() => { });

        render(<DestinationShipment />);

        fireEvent.click(
            screen.getByTestId(
                "shipment-shipment-1"
            )
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Show Agents",
            })
        );

        expect(
            consoleSpy
        ).toHaveBeenCalledWith(
            "Selected shipment IDs:",
            ["shipment-1"]
        );

        consoleSpy.mockRestore();
    });

    /* =======================================================
       PINCODE CHANGE CLEARS SELECTION
    ======================================================= */

    it("clears selected shipments when pincode changes", async () => {
        render(<DestinationShipment />);

        fireEvent.click(
            screen.getByTestId(
                "shipment-shipment-1"
            )
        );

        expect(
            screen.getByTestId(
                "selected-count"
            )
        ).toHaveTextContent("1");

        fireEvent.change(
            screen.getByTestId(
                "pincode-dropdown"
            ),
            {
                target: {
                    value: "500001",
                },
            }
        );

        await waitFor(() => {
            expect(
                screen.getByTestId(
                    "selected-count"
                )
            ).toHaveTextContent("0");
        });
    });

    /* =======================================================
       TABLE
    ======================================================= */

    it("renders shipment table", () => {
        render(<DestinationShipment />);

        expect(
            screen.getByTestId(
                "shipment-table"
            )
        ).toBeInTheDocument();
    });

    it("renders all shipments", () => {
        render(<DestinationShipment />);

        expect(
            screen.getByTestId(
                "shipment-shipment-1"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByTestId(
                "shipment-shipment-2"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByTestId(
                "shipment-shipment-3"
            )
        ).toBeInTheDocument();
    });
});