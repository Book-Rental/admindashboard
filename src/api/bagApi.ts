import axios from "axios";
import {
  BagListResponse,
  CreateBagResponse,
  BagResponse,
  BagStatus,
} from "../types/bag";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getBags = async (): Promise<BagListResponse> => {
  const response = await axios.get(`${API_BASE_URL}/bag`, {
    withCredentials: true,
  });
  return response.data;
};

export const getBagById = async (
  bagId: string
): Promise<BagResponse> => {
  const response = await axios.get(
    `${API_BASE_URL}/bag/${bagId}`,
    { withCredentials: true }
  );
  return response.data;
};

export const createBag = async (data: {
  fromHubId: string;
  toHubId: string;
}): Promise<CreateBagResponse> => {
  const response = await axios.post(`${API_BASE_URL}/bag`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const addShipmentsToBag = async (
  bagId: string,
  shipmentIds: string[]
): Promise<BagResponse> => {
  const response = await axios.post(
    `${API_BASE_URL}/bag/${bagId}/shipments`,
    { shipmentIds },
    { withCredentials: true }
  );
  return response.data;
};

export const updateBagStatus = async (
  bagId: string,
  data: { status: BagStatus; assignedAgentId?: string }
): Promise<BagResponse> => {
  const response = await axios.patch(
    `${API_BASE_URL}/bag/${bagId}/status`,
    data,
    { withCredentials: true }
  );
  return response.data;
};

export const verifyScannedShipment = async (
  bagId: string,
  awbNumber: string
) => {
  const response = await axios.post(
    `${API_BASE_URL}/bag/${bagId}/verify-scan`,
    { awbNumber },
    { withCredentials: true }
  );
  return response.data;
};

export const verifyShipmentInBag = async (
  bagId: string,
  shipmentId: string
) => {
  const response = await axios.post(
    `${API_BASE_URL}/bag/verify-shipment`,
    { bagId, shipmentId },
    { withCredentials: true }
  );
  return response.data;
};

export const completeBagVerification = async (bagId: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/bag/complete-verification`,
    { bagId },
    { withCredentials: true }
  );
  return response.data;
};

export const getShipmentLabelPdfUrl = (awbNumber: string) =>
  `${API_BASE_URL}/shipment/${awbNumber}/label/pdf`;

export interface ScannedShipment {
  shipmentId: string;
  awbNumber: string;
  currentStatus: string;
  originHub?: { hubId?: string } | null;
}

// Turns a scanned / typed AWB into the shipment record.
export const getShipmentByAwb = async (
  awbNumber: string
): Promise<ScannedShipment> => {
  const response = await axios.get(
    `${API_BASE_URL}/shipment/scan/${encodeURIComponent(awbNumber)}`,
    { withCredentials: true }
  );
  return response.data.data;
};
