import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import {
  render,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";

import Sidebar from "../components/sidebar";

describe("Sidebar", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/agents");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ---------------------------------------------------------
  // RENDERING
  // ---------------------------------------------------------

  it("renders the sidebar navigation items", () => {
    render(<Sidebar />);

    expect(screen.getByText("RentBook")).toBeInTheDocument();

    expect(
      screen.getByText("Admin Dashboard")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Main Menu")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Delivery Agents")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Orders")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Destination hub orders")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Hubs")
    ).toBeInTheDocument();
  });

  // ---------------------------------------------------------
  // ACTIVE ROUTES
  // ---------------------------------------------------------

  it("marks Delivery Agents as active when current path is /agents", () => {
    window.history.pushState({}, "", "/agents");

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
      name: /^orders$/i,
    });

    expect(ordersButton).toHaveClass(
      "bg-blue-50",
      "text-blue-600",
      "border-blue-600"
    );
  });

  it("marks Destination hub orders as active when current path is /destination-shipments", () => {
    window.history.pushState(
      {},
      "",
      "/destination-shipments"
    );

    render(<Sidebar />);

    const destinationShipmentsButton =
      screen.getByRole("button", {
        name: /destination hub orders/i,
      });

    expect(destinationShipmentsButton).toHaveClass(
      "bg-blue-50",
      "text-blue-600",
      "border-blue-600"
    );
  });

  it("marks Hubs as active when current path is /hubs", () => {
    window.history.pushState({}, "", "/hubs");

    render(<Sidebar />);

    const hubsButton = screen.getByRole("button", {
      name: /^hubs$/i,
    });

    expect(hubsButton).toHaveClass(
      "bg-blue-50",
      "text-blue-600",
      "border-blue-600"
    );
  });

  // ---------------------------------------------------------
  // NAVIGATION
  // ---------------------------------------------------------

  it("navigates to Orders when Orders is clicked", () => {
    render(<Sidebar />);

    const dispatchEventSpy = vi.spyOn(
      window,
      "dispatchEvent"
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /^orders$/i,
      })
    );

    expect(window.location.pathname).toBe("/orders");

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "popstate",
      })
    );
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

  it("navigates to Destination hub orders when clicked", () => {
    render(<Sidebar />);

    const dispatchEventSpy = vi.spyOn(
      window,
      "dispatchEvent"
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /destination hub orders/i,
      })
    );

    expect(window.location.pathname).toBe(
      "/destination-shipments"
    );

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "popstate",
      })
    );
  });

  it("navigates to Hubs when Hubs is clicked", () => {
    render(<Sidebar />);

    const dispatchEventSpy = vi.spyOn(
      window,
      "dispatchEvent"
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /^hubs$/i,
      })
    );

    expect(window.location.pathname).toBe("/hubs");

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "popstate",
      })
    );
  });

  // ---------------------------------------------------------
  // CURRENT ROUTE
  // ---------------------------------------------------------

  it("does not navigate when clicking the current active route", () => {
    window.history.pushState({}, "", "/agents");

    render(<Sidebar />);

    const pushStateSpy = vi.spyOn(
      window.history,
      "pushState"
    );

    const dispatchEventSpy = vi.spyOn(
      window,
      "dispatchEvent"
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /delivery agents/i,
      })
    );

    expect(pushStateSpy).not.toHaveBeenCalled();

    expect(dispatchEventSpy).not.toHaveBeenCalled();
  });

  it("does not navigate when clicking the current Orders route", () => {
    window.history.pushState({}, "", "/orders");

    render(<Sidebar />);

    const pushStateSpy = vi.spyOn(
      window.history,
      "pushState"
    );

    const dispatchEventSpy = vi.spyOn(
      window,
      "dispatchEvent"
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /^orders$/i,
      })
    );

    expect(pushStateSpy).not.toHaveBeenCalled();

    expect(dispatchEventSpy).not.toHaveBeenCalled();
  });

  it("does not navigate when clicking the current Destination hub orders route", () => {
    window.history.pushState(
      {},
      "",
      "/destination-shipments"
    );

    render(<Sidebar />);

    const pushStateSpy = vi.spyOn(
      window.history,
      "pushState"
    );

    const dispatchEventSpy = vi.spyOn(
      window,
      "dispatchEvent"
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /destination hub orders/i,
      })
    );

    expect(pushStateSpy).not.toHaveBeenCalled();

    expect(dispatchEventSpy).not.toHaveBeenCalled();
  });

  it("does not navigate when clicking the current Hubs route", () => {
    window.history.pushState({}, "", "/hubs");

    render(<Sidebar />);

    const pushStateSpy = vi.spyOn(
      window.history,
      "pushState"
    );

    const dispatchEventSpy = vi.spyOn(
      window,
      "dispatchEvent"
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /^hubs$/i,
      })
    );

    expect(pushStateSpy).not.toHaveBeenCalled();

    expect(dispatchEventSpy).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------
  // MOBILE SIDEBAR TOGGLE
  // ---------------------------------------------------------

  it("opens the mobile sidebar when toggle-mobile-sidebar event is dispatched", () => {
    render(<Sidebar />);

    const sidebar = screen.getByRole("complementary");

    expect(sidebar).toHaveClass("-translate-x-full");

    act(() => {
      window.dispatchEvent(
        new Event("toggle-mobile-sidebar")
      );
    });

    expect(sidebar).toHaveClass("translate-x-0");
  });

  it("closes the mobile sidebar when toggle-mobile-sidebar event is dispatched twice", () => {
    render(<Sidebar />);

    const sidebar = screen.getByRole("complementary");

    act(() => {
      window.dispatchEvent(
        new Event("toggle-mobile-sidebar")
      );
    });

    expect(sidebar).toHaveClass("translate-x-0");

    act(() => {
      window.dispatchEvent(
        new Event("toggle-mobile-sidebar")
      );
    });

    expect(sidebar).toHaveClass("-translate-x-full");
  });

  it("closes the mobile sidebar when the close button is clicked", () => {
    render(<Sidebar />);

    const sidebar = screen.getByRole("complementary");

    act(() => {
      window.dispatchEvent(
        new Event("toggle-mobile-sidebar")
      );
    });

    expect(sidebar).toHaveClass("translate-x-0");

    fireEvent.click(
      screen.getByLabelText("Close sidebar")
    );

    expect(sidebar).toHaveClass("-translate-x-full");
  });

  it("closes the mobile sidebar when overlay is clicked", () => {
    const { container } = render(<Sidebar />);

    const sidebar = screen.getByRole("complementary");

    act(() => {
      window.dispatchEvent(
        new Event("toggle-mobile-sidebar")
      );
    });

    expect(sidebar).toHaveClass("translate-x-0");

    const overlay = container.querySelector(
      ".fixed.top-16.inset-x-0.bottom-0"
    );

    expect(overlay).toBeInTheDocument();

    fireEvent.click(overlay!);

    expect(sidebar).toHaveClass("-translate-x-full");
  });

  // ---------------------------------------------------------
  // POPSTATE
  // ---------------------------------------------------------

  it("updates active route when popstate event is triggered", () => {
    window.history.pushState({}, "", "/agents");

    render(<Sidebar />);

    expect(
      screen.getByRole("button", {
        name: /delivery agents/i,
      })
    ).toHaveClass("bg-blue-50");

    act(() => {
      window.history.pushState({}, "", "/orders");

      window.dispatchEvent(
        new PopStateEvent("popstate")
      );
    });

    expect(
      screen.getByRole("button", {
        name: /^orders$/i,
      })
    ).toHaveClass("bg-blue-50");

    expect(
      screen.getByRole("button", {
        name: /delivery agents/i,
      })
    ).not.toHaveClass("bg-blue-50");
  });

  it("updates active route to Destination hub orders on popstate", () => {
    window.history.pushState({}, "", "/agents");

    render(<Sidebar />);

    act(() => {
      window.history.pushState(
        {},
        "",
        "/destination-shipments"
      );

      window.dispatchEvent(
        new PopStateEvent("popstate")
      );
    });

    expect(
      screen.getByRole("button", {
        name: /destination hub orders/i,
      })
    ).toHaveClass("bg-blue-50");

    expect(
      screen.getByRole("button", {
        name: /delivery agents/i,
      })
    ).not.toHaveClass("bg-blue-50");
  });

  it("updates active route to Hubs on popstate", () => {
    window.history.pushState({}, "", "/agents");

    render(<Sidebar />);

    act(() => {
      window.history.pushState({}, "", "/hubs");

      window.dispatchEvent(
        new PopStateEvent("popstate")
      );
    });

    expect(
      screen.getByRole("button", {
        name: /^hubs$/i,
      })
    ).toHaveClass("bg-blue-50");

    expect(
      screen.getByRole("button", {
        name: /delivery agents/i,
      })
    ).not.toHaveClass("bg-blue-50");
  });

  // ---------------------------------------------------------
  // TRAILING SLASH
  // ---------------------------------------------------------

  it("handles trailing slash in Orders path", () => {
    window.history.pushState({}, "", "/orders/");

    render(<Sidebar />);

    expect(
      screen.getByRole("button", {
        name: /^orders$/i,
      })
    ).toHaveClass(
      "bg-blue-50",
      "text-blue-600",
      "border-blue-600"
    );
  });

  it("handles trailing slash in Destination hub orders path", () => {
    window.history.pushState(
      {},
      "",
      "/destination-shipments/"
    );

    render(<Sidebar />);

    expect(
      screen.getByRole("button", {
        name: /destination hub orders/i,
      })
    ).toHaveClass(
      "bg-blue-50",
      "text-blue-600",
      "border-blue-600"
    );
  });

  it("handles trailing slash in Hubs path", () => {
    window.history.pushState({}, "", "/hubs/");

    render(<Sidebar />);

    expect(
      screen.getByRole("button", {
        name: /^hubs$/i,
      })
    ).toHaveClass(
      "bg-blue-50",
      "text-blue-600",
      "border-blue-600"
    );
  });

  // ---------------------------------------------------------
  // NESTED ROUTES
  // ---------------------------------------------------------

  it("keeps Delivery Agents active for nested agent routes", () => {
    window.history.pushState(
      {},
      "",
      "/agents/edit/123"
    );

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

  it("keeps Orders active for nested order routes", () => {
    window.history.pushState(
      {},
      "",
      "/orders/123"
    );

    render(<Sidebar />);

    expect(
      screen.getByRole("button", {
        name: /^orders$/i,
      })
    ).toHaveClass(
      "bg-blue-50",
      "text-blue-600",
      "border-blue-600"
    );
  });

  it("keeps Destination hub orders active for nested routes", () => {
    window.history.pushState(
      {},
      "",
      "/destination-shipments/123"
    );

    render(<Sidebar />);

    expect(
      screen.getByRole("button", {
        name: /destination hub orders/i,
      })
    ).toHaveClass(
      "bg-blue-50",
      "text-blue-600",
      "border-blue-600"
    );
  });

  it("keeps Hubs active for nested hub routes", () => {
    window.history.pushState(
      {},
      "",
      "/hubs/123"
    );

    render(<Sidebar />);

    expect(
      screen.getByRole("button", {
        name: /^hubs$/i,
      })
    ).toHaveClass(
      "bg-blue-50",
      "text-blue-600",
      "border-blue-600"
    );
  });

  // ---------------------------------------------------------
  // SIDEBAR CLOSE AFTER NAVIGATION
  // ---------------------------------------------------------

  it("closes the mobile sidebar after navigation to Orders", () => {
    render(<Sidebar />);

    const sidebar = screen.getByRole("complementary");

    act(() => {
      window.dispatchEvent(
        new Event("toggle-mobile-sidebar")
      );
    });

    expect(sidebar).toHaveClass("translate-x-0");

    fireEvent.click(
      screen.getByRole("button", {
        name: /^orders$/i,
      })
    );

    expect(window.location.pathname).toBe("/orders");

    expect(sidebar).toHaveClass("-translate-x-full");
  });

  it("closes the mobile sidebar after navigation to Destination hub orders", () => {
    render(<Sidebar />);

    const sidebar = screen.getByRole("complementary");

    act(() => {
      window.dispatchEvent(
        new Event("toggle-mobile-sidebar")
      );
    });

    expect(sidebar).toHaveClass("translate-x-0");

    fireEvent.click(
      screen.getByRole("button", {
        name: /destination hub orders/i,
      })
    );

    expect(window.location.pathname).toBe(
      "/destination-shipments"
    );

    expect(sidebar).toHaveClass("-translate-x-full");
  });

  it("closes the mobile sidebar after navigation to Hubs", () => {
    render(<Sidebar />);

    const sidebar = screen.getByRole("complementary");

    act(() => {
      window.dispatchEvent(
        new Event("toggle-mobile-sidebar")
      );
    });

    expect(sidebar).toHaveClass("translate-x-0");

    fireEvent.click(
      screen.getByRole("button", {
        name: /^hubs$/i,
      })
    );

    expect(window.location.pathname).toBe("/hubs");

    expect(sidebar).toHaveClass("-translate-x-full");
  });

  // ---------------------------------------------------------
  // CLEANUP / EVENT LISTENER
  // ---------------------------------------------------------

  it("removes the toggle event listener when component unmounts", () => {
    const { unmount } = render(<Sidebar />);

    const sidebar = screen.getByRole("complementary");

    unmount();

    act(() => {
      window.dispatchEvent(
        new Event("toggle-mobile-sidebar")
      );
    });

    expect(sidebar).toHaveClass("-translate-x-full");
  });
});