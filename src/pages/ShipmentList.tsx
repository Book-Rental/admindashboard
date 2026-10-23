import { useEffect, useMemo, useState } from "react";
import { useBags } from "../hooks/useBags";
import {
  Rb_LoadingSpinner,
  Pagination,
  Search as SearchField,
  Dropdown,
  Rb_Button,
} from "@rentbook/rentbook-ui-lib";

import ShipmentTable from "../components/ShipmentTable";
import AddToBagModal from "../components/bag/AddToBagModal";
import { Shipment } from "../types/shipment";
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
    label: "Out For Pickup",
    value: "Out For Pickup",
  },
  {
    label: "Pickup Completed",
    value: "Pickup Completed",
  },
  {
    label: "Arrived At Origin Hub",
    value: "Arrived At Origin Hub",
  }

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

// Only parcels sitting at the origin hub can be put in a bag.
const BAGGABLE_STATUS = "Arrived At Origin Hub";


export default function ShipmentList() {
  const hubId = window.HOST_USER_INFO?.referenceId ?? "";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBagModalOpen, setIsBagModalOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(search);

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useShipments(hubId, page, status, paymentMode, debouncedSearch);

  const { data: bagsData } = useBags();

  // Parcels already sitting in a bag that hasn't been released yet
  const baggedIds = useMemo(
    () =>
      new Set(
        (bagsData?.data ?? [])
          .filter((bag) => bag.status !== "RELEASED")
          .flatMap((bag) => bag.shipmentIds)
      ),
    [bagsData]
  );

  const isBaggable = (shipment: Shipment) =>
    shipment.currentStatus === BAGGABLE_STATUS &&
    !baggedIds.has(shipment.shipmentId);

  const shipments = data?.data.shipments ?? [];
  const totalPages = data?.data.meta.totalPages ?? 1;
  const totalRecords = data?.data.meta.totalRecords ?? 0;

  const hasActiveFilters = Boolean(
    debouncedSearch ||
    status ||
    paymentMode
  );

  const clearFilters = () => {
    setPage(1);
    setSearch("");
    setStatus("");
    setPaymentMode("");
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const toggleShipment = (shipmentId: string) => {
    setSelectedIds((prev) =>
      prev.includes(shipmentId)
        ? prev.filter((id) => id !== shipmentId)
        : [...prev, shipmentId]
    );
  };

  const toggleAllOnPage = (checked: boolean) => {
    const pageIds = shipments.filter(isBaggable).map((s) => s.shipmentId);
    setSelectedIds((prev) =>
      checked
        ? Array.from(new Set([...prev, ...pageIds]))
        : prev.filter((id) => !pageIds.includes(id))
    );
  };

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

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {selectedIds.length} selected
            </span>
            <Rb_Button
              variant="outline"
              size="md"
              onClick={() => setSelectedIds([])}
            >
              Clear
            </Rb_Button>
            <Rb_Button
              variant="primary"
              size="md"
              onClick={() => setIsBagModalOpen(true)}
            >
              Add to Bag
            </Rb_Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <SearchField
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Search by AWB, Receiver or City"
          containerClassName="lg:w-80"
          className="!pl-12"
        />

        <div className="w-full lg:w-56">
          <Dropdown
            value={status}
            onChange={(value) => {
              setPage(1);
              setStatus(value);
            }}
            options={STATUS_OPTIONS}
            placeholder="Shipment Status"
          />
        </div>

        <div className="w-full lg:w-48">
          <Dropdown
            value={paymentMode}
            onChange={(value) => {
              setPage(1);
              setPaymentMode(value);
            }}
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
              <ShipmentTable
                shipments={shipments}
                selectedIds={selectedIds}
                isSelectable={isBaggable}
                onToggle={toggleShipment}
                onToggleAll={toggleAllOnPage}
              />
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
                  Showing {shipments.length} of {totalRecords} shipments
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

      <AddToBagModal
        isOpen={isBagModalOpen}
        onClose={() => setIsBagModalOpen(false)}
        shipmentIds={selectedIds}
        onDone={() => setSelectedIds([])}
      />
    </div>
  );
}