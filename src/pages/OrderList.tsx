import { useEffect, useState } from "react";
import {
    Rb_LoadingSpinner,
    Pagination,
    Rb_Button,
    Search as SearchField,
    Dropdown,
} from "@rentbook/rentbook-ui-lib";
import OrderTable from "../components/OrderTable";
import { useOrders } from "../hooks/useOrders";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

const ORDER_STATUS_OPTIONS = [
    { label: "All statuses", value: "" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Pending", value: "pending" },
];

const PAYMENT_STATUS_OPTIONS = [
    { label: "All payments", value: "" },
    { label: "Success", value: "success" },
    { label: "Pending", value: "pending" },
];

export default function OrderList() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");

    const debouncedSearch = useDebouncedValue(search);

    const filters = {
        search: debouncedSearch || undefined,
        orderStatus: orderStatus || undefined,
        paymentStatus: paymentStatus || undefined,
    };

    const { data, isLoading, isError, isFetching } = useOrders(page, filters);

    // reset back to page 1 whenever a filter changes, otherwise you can land
    // on an empty page 5 of a filtered result set that only has 2 pages
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, orderStatus, paymentStatus]);

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
                        message: "Failed to load orders",
                        type: "error",
                    },
                })
            );
        }
    }, [isError]);

    const orders = data?.data.orders ?? [];
    const totalPages = data?.data.meta.totalPages ?? 1;
    const hasActiveFilters = Boolean(debouncedSearch || orderStatus || paymentStatus);

    const clearFilters = () => {
        setSearch("");
        setOrderStatus("");
        setPaymentStatus("");
    };

    return (
        <div className="p-4 w-full sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h1 className="text-2xl sm:text-3xl font-semibold">Order Lists</h1>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                <SearchField
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by order or book name"
                    containerClassName="sm:w-72"
                />

                <div className="w-full sm:w-48">
                    <Dropdown
                        value={orderStatus}
                        onChange={setOrderStatus}
                        options={ORDER_STATUS_OPTIONS}
                        placeholder="Order status"
                    />
                </div>

                <div className="w-full sm:w-48">
                    <Dropdown
                        value={paymentStatus}
                        onChange={setPaymentStatus}
                        options={PAYMENT_STATUS_OPTIONS}
                        placeholder="Payment status"
                    />
                </div>

                {hasActiveFilters && (
                    <Rb_Button variant="outline" size="md" onClick={clearFilters}>
                        Clear filters
                    </Rb_Button>
                )}
            </div>

            <div className="relative overflow-x-auto rounded-xl">
                <OrderTable orders={orders} />

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-xl">
                        <Rb_LoadingSpinner />
                    </div>
                )}
            </div>

            {isError && !isLoading && (
                <div className="mt-5 text-sm text-red-500">
                    Failed to load orders. Please try again.
                </div>
            )}

            {!isError && (
                <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm text-gray-500">
                        Showing 1-{orders.length} of{" "}
                        {data?.data.meta.totalRecords ?? 0}
                    </p>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        siblingCount={1}
                        disabled={isFetching}
                        onPageChange={setPage}
                    />


                </div>
            )}
        </div>
    );
}