
import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";

import {
  getBags,
  getBagById,
  createBag,
  addShipmentsToBag,
  updateBagStatus,
  verifyScannedShipment,
  verifyShipmentInBag,
  completeBagVerification,
  getShipmentLabelPdfUrl,
} from "../api/bagApi";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

describe("bagApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("gets all bags", async () => {
    const response = { data: [{ bagId: "BAG001" }] };
    vi.mocked(axios.get).mockResolvedValueOnce({ data: response } as never);

    await expect(getBags()).resolves.toEqual(response);

    expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/bag`, {
      withCredentials: true,
    });
  });

  it("gets a bag by ID", async () => {
    const response = { data: { bagId: "BAG001" } };
    vi.mocked(axios.get).mockResolvedValueOnce({ data: response } as never);

    await expect(getBagById("BAG001")).resolves.toEqual(response);

    expect(axios.get).toHaveBeenCalledWith(
      `${API_BASE_URL}/bag/BAG001`,
      { withCredentials: true }
    );
  });

  it("creates a bag", async () => {
    const payload = { fromHubId: "HUB001", toHubId: "HUB002" };
    const response = { data: { bagId: "BAG001" } };
    vi.mocked(axios.post).mockResolvedValueOnce({ data: response } as never);

    await expect(createBag(payload)).resolves.toEqual(response);

    expect(axios.post).toHaveBeenCalledWith(
      `${API_BASE_URL}/bag`,
      payload,
      { withCredentials: true }
    );
  });

  it("adds shipments to a bag", async () => {
    const shipmentIds = ["SHIP001", "SHIP002"];
    const response = { data: { bagId: "BAG001" } };
    vi.mocked(axios.post).mockResolvedValueOnce({ data: response } as never);

    await expect(
      addShipmentsToBag("BAG001", shipmentIds)
    ).resolves.toEqual(response);

    expect(axios.post).toHaveBeenCalledWith(
      `${API_BASE_URL}/bag/BAG001/shipments`,
      { shipmentIds },
      { withCredentials: true }
    );
  });

  it("updates bag status", async () => {
    const payload = { status: "SEALED" as const };
    const response = { data: { bagId: "BAG001", status: "SEALED" } };
    vi.mocked(axios.patch).mockResolvedValueOnce({ data: response } as never);

    await expect(
      updateBagStatus("BAG001", payload)
    ).resolves.toEqual(response);

    expect(axios.patch).toHaveBeenCalledWith(
      `${API_BASE_URL}/bag/BAG001/status`,
      payload,
      { withCredentials: true }
    );
  });

  it("verifies a scanned shipment", async () => {
    const response = { data: { verified: true } };
    vi.mocked(axios.post).mockResolvedValueOnce({ data: response } as never);

    await expect(
      verifyScannedShipment("BAG001", "AWB001")
    ).resolves.toEqual(response);

    expect(axios.post).toHaveBeenCalledWith(
      `${API_BASE_URL}/bag/BAG001/verify-scan`,
      { awbNumber: "AWB001" },
      { withCredentials: true }
    );
  });

  it("verifies a shipment in a bag", async () => {
    const response = { data: { verified: true } };
    vi.mocked(axios.post).mockResolvedValueOnce({ data: response } as never);

    await expect(
      verifyShipmentInBag("BAG001", "SHIP001")
    ).resolves.toEqual(response);

    expect(axios.post).toHaveBeenCalledWith(
      `${API_BASE_URL}/bag/verify-shipment`,
      { bagId: "BAG001", shipmentId: "SHIP001" },
      { withCredentials: true }
    );
  });

  it("completes bag verification", async () => {
    const response = { data: { success: true } };
    vi.mocked(axios.post).mockResolvedValueOnce({ data: response } as never);

    await expect(
      completeBagVerification("BAG001")
    ).resolves.toEqual(response);

    expect(axios.post).toHaveBeenCalledWith(
      `${API_BASE_URL}/bag/complete-verification`,
      { bagId: "BAG001" },
      { withCredentials: true }
    );
  });

  it("returns the shipment label PDF URL", () => {
    expect(getShipmentLabelPdfUrl("AWB001")).toBe(
      `${API_BASE_URL}/shipment/AWB001/label/pdf`
    );
  });
});
