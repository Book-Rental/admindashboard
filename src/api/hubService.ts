import axios from "axios";
import { HubResponse } from "../types/hub";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const getHubs = async (): Promise<HubResponse> => {
  const { data } = await axios.get<HubResponse>(
    `${API_BASE_URL}/hub`
  );

  return data;
};