import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";

// Mock Sidebar
vi.mock("../components/sidebar", () => ({
  default: () => <div>Sidebar</div>,
}));

// Mock DeliveryAgentList
vi.mock("../pages/DeliveryAgentList", () => ({
  default: () => <div>Delivery Agent List Page</div>,
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

// Mock ShipmentList
vi.mock("../pages/ShipmentList", () => ({
  default: () => <div>Shipment List Page</div>,
}));

// Mock ShipmentDetails
vi.mock("../pages/ShipmentDetails", () => ({
  default: () => <div>Shipment Details Page</div>,
}));

describe("App Component", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("renders Sidebar", () => {
    render(<App />);

    expect(screen.getByText("Sidebar")).toBeInTheDocument();
  });

  it("renders DeliveryAgentList on default route", () => {
    window.history.pushState({}, "", "/");

    render(<App />);

    expect(
      screen.getByText("Delivery Agent List Page")
    ).toBeInTheDocument();
  });

  it("renders DeliveryAgentList on /agents route", () => {
    window.history.pushState({}, "", "/agents");

    render(<App />);

    expect(
      screen.getByText("Delivery Agent List Page")
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
    window.history.pushState({}, "", "/agents/123/edit");

    render(<App />);

    expect(
      screen.getByText("Edit Agent Page")
    ).toBeInTheDocument();
  });

  it("renders AgentDetails on /agents/:id route", () => {
    window.history.pushState({}, "", "/agents/123");

    render(<App />);

    expect(
      screen.getByText("Agent Details Page")
    ).toBeInTheDocument();
  });

  it("renders ShipmentList on /orders route", () => {
    window.history.pushState({}, "", "/orders");

    render(<App />);

    expect(
      screen.getByText("Shipment List Page")
    ).toBeInTheDocument();
  });

  it("renders ShipmentDetails on /orders/:id route", () => {
    window.history.pushState({}, "", "/orders/123");

    render(<App />);

    expect(
      screen.getByText("Shipment Details Page")
    ).toBeInTheDocument();
  });

  it("renders DeliveryAgentList for unknown routes", () => {
    window.history.pushState({}, "", "/unknown-route");

    render(<App />);

    expect(
      screen.getByText("Delivery Agent List Page")
    ).toBeInTheDocument();
  });

  it("handles trailing slash on /agents route", () => {
    window.history.pushState({}, "", "/agents/");

    render(<App />);

    expect(
      screen.getByText("Delivery Agent List Page")
    ).toBeInTheDocument();
  });

  it("handles trailing slash on /agents/new route", () => {
    window.history.pushState({}, "", "/agents/new/");

    render(<App />);

    expect(
      screen.getByText("Add Agent Page")
    ).toBeInTheDocument();
  });

  it("handles trailing slash on /orders route", () => {
    window.history.pushState({}, "", "/orders/");

    render(<App />);

    expect(
      screen.getByText("Shipment List Page")
    ).toBeInTheDocument();
  });

  it("handles trailing slash on /orders/:id route", () => {
    window.history.pushState({}, "", "/orders/123/");

    render(<App />);

    expect(
      screen.getByText("Shipment Details Page")
    ).toBeInTheDocument();
  });

  it("updates route when popstate event is triggered", () => {
    window.history.pushState({}, "", "/");

    render(<App />);

    expect(
      screen.getByText("Delivery Agent List Page")
    ).toBeInTheDocument();

    act(() => {
      window.history.pushState({}, "", "/agents/new");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(
      screen.getByText("Add Agent Page")
    ).toBeInTheDocument();

    act(() => {
      window.history.pushState({}, "", "/orders");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(
      screen.getByText("Shipment List Page")
    ).toBeInTheDocument();

    act(() => {
      window.history.pushState({}, "", "/orders/123");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(
      screen.getByText("Shipment Details Page")
    ).toBeInTheDocument();
  });
});