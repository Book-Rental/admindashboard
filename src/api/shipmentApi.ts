import axios from "axios";
import { ShipmentResponse } from "../types/shipment";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const getShipments = async (
  hubId: string,
  page = 1,
  status = "",
  paymentMode = "",
  search = ""
): Promise<ShipmentResponse> => {
  const response = await axios.get(
    `${API_BASE_URL}/hub/shipment/${hubId}`,
    {
      params: {
        page,
        currentStatus: status,
        paymentMode,
        search,
      },
      withCredentials: true,
    }
  );

  return response.data;
};

export const getShipmentById = async (shipmentId: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/shipment/${shipmentId}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};
export const updateShipmentStatus = async (
  shipmentId: string,
  data: {
    hubId: string;
    status?: string;
    event?: string;
    remarks?: string;
    updatedBy?: string;
  }
) => {
  return axios.patch(
    `${API_BASE_URL}/shipment/${shipmentId}/status`,
    data,
    {
      withCredentials: true,
    }
  );
};

