import axios from "axios";
import { ShipmentResponse } from "../types/shipment";

const API_URL =
"https://be-logistics-service.onrender.com/api/hub/shipment";

export const getShipments = async (
    hubId: string,
    page = 1
): Promise<ShipmentResponse> => {

    const response = await axios.get(
        `${API_URL}/${hubId}?page=${page}`,
        {
            withCredentials: true,
        }
    );

    return response.data;
};
export const getShipmentById = async (shipmentId: string) => {
  const response = await axios.get(
    `https://be-logistics-service.onrender.com/api/shipment/${shipmentId}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};