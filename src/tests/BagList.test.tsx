import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import BagList from "../pages/BagList";

const mocks = vi.hoisted(() => ({
    useBags: vi.fn(),
    useHubs: vi.fn(),
    useHubById: vi.fn(),
    goTo: vi.fn(),
}));

vi.mock("../hooks/useBags", () => ({
    useBags: mocks.useBags,
}));

vi.mock("../hooks/useHubs", () => ({
    useHubs: mocks.useHubs,
}));

vi.mock("../hooks/useHubById", () => ({
    useHubById: mocks.useHubById,
}));

vi.mock("../components/bag/bagFlow", () => ({
    BAG_STEPS: [
        { label: "Created", status: "CREATED" },
        { label: "Sealed", status: "SEALED" },
        { label: "Assigned", status: "ASSIGNED" },
    ],
    goTo: mocks.goTo,
}));

vi.mock("@rentbook/rentbook-ui-lib", () => ({
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    Rb_Button: ({ children, onClick }: any) => (
        <button onClick={onClick}>{children}</button>
    ),
    Rb_LoadingSpinner: () => <div data-testid="loading-spinner" />,
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    Dropdown: ({ value, onChange, options, placeholder }: any) => (
        <select
            aria-label={placeholder}
            value={value}
            onChange={(event) => onChange(event.target.value)}
        >
            {options.map((option:
                // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                any) => (
                <option key={option.value || "all"} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    ),
}));

vi.mock("../components/bag/AddToBagModal", () => ({
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    default: ({ isOpen, onClose, onDone }: any) =>
        isOpen ? (
            <div data-testid="create-bag-modal">
                <button onClick={onClose}>Close modal</button>
                <button onClick={() => onDone("BAG-NEW")}>Complete creation</button>
            </div>
        ) : null,
}));

vi.mock("../components/bag/BagStatusBadge", () => ({
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    default: ({ status }:
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        any) => <span>{status}</span>,
}));

const bags = [
    {
        bagId: "BAG-001",
        fromHubId: "HUB-1",
        toHubId: "HUB-2",
        shipmentIds: ["S1", "S2"],
        status: "CREATED",
        createdAt: "2026-10-01T00:00:00.000Z",
    },
    {
        bagId: "BAG-002",
        fromHubId: "HUB-2",
        toHubId: "HUB-1",
        shipmentIds: ["S3"],
        status: "SEALED",
        createdAt: "2026-10-02T00:00:00.000Z",
    },
    {
        bagId: "BAG-003",
        fromHubId: "HUB-3",
        toHubId: "HUB-4",
        shipmentIds: [],
        status: "ASSIGNED",
        createdAt: "2026-10-03T00:00:00.000Z",
    },
];

const hubs = [
    { hubId: "HUB-1", hubName: "Hyderabad Hub" },
    { hubId: "HUB-2", hubName: "Bengaluru Hub" },
];

function setup({
    loading = false,
    error = false,
    bagData = bags,
    hubData = hubs,
    myHubId = "HUB-1",
}: {
    loading?: boolean;
    error?: boolean;
    bagData?: typeof bags;
    hubData?: typeof hubs;
    myHubId?: string;
} = {}) {
    Object.defineProperty(window, "HOST_USER_INFO", {
        configurable: true,
        value: { referenceId: "mongo-hub-id" },
    });

    mocks.useHubById.mockReturnValue({
        data: { data: { hubId: myHubId } },
    });
    mocks.useBags.mockReturnValue({
        data: { data: bagData },
        isLoading: loading,
        isError: error,
    });
    mocks.useHubs.mockReturnValue({ data: { data: hubData } });

    return render(<BagList />);
}

describe("BagList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows the loading spinner and dispatches loading status", () => {
        const dispatchSpy = vi.spyOn(window, "dispatchEvent");
        setup({ loading: true });

        expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
        expect(dispatchSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "widget-loading-status",
            }),
        );
    });

    it("dispatches an error notification when bags fail to load", async () => {
        const dispatchSpy = vi.spyOn(window, "dispatchEvent");
        setup({ error: true });

        await waitFor(() => {
            expect(dispatchSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "app-toast-notification",
                    detail: { message: "Failed to load bags", type: "error" },
                }),
            );
        });
    });

    it("shows bags connected to the current hub with hub names and parcel counts", () => {
        setup();

        expect(screen.getByText("BAG-001")).toBeInTheDocument();
        expect(screen.getByText("BAG-002")).toBeInTheDocument();
        expect(screen.queryByText("BAG-003")).not.toBeInTheDocument();
        expect(screen.getAllByText("Hyderabad Hub")).toHaveLength(2);
        expect(screen.getAllByText("Bengaluru Hub")).toHaveLength(2);
        expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("filters outgoing bags", () => {
        setup();

        fireEvent.click(screen.getByRole("button", { name: "Outgoing" }));

        expect(screen.getByText("BAG-001")).toBeInTheDocument();
        expect(screen.queryByText("BAG-002")).not.toBeInTheDocument();
    });

    it("filters incoming bags", () => {
        setup();

        fireEvent.click(screen.getByRole("button", { name: "Incoming" }));

        expect(screen.getByText("BAG-002")).toBeInTheDocument();
        expect(screen.queryByText("BAG-001")).not.toBeInTheDocument();
    });

    it("filters bags by status", () => {
        setup();

        fireEvent.change(screen.getByLabelText("Bag Status"), {
            target: { value: "SEALED" },
        });

        expect(screen.getByText("BAG-002")).toBeInTheDocument();
        expect(screen.queryByText("BAG-001")).not.toBeInTheDocument();
    });

    it("shows all bags when no hub ID is available", () => {
        setup({ myHubId: "" });

        expect(screen.getByText("BAG-001")).toBeInTheDocument();
        expect(screen.getByText("BAG-002")).toBeInTheDocument();
        expect(screen.getByText("BAG-003")).toBeInTheDocument();
    });

    it("falls back to hub IDs when hub names are unavailable", () => {
        setup({ hubData: [] });

        expect(screen.getAllByText("HUB-1")).toHaveLength(2);
        expect(screen.getAllByText("HUB-2")).toHaveLength(2);
    });

    it("shows the empty state when no bags match", () => {
        setup({ bagData: [] });

        expect(screen.getByText("No bags found")).toBeInTheDocument();
    });

    it("navigates to bag details when a row is clicked", () => {
        setup();

        fireEvent.click(screen.getByText("BAG-001"));

        expect(mocks.goTo).toHaveBeenCalledWith("/bags/BAG-001");
    });

    it("opens and closes the create-bag modal", () => {
        setup();

        fireEvent.click(screen.getByRole("button", { name: "Create Bag" }));
        expect(screen.getByTestId("create-bag-modal")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Close modal" }));
        expect(screen.queryByTestId("create-bag-modal")).not.toBeInTheDocument();
    });

    it("navigates after bag creation completes", () => {
        setup();

        fireEvent.click(screen.getByRole("button", { name: "Create Bag" }));
        fireEvent.click(screen.getByRole("button", { name: "Complete creation" }));

        expect(mocks.goTo).toHaveBeenCalledWith("/bags/BAG-NEW");
    });

    it("shows an empty state when the bags response has no data", () => {
        mocks.useHubById.mockReturnValue({
            data: { data: { hubId: "HUB-1" } },
        });
        mocks.useBags.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
        });
        mocks.useHubs.mockReturnValue({ data: { data: [] } });

        Object.defineProperty(window, "HOST_USER_INFO", {
            configurable: true,
            value: { referenceId: "mongo-hub-id" },
        });

        render(<BagList />);

        expect(screen.getByText("No bags found")).toBeInTheDocument();
    });
});