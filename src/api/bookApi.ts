import axios from "axios";
import { BookResponse } from "../types/book";

const API_URL = "https://be-book-rental.onrender.com/api/book";

export interface BookFilters {
    search?: string;
    isAvailable?: boolean;
    category?: string;
}

export const getBooks = async (
    page: number = 1,
    filters: BookFilters = {}
): Promise<BookResponse> => {
    const params = new URLSearchParams({ language: "all", page: String(page) });

    if (filters.search) params.set("search", filters.search);
    if (filters.isAvailable !== undefined) {
        params.set("isAvailable", String(filters.isAvailable));
    }
    if (filters.category) params.set("category", filters.category);

    const response = await axios.get(`${API_URL}?${params.toString()}`, {
        withCredentials: true,
    });

    return response.data;
};