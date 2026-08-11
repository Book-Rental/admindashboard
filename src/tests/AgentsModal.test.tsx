import React from "react";
import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  Agent,
  AgentAnalytics,
} from "../types/agent";
import AgentsModal from "../components/AgentsModal";

/* ---------------------------------------------------------
   UI LIBRARY MOCKS
--------------------------------------------------------- */

vi.mock("@rentbook/rentbook-ui-lib", () => ({
  Rb_Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    [key: string]: unknown;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ),

  Rb_LoadingSpinner: () => (
    <div data-testid="loading-spinner">
      Loading...
    </div>
  ),
}));

/* ---------------------------------------------------------
   TEST DATA
--------------------------------------------------------- */

const createAgent = (
  overrides: Partial<Agent> = {}
): Agent =>
  ({
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

    ...overrides,
  }) as Agent;

const activeAgent = createAgent();

const inactiveAgent = createAgent({
  agentId: "agent-2",
  fullName: "Jane Doe",
  email: "janedoe@gmail.com",
  phoneNumber: "9876543211",

  status: "Inactive",
  isAvailable: false,

  vehicle: {
    type: "Scooter",
    number: "KA02CD5678",
  },
});

const analytics: AgentAnalytics = {
  totalAgents: 2,
  activeAgents: 1,
  inactiveAgents: 1,
  offDutyAgents: 0,
};

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

const createProps = (
  overrides: Partial<
    React.ComponentProps<typeof AgentsModal>
  > = {}
): React.ComponentProps<typeof AgentsModal> => ({
  isOpen: true,

  agents: [
    activeAgent,
    inactiveAgent,
  ],

  analytics,

  isLoading: false,

  selectedAgentId: null,

  selectedShipmentCount: 1,

  isAssigningAgent: false,

  onSelectAgent: vi.fn(),

  onAssignAgent: vi.fn(),

  onClose: vi.fn(),

  ...overrides,
});

const renderModal = (
  overrides: Partial<
    React.ComponentProps<typeof AgentsModal>
  > = {}
) => {
  const props = createProps(overrides);

  return {
    props,
    ...render(
      <AgentsModal {...props} />
    ),
  };
};

/* ---------------------------------------------------------
   FOOTER TEXT HELPER
--------------------------------------------------------- */

const getShipmentMessage = (
  container: HTMLElement
) => {
  return Array.from(
    container.querySelectorAll("div")
  ).find((element) => {
    const text = element.textContent
      ?.replace(/\s+/g, " ")
      .trim();

    return (
      text === "Ready to assign 1 shipment" ||
      text === "Ready to assign 3 shipments"
    );
  });
};

/* ---------------------------------------------------------
   TESTS
--------------------------------------------------------- */

describe("AgentsModal", () => {
  /* -------------------------------------------------------
     VISIBILITY
  ------------------------------------------------------- */

  describe("visibility", () => {
    it("renders nothing when isOpen is false", () => {
      const { container } = renderModal({
        isOpen: false,
      });

      expect(
        container.firstChild
      ).toBeNull();
    });

    it("renders the modal when isOpen is true", () => {
      renderModal();

      expect(
        screen.getByRole("heading", {
          name: "Delivery Agents",
        })
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Select an agent to assign the selected shipments"
        )
      ).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------
     LOADING STATE
  ------------------------------------------------------- */

  describe("loading state", () => {
    it("renders the loading spinner when isLoading is true", () => {
      renderModal({
        isLoading: true,
      });

      expect(
        screen.getByTestId("loading-spinner")
      ).toBeInTheDocument();

      expect(
        screen.queryByRole("table")
      ).not.toBeInTheDocument();

      expect(
        screen.queryByText(
          "No agents found for this hub."
        )
      ).not.toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------
     EMPTY STATE
  ------------------------------------------------------- */

  describe("empty state", () => {
    it("renders the empty message when agents is empty", () => {
      renderModal({
        agents: [],
      });

      expect(
        screen.getByText(
          "No agents found for this hub."
        )
      ).toBeInTheDocument();

      expect(
        screen.queryByRole("table")
      ).not.toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------
     AGENT TABLE
  ------------------------------------------------------- */

  describe("agent table", () => {
    it("renders all table headers", () => {
      renderModal();

      expect(
        screen.getByRole("columnheader", {
          name: "Agent",
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("columnheader", {
          name: "Phone",
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("columnheader", {
          name: "Vehicle",
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("columnheader", {
          name: "Status",
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("columnheader", {
          name: "Availability",
        })
      ).toBeInTheDocument();
    });

    it("renders agent names and emails", () => {
      renderModal();

      expect(
        screen.getByText("John Doe")
      ).toBeInTheDocument();

      expect(
        screen.getByText("johndoe@gmail.com")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Jane Doe")
      ).toBeInTheDocument();

      expect(
        screen.getByText("janedoe@gmail.com")
      ).toBeInTheDocument();
    });

    it("renders phone numbers", () => {
      renderModal();

      expect(
        screen.getByText("9876543210")
      ).toBeInTheDocument();

      expect(
        screen.getByText("9876543211")
      ).toBeInTheDocument();
    });

    it("renders vehicle type and vehicle number", () => {
      renderModal();

      expect(
        screen.getByText("Bike")
      ).toBeInTheDocument();

      expect(
        screen.getByText("KA01AB1234")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Scooter")
      ).toBeInTheDocument();

      expect(
        screen.getByText("KA02CD5678")
      ).toBeInTheDocument();
    });

    it("renders Active and Inactive statuses", () => {
      renderModal();

      expect(
        screen.getByText("Active")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Inactive")
      ).toBeInTheDocument();
    });

    it("renders Available and Unavailable states", () => {
      renderModal();

      expect(
        screen.getByText("Available")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Unavailable")
      ).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------
     AGENT AVATAR
  ------------------------------------------------------- */

  describe("agent avatar", () => {
    it("shows initials when photo is null", () => {
      renderModal();

      expect(
        screen.getByText("JO")
      ).toBeInTheDocument();

      expect(
        screen.getByText("JA")
      ).toBeInTheDocument();
    });

    it("shows the first two uppercase characters for a normal name", () => {
      renderModal({
        agents: [
          createAgent({
            fullName: "alex",
          }),
        ],
      });

      expect(
        screen.getByText("AL")
      ).toBeInTheDocument();
    });

    it("trims whitespace before creating initials", () => {
      renderModal({
        agents: [
          createAgent({
            fullName: "  Robert  ",
          }),
        ],
      });

      expect(
        screen.getByText("RO")
      ).toBeInTheDocument();
    });

    it("shows NA when the agent name is empty", () => {
      renderModal({
        agents: [
          createAgent({
            fullName: "   ",
          }),
        ],
      });

      expect(
        screen.getByText("NA")
      ).toBeInTheDocument();
    });

    it("renders the photo when photo exists", () => {
      renderModal({
        agents: [
          createAgent({
            photo:
              "https://example.com/john.jpg",
          }),
        ],
      });

      const image =
        screen.getByRole("img", {
          name: "John Doe",
        });

      expect(image).toBeInTheDocument();

      expect(image).toHaveAttribute(
        "src",
        "https://example.com/john.jpg"
      );
    });

    it("falls back to initials when the photo fails", () => {
      renderModal({
        agents: [
          createAgent({
            photo:
              "https://example.com/broken.jpg",
          }),
        ],
      });

      const image =
        screen.getByRole("img", {
          name: "John Doe",
        });

      fireEvent.error(image);

      expect(
        screen.queryByRole("img", {
          name: "John Doe",
        })
      ).not.toBeInTheDocument();

      expect(
        screen.getByText("JO")
      ).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------
     SELECTION
  ------------------------------------------------------- */

  describe("selection", () => {
    it("calls onSelectAgent for an active agent", () => {
      const onSelectAgent = vi.fn();

      renderModal({
        onSelectAgent,
      });

      const checkbox =
        screen.getByRole("checkbox", {
          name: "Select John Doe",
        });

      expect(checkbox).toBeEnabled();

      fireEvent.click(checkbox);

      expect(
        onSelectAgent
      ).toHaveBeenCalledTimes(1);

      expect(
        onSelectAgent
      ).toHaveBeenCalledWith(
        "agent-1"
      );
    });

    it("disables selection for inactive agents", () => {
      renderModal();

      expect(
        screen.getByRole("checkbox", {
          name: "Select Jane Doe",
        })
      ).toBeDisabled();
    });

    it("checks the selected agent", () => {
      renderModal({
        selectedAgentId: "agent-1",
      });

      expect(
        screen.getByRole("checkbox", {
          name: "Select John Doe",
        })
      ).toBeChecked();
    });

    it("does not check an unselected agent", () => {
      renderModal({
        selectedAgentId: "agent-1",
      });

      expect(
        screen.getByRole("checkbox", {
          name: "Select Jane Doe",
        })
      ).not.toBeChecked();
    });

    it("applies selected row styling", () => {
      renderModal({
        selectedAgentId: "agent-1",
      });

      const checkbox =
        screen.getByRole("checkbox", {
          name: "Select John Doe",
        });

      const row =
        checkbox.closest("tr");

      expect(row).toHaveClass(
        "bg-blue-50"
      );
    });

    it("disables all checkboxes while assigning", () => {
      renderModal({
        isAssigningAgent: true,
      });

      expect(
        screen.getByRole("checkbox", {
          name: "Select John Doe",
        })
      ).toBeDisabled();

      expect(
        screen.getByRole("checkbox", {
          name: "Select Jane Doe",
        })
      ).toBeDisabled();
    });
  });

  /* -------------------------------------------------------
     FOOTER
  ------------------------------------------------------- */

  describe("footer", () => {
    it("shows select-agent message when no agent is selected", () => {
      renderModal({
        selectedAgentId: null,
      });

      expect(
        screen.getByText(
          "Select an agent to continue"
        )
      ).toBeInTheDocument();
    });

    it("shows singular shipment when count is 1", () => {
      const { container } = renderModal({
        selectedAgentId: "agent-1",
        selectedShipmentCount: 1,
      });

      const message =
        getShipmentMessage(container);

      expect(message).toBeInTheDocument();

      expect(
        message?.textContent
          ?.replace(/\s+/g, " ")
          .trim()
      ).toBe(
        "Ready to assign 1 shipment"
      );
    });

    it("shows plural shipments when count is greater than 1", () => {
      const { container } = renderModal({
        selectedAgentId: "agent-1",
        selectedShipmentCount: 3,
      });

      const message =
        getShipmentMessage(container);

      expect(message).toBeInTheDocument();

      expect(
        message?.textContent
          ?.replace(/\s+/g, " ")
          .trim()
      ).toBe(
        "Ready to assign 3 shipments"
      );
    });

    it("disables Assign to Agent when no agent is selected", () => {
      renderModal({
        selectedAgentId: null,
      });

      expect(
        screen.getByRole("button", {
          name: "Assign to Agent",
        })
      ).toBeDisabled();
    });

    it("enables Assign to Agent when an agent is selected", () => {
      renderModal({
        selectedAgentId: "agent-1",
      });

      expect(
        screen.getByRole("button", {
          name: "Assign to Agent",
        })
      ).toBeEnabled();
    });

    it("calls onAssignAgent when Assign to Agent is clicked", () => {
      const onAssignAgent = vi.fn();

      renderModal({
        selectedAgentId: "agent-1",
        onAssignAgent,
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: "Assign to Agent",
        })
      );

      expect(
        onAssignAgent
      ).toHaveBeenCalledTimes(1);
    });

    it("shows Assigning text while assigning", () => {
      renderModal({
        selectedAgentId: "agent-1",
        isAssigningAgent: true,
      });

      expect(
        screen.getByRole("button", {
          name: "Assigning...",
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: "Assigning...",
        })
      ).toBeDisabled();
    });

    it("disables Cancel while assigning", () => {
      renderModal({
        isAssigningAgent: true,
      });

      expect(
        screen.getByRole("button", {
          name: "Cancel",
        })
      ).toBeDisabled();
    });

    it("keeps Cancel enabled when not assigning", () => {
      renderModal({
        isAssigningAgent: false,
      });

      expect(
        screen.getByRole("button", {
          name: "Cancel",
        })
      ).toBeEnabled();
    });
  });

  /* -------------------------------------------------------
     CLOSE BEHAVIOR
  ------------------------------------------------------- */

  describe("close behavior", () => {
    it("calls onClose from the close button", () => {
      const onClose = vi.fn();

      renderModal({
        onClose,
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: "Close",
        })
      );

      expect(
        onClose
      ).toHaveBeenCalledTimes(1);
    });

    it("calls onClose from Cancel", () => {
      const onClose = vi.fn();

      renderModal({
        onClose,
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: "Cancel",
        })
      );

      expect(
        onClose
      ).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when the backdrop is clicked", () => {
      const onClose = vi.fn();

      const { container } =
        renderModal({
          onClose,
        });

      const backdrop =
        container.firstElementChild;

      expect(backdrop).toBeTruthy();

      fireEvent.click(
        backdrop as HTMLElement
      );

      expect(
        onClose
      ).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when content is clicked", () => {
      const onClose = vi.fn();

      renderModal({
        onClose,
      });

      fireEvent.click(
        screen.getByRole("heading", {
          name: "Delivery Agents",
        })
      );

      expect(
        onClose
      ).not.toHaveBeenCalled();
    });
  });

  /* -------------------------------------------------------
     COMBINED STATES
  ------------------------------------------------------- */

  describe("combined states", () => {
    it("keeps inactive agent disabled while assigning", () => {
      renderModal({
        isAssigningAgent: true,
      });

      expect(
        screen.getByRole("checkbox", {
          name: "Select Jane Doe",
        })
      ).toBeDisabled();
    });

    it("disables Assign to Agent while assigning", () => {
      renderModal({
        selectedAgentId: "agent-1",
        isAssigningAgent: true,
      });

      expect(
        screen.getByRole("button", {
          name: "Assigning...",
        })
      ).toBeDisabled();
    });

    it("does not call onAssignAgent when the button is disabled", () => {
      const onAssignAgent = vi.fn();

      renderModal({
        selectedAgentId: null,
        onAssignAgent,
      });

      const button =
        screen.getByRole("button", {
          name: "Assign to Agent",
        });

      expect(button).toBeDisabled();

      fireEvent.click(button);

      expect(
        onAssignAgent
      ).not.toHaveBeenCalled();
    });
  });
});
