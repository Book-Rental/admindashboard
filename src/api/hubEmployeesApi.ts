import axios from "axios";
import type { HubEmployeesResponse } from "../types/hub";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getHubEmployees = async (
    hubId: string
): Promise<HubEmployeesResponse> => {
    const response = await axios.get<HubEmployeesResponse>(
        `${BACKEND_URL}/hub/employees/${hubId}`
    );

    return response.data;
};