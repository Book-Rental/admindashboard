import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BagStatusBadge from "../components/bag/BagStatusBadge";
import BagStatusStepper from "../components/bag/BagStatusStepper";
import { BAG_STEPS, BAG_STATUS_LABEL } from "../components/bag/bagFlow";
import type { BagStatus } from "../types/bag";

describe("BagStatusBadge", () => {
  it("renders the label for a known status", () => {
    const status = "CREATED" as BagStatus;

    render(<BagStatusBadge status={status} />);

    expect(
      screen.getByText(BAG_STATUS_LABEL[status])
    ).toBeInTheDocument();
  });

  it("renders the raw status when no label exists", () => {
    const status = "UNKNOWN_STATUS" as BagStatus;

    render(<BagStatusBadge status={status} />);

    expect(screen.getByText(status)).toBeInTheDocument();
  });

  it("applies the badge classes returned by getBadgeClass", () => {
    const status = "SEALED" as BagStatus;

    const { container } = render(<BagStatusBadge status={status} />);

    expect(container.querySelector("span")?.className).toContain(
      "inline-block"
    );
    expect(container.querySelector("span")?.className).toContain(
      "whitespace-nowrap"
    );
  });
});

describe("BagStatusStepper", () => {
  it("renders every configured step label", () => {
    render(<BagStatusStepper status="CREATED" />);

    for (const step of BAG_STEPS) {
      expect(screen.getByText(step.label)).toBeInTheDocument();
    }
  });

  it("marks the current step as active", () => {
    const currentStep = BAG_STEPS[1];

    render(<BagStatusStepper status={currentStep.status} />);

    const currentLabel = screen.getByText(currentStep.label);

    expect(currentLabel.className).toContain("font-semibold");
    expect(currentLabel.className).toContain("text-gray-900");
  });

  it("shows completed checkmarks for steps before the current step", () => {
    const currentIndex = Math.min(2, BAG_STEPS.length - 1);
    const currentStep = BAG_STEPS[currentIndex];

    render(<BagStatusStepper status={currentStep.status} />);

    const completedSteps = BAG_STEPS.slice(0, currentIndex);

    for (const step of completedSteps) {
      const stepItem = screen.getByText(step.label).closest("li");

      expect(stepItem).not.toBeNull();
      expect(stepItem).toHaveTextContent("✓");
    }
  });

  it("renders numbered indicators for incomplete steps", () => {
    render(<BagStatusStepper status={BAG_STEPS[0].status} />);

    const lastStep = BAG_STEPS[BAG_STEPS.length - 1];
    const lastStepItem = screen.getByText(lastStep.label).closest("li");

    expect(lastStepItem).not.toBeNull();
    expect(lastStepItem).toHaveTextContent(
      String(BAG_STEPS.length)
    );
  });

  it("renders the horizontal scrolling container", () => {
    const { container } = render(
      <BagStatusStepper status="CREATED" />
    );

    expect(
      container.querySelector(".overflow-x-auto")
    ).toBeInTheDocument();
  });
});