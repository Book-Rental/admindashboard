import axios from "axios";
import {
  GetHubByIdResponse,
  HubResponse,
} from "../types/hub";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getHubs = async (): Promise<HubResponse> => {
  const response = await axios.get<HubResponse>(
    `${BACKEND_URL}/hub`
  );

  return response.data;
};

export const getHubById = async (
  hubId: string
): Promise<GetHubByIdResponse> => {
  const response = await axios.get<GetHubByIdResponse>(
    `${BACKEND_URL}/hub/${hubId}`
  );

  return response.data;
};