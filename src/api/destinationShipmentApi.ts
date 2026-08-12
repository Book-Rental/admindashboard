import axios from "axios";
import type {
    DestinationShipmentResponse,
} from "../types/destinationShipment";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;



export interface DestinationShipmentFilters {
    pincode?: string;
    status?: string;
    agentId?: string;
    page?: number;
    limit?: number;
}


export const getHubShipmentsByPincode = async (
    hubId: string,
    filters?: string | DestinationShipmentFilters
): Promise<DestinationShipmentResponse> => {


    const normalizedFilters: DestinationShipmentFilters =
        typeof filters === "string"
            ? {
                pincode: filters,
            }
            : filters ?? {};

    const response = await axios.get(
        `${BACKEND_URL}/hub/shipment/bypincode/${hubId}?journeyType=Delivery`,
        {
            params: {
                ...(normalizedFilters.pincode
                    ? {
                        pincode:
                            normalizedFilters.pincode,
                    }
                    : {}),

                ...(normalizedFilters.status
                    ? {
                        status:
                            normalizedFilters.status,
                    }
                    : {}),

                ...(normalizedFilters.agentId
                    ? {
                        agentId:
                            normalizedFilters.agentId,
                    }
                    : {}),
                ...(normalizedFilters.page
                    ? {
                        page:
                            normalizedFilters.page,
                    }
                    : {}),

                ...(normalizedFilters.limit
                    ? {
                        limit:
                            normalizedFilters.limit,
                    }
                    : {}),
            },
        }
    );

    return response.data;
};