import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddShipmentsModal, {
    BAGGABLE_STATUS,
} from "../components/bag/AddShipmentsModal";

const mocks = vi.hoisted(() => ({
    useShipments: vi.fn(),
    useDebouncedValue: vi.fn(),
    useAddShipmentsToBag: vi.fn(),
    mutateAsync: vi.fn(),
    showToast: vi.fn(),
    getErrorMessage: vi.fn(),
    onClose: vi.fn(),
}));

vi.mock("../hooks/useShipments", () => ({
    useShipments: mocks.useShipments,
}));

vi.mock("../hooks/useDebouncedValue", () => ({
    useDebouncedValue: mocks.useDebouncedValue,
}));

vi.mock("../hooks/useBagActions", () => ({
    useAddShipmentsToBag: mocks.useAddShipmentsToBag,
}));

vi.mock("../utils/showToaster", () => ({
    showToast: mocks.showToast,
}));

vi.mock("../utils/getErrorMessage", () => ({
    getErrorMessage: mocks.getErrorMessage,
}));

vi.mock("@rentbook/rentbook-ui-lib", () => ({
    Modal: ({ isOpen, children }: any) =>
        isOpen ? <div role="dialog">{children}</div> : null,

    ModalHeader: ({ children, onClose }: any) => (
        <div>
            <h2>{children}</h2>
            <button type="button" onClick={onClose}>
                Close header
            </button>
        </div>
    ),

    ModalBody: ({ children }: any) => <div>{children}</div>,
    ModalFooter: ({ children }: any) => <div>{children}</div>,

    Rb_Button: ({
        children,
        onClick,
        disabled,
        isLoading,
        type,
    }: any) => (
        <button
            type={type ?? "button"}
            onClick={onClick}
            disabled={disabled}
            data-loading={String(Boolean(isLoading))}
        >
            {children}
        </button>
    ),

    Rb_LoadingSpinner: () => <div data-testid="loading-spinner">Loading</div>,

    Pagination: ({ currentPage, totalPages, disabled, onPageChange }: any) => (
        <div data-testid="pagination">
            <span>
                Page {currentPage} of {totalPages}
            </span>
            <button
                type="button"
                disabled={disabled}
                onClick={() => onPageChange(2)}
            >
                Go to page 2
            </button>
        </div>
    ),

    Search: ({ value, onChange, placeholder }: any) => (
        <input value={value} onChange={onChange} placeholder={placeholder} />
    ),
}));

const SEARCH_PLACEHOLDER = "Search by AWB, Receiver or City";

const shipments = [
    {
        shipmentId: "S1",
        awbNumber: "AWB-001",
        receiverName: "Alice",
        receiverCity: "Hyderabad",
        paymentMode: "PREPAID",
    },
    {
        shipmentId: "S2",
        awbNumber: "AWB-002",
        receiverName: "Bob",
        receiverCity: "Chennai",
        paymentMode: "COD",
    },
    {
        shipmentId: "S3",
        awbNumber: "AWB-003",
        receiverName: "Carol",
        receiverCity: "",
        paymentMode: "PREPAID",
    },
];

function setup({
    isOpen = true,
    blockedIds = new Set<string>(),
    shipmentList = shipments,
    totalPages = 1,
    isLoading = false,
    isFetching = false,
    isPending = false,
    noData = false,
}: {
    isOpen?: boolean;
    blockedIds?: Set<string>;
    shipmentList?: any[];
    totalPages?: number;
    isLoading?: boolean;
    isFetching?: boolean;
    isPending?: boolean;
    noData?: boolean;
} = {}) {
    mocks.useShipments.mockReturnValue({
        data: noData
            ? undefined
            : { data: { shipments: shipmentList, meta: { totalPages } } },
        isLoading,
        isFetching,
    });

    mocks.useAddShipmentsToBag.mockReturnValue({
        mutateAsync: mocks.mutateAsync,
        isPending,
    });

    return render(
        <AddShipmentsModal
            isOpen={isOpen}
            onClose={mocks.onClose}
            bagId="BAG-001"
            sourceHubMongoId="HUB-MONGO-001"
            blockedIds={blockedIds}
        />
    );
}

describe("AddShipmentsModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.useDebouncedValue.mockImplementation((value: string) => value);
        mocks.mutateAsync.mockResolvedValue({});
        mocks.getErrorMessage.mockReturnValue("Failed to add parcels");
    });

    it("renders nothing when closed", () => {
        setup({ isOpen: false });

        expect(screen.queryByRole("dialog")).toBeNull();
        expect(mocks.useShipments).not.toHaveBeenCalled();
    });

    it("renders the header and fetches baggable shipments for the source hub", () => {
        setup();

        expect(screen.getByText("Add Shipments to Bag")).toBeTruthy();
        expect(mocks.useShipments).toHaveBeenCalledWith(
            "HUB-MONGO-001",
            1,
            BAGGABLE_STATUS,
            "",
            ""
        );
    });

    it("shows the loading spinner while shipments load", () => {
        setup({ isLoading: true });

        expect(screen.getByTestId("loading-spinner")).toBeTruthy();
        expect(screen.queryByText("AWB-001")).toBeNull();
    });

    it("lists available shipments and hides blocked ones", () => {
        setup({ blockedIds: new Set(["S2"]) });

        expect(screen.getByText("AWB-001")).toBeTruthy();
        expect(screen.getByText("Alice")).toBeTruthy();
        expect(screen.getByText("Hyderabad")).toBeTruthy();
        expect(screen.queryByText("AWB-002")).toBeNull();
        expect(screen.getByText("AWB-003")).toBeTruthy();
    });

    it("shows the empty state and disables select all when nothing is available", () => {
        setup({ shipmentList: [] });

        expect(screen.getByText("No parcels available to add")).toBeTruthy();
        expect(
            (screen.getByLabelText("Select all") as HTMLInputElement).disabled
        ).toBe(true);
    });

    it("handles missing data gracefully", () => {
        setup({ noData: true });

        expect(screen.getByText("No parcels available to add")).toBeTruthy();
        expect(screen.queryByTestId("pagination")).toBeNull();
    });

    it("selects and deselects a parcel with its checkbox", () => {
        setup();

        const addButton = screen.getByRole("button", { name: "Add to Bag" });
        expect((addButton as HTMLButtonElement).disabled).toBe(true);
        expect(screen.getByText("0 selected")).toBeTruthy();

        fireEvent.click(screen.getByLabelText("Select AWB-001"));

        expect(screen.getByText("1 selected")).toBeTruthy();
        expect((addButton as HTMLButtonElement).disabled).toBe(false);

        fireEvent.click(screen.getByLabelText("Select AWB-001"));

        expect(screen.getByText("0 selected")).toBeTruthy();
    });

    it("toggles a parcel when its row is clicked", () => {
        setup();

        fireEvent.click(screen.getByText("AWB-002"));
        expect(screen.getByText("1 selected")).toBeTruthy();
        expect(
            (screen.getByLabelText("Select AWB-002") as HTMLInputElement)
                .checked
        ).toBe(true);

        fireEvent.click(screen.getByText("AWB-002"));
        expect(screen.getByText("0 selected")).toBeTruthy();
    });

    it("selects and clears all parcels on the page", () => {
        setup();

        const selectAll = screen.getByLabelText("Select all") as HTMLInputElement;

        fireEvent.click(selectAll);
        expect(screen.getByText("3 selected")).toBeTruthy();
        expect(selectAll.checked).toBe(true);

        fireEvent.click(selectAll);
        expect(screen.getByText("0 selected")).toBeTruthy();
        expect(selectAll.checked).toBe(false);
    });

    it("adds the selected parcels to the bag", async () => {
        setup();

        fireEvent.click(screen.getByLabelText("Select AWB-001"));
        fireEvent.click(screen.getByLabelText("Select AWB-002"));
        fireEvent.click(screen.getByRole("button", { name: "Add to Bag" }));

        await waitFor(() => {
            expect(mocks.mutateAsync).toHaveBeenCalledWith({
                bagId: "BAG-001",
                shipmentIds: ["S1", "S2"],
            });
            expect(mocks.showToast).toHaveBeenCalledWith(
                "2 parcel(s) added to bag",
                "success"
            );
            expect(mocks.onClose).toHaveBeenCalledTimes(1);
        });
    });

    it("shows an error toast and stays open when adding fails", async () => {
        mocks.mutateAsync.mockRejectedValueOnce(new Error("API error"));

        setup();

        fireEvent.click(screen.getByLabelText("Select AWB-001"));
        fireEvent.click(screen.getByRole("button", { name: "Add to Bag" }));

        await waitFor(() => {
            expect(mocks.getErrorMessage).toHaveBeenCalledWith(
                expect.any(Error),
                "Failed to add parcels"
            );
            expect(mocks.showToast).toHaveBeenCalledWith(
                "Failed to add parcels",
                "error"
            );
        });

        expect(mocks.onClose).not.toHaveBeenCalled();
    });

    it("closes from the Cancel button", () => {
        setup();

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

        expect(mocks.onClose).toHaveBeenCalledTimes(1);
    });

    it("closes from the modal header", () => {
        setup();

        fireEvent.click(screen.getByRole("button", { name: "Close header" }));

        expect(mocks.onClose).toHaveBeenCalledTimes(1);
    });

    it("disables the actions while the add request is pending", () => {
        setup({ isPending: true });

        fireEvent.click(screen.getByLabelText("Select AWB-001"));

        const addButton = screen.getByRole("button", {
            name: "Add to Bag",
        }) as HTMLButtonElement;
        const cancelButton = screen.getByRole("button", {
            name: "Cancel",
        }) as HTMLButtonElement;

        expect(addButton.disabled).toBe(true);
        expect(addButton.getAttribute("data-loading")).toBe("true");
        expect(cancelButton.disabled).toBe(true);
    });

    it("hides pagination when there is only one page", () => {
        setup({ totalPages: 1 });

        expect(screen.queryByTestId("pagination")).toBeNull();
    });

    it("shows pagination and fetches the requested page", () => {
        setup({ totalPages: 3 });

        expect(screen.getByTestId("pagination")).toBeTruthy();
        expect(screen.getByText("Page 1 of 3")).toBeTruthy();

        fireEvent.click(screen.getByRole("button", { name: "Go to page 2" }));

        expect(mocks.useShipments).toHaveBeenLastCalledWith(
            "HUB-MONGO-001",
            2,
            BAGGABLE_STATUS,
            "",
            ""
        );
    });

    it("disables pagination while fetching", () => {
        setup({ totalPages: 3, isFetching: true });

        expect(
            (
                screen.getByRole("button", {
                    name: "Go to page 2",
                }) as HTMLButtonElement
            ).disabled
        ).toBe(true);
    });

    it("searches and resets to the first page", () => {
        setup({ totalPages: 3 });

        fireEvent.click(screen.getByRole("button", { name: "Go to page 2" }));
        expect(mocks.useShipments).toHaveBeenLastCalledWith(
            "HUB-MONGO-001",
            2,
            BAGGABLE_STATUS,
            "",
            ""
        );

        fireEvent.change(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), {
            target: { value: "alice" },
        });

        expect(mocks.useDebouncedValue).toHaveBeenCalledWith("alice");
        expect(mocks.useShipments).toHaveBeenLastCalledWith(
            "HUB-MONGO-001",
            1,
            BAGGABLE_STATUS,
            "",
            "alice"
        );
    });
});