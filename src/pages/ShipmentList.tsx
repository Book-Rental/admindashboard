import { useEffect, useState } from "react";
import {
  Rb_LoadingSpinner,
  Pagination,
  Search as SearchField,
  Dropdown,
  Rb_Button,
} from "@rentbook/rentbook-ui-lib";

import ShipmentTable from "../components/ShipmentTable";
import { useShipments } from "../hooks/useShipments";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

const STATUS_OPTIONS = [
  {
    label: "All Statuses",
    value: "",
  },
  {
    label: "Created",
    value: "Created",
  },
  {
    label: "Pickup Assigned",
    value: "Pickup Assigned",
  },
  {
    label: "Picked Up",
    value: "Picked Up",
  },
  {
    label: "In Transit",
    value: "In Transit",
  },
  {
    label: "Delivered",
    value: "Delivered",
  },
  {
    label: "Cancelled",
    value: "Cancelled",
  },
];

const PAYMENT_OPTIONS = [
  {
    label: "All Payments",
    value: "",
  },
  {
    label: "Prepaid",
    value: "Prepaid",
  },
  {
    label: "COD",
    value: "COD",
  },
];

export default function ShipmentList() {
  // Replace with logged-in hub id later
  const hubId = "6a6aeb9b18b80d35a476f97d";

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const debouncedSearch = useDebouncedValue(search);

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useShipments(hubId, page);

  const shipments = data?.data.shipments ?? [];
  const totalPages = data?.data.meta.totalPages ?? 1;
  const totalRecords = data?.data.meta.totalRecords ?? 0;

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.awbNumber
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
      shipment.receiverName
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
      shipment.receiverCity
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

    const matchesStatus =
      !status ||
      shipment.currentStatus === status;

    const matchesPayment =
      !paymentMode ||
      shipment.paymentMode === paymentMode;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPayment
    );
  });

  const hasActiveFilters = Boolean(
    debouncedSearch ||
    status ||
    paymentMode
  );

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPaymentMode("");
  };
  useEffect(() => {
    console.log("Current page:", page);
  }, [page]);
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    status,
    paymentMode,
  ]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(
        "widget-loading-status",
        {
          detail: isLoading,
        }
      )
    );
  }, [isLoading]);

  useEffect(() => {
    if (isError) {
      window.dispatchEvent(
        new CustomEvent(
          "app-toast-notification",
          {
            detail: {
              message:
                "Failed to load shipments",
              type: "error",
            },
          }
        )
      );
    }
  }, [isError]);
  return (
    <div className="p-4 w-full sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Shipment List
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <SearchField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by AWB, Receiver or City"
          containerClassName="lg:w-80"
          className="!pl-12"
        />

        <div className="w-full lg:w-56">
          <Dropdown
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
            placeholder="Shipment Status"
          />
        </div>

        <div className="w-full lg:w-48">
          <Dropdown
            value={paymentMode}
            onChange={setPaymentMode}
            options={PAYMENT_OPTIONS}
            placeholder="Payment"
          />
        </div>

        {hasActiveFilters && (
          <Rb_Button
            variant="outline"
            size="md"
            onClick={clearFilters}
          >
            Clear Filters
          </Rb_Button>
        )}
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto rounded-xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Rb_LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto rounded-xl">
              <ShipmentTable shipments={filteredShipments} />
            </div>

            {/* Error */}
            {isError && (
              <div className="mt-5 text-red-500 text-sm">
                Failed to load shipments.
              </div>
            )}

            {/* Footer */}
            {!isError && (
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Showing {filteredShipments.length} of {totalRecords} shipments
                </p>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    siblingCount={1}
                    disabled={isFetching}
                    onPageChange={setPage}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}