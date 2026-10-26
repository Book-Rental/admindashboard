import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Rb_Button,
  Rb_LoadingSpinner,
  Pagination,
  Search as SearchField,
} from "@rentbook/rentbook-ui-lib";

import { useShipments } from "../../hooks/useShipments";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useAddShipmentsToBag } from "../../hooks/useBagActions";
import { showToast } from "../../utils/showToaster";
import { getErrorMessage } from "../../utils/getErrorMessage";

// Only parcels waiting at the origin hub can go into a bag.
export const BAGGABLE_STATUS = "Arrived At Origin Hub";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bagId: string;
  // Mongo _id of the bag's source hub (used to list its parcels)
  sourceHubMongoId: string;
  // Parcels that are already in this bag or in another open bag
  blockedIds: Set<string>;
}

function ShipmentPicker({
  bagId,
  sourceHubMongoId,
  blockedIds,
  onClose,
}: Omit<Props, "isOpen">) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const debouncedSearch = useDebouncedValue(search);

  const addShipments = useAddShipmentsToBag();
  const { data, isLoading, isFetching } = useShipments(
    sourceHubMongoId,
    page,
    BAGGABLE_STATUS,
    "",
    debouncedSearch
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const totalPages = data?.data.meta.totalPages ?? 1;

  const available = useMemo(
    () =>
      (data?.data.shipments ?? []).filter(
        (s) => !blockedIds.has(s.shipmentId)
      ),
    [data, blockedIds]
  );

  const allOnPageSelected =
    available.length > 0 &&
    available.every((s) => selectedIds.includes(s.shipmentId));

  const toggle = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleAll = (checked: boolean) => {
    const ids = available.map((s) => s.shipmentId);
    setSelectedIds((prev) =>
      checked
        ? Array.from(new Set([...prev, ...ids]))
        : prev.filter((id) => !ids.includes(id))
    );
  };

  const handleAdd = async () => {
    try {
      await addShipments.mutateAsync({
        bagId,
        shipmentIds: selectedIds,
      });
      showToast(`${selectedIds.length} parcel(s) added to bag`, "success");
      onClose();
    } catch (error) {
      showToast(getErrorMessage(error, "Failed to add parcels"), "error");
    }
  };

  return (
    <>
      <ModalBody>
        <div className="space-y-4">
          <SearchField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by AWB, Receiver or City"
            containerClassName="w-full"
          />

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Rb_LoadingSpinner />
            </div>
          ) : (
            <div className="max-h-80 overflow-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="sticky top-0 bg-gray-50">
                  <tr className="border-b border-gray-200 text-left text-gray-600">
                    <th className="w-10 p-3">
                      <input
                        type="checkbox"
                        checked={allOnPageSelected}
                        disabled={available.length === 0}
                        onChange={(e) => toggleAll(e.target.checked)}
                        aria-label="Select all"
                      />
                    </th>
                    <th className="p-3 font-semibold">AWB</th>
                    <th className="p-3 font-semibold">Receiver</th>
                    <th className="p-3 font-semibold">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {available.map((s) => (
                    <tr
                      key={s.shipmentId}
                      onClick={() => toggle(s.shipmentId)}
                      className="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(s.shipmentId)}
                          onChange={() => toggle(s.shipmentId)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select ${s.awbNumber}`}
                        />
                      </td>
                      <td className="p-3 font-medium text-gray-700">
                        {s.awbNumber}
                      </td>
                      <td className="p-3 text-gray-700">
                        {s.receiverName}
                        {s.receiverCity && (
                          <span className="block text-xs text-gray-500">
                            {s.receiverCity}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-gray-700">
                        {s.paymentMode}
                      </td>
                    </tr>
                  ))}

                  {available.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-gray-400"
                      >
                        No parcels available to add
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

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
      </ModalBody>

      <ModalFooter>
        <span className="mr-auto text-sm text-gray-600">
          {selectedIds.length} selected
        </span>
        <Rb_Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={addShipments.isPending}
        >
          Cancel
        </Rb_Button>
        <Rb_Button
          type="button"
          onClick={handleAdd}
          isLoading={addShipments.isPending}
          disabled={selectedIds.length === 0 || addShipments.isPending}
        >
          Add to Bag
        </Rb_Button>
      </ModalFooter>
    </>
  );
}

export default function AddShipmentsModal(props: Props) {
  const { isOpen, onClose } = props;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="min(760px, 92vw)"
    >
      <ModalHeader onClose={onClose}>Add Shipments to Bag</ModalHeader>
      {/* Mounted only while open so the selection resets each time */}
      {isOpen && <ShipmentPicker {...props} />}
    </Modal>
  );
}
