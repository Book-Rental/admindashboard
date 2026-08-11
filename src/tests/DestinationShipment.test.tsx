import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import type { Agent } from "../types/agent";

import DestinationShipment from "../pages/DestinationShipment";

import {
  useDestinationShipments,
  useHubById,
} from "../hooks/useDestinationShipment";

import { getAgents } from "../api/agentApi";

import { assignAgentToShipments } from "../api/shipmentApi";

import type {
  DestinationShipment as DestinationShipmentType,
} from "../types/destinationShipment";

/* =========================================================
   MOCK HOOKS
========================================================= */

vi.mock("../hooks/useDestinationShipment", () => ({
  useDestinationShipments: vi.fn(),
  useHubById: vi.fn(),
}));

/* =========================================================
   MOCK AGENT API
========================================================= */

vi.mock("../api/agentApi", () => ({
  getAgents: vi.fn(),
}));

/* =========================================================
   MOCK SHIPMENT API
========================================================= */

vi.mock("../api/shipmentApi", () => ({
  assignAgentToShipments: vi.fn(),
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
  }) => {
    const testId =
      placeholder === "Select Pincode"
        ? "pincode-dropdown"
        : placeholder === "Select Status"
          ? "status-dropdown"
          : "agent-dropdown";

    return (
      <select
        data-testid={testId}
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
    );
  },

  Pagination: ({
    currentPage,
    totalPages,
    disabled,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    siblingCount?: number;
    disabled?: boolean;
    onPageChange: (page: number) => void;
  }) => (
    <div data-testid="pagination">
      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          onPageChange(currentPage + 1)
        }
      >
        Next
      </button>

      <span>
        {currentPage} / {totalPages}
      </span>
    </div>
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
   MOCK AGENTS MODAL
========================================================= */

vi.mock(
  "../components/AgentsModal",
  () => ({
    default: ({
      isOpen,
      agents,
      analytics,
      isLoading,
      selectedAgentId,
      selectedShipmentCount,
      isAssigningAgent,
      onSelectAgent,
      onAssignAgent,
      onClose,
    }: {
      isOpen: boolean;
      agents: Agent[];
      analytics: unknown;
      isLoading: boolean;
      selectedAgentId: string | null;
      selectedShipmentCount: number;
      isAssigningAgent: boolean;
      onSelectAgent: (
        agentId: string
      ) => void;
      onAssignAgent: () => void;
      onClose: () => void;
    }) => {
      if (!isOpen) {
        return null;
      }

      return (
        <div data-testid="agents-modal">
          <div>Agents Modal</div>

          <div data-testid="modal-agent-count">
            {agents.length}
          </div>

          <div data-testid="modal-selected-count">
            {selectedShipmentCount}
          </div>

          <div data-testid="modal-loading">
            {isLoading
              ? "Loading"
              : "Loaded"}
          </div>

          <div data-testid="modal-selected-agent">
            {selectedAgentId ?? ""}
          </div>

          <div data-testid="modal-analytics">
            {analytics
              ? "Analytics Available"
              : "No Analytics"}
          </div>

          {agents.map((agent) => (
            <button
              type="button"
              key={agent.agentId}
              data-testid={`agent-${agent.agentId}`}
              onClick={() =>
                onSelectAgent(
                  agent.agentId
                )
              }
            >
              {agent.fullName}
            </button>
          ))}

          <button
            type="button"
            onClick={onAssignAgent}
            disabled={isAssigningAgent}
          >
            Assign Agent
          </button>

          <button
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      );
    },
  })
);

/* =========================================================
   MOCKED HOOK REFERENCES
========================================================= */

const mockedUseHubById =
  vi.mocked(useHubById);

const mockedUseDestinationShipments =
  vi.mocked(useDestinationShipments);

const mockedGetAgents =
  vi.mocked(getAgents);

const mockedAssignAgentToShipments =
  vi.mocked(assignAgentToShipments);

/* =========================================================
   MOCK HUB DATA
========================================================= */

const mockHubData = {
  status: 200,
  message:
    "Hub details fetched successfully",

  data: {
    serviceablePincodes: [
      "500001",
      "500002",
      "500003",
    ],
  },
};

/* =========================================================
   MOCK SHIPMENT DATA
========================================================= */

const mockShipments: DestinationShipmentType[] = [
  {
    shipmentId: "shipment-1",
    currentStatus:
      "Arrived At Destination Hub",
    assignedAgent: null,
  } as DestinationShipmentType,

  {
    shipmentId: "shipment-2",
    currentStatus:
      "Arrived At Destination Hub",
    assignedAgent: null,
  } as DestinationShipmentType,

  {
    shipmentId: "shipment-3",
    currentStatus:
      "Arrived At Destination Hub",
    assignedAgent: null,
  } as DestinationShipmentType,
];

const mockShipmentData = {
  status: 200,
  message:
    "Shipments fetched successfully",

  data: {
    shipments: mockShipments,

    meta: {
      totalRecords: 10,
      totalPages: 1,
      currentPage: 1,
      limit: 10,
      hasMore: false,
    },
  },
};

/* =========================================================
   MOCK AGENT DATA
========================================================= */

const mockAgent: Agent = {
  agentId: "agent-1",
  fullName: "John Doe",
  email: "johndoe@gmail.com",
  phoneNumber: "9876543210",

  status: "Active",
  isAvailable: true,

  vehicle: {
    type: "Bike",
    number: "KA01AB1234",
  },

  currentLocation: {
    type: "Point",
    coordinates: [77.5946, 12.9716],
    updatedAt:
      "2026-08-11T10:00:00.000Z",
  },

  currentShipmentId: null,
  photo: null,

  joinedOn:
    "2026-01-15T10:00:00.000Z",
};

const mockAgent2: Agent = {
  agentId: "agent-2",
  fullName: "Jane Doe",
  email: "janedoe@gmail.com",
  phoneNumber: "9876543211",

  status: "Active",
  isAvailable: true,

  vehicle: {
    type: "Scooter",
    number: "KA02CD5678",
  },

  currentLocation: {
    type: "Point",
    coordinates: [77.6245, 12.9352],
    updatedAt:
      "2026-08-11T10:00:00.000Z",
  },

  currentShipmentId: null,
  photo: null,

  joinedOn:
    "2026-02-10T10:00:00.000Z",
};

const mockAgents: Agent[] = [
  mockAgent,
  mockAgent2,
];

/* =========================================================
   MOCK AGENT RESPONSE
========================================================= */

const mockAgentResponse = {
  status: "200",
  message:
    "Agents fetched successfully",

  data: {
    agents: mockAgents,

    analytics: {
      totalAgents: 2,
      activeAgents: 2,
      inactiveAgents: 0,
      offDutyAgents: 0,
    },

    meta: {
      totalRecords: 2,
      totalPages: 1,
      currentPage: 1,
      limit: 100,
      hasMore: false,
    },
  },
};

/* =========================================================
   QUERY RESULT HELPERS
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

  mockedGetAgents.mockResolvedValue(
    mockAgentResponse as Awaited<
      ReturnType<typeof getAgents>
    >
  );

  mockedAssignAgentToShipments.mockResolvedValue(
    {} as Awaited<
      ReturnType<
        typeof assignAgentToShipments
      >
    >
  );
};

/* =========================================================
   TOAST HELPER
========================================================= */
const getToastEvents = (
    dispatchSpy: ReturnType<typeof vi.spyOn>,
    message?: string
) =>
    dispatchSpy.mock.calls.filter(
        ([event]: [Event]) =>
            event instanceof CustomEvent &&
            event.type === "app-toast-notification" &&
            (message === undefined ||
                event.detail?.message === message)
    );
/* =========================================================
   HELPER
========================================================= */

const selectShipmentAndOpenAgents = async () => {
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

  await waitFor(() => {
    expect(
      screen.getByTestId("agents-modal")
    ).toBeInTheDocument();
  });
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
        userId: "user-123",
      },
    }
  );

  setupDefaultMocks();
});

/* =========================================================
   TESTS
========================================================= */

describe(
  "DestinationShipment",
  () => {
    /* =====================================================
       BASIC RENDER
    ===================================================== */

    it(
      "renders shipment list heading",
      () => {
        render(
          <DestinationShipment />
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name: "Shipment List",
            }
          )
        ).toBeInTheDocument();
      }
    );

    /* =====================================================
       HUB ID
    ===================================================== */

    it(
      "passes hub id to useHubById",
      () => {
        render(
          <DestinationShipment />
        );

        expect(
          mockedUseHubById
        ).toHaveBeenCalledWith(
          "hub-123"
        );
      }
    );

    it(
      "passes hub id and default shipment filters",
      () => {
        render(
          <DestinationShipment />
        );

        expect(
          mockedUseDestinationShipments
        ).toHaveBeenCalledWith(
          "hub-123",
          {
            pincode: undefined,
            status: undefined,
            agentId: undefined,
            page: 1,
            limit: 10,
          }
        );
      }
    );

    it(
      "handles missing hub id",
      () => {
        Object.defineProperty(
          window,
          "HOST_USER_INFO",
          {
            writable: true,
            configurable: true,
            value: {
              userId: "user-123",
            },
          }
        );

        render(
          <DestinationShipment />
        );

        expect(
          mockedUseHubById
        ).toHaveBeenCalledWith("");

        expect(
          mockedUseDestinationShipments
        ).toHaveBeenCalledWith(
          "",
          {
            pincode: undefined,
            status: undefined,
            agentId: undefined,
            page: 1,
            limit: 10,
          }
        );
      }
    );

    /* =====================================================
       PINCODE DROPDOWN
    ===================================================== */

    it(
      "renders serviceable pincodes",
      () => {
        render(
          <DestinationShipment />
        );

        expect(
          screen.getByRole(
            "option",
            {
              name: "500001",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "option",
            {
              name: "500002",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "option",
            {
              name: "500003",
            }
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "renders All Pincodes option",
      () => {
        render(
          <DestinationShipment />
        );

        expect(
          screen.getByRole(
            "option",
            {
              name: "All Pincodes",
            }
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "changes selected pincode",
      async () => {
        render(
          <DestinationShipment />
        );

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
            {
              pincode: "500001",
              status: undefined,
              agentId: undefined,
              page: 1,
              limit: 10,
            }
          );
        });
      }
    );

    it(
      "passes undefined when All Pincodes is selected",
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
              value: "500001",
            },
          }
        );

        fireEvent.change(
          dropdown,
          {
            target: {
              value: "",
            },
          }
        );

        await waitFor(() => {
          expect(
            mockedUseDestinationShipments
          ).toHaveBeenLastCalledWith(
            "hub-123",
            {
              pincode: undefined,
              status: undefined,
              agentId: undefined,
              page: 1,
              limit: 10,
            }
          );
        });
      }
    );

    /* =====================================================
       STATUS FILTER
    ===================================================== */

    it(
      "changes selected status",
      async () => {
        render(
          <DestinationShipment />
        );

        fireEvent.change(
          screen.getByTestId(
            "status-dropdown"
          ),
          {
            target: {
              value:
                "Out For Delivery",
            },
          }
        );

        await waitFor(() => {
          expect(
            mockedUseDestinationShipments
          ).toHaveBeenLastCalledWith(
            "hub-123",
            {
              pincode: undefined,
              status:
                "Out For Delivery",
              agentId: undefined,
              page: 1,
              limit: 10,
            }
          );
        });
      }
    );

    /* =====================================================
       AGENT FILTER
    ===================================================== */

    it(
      "renders agents in agent filter",
      async () => {
        render(
          <DestinationShipment />
        );

        await waitFor(() => {
          expect(
            screen.getByRole(
              "option",
              {
                name: "John Doe",
              }
            )
          ).toBeInTheDocument();
        });

        expect(
          screen.getByRole(
            "option",
            {
              name: "Jane Doe",
            }
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "changes selected agent filter",
      async () => {
        render(
          <DestinationShipment />
        );

        await waitFor(() => {
          expect(
            screen.getByRole(
              "option",
              {
                name: "John Doe",
              }
            )
          ).toBeInTheDocument();
        });

        fireEvent.change(
          screen.getByTestId(
            "agent-dropdown"
          ),
          {
            target: {
              value: "agent-1",
            },
          }
        );

        await waitFor(() => {
          expect(
            mockedUseDestinationShipments
          ).toHaveBeenLastCalledWith(
            "hub-123",
            {
              pincode: undefined,
              status: undefined,
              agentId: "agent-1",
              page: 1,
              limit: 10,
            }
          );
        });
      }
    );

    /* =====================================================
       INITIAL AGENT FETCH ERROR
    ===================================================== */

    it(
      "handles initial agent fetch error",
      async () => {
        mockedGetAgents.mockRejectedValueOnce(
          new Error(
            "Failed to fetch agents"
          )
        );

        render(
          <DestinationShipment />
        );

        await waitFor(() => {
          expect(
            mockedGetAgents
          ).toHaveBeenCalledWith(
            "hub-123",
            1,
            100
          );
        });

        expect(
          screen.getByTestId(
            "agent-dropdown"
          )
        ).toBeInTheDocument();

        expect(
          screen.queryByRole(
            "option",
            {
              name: "John Doe",
            }
          )
        ).not.toBeInTheDocument();
      }
    );

    /* =====================================================
       HUB LOADING
    ===================================================== */

    it(
      "shows loading spinner when hub is loading",
      () => {
        mockedUseHubById.mockReturnValue(
          createHubQueryResult({
            data: undefined,
            isLoading: true,
            isPending: true,
            isSuccess: false,
            status: "pending",
          })
        );

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
        mockedUseHubById.mockReturnValue(
          createHubQueryResult({
            data: undefined,
            isLoading: true,
            isPending: true,
            isSuccess: false,
            status: "pending",
          })
        );

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

    /* =====================================================
       HUB ERROR
    ===================================================== */

    it(
      "disables pincode dropdown when hub has an error",
      () => {
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
      "dispatches hub error toast",
      async () => {
        const dispatchSpy =
          vi.spyOn(
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

        render(
          <DestinationShipment />
        );

        await waitFor(() => {
          expect(
            getToastEvents(
              dispatchSpy,
              "Failed to load hub details"
            ).length
          ).toBeGreaterThan(0);
        });

        const event =
          getToastEvents(
            dispatchSpy,
            "Failed to load hub details"
          )[0]?.[0] as
            | CustomEvent
            | undefined;

        expect(
          event?.detail
        ).toEqual({
          message:
            "Failed to load hub details",
          type: "error",
        });

        dispatchSpy.mockRestore();
      }
    );

    /* =====================================================
       SHIPMENT LOADING
    ===================================================== */

    it(
      "shows loading spinner when shipments are loading",
      () => {
        mockedUseDestinationShipments.mockReturnValue(
          createShipmentQueryResult({
            data: undefined,
            isLoading: true,
            isPending: true,
            isSuccess: false,
            status: "pending",
          })
        );

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

    /* =====================================================
       SHIPMENT FETCHING
    ===================================================== */

    it(
      "does not show loading spinner when shipments are only fetching",
      () => {
        mockedUseDestinationShipments.mockReturnValue(
          createShipmentQueryResult({
            isLoading: false,
            isFetching: true,
            isRefetching: true,
          })
        );

        render(
          <DestinationShipment />
        );

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
      }
    );

    /* =====================================================
       WIDGET LOADING EVENT
    ===================================================== */

    it(
      "dispatches true loading status when hub is loading",
      async () => {
        const dispatchSpy =
          vi.spyOn(
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

        render(
          <DestinationShipment />
        );

        await waitFor(() => {
          const events =
            dispatchSpy.mock.calls.filter(
              ([event]) =>
                event instanceof
                  CustomEvent &&
                event.type ===
                  "widget-loading-status"
            );

          expect(
            events.length
          ).toBeGreaterThan(0);

          const lastEvent =
            events[
              events.length - 1
            ][0] as CustomEvent;

          expect(
            lastEvent.detail
          ).toBe(true);
        });

        dispatchSpy.mockRestore();
      }
    );

    it(
      "dispatches true loading status when shipments are loading",
      async () => {
        const dispatchSpy =
          vi.spyOn(
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

        render(
          <DestinationShipment />
        );

        await waitFor(() => {
          const events =
            dispatchSpy.mock.calls.filter(
              ([event]) =>
                event instanceof
                  CustomEvent &&
                event.type ===
                  "widget-loading-status"
            );

          expect(
            events.length
          ).toBeGreaterThan(0);

          const lastEvent =
            events[
              events.length - 1
            ][0] as CustomEvent;

          expect(
            lastEvent.detail
          ).toBe(true);
        });

        dispatchSpy.mockRestore();
      }
    );

    it(
      "dispatches true loading status when shipments are fetching",
      async () => {
        const dispatchSpy =
          vi.spyOn(
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

        render(
          <DestinationShipment />
        );

        await waitFor(() => {
          const events =
            dispatchSpy.mock.calls.filter(
              ([event]) =>
                event instanceof
                  CustomEvent &&
                event.type ===
                  "widget-loading-status"
            );

          expect(
            events.length
          ).toBeGreaterThan(0);

          const lastEvent =
            events[
              events.length - 1
            ][0] as CustomEvent;

          expect(
            lastEvent.detail
          ).toBe(true);
        });

        dispatchSpy.mockRestore();
      }
    );

    it(
      "dispatches false loading status when nothing is loading",
      async () => {
        const dispatchSpy =
          vi.spyOn(
            window,
            "dispatchEvent"
          );

        render(
          <DestinationShipment />
        );

        await waitFor(() => {
          const events =
            dispatchSpy.mock.calls.filter(
              ([event]) =>
                event instanceof
                  CustomEvent &&
                event.type ===
                  "widget-loading-status"
            );

          expect(
            events.length
          ).toBeGreaterThan(0);

          const lastEvent =
            events[
              events.length - 1
            ][0] as CustomEvent;

          expect(
            lastEvent.detail
          ).toBe(false);
        });

        dispatchSpy.mockRestore();
      }
    );

    /* =====================================================
       SHIPMENT ERROR
    ===================================================== */

    it(
      "dispatches shipment error toast",
      async () => {
        const dispatchSpy =
          vi.spyOn(
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

        render(
          <DestinationShipment />
        );

        await waitFor(() => {
          const events =
            getToastEvents(
              dispatchSpy,
              "Failed to load shipments"
            );

          expect(
            events.length
          ).toBeGreaterThan(0);

          expect(
            (
              events[0]?.[0] as CustomEvent
            ).detail
          ).toEqual({
            message:
              "Failed to load shipments",
            type: "error",
          });
        });

        dispatchSpy.mockRestore();
      }
    );

    it(
      "shows shipment error message",
      () => {
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

        render(
          <DestinationShipment />
        );

        expect(
          screen.getByText(
            "Failed to load shipments."
          )
        ).toBeInTheDocument();
      }
    );

    /* =====================================================
       EMPTY HUB PINCODES
    ===================================================== */

    it(
      "handles empty hub pincodes",
      () => {
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

        render(
          <DestinationShipment />
        );

        expect(
          screen.getByRole(
            "option",
            {
              name: "All Pincodes",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.queryByRole(
            "option",
            {
              name: "500001",
            }
          )
        ).not.toBeInTheDocument();
      }
    );

    it(
      "handles missing hub data",
      () => {
        mockedUseHubById.mockReturnValue(
          createHubQueryResult({
            data: undefined,
          })
        );

        render(
          <DestinationShipment />
        );

        expect(
          screen.getByRole(
            "option",
            {
              name: "All Pincodes",
            }
          )
        ).toBeInTheDocument();
      }
    );

    /* =====================================================
       EMPTY SHIPMENTS
    ===================================================== */

    it(
      "handles empty shipments",
      () => {
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
                  totalPages: 1,
                },
              },
            },
          })
        );

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
            "No shipments available"
          )
        ).toBeInTheDocument();
      }
    );

    /* =====================================================
       TOTAL COUNT
    ===================================================== */

    it(
      "shows total shipment count",
      () => {
        render(
          <DestinationShipment />
        );

        expect(
          screen.getByText(
            "Showing 3 of 10 shipments"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "defaults total records to zero when meta is missing",
      () => {
        mockedUseDestinationShipments.mockReturnValue(
          createShipmentQueryResult({
            data: {
              status: 200,
              message:
                "Shipments fetched successfully",
              data: {
                shipments:
                  mockShipments,
              },
            },
          })
        );

        render(
          <DestinationShipment />
        );

        expect(
          screen.getByText(
            "Showing 3 of 0 shipments"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "defaults shipments to empty array when data is missing",
      () => {
        mockedUseDestinationShipments.mockReturnValue(
          createShipmentQueryResult({
            data: undefined,
          })
        );

        render(
          <DestinationShipment />
        );

        expect(
          screen.getByText(
            "No shipments available"
          )
        ).toBeInTheDocument();
      }
    );

    /* =====================================================
       SINGLE SHIPMENT SELECTION
    ===================================================== */

    it(
      "selects a shipment",
      () => {
        render(
          <DestinationShipment />
        );

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
          screen.getByText(
            "1 shipment selected"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "deselects an already selected shipment",
      () => {
        render(
          <DestinationShipment />
        );

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
      }
    );

    /* =====================================================
       SELECT ALL
    ===================================================== */

    it(
      "selects all eligible shipments",
      () => {
        render(
          <DestinationShipment />
        );

        fireEvent.click(
          screen.getByTestId(
            "toggle-all"
          )
        );

        expect(
          screen.getByTestId(
            "selected-count"
          )
        ).toHaveTextContent("3");

        expect(
          screen.getByText(
            "3 shipments selected"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "clears all shipments when toggle all is clicked again",
      () => {
        render(
          <DestinationShipment />
        );

        const toggleAll =
          screen.getByTestId(
            "toggle-all"
          );

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
      }
    );

    it(
      "selects missing shipments when some are already selected",
      () => {
        render(
          <DestinationShipment />
        );

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
          screen.getByTestId(
            "toggle-all"
          )
        );

        expect(
          screen.getByTestId(
            "selected-count"
          )
        ).toHaveTextContent("3");
      }
    );

    it(
      "does nothing when there are no selectable shipments",
      () => {
        const assignedShipment = {
          shipmentId: "assigned-1",
          currentStatus:
            "Arrived At Destination Hub",
          assignedAgent: {
            agentId: "agent-1",
          },
        } as unknown as DestinationShipmentType;

        mockedUseDestinationShipments.mockReturnValue(
          createShipmentQueryResult({
            data: {
              ...mockShipmentData,
              data: {
                shipments: [
                  assignedShipment,
                ],
                meta:
                  mockShipmentData.data.meta,
              },
            },
          })
        );

        render(
          <DestinationShipment />
        );

        fireEvent.click(
          screen.getByTestId(
            "toggle-all"
          )
        );

        expect(
          screen.getByTestId(
            "selected-count"
          )
        ).toHaveTextContent("0");
      }
    );

    it(
      "does not select shipments with a different status",
      () => {
        const shipment = {
          shipmentId: "shipment-other",
          currentStatus:
            "Out For Delivery",
          assignedAgent: null,
        } as DestinationShipmentType;

        mockedUseDestinationShipments.mockReturnValue(
          createShipmentQueryResult({
            data: {
              ...mockShipmentData,
              data: {
                shipments: [
                  shipment,
                ],
                meta:
                  mockShipmentData.data.meta,
              },
            },
          })
        );

        render(
          <DestinationShipment />
        );

        fireEvent.click(
          screen.getByTestId(
            "toggle-all"
          )
        );

        expect(
          screen.getByTestId(
            "selected-count"
          )
        ).toHaveTextContent("0");
      }
    );

    /* =====================================================
       CLEAR SELECTION
    ===================================================== */

    it(
      "shows Clear Selection button after selecting shipment",
      () => {
        render(
          <DestinationShipment />
        );

        fireEvent.click(
          screen.getByTestId(
            "shipment-shipment-1"
          )
        );

        expect(
          screen.getByRole(
            "button",
            {
              name: "Clear Selection",
            }
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
            "shipment-shipment-1"
          )
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Clear Selection",
            }
          )
        );

        expect(
          screen.getByTestId(
            "selected-count"
          )
        ).toHaveTextContent("0");

        expect(
          screen.queryByText(
            "1 shipment selected"
          )
        ).not.toBeInTheDocument();
      }
    );

    /* =====================================================
       SHOW AGENTS
    ===================================================== */

    it(
      "shows Show Agents button when shipment is selected",
      () => {
        render(
          <DestinationShipment />
        );

        fireEvent.click(
          screen.getByTestId(
            "shipment-shipment-1"
          )
        );

        expect(
          screen.getByRole(
            "button",
            {
              name: "Show Agents",
            }
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "opens agents modal when Show Agents is clicked",
      async () => {
        render(
          <DestinationShipment />
        );

        await selectShipmentAndOpenAgents();

        expect(
          mockedGetAgents
        ).toHaveBeenCalledWith(
          "hub-123",
          1,
          100
        );
      }
    );

    /* =====================================================
       SHOW AGENTS - MISSING HUB ID
    ===================================================== */

    it(
      "shows error when opening agents without a hub id",
      async () => {
        const dispatchSpy =
          vi.spyOn(
            window,
            "dispatchEvent"
          );

        Object.defineProperty(
          window,
          "HOST_USER_INFO",
          {
            writable: true,
            configurable: true,
            value: {
              userId: "user-123",
            },
          }
        );

        render(
          <DestinationShipment />
        );

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

        await waitFor(() => {
          const events =
            getToastEvents(
              dispatchSpy,
              "Hub ID not found"
            );

          expect(
            events.length
          ).toBeGreaterThan(0);

          expect(
            (
              events[0]?.[0] as CustomEvent
            ).detail
          ).toEqual({
            message:
              "Hub ID not found",
            type: "error",
          });
        });

        expect(
          screen.queryByTestId(
            "agents-modal"
          )
        ).not.toBeInTheDocument();

        expect(
          mockedGetAgents
        ).not.toHaveBeenCalled();

        dispatchSpy.mockRestore();
      }
    );

    /* =====================================================
       AGENT MODAL
    ===================================================== */

    it(
      "loads agents when Show Agents is clicked",
      async () => {
        render(
          <DestinationShipment />
        );

        await selectShipmentAndOpenAgents();

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "modal-agent-count"
            )
          ).toHaveTextContent("2");
        });
      }
    );

    it(
      "loads agent analytics",
      async () => {
        render(
          <DestinationShipment />
        );

        await selectShipmentAndOpenAgents();

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "modal-analytics"
            )
          ).toHaveTextContent(
            "Analytics Available"
          );
        });
      }
    );

    it(
      "selects an agent in the modal",
      async () => {
        render(
          <DestinationShipment />
        );

        await selectShipmentAndOpenAgents();

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "agent-agent-1"
            )
          ).toBeInTheDocument();
        });

        fireEvent.click(
          screen.getByTestId(
            "agent-agent-1"
          )
        );

        expect(
          screen.getByTestId(
            "modal-selected-agent"
          )
        ).toHaveTextContent(
          "agent-1"
        );
      }
    );

    it(
      "deselects the same agent when clicked again",
      async () => {
        render(
          <DestinationShipment />
        );

        await selectShipmentAndOpenAgents();

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "agent-agent-1"
            )
          ).toBeInTheDocument();
        });

        const agentButton =
          screen.getByTestId(
            "agent-agent-1"
          );

        fireEvent.click(agentButton);

        expect(
          screen.getByTestId(
            "modal-selected-agent"
          )
        ).toHaveTextContent(
          "agent-1"
        );

        fireEvent.click(agentButton);

        expect(
          screen.getByTestId(
            "modal-selected-agent"
          )
        ).toHaveTextContent("");
      }
    );

    /* =====================================================
       ASSIGN AGENT VALIDATION
    ===================================================== */

    it(
      "shows error when assigning without selecting agent",
      async () => {
        const dispatchSpy =
          vi.spyOn(
            window,
            "dispatchEvent"
          );

        render(
          <DestinationShipment />
        );

        await selectShipmentAndOpenAgents();

        fireEvent.click(
          screen.getByRole("button", {
            name: "Assign Agent",
          })
        );

        await waitFor(() => {
          const events =
            getToastEvents(
              dispatchSpy,
              "Please select an agent"
            );

          expect(
            events.length
          ).toBeGreaterThan(0);

          expect(
            (
              events[0]?.[0] as CustomEvent
            ).detail
          ).toEqual({
            message:
              "Please select an agent",
            type: "error",
          });
        });

        expect(
          mockedAssignAgentToShipments
        ).not.toHaveBeenCalled();

        dispatchSpy.mockRestore();
      }
    );

    it(
      "shows error when assigning without selected shipments",
      async () => {
        const dispatchSpy =
          vi.spyOn(
            window,
            "dispatchEvent"
          );

        render(
          <DestinationShipment />
        );

        await selectShipmentAndOpenAgents();

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "agent-agent-1"
            )
          ).toBeInTheDocument();
        });

        /*
         * Select an agent first.
         */
        fireEvent.click(
          screen.getByTestId(
            "agent-agent-1"
          )
        );

        /*
         * Clear the shipment selection while
         * the modal remains open.
         */
        const clearSelectionButton =
          screen.getByRole(
            "button",
            {
              name: "Clear Selection",
            }
          );

        fireEvent.click(
          clearSelectionButton
        );

        expect(
          screen.getByTestId(
            "selected-count"
          )
        ).toHaveTextContent("0");

        fireEvent.click(
          screen.getByRole("button", {
            name: "Assign Agent",
          })
        );

        await waitFor(() => {
          const events =
            getToastEvents(
              dispatchSpy,
              "Please select at least one shipment"
            );

          expect(
            events.length
          ).toBeGreaterThan(0);

          expect(
            (
              events[0]?.[0] as CustomEvent
            ).detail
          ).toEqual({
            message:
              "Please select at least one shipment",
            type: "error",
          });
        });

        expect(
          mockedAssignAgentToShipments
        ).not.toHaveBeenCalled();

        expect(
          screen.getByTestId(
            "agents-modal"
          )
        ).toBeInTheDocument();

        dispatchSpy.mockRestore();
      }
    );

    /* =====================================================
       SUCCESSFUL ASSIGNMENT
    ===================================================== */

    it(
      "assigns selected agent to selected shipments",
      async () => {
        render(
          <DestinationShipment />
        );

        await selectShipmentAndOpenAgents();

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "agent-agent-1"
            )
          ).toBeInTheDocument();
        });

        fireEvent.click(
          screen.getByTestId(
            "agent-agent-1"
          )
        );

        fireEvent.click(
          screen.getByRole("button", {
            name: "Assign Agent",
          })
        );

        await waitFor(() => {
          expect(
            mockedAssignAgentToShipments
          ).toHaveBeenCalledWith(
            "agent-1",
            ["shipment-1"],
            "user-123"
          );
        });

        expect(
          screen.queryByTestId(
            "agents-modal"
          )
        ).not.toBeInTheDocument();

        expect(
          screen.getByTestId(
            "selected-count"
          )
        ).toHaveTextContent("0");
      }
    );

    it(
      "assigns an agent to multiple selected shipments",
      async () => {
        render(
          <DestinationShipment />
        );

        fireEvent.click(
          screen.getByTestId(
            "shipment-shipment-1"
          )
        );

        fireEvent.click(
          screen.getByTestId(
            "shipment-shipment-2"
          )
        );

        expect(
          screen.getByTestId(
            "selected-count"
          )
        ).toHaveTextContent("2");

        fireEvent.click(
          screen.getByRole("button", {
            name: "Show Agents",
          })
        );

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "agents-modal"
            )
          ).toBeInTheDocument();
        });

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "agent-agent-1"
            )
          ).toBeInTheDocument();
        });

        fireEvent.click(
          screen.getByTestId(
            "agent-agent-1"
          )
        );

        fireEvent.click(
          screen.getByRole("button", {
            name: "Assign Agent",
          })
        );

        await waitFor(() => {
          expect(
            mockedAssignAgentToShipments
          ).toHaveBeenCalledWith(
            "agent-1",
            [
              "shipment-1",
              "shipment-2",
            ],
            "user-123"
          );
        });
      }
    );

    it(
      "removes assigned shipments from the list after successful assignment",
      async () => {
        render(
          <DestinationShipment />
        );

        await selectShipmentAndOpenAgents();

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "agent-agent-1"
            )
          ).toBeInTheDocument();
        });

        fireEvent.click(
          screen.getByTestId(
            "agent-agent-1"
          )
        );

        fireEvent.click(
          screen.getByRole("button", {
            name: "Assign Agent",
          })
        );

        await waitFor(() => {
          expect(
            screen.queryByTestId(
              "shipment-shipment-1"
            )
          ).not.toBeInTheDocument();
        });

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
      }
    );

    it(
      "dispatches success toast after assigning agent",
      async () => {
        const dispatchSpy =
          vi.spyOn(
            window,
            "dispatchEvent"
          );

        render(
          <DestinationShipment />
        );

        await selectShipmentAndOpenAgents();

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "agent-agent-1"
            )
          ).toBeInTheDocument();
        });

        fireEvent.click(
          screen.getByTestId(
            "agent-agent-1"
          )
        );

        fireEvent.click(
          screen.getByRole("button", {
            name: "Assign Agent",
          })
        );

        await waitFor(() => {
          const events =
            getToastEvents(
              dispatchSpy,
              "Agent assigned successfully"
            );

          expect(
            events.length
          ).toBeGreaterThan(0);

          expect(
            (
              events[0]?.[0] as CustomEvent
            ).detail
          ).toEqual({
            message:
              "Agent assigned successfully",
            type: "success",
          });
        });

        dispatchSpy.mockRestore();
      }
    );

    /* =====================================================
       ASSIGNMENT ERROR
    ===================================================== */

    it(
      "handles assignment API failure",
      async () => {
        const dispatchSpy =
          vi.spyOn(
            window,
            "dispatchEvent"
          );

        mockedAssignAgentToShipments.mockRejectedValueOnce(
          new Error(
            "Assignment failed"
          )
        );

        render(
          <DestinationShipment />
        );

        await selectShipmentAndOpenAgents();

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "agent-agent-1"
            )
          ).toBeInTheDocument();
        });

        fireEvent.click(
          screen.getByTestId(
            "agent-agent-1"
          )
        );

        fireEvent.click(
          screen.getByRole("button", {
            name: "Assign Agent",
          })
        );

        await waitFor(() => {
          const events =
            getToastEvents(
              dispatchSpy,
              "Failed to assign agent"
            );

          expect(
            events.length
          ).toBeGreaterThan(0);

          expect(
            (
              events[0]?.[0] as CustomEvent
            ).detail
          ).toEqual({
            message:
              "Failed to assign agent",
            type: "error",
          });
        });

        expect(
          screen.getByTestId(
            "agents-modal"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "selected-count"
          )
        ).toHaveTextContent("1");

        dispatchSpy.mockRestore();
      }
    );

    /* =====================================================
       UPDATED BY FALLBACK
    ===================================================== */

    it(
      "uses _id when userId is unavailable",
      async () => {
        Object.defineProperty(
          window,
          "HOST_USER_INFO",
          {
            writable: true,
            configurable: true,
            value: {
              referenceId: "hub-123",
              _id: "fallback-user-id",
            },
          }
        );

        render(
          <DestinationShipment />
        );

        await selectShipmentAndOpenAgents();

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "agent-agent-1"
            )
          ).toBeInTheDocument();
        });

        fireEvent.click(
          screen.getByTestId(
            "agent-agent-1"
          )
        );

        fireEvent.click(
          screen.getByRole("button", {
            name: "Assign Agent",
          })
        );

        await waitFor(() => {
          expect(
            mockedAssignAgentToShipments
          ).toHaveBeenCalledWith(
            "agent-1",
            ["shipment-1"],
            "fallback-user-id"
          );
        });
      }
    );

    /* =====================================================
       MISSING USER ID
    ===================================================== */

    it(
      "shows error when user id is missing",
      async () => {
        const dispatchSpy =
          vi.spyOn(
            window,
            "dispatchEvent"
          );

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

        render(
          <DestinationShipment />
        );

        await selectShipmentAndOpenAgents();

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "agent-agent-1"
            )
          ).toBeInTheDocument();
        });

        fireEvent.click(
          screen.getByTestId(
            "agent-agent-1"
          )
        );

        fireEvent.click(
          screen.getByRole("button", {
            name: "Assign Agent",
          })
        );

        await waitFor(() => {
          const events =
            getToastEvents(
              dispatchSpy,
              "User ID not found"
            );

          expect(
            events.length
          ).toBeGreaterThan(0);

          expect(
            (
              events[0]?.[0] as CustomEvent
            ).detail
          ).toEqual({
            message:
              "User ID not found",
            type: "error",
          });
        });

        expect(
          mockedAssignAgentToShipments
        ).not.toHaveBeenCalled();

        dispatchSpy.mockRestore();
      }
    );

    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    it(
      "closes agents modal",
      async () => {
        render(
          <DestinationShipment />
        );

        await selectShipmentAndOpenAgents();

        fireEvent.click(
          screen.getByRole("button", {
            name: "Close",
          })
        );

        expect(
          screen.queryByTestId(
            "agents-modal"
          )
        ).not.toBeInTheDocument();
      }
    );

    it(
      "preserves shipment selection when agents modal is closed",
      async () => {
        render(
          <DestinationShipment />
        );

        await selectShipmentAndOpenAgents();

        fireEvent.click(
          screen.getByRole("button", {
            name: "Close",
          })
        );

        expect(
          screen.queryByTestId(
            "agents-modal"
          )
        ).not.toBeInTheDocument();

        expect(
          screen.getByTestId(
            "selected-count"
          )
        ).toHaveTextContent("1");
      }
    );

    /* =====================================================
       AGENT MODAL FETCH ERROR
    ===================================================== */

    it(
      "handles agent loading failure from Show Agents",
      async () => {
        const dispatchSpy =
          vi.spyOn(
            window,
            "dispatchEvent"
          );

        /*
         * Initial agent-filter request succeeds.
         * The request triggered by Show Agents fails.
         */
        mockedGetAgents
          .mockResolvedValueOnce(
            mockAgentResponse as Awaited<
              ReturnType<typeof getAgents>
            >
          )
          .mockRejectedValueOnce(
            new Error(
              "Agent loading failed"
            )
          );

        render(
          <DestinationShipment />
        );

        await selectShipmentAndOpenAgents();

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "modal-agent-count"
            )
          ).toHaveTextContent("0");
        });

        expect(
          screen.getByTestId(
            "modal-analytics"
          )
        ).toHaveTextContent(
          "No Analytics"
        );

        await waitFor(() => {
          const events =
            getToastEvents(
              dispatchSpy,
              "Failed to load delivery agents"
            );

          expect(
            events.length
          ).toBeGreaterThan(0);

          expect(
            (
              events[0]?.[0] as CustomEvent
            ).detail
          ).toEqual({
            message:
              "Failed to load delivery agents",
            type: "error",
          });
        });

        dispatchSpy.mockRestore();
      }
    );

    /* =====================================================
       FILTER CHANGE CLEARS SELECTION
    ===================================================== */

    it(
      "clears selected shipments when pincode changes",
      async () => {
        render(
          <DestinationShipment />
        );

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
      }
    );

    it(
      "clears selected shipments when status changes",
      async () => {
        render(
          <DestinationShipment />
        );

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
            "status-dropdown"
          ),
          {
            target: {
              value:
                "Out For Delivery",
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
      }
    );

    it(
      "clears selected shipments when agent filter changes",
      async () => {
        render(
          <DestinationShipment />
        );

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

        await waitFor(() => {
          expect(
            screen.getByRole(
              "option",
              {
                name: "John Doe",
              }
            )
          ).toBeInTheDocument();
        });

        fireEvent.change(
          screen.getByTestId(
            "agent-dropdown"
          ),
          {
            target: {
              value: "agent-1",
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
      }
    );

    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    it(
      "shows Clear Filters button when filters are selected",
      () => {
        render(
          <DestinationShipment />
        );

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

        expect(
          screen.getByRole(
            "button",
            {
              name: "Clear Filters",
            }
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "clears all filters",
      async () => {
        render(
          <DestinationShipment />
        );

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

        fireEvent.change(
          screen.getByTestId(
            "status-dropdown"
          ),
          {
            target: {
              value:
                "Out For Delivery",
            },
          }
        );

        await waitFor(() => {
          expect(
            screen.getByRole(
              "button",
              {
                name: "Clear Filters",
              }
            )
          ).toBeInTheDocument();
        });

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Clear Filters",
            }
          )
        );

        await waitFor(() => {
          expect(
            mockedUseDestinationShipments
          ).toHaveBeenLastCalledWith(
            "hub-123",
            {
              pincode: undefined,
              status: undefined,
              agentId: undefined,
              page: 1,
              limit: 10,
            }
          );
        });
      }
    );

    /* =====================================================
       TABLE
    ===================================================== */

    it(
      "renders shipment table",
      () => {
        render(
          <DestinationShipment />
        );

        expect(
          screen.getByTestId(
            "shipment-table"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "renders all shipments",
      () => {
        render(
          <DestinationShipment />
        );

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
      }
    );

    /* =====================================================
       PAGINATION
    ===================================================== */

    it(
      "shows pagination when there are multiple pages",
      () => {
        mockedUseDestinationShipments.mockReturnValue(
          createShipmentQueryResult({
            data: {
              status: 200,
              message:
                "Shipments fetched successfully",

              data: {
                shipments:
                  mockShipments,

                meta: {
                  totalRecords: 25,
                  totalPages: 3,
                  currentPage: 1,
                  limit: 10,
                  hasMore: true,
                },
              },
            },
          })
        );

        render(
          <DestinationShipment />
        );

        expect(
          screen.getByTestId(
            "pagination"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "does not show pagination when there is only one page",
      () => {
        render(
          <DestinationShipment />
        );

        expect(
          screen.queryByTestId(
            "pagination"
          )
        ).not.toBeInTheDocument();
      }
    );

    it(
      "changes page through pagination",
      async () => {
        mockedUseDestinationShipments.mockReturnValue(
          createShipmentQueryResult({
            data: {
              status: 200,
              message:
                "Shipments fetched successfully",

              data: {
                shipments:
                  mockShipments,

                meta: {
                  totalRecords: 25,
                  totalPages: 3,
                  currentPage: 1,
                  limit: 10,
                  hasMore: true,
                },
              },
            },
          })
        );

        render(
          <DestinationShipment />
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Next",
            }
          )
        );

        await waitFor(() => {
          expect(
            mockedUseDestinationShipments
          ).toHaveBeenLastCalledWith(
            "hub-123",
            {
              pincode: undefined,
              status: undefined,
              agentId: undefined,
              page: 2,
              limit: 10,
            }
          );
        });
      }
    );

    it(
      "clears selected shipments when page changes",
      async () => {
        mockedUseDestinationShipments.mockReturnValue(
          createShipmentQueryResult({
            data: {
              status: 200,
              message:
                "Shipments fetched successfully",

              data: {
                shipments:
                  mockShipments,

                meta: {
                  totalRecords: 25,
                  totalPages: 3,
                  currentPage: 1,
                  limit: 10,
                  hasMore: true,
                },
              },
            },
          })
        );

        render(
          <DestinationShipment />
        );

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
          screen.getByRole(
            "button",
            {
              name: "Next",
            }
          )
        );

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "selected-count"
            )
          ).toHaveTextContent("0");
        });
      }
    );

    it(
      "disables pagination while shipments are fetching",
      () => {
        mockedUseDestinationShipments.mockReturnValue(
          createShipmentQueryResult({
            isLoading: false,
            isFetching: true,
            isRefetching: true,

            data: {
              status: 200,
              message:
                "Shipments fetched successfully",

              data: {
                shipments:
                  mockShipments,

                meta: {
                  totalRecords: 25,
                  totalPages: 3,
                  currentPage: 1,
                  limit: 10,
                  hasMore: true,
                },
              },
            },
          })
        );

        render(
          <DestinationShipment />
        );

        expect(
          screen.getByRole(
            "button",
            {
              name: "Next",
            }
          )
        ).toBeDisabled();
      }
    );
  }
);
