import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";

// Mock child components
vi.mock("../components/sidebar", () => ({
    default: () => <div>Sidebar</div>,
}));

vi.mock("../pages/ProductList", () => ({
    default: () => <div>Product List Page</div>,
}));

vi.mock("../pages/OrderList", () => ({
    default: () => <div>Order List Page</div>,
}));

describe("App Component", () => {
    beforeEach(() => {
        window.history.pushState({}, "", "/");
    });

    it("renders Sidebar", () => {
        render(<App />);

        expect(screen.getByText("Sidebar")).toBeInTheDocument();
    });

    it("renders ProductList on default route", () => {
        window.history.pushState({}, "", "/");

        render(<App />);

        expect(screen.getByText("Product List Page")).toBeInTheDocument();
    });

    it("renders ProductList on /products route", () => {
        window.history.pushState({}, "", "/products");

        render(<App />);

        expect(screen.getByText("Product List Page")).toBeInTheDocument();
    });

    it("renders OrderList on /orders route", () => {
        window.history.pushState({}, "", "/orders");

        render(<App />);

        expect(screen.getByText("Order List Page")).toBeInTheDocument();
    });
});