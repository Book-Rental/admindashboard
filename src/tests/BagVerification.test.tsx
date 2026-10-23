import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Bag } from "../types/bag";
import BagVerification from "../components/bag/BagVerification";

const mocks = vi.hoisted(() => ({
    useVerifyScannedShipment: vi.fn(),
    useCompleteBagVerification: vi.fn(),
    showToast: vi.fn(),
    getErrorMessage: vi.fn(),
    verifyMutateAsync: vi.fn(),
    completeMutateAsync: vi.fn(),
}));

vi.mock("../hooks/useBagActions", () => ({
    useVerifyScannedShipment: mocks.useVerifyScannedShipment,
    useCompleteBagVerification: mocks.useCompleteBagVerification,
}));

vi.mock("../utils/showToaster", () => ({
    showToast: mocks.showToast,
}));

vi.mock("../utils/getErrorMessage", () => ({
    getErrorMessage: mocks.getErrorMessage,
}));

vi.mock("@rentbook/rentbook-ui-lib", () => ({
    Rb_Button: ({
        children,
        onClick,
        disabled,
        isLoading,
        type,
    }:
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

    Modal: ({ isOpen, onClose, children }:
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        any) =>
        isOpen ? (
            <div data-testid="mock-modal">
                <button type="button" onClick={onClose}>
                    Close modal
                </button>
                {children}
            </div>
        ) : null,

    ModalHeader: ({ children, onClose }:
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        any) => (
        <div>
            <span>{children}</span>
            <button type="button" onClick={onClose}>
                Close header
            </button>
        </div>
    ),

    ModalBody: ({ children }:
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        any) => (
        <div data-testid="mock-modal-body">{children}</div>
    ),

    // Missing export causing your tests to fail
    ModalFooter: ({ children }:
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        any) => (
        <div data-testid="mock-modal-footer">{children}</div>
    ),
}));

const bag = {
    bagId: "BAG-001",
    shipmentIds: ["shipment-1", "shipment-2"],
    verifiedShipmentIds: ["shipment-1"],
} as unknown as Bag;

function renderComponent(
    overrides: { bag?: Bag; canAct?: boolean } = {},
) {
    return render(
        <BagVerification
            bag={overrides.bag ?? bag}
            canAct={overrides.canAct ?? true}
        />,
    );
}

describe("BagVerification", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mocks.verifyMutateAsync.mockResolvedValue({});
        mocks.completeMutateAsync.mockResolvedValue({});

        mocks.useVerifyScannedShipment.mockReturnValue({
            mutateAsync: mocks.verifyMutateAsync,
            isPending: false,
        });

        mocks.useCompleteBagVerification.mockReturnValue({
            mutateAsync: mocks.completeMutateAsync,
            isPending: false,
        });

        mocks.getErrorMessage.mockReturnValue("Something went wrong");
    });

    it("renders the verification count and progress", () => {
        renderComponent();

        expect(screen.getByText("Verify Parcels")).toBeTruthy();
        expect(screen.getByText("1 of 2 verified")).toBeTruthy();

        const progress = document.querySelector(
            ".bg-emerald-500",
        ) as HTMLDivElement;

        expect(progress.style.width).toBe("50%");
    });

    it("shows zero progress when the bag has no shipments", () => {
        renderComponent({
            bag: {
                ...bag,
                shipmentIds: [],
                verifiedShipmentIds: [],
            } as unknown as Bag,
        });

        expect(screen.getByText("0 of 0 verified")).toBeTruthy();

        const progress = document.querySelector(
            ".bg-emerald-500",
        ) as HTMLDivElement;

        expect(progress.style.width).toBe("0%");
    });

    it("hides action controls when the user cannot act", () => {
        renderComponent({ canAct: false });

        expect(
            screen.queryByPlaceholderText("Scan or type AWB number"),
        ).toBeNull();
        expect(screen.queryByText("Verify Parcel")).toBeNull();
        expect(screen.queryByText("Complete Verification")).toBeNull();
    });

    it("keeps Verify Parcel disabled when the input is empty", () => {
        renderComponent();

        expect(
            screen.getByText("Verify Parcel").hasAttribute("disabled"),
        ).toBe(true);
    });

    it("verifies a trimmed AWB and clears the input on success", async () => {
        renderComponent();

        const input = screen.getByPlaceholderText("Scan or type AWB number");

        fireEvent.change(input, { target: { value: "  AWB-123  " } });
        fireEvent.click(screen.getByText("Verify Parcel"));

        await waitFor(() => {
            expect(mocks.verifyMutateAsync).toHaveBeenCalledWith({
                bagId: "BAG-001",
                awbNumber: "AWB-123",
            });
        });

        await waitFor(() => {
            expect(mocks.showToast).toHaveBeenCalledWith(
                "AWB-123 verified",
                "success",
            );
            expect(input).toHaveProperty("value", "");
        });
    });

    it("verifies an AWB when Enter is pressed", async () => {
        renderComponent();

        const input = screen.getByPlaceholderText("Scan or type AWB number");

        fireEvent.change(input, { target: { value: "AWB-456" } });
        fireEvent.keyDown(input, { key: "Enter" });

        await waitFor(() => {
            expect(mocks.verifyMutateAsync).toHaveBeenCalledWith({
                bagId: "BAG-001",
                awbNumber: "AWB-456",
            });
        });
    });

    it("does not verify when the AWB contains only whitespace", async () => {
        renderComponent();

        const input = screen.getByPlaceholderText("Scan or type AWB number");

        fireEvent.change(input, { target: { value: "   " } });
        fireEvent.keyDown(input, { key: "Enter" });

        await waitFor(() => {
            expect(mocks.verifyMutateAsync).not.toHaveBeenCalled();
        });
    });

    it("shows an error toast when parcel verification fails", async () => {
        mocks.verifyMutateAsync.mockRejectedValueOnce(
            new Error("API failed"),
        );
        mocks.getErrorMessage.mockReturnValueOnce("Failed to verify parcel");

        renderComponent();

        fireEvent.change(
            screen.getByPlaceholderText("Scan or type AWB number"),
            { target: { value: "AWB-ERROR" } },
        );
        fireEvent.click(screen.getByText("Verify Parcel"));

        await waitFor(() => {
            expect(mocks.getErrorMessage).toHaveBeenCalledWith(
                expect.any(Error),
                "Failed to verify parcel",
            );
            expect(mocks.showToast).toHaveBeenCalledWith(
                "Failed to verify parcel",
                "error",
            );
        });
    });

    it("keeps Complete Verification disabled until every shipment is verified", () => {
        renderComponent();

        expect(
            screen.getByText("Complete Verification").hasAttribute("disabled"),
        ).toBe(true);
    });

    it("enables completion when all shipments are verified", () => {
        renderComponent({
            bag: {
                ...bag,
                verifiedShipmentIds: ["shipment-1", "shipment-2"],
            } as unknown as Bag,
        });

        expect(
            screen.getByText("Complete Verification").hasAttribute("disabled"),
        ).toBe(false);
    });

    it("completes verification successfully", async () => {
        renderComponent({
            bag: {
                ...bag,
                verifiedShipmentIds: ["shipment-1", "shipment-2"],
            } as unknown as Bag,
        });

        fireEvent.click(screen.getByText("Complete Verification"));

        await waitFor(() => {
            expect(mocks.completeMutateAsync).toHaveBeenCalledWith("BAG-001");
            expect(mocks.showToast).toHaveBeenCalledWith(
                "Bag verification completed",
                "success",
            );
        });
    });

    it("shows an error toast when completing verification fails", async () => {
        mocks.completeMutateAsync.mockRejectedValueOnce(
            new Error("Completion failed"),
        );
        mocks.getErrorMessage.mockReturnValueOnce(
            "Failed to complete verification",
        );

        renderComponent({
            bag: {
                ...bag,
                verifiedShipmentIds: ["shipment-1", "shipment-2"],
            } as unknown as Bag,
        });

        fireEvent.click(screen.getByText("Complete Verification"));

        await waitFor(() => {
            expect(mocks.getErrorMessage).toHaveBeenCalledWith(
                expect.any(Error),
                "Failed to complete verification",
            );
            expect(mocks.showToast).toHaveBeenCalledWith(
                "Failed to complete verification",
                "error",
            );
        });
    });
});