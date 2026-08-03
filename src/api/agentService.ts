import axios from "axios";
import { AgentResponse } from "../types/agent";

const API_URL = "https://be-logistics-service.onrender.com/api";

export const getAgents = async (
  hubId: string,
  page = 1,
  limit = 10
): Promise<AgentResponse> => {
  const { data } = await axios.get<AgentResponse>(
    `${API_URL}/agent/hub/${hubId}?page=${page}&limit=${limit}`
  );

  return data;
};