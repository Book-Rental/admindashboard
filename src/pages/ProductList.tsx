import { useEffect, useState } from "react";
import {
    Rb_LoadingSpinner,
    Pagination,
    Rb_Button,
    Search as SearchField,
    Dropdown,
} from "@rentbook/rentbook-ui-lib";
import ProductTable from "../components/ProductTable";
import { useBooks } from "../hooks/useBooks";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

const AVAILABILITY_OPTIONS = [
    { label: "All availability", value: "" },
    { label: "Available", value: "true" },
    { label: "Unavailable", value: "false" },
];

export default function ProductList() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [availabilityStatus, setAvailabilityStatus] = useState("");
    const debouncedSearch = useDebouncedValue(search);

    const filters = {
        search: debouncedSearch || undefined,
        isAvailable:
            availabilityStatus === ""
                ? undefined
                : availabilityStatus === "true",
    };

    const { data, isLoading, isError, isFetching } = useBooks(page, filters);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, availabilityStatus]);

    useEffect(() => {
        window.dispatchEvent(
            new CustomEvent("widget-loading-status", { detail: isLoading })
        );
    }, [isLoading]);

    useEffect(() => {
        if (isError) {
            window.dispatchEvent(
                new CustomEvent("app-toast-notification", {
                    detail: {
                        message: "Failed to load products",
                        type: "error",
                    },
                })
            );
        }
    }, [isError]);

    const books = data?.data.products ?? [];
    const totalPages = Number(data?.data.totalPages) || 1;
    const hasActiveFilters = Boolean(debouncedSearch || availabilityStatus);

    const clearFilters = () => {
        setSearch("");
        setAvailabilityStatus("");
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h1 className="text-2xl sm:text-3xl font-semibold">Products</h1>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                <SearchField
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title or author"
                    containerClassName="sm:w-72"
                />

                <div className="w-full sm:w-48">
                    <Dropdown
                        value={availabilityStatus}
                        onChange={setAvailabilityStatus}
                        options={AVAILABILITY_OPTIONS}
                        placeholder="Availability"
                    />
                </div>

                {hasActiveFilters && (
                    <Rb_Button variant="outline" size="md" onClick={clearFilters}>
                        Clear filters
                    </Rb_Button>
                )}
            </div>

            <div className="relative overflow-x-auto rounded-xl">
                <ProductTable books={books} />

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-xl">
                        <Rb_LoadingSpinner />
                    </div>
                )}
            </div>

            {isError && !isLoading && (
                <div className="mt-5 text-sm text-red-500">
                    Failed to load products. Please try again.
                </div>
            )}

            {!isError && (
                <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm text-gray-500">
                        Showing 1-{books.length} of {data?.data.totalCount ?? 0}
                    </p>


                    <div
                        className="
        [&_.pagination__button]:!text-gray-700
        [&_.pagination__button--active]:!text-white
    "
                    >                                 <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            siblingCount={1}
                            disabled={isFetching}
                            onPageChange={setPage}
                        />


                    </div>
                </div>
            )}
        </div>
    );
}