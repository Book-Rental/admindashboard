import { useState } from "react";
import { Rb_Button } from "@rentbook/rentbook-ui-lib";

import { Bag } from "../../types/bag";
import {
  useCompleteBagVerification,
  useVerifyScannedShipment,
} from "../../hooks/useBagActions";
import { showToast } from "../../utils/showToaster";
import { getErrorMessage } from "../../utils/getErrorMessage";
import ScanAwbModal from "./ScanAwbModal";

interface Props {
  bag: Bag;
  canAct: boolean;
}

// Shown only while the bag is OPENED. A barcode scanner types the
// AWB into this field and presses Enter, so typing + Enter works too.
export default function BagVerification({ bag, canAct }: Props) {
  const [awb, setAwb] = useState("");
  const [isScanOpen, setIsScanOpen] = useState(false);
  const verifyScan = useVerifyScannedShipment();
  const complete = useCompleteBagVerification();

  const total = bag.shipmentIds.length;
  const verified = bag.verifiedShipmentIds.length;
  const allVerified = total > 0 && verified === total;

  // Shared by the typed field and the camera scanner.
  const verifyAwb = async (
    value: string
  ): Promise<{
    ok: boolean;
    message: string;
    alreadyDone?: boolean;
  }> => {
    try {
      await verifyScan.mutateAsync({
        bagId: bag.bagId,
        awbNumber: value,
      });
      return { ok: true, message: "Verified" };
    } catch (error) {
      const message = getErrorMessage(error, "Failed to verify parcel");
      const alreadyDone = /already verified/i.test(message);
      return {
        ok: false,
        message: alreadyDone ? "Already verified" : message,
        alreadyDone,
      };
    }
  };

  const handleScan = async () => {
    const value = awb.trim();
    if (!value) return;
    const result = await verifyAwb(value);
    if (result.ok) {
      showToast(`${value} verified`, "success");
      setAwb("");
    } else {
      showToast(result.message, "error");
    }
  };

  const handleComplete = async () => {
    try {
      await complete.mutateAsync(bag.bagId);
      showToast("Bag verification completed", "success");
    } catch (error) {
      showToast(
        getErrorMessage(error, "Failed to complete verification"),
        "error"
      );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">
          Verify Parcels
        </h2>
        <span className="text-sm font-medium text-slate-600">
          {verified} of {total} verified
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{
            width: total ? `${(verified / total) * 100}%` : "0%",
          }}
        />
      </div>

      {canAct && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={awb}
            onChange={(e) => setAwb(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleScan();
            }}
            placeholder="Scan or type AWB number"
            autoFocus
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-600 sm:max-w-sm"
          />
          <Rb_Button
            type="button"
            variant="outline"
            onClick={() => setIsScanOpen(true)}
          >
            Scan with Camera
          </Rb_Button>
          <Rb_Button
            type="button"
            variant="outline"
            onClick={handleScan}
            isLoading={verifyScan.isPending}
            disabled={!awb.trim() || verifyScan.isPending}
          >
            Verify Parcel
          </Rb_Button>
          <Rb_Button
            type="button"
            onClick={handleComplete}
            isLoading={complete.isPending}
            disabled={!allVerified || complete.isPending}
          >
            Complete Verification
          </Rb_Button>
        </div>
      )}

      <ScanAwbModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onScan={verifyAwb}
        title="Scan Parcels"
        progressText={`${verified} of ${total} verified`}
        isComplete={allVerified}
        completeMessage="All parcels verified. Press Done, then Complete Verification."
      />
    </div>
  );
}
