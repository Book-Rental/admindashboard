import { useQuery } from "@tanstack/react-query";
import { getBooks, BookFilters } from "../api/bookApi";

export const useBooks = (page: number = 1, filters: BookFilters = {}) => {
    return useQuery({
        queryKey: ["books", page, filters],
        queryFn: () => getBooks(page, filters),
        placeholderData: (previousData) => previousData,
    });
};