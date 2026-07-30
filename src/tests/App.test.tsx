import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";

// Mock Sidebar
vi.mock("../components/sidebar", () => ({
    default: () => <div>Sidebar</div>,
}));

// Mock OrderList
vi.mock("../pages/OrderList", () => ({
    default: () => <div>Order List Page</div>,
}));

// Mock AgentList
vi.mock("../pages/AgentList", () => ({
    default: () => <div>Agent List Page</div>,
}));

// Mock AddAgent
vi.mock("../pages/AddAgent", () => ({
    default: () => <div>Add Agent Page</div>,
}));

// Mock EditAgent
vi.mock("../pages/EditAgent", () => ({
    default: () => <div>Edit Agent Page</div>,
}));

// Mock AgentDetails
vi.mock("../pages/AgentDetails", () => ({
    default: () => <div>Agent Details Page</div>,
}));

describe("App Component", () => {
    beforeEach(() => {
        window.history.pushState({}, "", "/");
    });

    it("renders Sidebar", () => {
        render(<App />);

        expect(
            screen.getByText("Sidebar")
        ).toBeInTheDocument();
    });

    it("renders OrderList on default route", () => {
        window.history.pushState({}, "", "/");

        render(<App />);

        expect(
            screen.getByText("Order List Page")
        ).toBeInTheDocument();
    });

    it("renders AgentList on /agents route", () => {
        window.history.pushState({}, "", "/agents");

        render(<App />);

        expect(
            screen.getByText("Agent List Page")
        ).toBeInTheDocument();
    });

    it("renders AddAgent on /agents/new route", () => {
        window.history.pushState({}, "", "/agents/new");

        render(<App />);

        expect(
            screen.getByText("Add Agent Page")
        ).toBeInTheDocument();
    });

    it("renders EditAgent on /agents/:id/edit route", () => {
        window.history.pushState(
            {},
            "",
            "/agents/123/edit"
        );

        render(<App />);

        expect(
            screen.getByText("Edit Agent Page")
        ).toBeInTheDocument();
    });

    it("renders AgentDetails on /agents/:id route", () => {
        window.history.pushState(
            {},
            "",
            "/agents/123"
        );

        render(<App />);

        expect(
            screen.getByText("Agent Details Page")
        ).toBeInTheDocument();
    });

    it("renders OrderList on /orders route", () => {
        window.history.pushState({}, "", "/orders");

        render(<App />);

        expect(
            screen.getByText("Order List Page")
        ).toBeInTheDocument();
    });

    it("renders OrderList on nested /orders route", () => {
        window.history.pushState(
            {},
            "",
            "/orders/123"
        );

        render(<App />);

        expect(
            screen.getByText("Order List Page")
        ).toBeInTheDocument();
    });
});