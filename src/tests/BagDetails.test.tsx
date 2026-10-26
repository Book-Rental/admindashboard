import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BagDetails from "../pages/BagDetails";
import type { Bag } from "../types/bag";

const mocks = vi.hoisted(() => ({
    useBags: vi.fn(),
    useBag: vi.fn(),
    useBagParcels: vi.fn(),
    useHubs: vi.fn(),
    useHubById: vi.fn(),
    useAgents: vi.fn(),
    useUpdateBagStatus: vi.fn(),
    useAddShipmentsToBag: vi.fn(),
    getNextAction: vi.fn(),
    goTo: vi.fn(),
    getShipmentLabelPdfUrl: vi.fn(),
    getShipmentByAwb: vi.fn(),
    showToast: vi.fn(),
    getErrorMessage: vi.fn(),
    mutateAsync: vi.fn(),
}));

vi.mock("../hooks/useBags", () => ({
    useBags: mocks.useBags,
    useBag: mocks.useBag,
    useBagParcels: mocks.useBagParcels,
}));

vi.mock("../hooks/useHubs", () => ({
    useHubs: mocks.useHubs,
}));

vi.mock("../hooks/useHubById", () => ({
    useHubById: mocks.useHubById,
}));

vi.mock("../hooks/useAgents", () => ({
    useAgents: mocks.useAgents,
}));

vi.mock("../hooks/useBagActions", () => ({
    useUpdateBagStatus: mocks.useUpdateBagStatus,
    useAddShipmentsToBag: mocks.useAddShipmentsToBag,
}));

vi.mock("../components/bag/bagFlow", () => ({
    getNextAction: mocks.getNextAction,
    goTo: mocks.goTo,
}));

vi.mock("../api/bagApi", () => ({
    getShipmentLabelPdfUrl: mocks.getShipmentLabelPdfUrl,
    getShipmentByAwb: mocks.getShipmentByAwb,
}));

vi.mock("../utils/showToaster", () => ({
    showToast: mocks.showToast,
}));

vi.mock("../utils/getErrorMessage", () => ({
    getErrorMessage: mocks.getErrorMessage,
}));

vi.mock("@rentbook/rentbook-ui-lib", () => ({
    Rb_Button: ({ children, onClick, disabled, isLoading, type }:
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        any) => (
        <button
            type={type ?? "button"}
            onClick={onClick}
            disabled={disabled}
            data-loading={String(Boolean(isLoading))}
        >
            {children}
        </button>
    ),

    Rb_LoadingSpinner: () => (
        <div data-testid="loading-spinner">Loading</div>
    ),

    Modal: ({ isOpen, onClose, children }:
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        any) =>
        isOpen ? (
            <div role="dialog">
                {children}
                <button type="button" onClick={onClose}>
                    Close
                </button>
            </div>
        ) : null,

    ModalHeader: ({ children }:
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        any) => <div>{children}</div>,
}));

vi.mock("react-icons/fa", () => ({
    FaArrowLeft: () => <span data-testid="back-icon" />,
}));

vi.mock("../components/bag/BagStatusBadge", () => ({
    default: ({ status }: { status: string }) => (
        <span data-testid="status-badge">{status}</span>
    ),
}));

vi.mock("../components/bag/BagStatusStepper", () => ({
    default: ({ status }: { status: string }) => (
        <div data-testid="status-stepper">{status}</div>
    ),
}));

vi.mock("../components/bag/BagVerification", () => ({
    default: ({ canAct }: { canAct: boolean }) => (
        <div data-testid="bag-verification">Can act: {String(canAct)}</div>
    ),
}));

// BagAddParcels has its own tests; stub it so its modals don't mount here.
vi.mock("../components/bag/BagAddParcels", () => ({
    default: () => <div data-testid="bag-add-parcels" />,
}));

vi.mock("../components/bag/AssignBagAgentModal", () => ({
    default: ({
        isOpen,
        onClose,
        onConfirm,
    }: {
        isOpen: boolean;
        onClose: () => void;
        onConfirm: (agentId: string) => void;
    }) =>
        isOpen ? (
            <div data-testid="agent-modal">
                <button onClick={onClose}>Close agent modal</button>
                <button onClick={() => onConfirm("AGENT-001")}>
                    Confirm agent
                </button>
            </div>
        ) : null,
}));

const baseBag = {
    bagId: "BAG-001",
    fromHubId: "HUB-001",
    toHubId: "HUB-002",
    status: "CREATED",
    shipmentIds: ["SHIPMENT-001"],
    verifiedShipmentIds: [],
    assignedAgentId: "AGENT-001",
} as unknown as Bag;

const agents = [{ agentId: "AGENT-001", fullName: "Test Agent" }];

const parcel = {
    awbNumber: "AWB-001",
    receiver: { name: "Test Receiver", city: "Hyderabad" },
    currentStatus: "IN_TRANSIT",
};

const defaultNextAction = {
    label: "Seal Bag",
    next: "SEALED",
    side: "source" as const,
    needsAgent: false,
};

// NOTE: hubsData / agentsData are the *response body* (what the component
// reads as `hubsData` / `agentsData`). setup() wraps them as `{ data: body }`
// to mimic a react-query result.
function setup({
    bag = baseBag,
    isLoading = false,
    isError = false,
    hubId = "",
    parcelQueries = [{ data: { data: parcel }, isLoading: false }],
    nextAction = defaultNextAction,
    hubsData = {
        data: [
            { hubId: "HUB-001", hubName: "Source Hub" },
            { hubId: "HUB-002", hubName: "Destination Hub" },
        ],
    },
    agentsData = { data: { agents } },
}: {
    bag?: Bag | undefined;
    isLoading?: boolean;
    isError?: boolean;
    hubId?: string;
    parcelQueries?:
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    any[];
    nextAction?: {
        label: string;
        next: string;
        side: "source" | "destination";
        needsAgent: boolean;
    } | null;
    hubsData?:
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    any;
    agentsData?:
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    any;
} = {}) {
    window.history.pushState({}, "", "/bags/BAG-001");

    window.HOST_USER_INFO = {
        referenceId: "HUB-MONGO-001",
    } as 
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    any;

    mocks.useBags.mockReturnValue({
        data: { data: [] },
        isLoading: false,
        isError: false,
    });

    mocks.useAddShipmentsToBag.mockReturnValue({
        mutateAsync: vi.fn().mockResolvedValue({}),
        isPending: false,
    });

    mocks.useBag.mockReturnValue({
        data: bag ? { data: bag } : undefined,
        isLoading,
        isError,
    });

    mocks.useBagParcels.mockReturnValue(parcelQueries);
    mocks.useHubs.mockReturnValue({ data: hubsData });
    mocks.useAgents.mockReturnValue({ data: agentsData });

    mocks.useHubById.mockReturnValue({
        data: { data: { hubId } },
    });

    mocks.useUpdateBagStatus.mockReturnValue({
        mutateAsync: mocks.mutateAsync,
        isPending: false,
    });

    mocks.getNextAction.mockReturnValue(nextAction);

    mocks.getShipmentLabelPdfUrl.mockReturnValue(
        "https://example.com/label.pdf"
    );

    mocks.getErrorMessage.mockReturnValue("Failed to update bag");

    return render(<BagDetails />);
}

describe("BagDetails", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.mutateAsync.mockResolvedValue({});
    });

    it("shows the loading spinner", () => {
        setup({ isLoading: true });

        expect(screen.getByTestId("loading-spinner")).toBeTruthy();
    });

    it("shows an error when bag details fail to load", () => {
        setup({ bag: undefined, isError: true });

        expect(screen.getByText("Failed to load bag details.")).toBeTruthy();
    });

    it("renders bag details, hub names, agent and parcel information", () => {
        setup();

        expect(screen.getByText("BAG-001")).toBeTruthy();
        expect(screen.getByText("Source Hub")).toBeTruthy();
        expect(screen.getByText("Destination Hub")).toBeTruthy();
        expect(screen.getByText("Test Agent")).toBeTruthy();
        expect(screen.getByText("AWB-001")).toBeTruthy();
        expect(screen.getByText("Test Receiver")).toBeTruthy();
        expect(screen.getByText("Hyderabad")).toBeTruthy();
        expect(screen.getByText("IN_TRANSIT")).toBeTruthy();
        expect(screen.getByText("Pending")).toBeTruthy();
    });

    it("navigates back to the bags page", () => {
        setup();

        fireEvent.click(screen.getByText("Back to Bags"));

        expect(mocks.goTo).toHaveBeenCalledWith("/bags");
    });

    it("runs the next status action", async () => {
        setup();

        fireEvent.click(screen.getByText("Seal Bag"));

        await waitFor(() => {
            expect(mocks.mutateAsync).toHaveBeenCalledWith({
                bagId: "BAG-001",
                status: "SEALED",
                assignedAgentId: undefined,
            });

            expect(mocks.showToast).toHaveBeenCalledWith(
                "Bag status updated",
                "success"
            );
        });
    });

    it("shows an error toast when status update fails", async () => {
        mocks.mutateAsync.mockRejectedValueOnce(new Error("API error"));

        setup();

        fireEvent.click(screen.getByText("Seal Bag"));

        await waitFor(() => {
            expect(mocks.getErrorMessage).toHaveBeenCalledWith(
                expect.any(Error),
                "Failed to update bag"
            );

            expect(mocks.showToast).toHaveBeenCalledWith(
                "Failed to update bag",
                "error"
            );
        });
    });

    it("opens the agent modal when the next action requires an agent", () => {
        setup({
            nextAction: {
                label: "Assign Agent",
                next: "ASSIGNED",
                side: "source",
                needsAgent: true,
            },
        });

        expect(mocks.getNextAction).toHaveBeenCalledWith("CREATED");

        fireEvent.click(screen.getByRole("button", { name: "Assign Agent" }));

        expect(screen.getByTestId("agent-modal")).toBeTruthy();
        expect(mocks.mutateAsync).not.toHaveBeenCalled();
    });

    it("assigns the selected agent and updates the bag", async () => {
        setup({
            nextAction: {
                label: "Assign Agent",
                next: "ASSIGNED",
                side: "source",
                needsAgent: true,
            },
        });

        fireEvent.click(screen.getByRole("button", { name: "Assign Agent" }));
        fireEvent.click(screen.getByText("Confirm agent"));

        await waitFor(() => {
            expect(mocks.mutateAsync).toHaveBeenCalledWith({
                bagId: "BAG-001",
                status: "ASSIGNED",
                assignedAgentId: "AGENT-001",
            });

            expect(mocks.showToast).toHaveBeenCalledWith(
                "Bag status updated",
                "success"
            );
        });
    });

    it("closes the agent modal when the close button is clicked", () => {
        setup({
            nextAction: {
                label: "Assign Agent",
                next: "ASSIGNED",
                side: "source",
                needsAgent: true,
            },
        });

        fireEvent.click(screen.getByRole("button", { name: "Assign Agent" }));

        expect(screen.getByTestId("agent-modal")).toBeTruthy();

        fireEvent.click(
            screen.getByRole("button", { name: "Close agent modal" })
        );

        expect(screen.queryByTestId("agent-modal")).toBeNull();
    });

    it("disables the seal action when a created bag has no parcels", () => {
        setup({
            bag: { ...baseBag, shipmentIds: [] } as unknown as Bag,
            parcelQueries: [],
        });

        expect(
            screen.getByText("Add parcels below before sealing.")
        ).toBeTruthy();

        expect(screen.getByText("Seal Bag").hasAttribute("disabled")).toBe(
            true
        );

        expect(screen.getByText("No parcels in this bag yet")).toBeTruthy();
    });

    it("hides the primary action when the current hub cannot perform it", () => {
        setup({ hubId: "UNRELATED-HUB" });

        expect(screen.queryByText("Seal Bag")).toBeNull();
    });

    it("shows parcel loading and fallback values", () => {
        setup({ parcelQueries: [{ isLoading: true }] });

        expect(screen.getByText("Loading...")).toBeTruthy();
        expect(screen.getAllByText("-").length).toBeGreaterThan(0);
    });

    it("prints a parcel label", () => {
        const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

        setup();

        fireEvent.click(screen.getByText("Print label"));

        expect(mocks.getShipmentLabelPdfUrl).toHaveBeenCalledWith("AWB-001");

        expect(openSpy).toHaveBeenCalledWith(
            "https://example.com/label.pdf",
            "_blank"
        );

        openSpy.mockRestore();
    });

    it("renders verification when the bag is opened", () => {
        setup({
            bag: { ...baseBag, status: "OPENED" } as unknown as Bag,
        });

        expect(screen.getByTestId("bag-verification")).toBeTruthy();
    });

    it("shows a fallback when hub or agent names are unavailable", () => {
        setup({
            bag: {
                ...baseBag,
                assignedAgentId: "UNKNOWN-AGENT",
            } as unknown as Bag,
            hubsData: { data: [] },
            agentsData: { data: { agents: [] } },
        });

        expect(screen.getByText("HUB-001")).toBeTruthy();
        expect(screen.getByText("HUB-002")).toBeTruthy();
        expect(screen.getByText("UNKNOWN-AGENT")).toBeTruthy();
    });
});