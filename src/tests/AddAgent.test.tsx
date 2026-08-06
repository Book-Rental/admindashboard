import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import AddAgent from "../pages/AddAgent";
import { AgentFormData } from "../types/agent";

beforeEach(() => {
    vi.clearAllMocks();

    window.HOST_USER_INFO = {
        referenceId: "hub123",
    };

    window.history.pushState({}, "", "/agents/add");
});

const { mockMutate, mockShowToast } = vi.hoisted(() => ({
    mockMutate: vi.fn(),
    mockShowToast: vi.fn(),
}));

vi.mock("../hooks/useAgents", () => ({
    useCreateAgent: () => ({
        mutate: mockMutate,
        isPending: false,
    }),
}));

vi.mock("../utils/showToaster", () => ({
    showToast: mockShowToast,
}));

vi.mock("../components/AgentForm", () => ({
    default: (props: {
        hubId: string;
        onSubmit: (data: AgentFormData) => void;
        onCancel: () => void;
        isLoading: boolean;
        title: string;
        description: string;
        submitText: string;
    }) => {
        const agentData: AgentFormData = {
            hubId: props.hubId,
            fullName: "John Doe",
            email: "john@example.com",
            phoneNumber: "9876543210",
            password: "password123",
            vehicleType: "Bike",
            vehicleNumber: "TS09AB1234",
            address: "Hyderabad",
            emergencyContact: "9876543211",
            notes: "",
            photo: null,
            isActive: true,
        };

        return (
            <div>
                <h1>{props.title}</h1>

                <p>{props.description}</p>

                <span data-testid="hub-id">{props.hubId}</span>

                <span data-testid="loading">
                    {props.isLoading ? "loading" : "not-loading"}
                </span>

                <button
                    type="button"
                    onClick={() => props.onSubmit(agentData)}
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

describe("AddAgent", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        Object.defineProperty(window, "HOST_USER_INFO", {
            writable: true,
            configurable: true,
            value: {
                referenceId: "hub123",
            },
        });

        window.history.pushState({}, "", "/agents/add");
    });

    it("renders Add Agent form with correct props", () => {
        render(<AddAgent />);

        expect(
            screen.getByText("Add New Agent")
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Create a delivery agent profile and assign their vehicle details."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByTestId("hub-id")
        ).toHaveTextContent("hub123");

        expect(
            screen.getByTestId("loading")
        ).toHaveTextContent("not-loading");

        expect(
            screen.getByRole("button", {
                name: "Create Agent",
            })
        ).toBeInTheDocument();
    });

    it("uses empty hubId when HOST_USER_INFO is not present", () => {
        window.HOST_USER_INFO = undefined;

        render(<AddAgent />);

        expect(screen.getByTestId("hub-id")).toHaveTextContent("");
    });

    it("dispatches widget loading status event", () => {
        const dispatchSpy = vi.spyOn(
            window,
            "dispatchEvent"
        );

        render(<AddAgent />);

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

    it("calls create agent mutation when submitted", () => {
        render(<AddAgent />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Agent",
            })
        );

        expect(mockMutate).toHaveBeenCalledTimes(1);

        expect(mockMutate).toHaveBeenCalledWith(
            expect.objectContaining({
                hubId: "hub123",
                fullName: "John Doe",
                email: "john@example.com",
                phoneNumber: "9876543210",
                vehicleType: "Bike",
            }),
            expect.objectContaining({
                onSuccess: expect.any(Function),
                onError: expect.any(Function),
            })
        );
    });

    it("shows success toast and navigates to agents", () => {
        const dispatchSpy = vi.spyOn(
            window,
            "dispatchEvent"
        );

        render(<AddAgent />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Agent",
            })
        );

        const options = mockMutate.mock.calls[0][1];

        options.onSuccess();

        expect(mockShowToast).toHaveBeenCalledWith(
            "Agent created successfully",
            "success"
        );

        expect(window.location.pathname).toBe(
            "/agents"
        );

        expect(dispatchSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "popstate",
            })
        );

        dispatchSpy.mockRestore();
    });

    it("shows API error message when creation fails", () => {
        render(<AddAgent />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Agent",
            })
        );

        const options = mockMutate.mock.calls[0][1];

        options.onError({
            response: {
                data: {
                    message: "Email already exists",
                },
            },
        });

        expect(mockShowToast).toHaveBeenCalledWith(
            "Email already exists",
            "error"
        );
    });

    it("shows Error message when creation fails with Error", () => {
        render(<AddAgent />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Agent",
            })
        );

        const options = mockMutate.mock.calls[0][1];

        options.onError(
            new Error("Network error")
        );

        expect(mockShowToast).toHaveBeenCalledWith(
            "Network error",
            "error"
        );
    });

    it("shows default error message for unknown error", () => {
        render(<AddAgent />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Agent",
            })
        );

        const options = mockMutate.mock.calls[0][1];

        options.onError({});

        expect(mockShowToast).toHaveBeenCalledWith(
            "Failed to create agent",
            "error"
        );
    });

    it("navigates to agents when cancel is clicked", () => {
        const dispatchSpy = vi.spyOn(
            window,
            "dispatchEvent"
        );

        render(<AddAgent />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Cancel",
            })
        );

        expect(window.location.pathname).toBe(
            "/agents"
        );

        expect(dispatchSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "popstate",
            })
        );

        dispatchSpy.mockRestore();
    });
});