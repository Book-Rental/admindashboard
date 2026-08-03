import axios from "axios";
import { HubResponse } from "../types/hub";

const API_URL = "https://be-logistics-service.onrender.com/api";

export const getHubs = async (): Promise<HubResponse> => {
  const { data } = await axios.get<HubResponse>(
    `${API_URL}/hub`
  );

  return data;
};