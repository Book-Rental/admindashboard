
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import AddToBagModal from "../components/bag/AddToBagModal";

const mocks = vi.hoisted(() => ({
    useBags: vi.fn(),
    useHubs: vi.fn(),
    useHubById: vi.fn(),
    useCreateBag: vi.fn(),
    useAddShipmentsToBag: vi.fn(),
    showToast: vi.fn(),
    getErrorMessage: vi.fn(),
    createMutateAsync: vi.fn(),
    addMutateAsync: vi.fn(),
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

vi.mock("../hooks/useBagActions", () => ({
    useCreateBag: mocks.useCreateBag,
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
        isOpen ? <div data-testid="modal">{children}</div> : null,

    ModalHeader: ({ children }: any) => <h2>{children}</h2>,

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
            disabled={disabled}
            onClick={onClick}
        >
            {isLoading ? "Loading..." : children}
        </button>
    ),

    Dropdown: ({ value, onChange, options, placeholder }: any) => (
        <select
            aria-label={placeholder}
            value={value}
            onChange={(event) => onChange(event.target.value)}
        >
            <option value="">{placeholder}</option>
            {options.map((option: any) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    ),
}));

const hubs = [
    { hubId: "hub-1", hubName: "Bengaluru", hubCode: "BLR" },
    { hubId: "hub-2", hubName: "Hyderabad", hubCode: "HYD" },
    { hubId: "hub-3", hubName: "Chennai", hubCode: "MAA" },
];

const bags = [
    {
        bagId: "BAG-1",
        fromHubId: "hub-1",
        toHubId: "hub-2",
        shipmentIds: ["S1", "S2"],
        status: "CREATED",
    },
    {
        bagId: "BAG-2",
        fromHubId: "hub-1",
        toHubId: "hub-3",
        shipmentIds: [],
        status: "SEALED",
    },
    {
        bagId: "BAG-3",
        fromHubId: "hub-3",
        toHubId: "hub-2",
        shipmentIds: [],
        status: "CREATED",
    },
];

const onClose = vi.fn();
const onDone = vi.fn();

function renderModal(
    shipmentIds: string[] = [],
    isOpen = true,
) {
    return render(
        <AddToBagModal
            isOpen={isOpen}
            onClose={onClose}
            shipmentIds={shipmentIds}
            onDone={onDone}
        />,
    );
}

beforeEach(() => {
    vi.clearAllMocks();

    window.HOST_USER_INFO = undefined;

    mocks.useHubById.mockReturnValue({ data: undefined });
    mocks.useBags.mockReturnValue({ data: { data: bags } });
    mocks.useHubs.mockReturnValue({ data: { data: hubs } });

    mocks.createMutateAsync.mockResolvedValue({
        bag: { bagId: "BAG-NEW" },
    });

    mocks.addMutateAsync.mockResolvedValue({});

    mocks.useCreateBag.mockReturnValue({
        mutateAsync: mocks.createMutateAsync,
        isPending: false,
    });

    mocks.useAddShipmentsToBag.mockReturnValue({
        mutateAsync: mocks.addMutateAsync,
        isPending: false,
    });

    mocks.getErrorMessage.mockReturnValue("Something went wrong");
});

afterEach(() => {
    cleanup();
});

describe("AddToBagModal", () => {
    it("does not render the modal when closed", () => {
        renderModal([], false);

        expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("renders create bag mode without shipments", () => {
        renderModal();

        expect(
            screen.getByRole("heading", { name: "Create Bag" }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Create Bag" }),
        ).toBeDisabled();

        expect(
            screen.getByLabelText("Select destination hub"),
        ).toBeInTheDocument();
    });

    it("renders add to bag mode with selected shipment count", () => {
        renderModal(["S1", "S2"]);

        expect(
            screen.getByRole("heading", { name: "Add to Bag" }),
        ).toBeInTheDocument();

        expect(screen.getByText("2 parcel(s) selected")).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Add to Bag" }),
        ).toBeDisabled();
    });

    it("shows only created bags from the selected source hub", async () => {
        window.HOST_USER_INFO = { referenceId: "mongo-hub-1" } as any;

        mocks.useHubById.mockReturnValue({
            data: {
                data: {
                    hubId: "hub-1",
                    hubName: "Bengaluru",
                    hubCode: "BLR",
                },
            },
        });

        renderModal(["S1"]);

        await waitFor(() => {
            expect(
                screen.getByText("Bengaluru (BLR)"),
            ).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText("Select bag"), {
            target: { value: "BAG-1" },
        });

        expect(
            screen.getByRole("button", { name: "Add to Bag" }),
        ).toBeEnabled();

        const bagDropdown = screen.getByLabelText(
            "Select bag",
        ) as HTMLSelectElement;

        expect(
            Array.from(bagDropdown.options).some((option) =>
                option.text.includes("BAG-2"),
            ),
        ).toBe(false);

        expect(
            Array.from(bagDropdown.options).some((option) =>
                option.text.includes("BAG-3"),
            ),
        ).toBe(false);
    });

    it("creates a new bag and adds selected shipments", async () => {
        renderModal(["S1", "S2"]);

        fireEvent.change(screen.getByLabelText("Select source hub"), {
            target: { value: "hub-1" },
        });

        fireEvent.change(screen.getByLabelText("Select destination hub"), {
            target: { value: "hub-2" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Add to Bag" }));

        await waitFor(() => {
            expect(mocks.createMutateAsync).toHaveBeenCalledWith({
                fromHubId: "hub-1",
                toHubId: "hub-2",
            });

            expect(mocks.addMutateAsync).toHaveBeenCalledWith({
                bagId: "BAG-NEW",
                shipmentIds: ["S1", "S2"],
            });

            expect(mocks.showToast).toHaveBeenCalledWith(
                "2 parcel(s) added to BAG-NEW",
                "success",
            );

            expect(onDone).toHaveBeenCalledWith("BAG-NEW");
            expect(onClose).toHaveBeenCalled();
        });
    });

    it("creates an empty bag without adding shipments", async () => {
        renderModal();

        fireEvent.change(screen.getByLabelText("Select source hub"), {
            target: { value: "hub-1" },
        });

        fireEvent.change(screen.getByLabelText("Select destination hub"), {
            target: { value: "hub-2" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Create Bag" }));

        await waitFor(() => {
            expect(mocks.createMutateAsync).toHaveBeenCalledWith({
                fromHubId: "hub-1",
                toHubId: "hub-2",
            });

            expect(mocks.addMutateAsync).not.toHaveBeenCalled();

            expect(mocks.showToast).toHaveBeenCalledWith(
                "Bag BAG-NEW created",
                "success",
            );

            expect(onDone).toHaveBeenCalledWith("BAG-NEW");
            expect(onClose).toHaveBeenCalled();
        });
    });

    it("adds shipments to an existing bag without creating another bag", async () => {
        renderModal(["S1"]);

        fireEvent.change(screen.getByLabelText("Select bag"), {
            target: { value: "BAG-1" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Add to Bag" }));

        await waitFor(() => {
            expect(mocks.createMutateAsync).not.toHaveBeenCalled();

            expect(mocks.addMutateAsync).toHaveBeenCalledWith({
                bagId: "BAG-1",
                shipmentIds: ["S1"],
            });

            expect(mocks.showToast).toHaveBeenCalledWith(
                "1 parcel(s) added to BAG-1",
                "success",
            );

            expect(onDone).toHaveBeenCalledWith("BAG-1");
            expect(onClose).toHaveBeenCalled();
        });
    });

    it("shows an error when bag creation fails", async () => {
        mocks.createMutateAsync.mockRejectedValueOnce(new Error("API failed"));

        renderModal();

        fireEvent.change(screen.getByLabelText("Select source hub"), {
            target: { value: "hub-1" },
        });

        fireEvent.change(screen.getByLabelText("Select destination hub"), {
            target: { value: "hub-2" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Create Bag" }));

        await waitFor(() => {
            expect(mocks.getErrorMessage).toHaveBeenCalledWith(
                expect.any(Error),
                "Failed to update bag",
            );

            expect(mocks.showToast).toHaveBeenCalledWith(
                "Something went wrong",
                "error",
            );
        });

        expect(onClose).not.toHaveBeenCalled();
        expect(onDone).not.toHaveBeenCalled();
    });

    it("shows an error when adding shipments fails", async () => {
        mocks.addMutateAsync.mockRejectedValueOnce(new Error("Add failed"));

        renderModal(["S1"]);

        fireEvent.change(screen.getByLabelText("Select bag"), {
            target: { value: "BAG-1" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Add to Bag" }));

        await waitFor(() => {
            expect(mocks.showToast).toHaveBeenCalledWith(
                "Something went wrong",
                "error",
            );
        });

        expect(onClose).not.toHaveBeenCalled();
        expect(onDone).not.toHaveBeenCalled();
    });

    it("calls onClose when Cancel is clicked", () => {
        renderModal();

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });


    it("excludes the source hub from destination options", async () => {
        window.HOST_USER_INFO = { referenceId: "mongo-hub-1" } as any;

        mocks.useHubById.mockReturnValue({
            data: {
                data: {
                    hubId: "hub-1",
                    hubName: "Bengaluru",
                    hubCode: "BLR",
                },
            },
        });

        renderModal();

        const destination = screen.getByLabelText(
            "Select destination hub",
        ) as HTMLSelectElement;

        await waitFor(() => {
            expect(
                Array.from(destination.options).some(
                    (option) => option.value === "hub-1",
                ),
            ).toBe(false);
        });

        expect(
            Array.from(destination.options).some(
                (option) => option.value === "hub-2",
            ),
        ).toBe(true);
    });

});
