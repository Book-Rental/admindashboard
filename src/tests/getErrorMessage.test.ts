import { describe, it, expect } from "vitest";
import { getErrorMessage } from "../utils/getErrorMessage";

describe("getErrorMessage", () => {
    it("returns the API error message when available", () => {
        const error = {
            response: {
                data: {
                    message: "Invalid request",
                },
            },
        };

        expect(getErrorMessage(error)).toBe("Invalid request");
    });

    it("returns the default fallback when the error is undefined", () => {
        expect(getErrorMessage(undefined)).toBe("Something went wrong");
    });

    it("returns the default fallback when the error is null", () => {
        expect(getErrorMessage(null)).toBe("Something went wrong");
    });

    it("returns the default fallback when there is no response", () => {
        expect(getErrorMessage({ message: "Network error" })).toBe(
            "Something went wrong",
        );
    });

    it("returns the default fallback when response data has no message", () => {
        expect(getErrorMessage({ response: { data: {} } })).toBe(
            "Something went wrong",
        );
    });

    it("returns the default fallback when the API message is empty", () => {
        expect(
            getErrorMessage({ response: { data: { message: "" } } }),
        ).toBe("Something went wrong");
    });

    it("uses a custom fallback when provided", () => {
        expect(getErrorMessage(undefined, "Unable to load bags")).toBe(
            "Unable to load bags",
        );
    });

    it("uses a custom fallback when the API message is empty", () => {
        expect(
            getErrorMessage(
                { response: { data: { message: "" } } },
                "Request failed",
            ),
        ).toBe("Request failed");
    });
});