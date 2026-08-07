import axios from "axios";

import {
    DestinationShipmentResponse,
} from "../types/destinationShipment";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
