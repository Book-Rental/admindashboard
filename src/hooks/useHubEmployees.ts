import { useQuery } from "@tanstack/react-query";
import { getHubEmployees } from "../api/hubEmployeesApi";

export const useHubEmployees = (hubId?: string) => {
    return useQuery({
        queryKey: ["hubEmployees", hubId],
        queryFn: () => getHubEmployees(hubId!),
        enabled: Boolean(hubId),
    });
};