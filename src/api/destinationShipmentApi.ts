import axios from "axios";

import {
    DestinationShipmentResponse,
    GetHubByIdResponse,
} from "../types/destinationShipment";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const getHubById = async (
    hubId: string
): Promise<GetHubByIdResponse> => {
    const response = await axios.get(
        `${BACKEND_URL}/hub/${hubId}`
    );

    return response.data;
};

export const getHubShipmentsByPincode = async (
    hubId: string,
    pincode?: string
): Promise<DestinationShipmentResponse> => {
    const response = await axios.get<DestinationShipmentResponse>(
        `${BACKEND_URL}/hub/shipment/bypincode/${hubId}`,
        {
            params: pincode
                ? { pincode }
                : undefined,
        }
    );

    return response.data;
};
