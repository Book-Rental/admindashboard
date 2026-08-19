import { useQuery } from "@tanstack/react-query";
import { getEmployeeById } from "../api/employeeApi";

export const useEmployeeById = (employeeId: string) => {
    return useQuery({
        queryKey: ["employee", employeeId],
        queryFn: () => getEmployeeById(employeeId),
        enabled: Boolean(employeeId),
    });
};