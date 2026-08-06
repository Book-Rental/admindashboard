import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Sidebar from "../components/sidebar";

describe("Sidebar", () => {
    beforeEach(() => {
        window.history.pushState({}, "", "/agents");
    });

    it("renders the sidebar navigation items", () => {
        render(<Sidebar />);

        expect(screen.getByText("RentBook")).toBeInTheDocument();
        expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Main Menu")).toBeInTheDocument();

        expect(screen.getByText("Delivery Agents")).toBeInTheDocument();
        expect(screen.getByText("Orders")).toBeInTheDocument();
    });

    it("marks Delivery Agents as active when current path is /agents", () => {
        render(<Sidebar />);

        const deliveryAgentsButton = screen.getByRole("button", {
            name: /delivery agents/i,
        });

        expect(deliveryAgentsButton).toHaveClass(
            "bg-blue-50",
            "text-blue-600",
            "border-blue-600"
        );
    });

    it("marks Orders as active when current path is /orders", () => {
        window.history.pushState({}, "", "/orders");

        render(<Sidebar />);

        const ordersButton = screen.getByRole("button", {
            name: /orders/i,
        });

        expect(ordersButton).toHaveClass(
            "bg-blue-50",
            "text-blue-600",
            "border-blue-600"
        );
    });

    it("navigates to Orders when Orders is clicked", () => {
        render(<Sidebar />);

        const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

        fireEvent.click(
            screen.getByRole("button", {
                name: /orders/i,
            })
        );

        expect(window.location.pathname).toBe("/orders");

        expect(dispatchEventSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "popstate",
            })
        );

        dispatchEventSpy.mockRestore();
    });

    it("navigates to Delivery Agents when Delivery Agents is clicked", () => {
        window.history.pushState({}, "", "/orders");

        render(<Sidebar />);

        fireEvent.click(
            screen.getByRole("button", {
                name: /delivery agents/i,
            })
        );

        expect(window.location.pathname).toBe("/agents");
    });

    it("does not navigate when clicking the current active route", () => {
        render(<Sidebar />);

        const pushStateSpy = vi.spyOn(window.history, "pushState");
        const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

        fireEvent.click(
            screen.getByRole("button", {
                name: /delivery agents/i,
            })
        );

        expect(pushStateSpy).not.toHaveBeenCalled();
        expect(dispatchEventSpy).not.toHaveBeenCalled();

        pushStateSpy.mockRestore();
        dispatchEventSpy.mockRestore();
    });

    it("opens and closes the mobile sidebar using buttons", () => {
        render(<Sidebar />);

        fireEvent.click(screen.getByLabelText("Open sidebar"));

        const sidebar = screen.getByRole("complementary");

        expect(sidebar).toHaveClass("translate-x-0");

        fireEvent.click(screen.getByLabelText("Close sidebar"));

        expect(sidebar).toHaveClass("-translate-x-full");
    });

    it("closes the mobile sidebar when overlay is clicked", () => {
        const { container } = render(<Sidebar />);

        fireEvent.click(screen.getByLabelText("Open sidebar"));

        const sidebar = screen.getByRole("complementary");

        expect(sidebar).toHaveClass("translate-x-0");

        const overlay = container.querySelector(
            ".fixed.top-16.inset-x-0.bottom-0"
        );

        expect(overlay).toBeInTheDocument();

        fireEvent.click(overlay!);

        expect(sidebar).toHaveClass("-translate-x-full");
    });

    it("updates active route when popstate event is triggered", () => {
        render(<Sidebar />);

        expect(
            screen.getByRole("button", {
                name: /delivery agents/i,
            })
        ).toHaveClass("bg-blue-50");

        act(() => {
            window.history.pushState({}, "", "/orders");
            window.dispatchEvent(new PopStateEvent("popstate"));
        });

        expect(
            screen.getByRole("button", {
                name: /orders/i,
            })
        ).toHaveClass("bg-blue-50");
    });

    it("handles trailing slash in current path", () => {
        window.history.pushState({}, "", "/orders/");

        render(<Sidebar />);

        expect(
            screen.getByRole("button", {
                name: /orders/i,
            })
        ).toHaveClass(
            "bg-blue-50",
            "text-blue-600",
            "border-blue-600"
        );
    });

    it("keeps Delivery Agents active for nested agent routes", () => {
        window.history.pushState({}, "", "/agents/edit/123");

        render(<Sidebar />);

        expect(
            screen.getByRole("button", {
                name: /delivery agents/i,
            })
        ).toHaveClass(
            "bg-blue-50",
            "text-blue-600",
            "border-blue-600"
        );
    });

    it("closes the mobile sidebar after navigation", () => {
        render(<Sidebar />);

        fireEvent.click(screen.getByLabelText("Open sidebar"));

        const sidebar = screen.getByRole("complementary");

        expect(sidebar).toHaveClass("translate-x-0");

        fireEvent.click(
            screen.getByRole("button", {
                name: /orders/i,
            })
        );

        expect(sidebar).toHaveClass("-translate-x-full");
    });
});