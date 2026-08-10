import {
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import App from "../App";

/* =========================================
   Component mocks
========================================= */

vi.mock("../components/sidebar", () => ({
  default: () => (
    <div>Sidebar</div>
  ),
}));

vi.mock("../pages/DeliveryAgentList", () => ({
  default: () => (
    <div>Delivery Agent List Page</div>
  ),
}));

vi.mock("../pages/AddAgent", () => ({
  default: () => (
    <div>Add Agent Page</div>
  ),
}));

vi.mock("../pages/EditAgent", () => ({
  default: () => (
    <div>Edit Agent Page</div>
  ),
}));

vi.mock("../pages/AgentDetails", () => ({
  default: () => (
    <div>Agent Details Page</div>
  ),
}));

vi.mock("../pages/ShipmentList", () => ({
  default: () => (
    <div>Shipment List Page</div>
  ),
}));

vi.mock("../pages/ShipmentDetails", () => ({
  default: () => (
    <div>Shipment Details Page</div>
  ),
}));

vi.mock("../pages/DestinationShipment", () => ({
  default: () => (
    <div>
      Destination Shipment Page
    </div>
  ),
}));

/* =========================================
   Tests
========================================= */

describe("App Component", () => {
  it("renders Sidebar", () => {
    render(<App />);

    expect(
      screen.getByText("Sidebar")
    ).toBeInTheDocument();
  });

  it(
    "renders DeliveryAgentList by default",
    () => {
      render(<App />);

      expect(
        screen.getByText(
          "Delivery Agent List Page"
        )
      ).toBeInTheDocument();
    }
  );

  it(
    "renders DeliveryAgentList for admin view",
    () => {
      render(
        <App view="admin" />
      );

      expect(
        screen.getByText(
          "Delivery Agent List Page"
        )
      ).toBeInTheDocument();
    }
  );

  it(
    "renders DeliveryAgentList for agents view",
    () => {
      render(
        <App view="agents" />
      );

      expect(
        screen.getByText(
          "Delivery Agent List Page"
        )
      ).toBeInTheDocument();
    }
  );

  it(
    "renders AddAgent for create-agent view",
    () => {
      render(
        <App view="create-agent" />
      );

      expect(
        screen.getByText(
          "Add Agent Page"
        )
      ).toBeInTheDocument();
    }
  );

  it(
    "renders EditAgent for edit-agent view",
    () => {
      render(
        <App view="edit-agent" />
      );

      expect(
        screen.getByText(
          "Edit Agent Page"
        )
      ).toBeInTheDocument();
    }
  );

  it(
    "renders AgentDetails for agent-details view",
    () => {
      render(
        <App view="agent-details" />
      );

      expect(
        screen.getByText(
          "Agent Details Page"
        )
      ).toBeInTheDocument();
    }
  );

  it(
    "renders ShipmentList for orders view",
    () => {
      render(
        <App view="orders" />
      );

      expect(
        screen.getByText(
          "Shipment List Page"
        )
      ).toBeInTheDocument();
    }
  );

  it(
    "renders ShipmentDetails for order-details view",
    () => {
      render(
        <App view="order-details" />
      );

      expect(
        screen.getByText(
          "Shipment Details Page"
        )
      ).toBeInTheDocument();
    }
  );

  it(
    "renders DestinationShipment for destination-shipments view",
    () => {
      render(
        <App view="destination-shipments" />
      );

      expect(
        screen.getByText(
          "Destination Shipment Page"
        )
      ).toBeInTheDocument();
    }
  );
});
