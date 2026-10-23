import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    BAG_STEPS,
    BAG_STATUS_LABEL,
    getNextAction,
    getBadgeClass,
    goTo,
} from "../components/bag/bagFlow";
import type { BagStatus } from "../types/bag";

describe("BAG_STEPS and BAG_STATUS_LABEL", () => {
    it("contains all nine bag statuses in the correct order", () => {
        expect(BAG_STEPS.map((step) => step.status)).toEqual([
            "CREATED",
            "SEALED",
            "ASSIGNED",
            "IN_TRANSIT",
            "ARRIVED",
            "RECEIVED",
            "OPENED",
            "VERIFIED",
            "RELEASED",
        ]);
    });

    it("maps every status to its display label", () => {
        for (const step of BAG_STEPS) {
            expect(BAG_STATUS_LABEL[step.status]).toBe(step.label);
        }
    });
});

describe("getNextAction", () => {
    it.each([
        ["CREATED", "Seal Bag", "SEALED", "source", false],
        ["SEALED", "Assign Agent", "ASSIGNED", "source", true],
        ["ASSIGNED", "Dispatch Bag", "IN_TRANSIT", "source", false],
        ["IN_TRANSIT", "Mark Arrived", "ARRIVED", "destination", false],
        ["ARRIVED", "Mark Received", "RECEIVED", "destination", false],
        ["RECEIVED", "Open Bag", "OPENED", "destination", false],
        ["VERIFIED", "Release Bag", "RELEASED", "destination", false],
    ] as const)(
        "returns the correct action for %s",
        (status, label, next, side, needsAgent) => {
            const action = getNextAction(status);

            expect(action).toMatchObject({
                label,
                next,
                side,
            });

            if (needsAgent) {
                expect(action?.needsAgent).toBe(true);
            } else {
                expect(action?.needsAgent).toBeUndefined();
            }
        }
    );

    it.each(["OPENED", "RELEASED"] as const)(
        "returns null for %s",
        (status) => {
            expect(getNextAction(status)).toBeNull();
        }
    );
});

describe("getBadgeClass", () => {
    it.each([
        ["CREATED", "bg-blue-50 text-blue-700"],
        ["SEALED", "bg-gray-100 text-gray-700"],
        ["ASSIGNED", "bg-violet-50 text-violet-700"],
        ["IN_TRANSIT", "bg-orange-50 text-orange-700"],
        ["ARRIVED", "bg-cyan-50 text-cyan-700"],
        ["RECEIVED", "bg-cyan-50 text-cyan-700"],
        ["OPENED", "bg-amber-50 text-amber-700"],
        ["VERIFIED", "bg-emerald-50 text-emerald-700"],
        ["RELEASED", "bg-emerald-50 text-emerald-700"],
    ] as const)(
        "returns the correct class for %s",
        (status, expectedClass) => {
            expect(getBadgeClass(status)).toBe(expectedClass);
        }
    );

    it("returns the fallback class for an unknown status", () => {
        expect(getBadgeClass("UNKNOWN_STATUS" as BagStatus)).toBe(
            "bg-gray-100 text-gray-700"
        );
    });
});

describe("goTo", () => {
    beforeEach(() => {
        window.history.replaceState({}, "", "/");
    });

    it("updates the browser history path", () => {
        goTo("/bags/test-bag");

        expect(window.location.pathname).toBe("/bags/test-bag");
    });

    it("dispatches a popstate event", () => {
        const listener = vi.fn();

        window.addEventListener("popstate", listener);

        try {
            goTo("/bags");
            expect(listener).toHaveBeenCalledTimes(1);
        } finally {
            window.removeEventListener("popstate", listener);
        }
    });
});