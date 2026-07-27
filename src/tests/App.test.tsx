import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("App Component", () => {
    it("renders the Admin Dashboard heading", () => {
        render(<App />);

        expect(
            screen.getByRole("heading", { name: "Admin Dashboard" })
        ).toBeInTheDocument();
    });
});