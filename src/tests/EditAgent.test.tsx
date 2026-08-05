import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
} from "vitest";
import {
    render,
    screen,
    fireEvent,
} from "@testing-library/react";

import EditAgent from "../pages/EditAgent";
import { AgentFormData } from "../types/agent";

type MutationOptions = {
    onSuccess: () => void;
    onError: (error: unknown) => void;
};

type AgentFormProps = {
    hubId: string;
    initialData: unknown;
    onSubmit: (data: AgentFormData) => void;
    onCancel: () => void;
    isLoading: boolean;
    title: string;
    description: string;
    submitText: string;
};

const {
    mockUseAgent,
    mockUseUpdateAgent,
    mockMutate,
    mockShowToast,
} = vi.hoisted(() => ({
    mockUseAgent: vi.fn(),
    mockUseUpdateAgent: vi.fn(),
    mockMutate: vi.fn(),
    mockShowToast: vi.fn(),
}));

vi.mock("../hooks/useAgents", () => ({
    useAgent: mockUseAgent,
    useUpdateAgent: mockUseUpdateAgent,
}));

vi.mock("../utils/showToaster", () => ({
    showToast: mockShowToast,
}));

vi.mock("@rentbook/rentbook-ui-lib", () => ({
    Rb_Button: ({
        children,
        onClick,
        type,
    }: {
        children: React.ReactNode;
        onClick: () => void;
        type: "button";
    }) => (
        <button
            type={type}
            onClick={onClick}
        >
            {children}
        </button>
    ),

    Rb_LoadingSpinner: ({
        text,
    }: {
        text: string;
    }) => (
        <div data-testid="loading-spinner">
            {text}
        </div>
    ),
}));

vi.mock("react-icons/fa", () => ({
    FaExclamationCircle: () => (
        <span data-testid="error-icon" />
    ),
}));

vi.mock("../components/AgentForm", () => ({
    default: (props: AgentFormProps) => {
        const agentData: AgentFormData = {
            hubId: props.hubId,
            fullName: "John Doe",
            email: "john@example.com",
            phoneNumber: "9876543210",
            password: "",
            vehicleType: "Bike",
            vehicleNumber: "TS09AB1234",
            address: "Hyderabad",
            emergencyContact: "9876543211",
            notes: "Test agent",
            photo: null,
            isActive: true,
        };

        return (
            <div>
                <h1>{props.title}</h1>

                <p>{props.description}</p>

                <span data-testid="hub-id">
                    {props.hubId}
                </span>

                <span data-testid="form-loading">
                    {props.isLoading
                        ? "loading"
                        : "not-loading"}
                </span>

                <button
                    type="button"
                    onClick={() =>
                        props.onSubmit(agentData)
                    }
                >
                    {props.submitText}
                </button>

                <button
                    type="button"
                    onClick={props.onCancel}
                >
                    Cancel
                </button>
            </div>
        );
    },
}));

describe("EditAgent", () => {
    const mockAgent = {
        _id: "agent123",
        hubId: "hub123",
        fullName: "John Doe",
        email: "john@example.com",
        phoneNumber: "9876543210",
        vehicleType: "Bike",
        vehicleNumber: "TS09AB1234",
        address: "Hyderabad",
        emergencyContact: "9876543211",
        notes: "Test agent",
        photo: null,
        isActive: true,
    };

    beforeEach(() => {
        vi.clearAllMocks();

        window.history.pushState(
            {},
            "",
            "/agents/agent123"
        );

        mockUseAgent.mockReturnValue({
            data: mockAgent,
            isLoading: false,
            isError: false,
        });

        mockUseUpdateAgent.mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        });
    });

    it("renders Edit Agent form with agent details", () => {
        render(<EditAgent />);

        expect(
            screen.getByText("Edit Agent")
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Update the agent's information and save the latest details."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByTestId("hub-id")
        ).toHaveTextContent("hub123");

        expect(
            screen.getByRole("button", {
                name: "Save Changes",
            })
        ).toBeInTheDocument();
    });

    it("shows loading spinner while agent details are loading", () => {
        mockUseAgent.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
        });

        render(<EditAgent />);

        expect(
            screen.getByTestId("loading-spinner")
        ).toHaveTextContent(
            "Loading agent details..."
        );
    });

    it("shows error state when agent loading fails", () => {
        mockUseAgent.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
        });

        render(<EditAgent />);

        expect(
            screen.getByText("Unable to load agent")
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "We couldn't load the agent details. Please try again."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Back to Agents",
            })
        ).toBeInTheDocument();
    });

    it("shows error state when agent data is unavailable", () => {
        mockUseAgent.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
        });

        render(<EditAgent />);

        expect(
            screen.getByText("Unable to load agent")
        ).toBeInTheDocument();
    });

    it("dispatches widget loading status event", () => {
        const dispatchSpy = vi.spyOn(
            window,
            "dispatchEvent"
        );

        render(<EditAgent />);

        expect(dispatchSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "widget-loading-status",
            })
        );

        const event = dispatchSpy.mock.calls.find(
            ([event]) =>
                event.type === "widget-loading-status"
        )?.[0] as CustomEvent;

        expect(event.detail).toBe(false);

        dispatchSpy.mockRestore();
    });

    it("calls update mutation when form is submitted", () => {
        render(<EditAgent />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Save Changes",
            })
        );

        expect(mockMutate).toHaveBeenCalledTimes(1);

        expect(mockMutate).toHaveBeenCalledWith(
            {
                id: "agent123",
                data: expect.objectContaining({
                    hubId: "hub123",
                    fullName: "John Doe",
                    email: "john@example.com",
                    phoneNumber: "9876543210",
                    vehicleType: "Bike",
                    vehicleNumber: "TS09AB1234",
                    address: "Hyderabad",
                    emergencyContact: "9876543211",
                    notes: "Test agent",
                    photo: null,
                    isActive: true,
                }),
            },
            expect.objectContaining({
                onSuccess: expect.any(Function),
                onError: expect.any(Function),
            })
        );
    });

    it("shows success toast and navigates to agents after successful update", () => {
        render(<EditAgent />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Save Changes",
            })
        );

        const options =
            mockMutate.mock.calls[0][1] as MutationOptions;

        options.onSuccess();

        expect(mockShowToast).toHaveBeenCalledWith(
            "Agent updated successfully",
            "success"
        );

        expect(window.location.pathname).toBe(
            "/agents"
        );
    });

    it("shows API error message when update fails", () => {
        render(<EditAgent />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Save Changes",
            })
        );

        const options =
            mockMutate.mock.calls[0][1] as MutationOptions;

        const error: unknown = {
            response: {
                data: {
                    message: "Email already exists",
                },
            },
        };

        options.onError(error);

        expect(mockShowToast).toHaveBeenCalledWith(
            "Email already exists",
            "error"
        );
    });

    it("shows Error message when update fails with Error", () => {
        render(<EditAgent />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Save Changes",
            })
        );

        const options =
            mockMutate.mock.calls[0][1] as MutationOptions;

        options.onError(
            new Error("Network error")
        );

        expect(mockShowToast).toHaveBeenCalledWith(
            "Network error",
            "error"
        );
    });

    it("shows default error message for unknown error", () => {
        render(<EditAgent />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Save Changes",
            })
        );

        const options =
            mockMutate.mock.calls[0][1] as MutationOptions;

        options.onError({});

        expect(mockShowToast).toHaveBeenCalledWith(
            "Failed to update agent",
            "error"
        );
    });

    it("navigates to agents when cancel is clicked", () => {
        render(<EditAgent />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Cancel",
            })
        );

        expect(window.location.pathname).toBe(
            "/agents"
        );
    });

    it("navigates to agents from error state", () => {
        mockUseAgent.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
        });

        render(<EditAgent />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Back to Agents",
            })
        );

        expect(window.location.pathname).toBe(
            "/agents"
        );
    });

    it("uses hubId._id when hubId is an object", () => {
        mockUseAgent.mockReturnValue({
            data: {
                ...mockAgent,
                hubId: {
                    _id: "hub-object-id",
                },
            },
            isLoading: false,
            isError: false,
        });

        render(<EditAgent />);

        expect(
            screen.getByTestId("hub-id")
        ).toHaveTextContent("hub-object-id");
    });

    it("passes update loading state to AgentForm", () => {
        mockUseUpdateAgent.mockReturnValue({
            mutate: mockMutate,
            isPending: true,
        });

        render(<EditAgent />);

        expect(
            screen.getByTestId("form-loading")
        ).toHaveTextContent("loading");
    });
});
