import { describe, it, expect, vi, beforeEach } from "vitest";
import { showToast } from "../utils/showToaster";

describe("showToast", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("dispatches success toast event", () => {
        const dispatchSpy = vi.spyOn(
            window,
            "dispatchEvent"
        );

        showToast("Agent created successfully", "success");

        expect(dispatchSpy).toHaveBeenCalledTimes(1);

        expect(dispatchSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "app-toast-notification",
            })
        );

        const event = dispatchSpy.mock.calls[0][0] as CustomEvent;

        expect(event.detail).toEqual({
            message: "Agent created successfully",
            type: "success",
        });
    });

    it("dispatches error toast event", () => {
        const dispatchSpy = vi.spyOn(
            window,
            "dispatchEvent"
        );

        showToast("Failed to create agent", "error");

        const event = dispatchSpy.mock.calls[0][0] as CustomEvent;

        expect(event.detail).toEqual({
            message: "Failed to create agent",
            type: "error",
        });
    });

    it("dispatches loading toast event", () => {
        const dispatchSpy = vi.spyOn(
            window,
            "dispatchEvent"
        );

        showToast("Loading...", "loading");

        const event = dispatchSpy.mock.calls[0][0] as CustomEvent;

        expect(event.detail).toEqual({
            message: "Loading...",
            type: "loading",
        });
    });

    it("dispatches custom toast event", () => {
        const dispatchSpy = vi.spyOn(
            window,
            "dispatchEvent"
        );

        showToast("Custom message", "custom");

        const event = dispatchSpy.mock.calls[0][0] as CustomEvent;

        expect(event.detail).toEqual({
            message: "Custom message",
            type: "custom",
        });
    });
});
