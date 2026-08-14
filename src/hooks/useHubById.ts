import { useQuery } from "@tanstack/react-query";
import { getHubById } from "../api/hubService";

export const useHubById = (hubId?: string) => {
    return useQuery({
        queryKey: ["hub", hubId],
        queryFn: () => getHubById(hubId as string),
        enabled: Boolean(hubId),
    });
};