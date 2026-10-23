import { AxiosError } from "axios";

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong"
): string => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError?.response?.data?.message || fallback;
};
