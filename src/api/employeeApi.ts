import axios from "axios";
import { EmployeeResponse } from "../types/employee";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const getEmployeeById = async (
    employeeId: string
): Promise<EmployeeResponse> => {
    const response = await axios.get<EmployeeResponse>(
        `${API_URL}/employee/${employeeId}`
    );

    return response.data;
};