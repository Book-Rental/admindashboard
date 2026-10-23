
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import AssignBagAgentModal from "../components/bag/AssignBagAgentModal";

const mocks = vi.hoisted(() => ({
    useAgents: vi.fn(),
}));

vi.mock("../hooks/useAgents", () => ({
    useAgents: mocks.useAgents,
}));

vi.mock("@rentbook/rentbook-ui-lib", () => ({
    Modal: ({ isOpen, children }: any) =>
        isOpen ? <div data-testid="modal">{children}</div> : null,

    ModalHeader: ({ children, onClose }: any) => (
        <div>
            <h2>{children}</h2>
            <button type="button" onClick={onClose}>
                Header close
            </button>
        </div>
    ),

    ModalBody: ({ children }: any) => <div>{children}</div>,
    ModalFooter: ({ children }: any) => <div>{children}</div>,

    Rb_Button: ({
        children,
        onClick,
        disabled,
        type = "button",
    }: any) => (
        <button type={type} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    ),

    Rb_LoadingSpinner: () => <div data-testid="loading-spinner" />,
}));

const agents = [
    {
        agentId: "AGENT-1",
        fullName: "Ravi Kumar",
        phoneNumber: "9876543210",
        vehicle: { type: "Bike" },
        status: "AVAILABLE",
    },
    {
        agentId: "AGENT-2",
        fullName: "Priya Sharma",
        phoneNumber: "9876501234",
        vehicle: { type: "Van" },
        status: "BUSY",
    },
];

const defaultProps = {
    isOpen: true,
    hubMongoId: "mongo-hub-1",
    isSubmitting: false,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
};

function renderModal(
    props: Partial<typeof defaultProps> = {},
) {
    return render(<AssignBagAgentModal {...defaultProps} {...props} />);
}

describe("AssignBagAgentModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mocks.useAgents.mockReturnValue({
            data: { data: { agents } },
            isLoading: false,
        });
    });

    it("does not render the modal when closed", () => {
        renderModal({ isOpen: false });

        expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("requests agents for the given hub with page 1 and limit 100", () => {
        renderModal();

        expect(mocks.useAgents).toHaveBeenCalledWith(
            "mongo-hub-1",
            1,
            100,
        );
    });

    it("shows a loading spinner while agents are loading", () => {
        mocks.useAgents.mockReturnValue({
            data: undefined,
            isLoading: true,
        });

        renderModal();

        expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
        expect(screen.queryByText("No agents found for this hub."))
            .not.toBeInTheDocument();
    });

    it("shows an empty message when no agents are available", () => {
        mocks.useAgents.mockReturnValue({
            data: { data: { agents: [] } },
            isLoading: false,
        });

        renderModal();

        expect(
            screen.getByText("No agents found for this hub."),
        ).toBeInTheDocument();
    });

    it("renders agent details", () => {
        renderModal();

        expect(screen.getByText("Ravi Kumar")).toBeInTheDocument();
        expect(screen.getByText("9876543210 · Bike")).toBeInTheDocument();
        expect(screen.getByText("AVAILABLE")).toBeInTheDocument();

        expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
        expect(screen.getByText("9876501234 · Van")).toBeInTheDocument();
        expect(screen.getByText("BUSY")).toBeInTheDocument();
    });

    it("disables assignment until an agent is selected", () => {
        renderModal();

        expect(screen.getByRole("button", { name: "Assign Agent" }))
            .toBeDisabled();
    });

    it("selects an agent and enables assignment", () => {
        renderModal();

        fireEvent.click(screen.getByRole("button", { name: /Ravi Kumar/ }));

        expect(
            screen.getByRole("button", { name: "Assign Agent" }),
        ).toBeEnabled();
    });

    it("confirms with the selected agent ID", () => {
        renderModal();

        fireEvent.click(screen.getByRole("button", { name: /Priya Sharma/ }));
        fireEvent.click(screen.getByRole("button", { name: "Assign Agent" }));

        expect(defaultProps.onConfirm).toHaveBeenCalledWith("AGENT-2");
        expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when Cancel is clicked", () => {
        renderModal();

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose from the modal header", () => {
        renderModal();

        fireEvent.click(screen.getByRole("button", { name: "Header close" }));

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("disables Cancel and Assign Agent while submitting", () => {
        renderModal({ isSubmitting: true });

        expect(screen.getByRole("button", { name: "Cancel" }))
            .toBeDisabled();

        expect(screen.getByRole("button", { name: "Assign Agent" }))
            .toBeDisabled();
    });

    it("allows changing the selected agent", () => {
        renderModal();

        fireEvent.click(screen.getByRole("button", { name: /Ravi Kumar/ }));
        fireEvent.click(screen.getByRole("button", { name: /Priya Sharma/ }));
        fireEvent.click(screen.getByRole("button", { name: "Assign Agent" }));

        expect(defaultProps.onConfirm).toHaveBeenCalledWith("AGENT-2");
    });
});
