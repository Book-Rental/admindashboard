import { useMemo, useState } from "react";
import { Rb_Button } from "@rentbook/rentbook-ui-lib";

import { Bag } from "../../types/bag";
import { useBags } from "../../hooks/useBags";
import { useHubs } from "../../hooks/useHubs";
import { useAddShipmentsToBag } from "../../hooks/useBagActions";
import { getShipmentByAwb } from "../../api/bagApi";
import { showToast } from "../../utils/showToaster";
import { getErrorMessage } from "../../utils/getErrorMessage";
import AddShipmentsModal, { BAGGABLE_STATUS } from "./AddShipmentsModal";
import ScanAwbModal from "./ScanAwbModal";

interface Props {
  bag: Bag;
}

// Shown while the bag is CREATED. Parcels can be added by picking
// from a list, or by scanning / typing the AWB on the label.
export default function BagAddParcels({ bag }: Props) {
  const [awb, setAwb] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);

  const { data: bagsData } = useBags();
  const { data: hubsData } = useHubs();
  const addShipments = useAddShipmentsToBag();

  const sourceHubMongoId =
    hubsData?.data.find((h) => h.hubId === bag.fromHubId)?._id ?? "";

  // Parcels in any other bag that has not been released yet
  const inOtherBags = useMemo(
    () =>
      new Set(
        (bagsData?.data ?? [])
          .filter(
            (b) => b.bagId !== bag.bagId && b.status !== "RELEASED"
          )
          .flatMap((b) => b.shipmentIds)
      ),
    [bagsData, bag.bagId]
  );

  const blockedIds = useMemo(
    () => new Set([...inOtherBags, ...bag.shipmentIds]),
    [inOtherBags, bag.shipmentIds]
  );

  // Shared by the typed field and the camera scanner.
  const addByAwb = async (
    value: string
  ): Promise<{ ok: boolean; message: string; alreadyDone?: boolean }> => {
    let shipment;
    try {
      shipment = await getShipmentByAwb(value);
    } catch (error) {
      return {
        ok: false,
        message: getErrorMessage(error, "Parcel not found"),
      };
    }

    if (bag.shipmentIds.includes(shipment.shipmentId)) {
      return {
        ok: false,
        alreadyDone: true,
        message: "Already in this bag",
      };
    }
    if (inOtherBags.has(shipment.shipmentId)) {
      return { ok: false, message: "Already in another bag" };
    }
    if (
      shipment.originHub?.hubId &&
      shipment.originHub.hubId !== bag.fromHubId
    ) {
      return { ok: false, message: "This parcel belongs to another hub" };
    }
    if (shipment.currentStatus !== BAGGABLE_STATUS) {
      return {
        ok: false,
        message: `Not ready for a bag (status: ${shipment.currentStatus})`,
      };
    }

    try {
      await addShipments.mutateAsync({
        bagId: bag.bagId,
        shipmentIds: [shipment.shipmentId],
      });
      return { ok: true, message: "Added to bag" };
    } catch (error) {
      return {
        ok: false,
        message: getErrorMessage(error, "Failed to add parcel"),
      };
    }
  };

  const handleTypedAdd = async () => {
    const value = awb.trim();
    if (!value) return;
    const result = await addByAwb(value);
    if (result.ok) {
      showToast(`${value} added to bag`, "success");
      setAwb("");
    } else {
      showToast(result.message, "error");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">
          Add Parcels
        </h2>
        <span className="text-sm font-medium text-slate-600">
          {bag.shipmentIds.length} in bag
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input
          value={awb}
          onChange={(e) => setAwb(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleTypedAdd();
          }}
          placeholder="Scan or type AWB number"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-600 sm:max-w-sm"
        />
        <Rb_Button
          type="button"
          variant="outline"
          onClick={handleTypedAdd}
          isLoading={addShipments.isPending}
          disabled={!awb.trim() || addShipments.isPending}
        >
          Add Parcel
        </Rb_Button>
        <Rb_Button
          type="button"
          variant="outline"
          onClick={() => setIsScanOpen(true)}
        >
          Scan with Camera
        </Rb_Button>
        <Rb_Button type="button" onClick={() => setIsListOpen(true)}>
          Add Shipments
        </Rb_Button>
      </div>

      <AddShipmentsModal
        isOpen={isListOpen}
        onClose={() => setIsListOpen(false)}
        bagId={bag.bagId}
        sourceHubMongoId={sourceHubMongoId}
        blockedIds={blockedIds}
      />

      <ScanAwbModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onScan={addByAwb}
        title="Scan to Add Parcels"
        progressText={`${bag.shipmentIds.length} in bag`}
      />
    </div>
  );
}
