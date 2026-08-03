import { useQuery } from "@tanstack/react-query";
import { getHubs } from "../api/hubService";

export const useHubs = () => {
  return useQuery({
    queryKey: ["hubs"],
    queryFn: getHubs,
  });
};