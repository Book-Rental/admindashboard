import { ShipmentDetailsData } from "../../types/shipmentDetails";
import { getShipmentLabelPdfUrl } from "../../api/bagApi";

interface ShipmentSummaryProps {
  shipment: ShipmentDetailsData;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const SummaryItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <p className="mt-1 text-sm font-semibold text-slate-600 break-words">
      {value}
    </p>
  </div>
);

export default function ShipmentSummary({
  shipment,
}: ShipmentSummaryProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">
          Shipment Summary
        </h2>

        <button
          type="button"
          onClick={() =>
            window.open(
              getShipmentLabelPdfUrl(shipment.awbNumber),
              "_blank"
            )
          }
          className="rounded-lg border border-blue-600 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
        >
          Print Label
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <SummaryItem
          label="AWB Number"
          value={shipment.awbNumber}
        />

        <SummaryItem
          label="Shipment Type"
          value={shipment.shipmentType}
        />

        <SummaryItem
          label="Payment Mode"
          value={shipment.paymentMode}
        />

        <SummaryItem
          label="COD Amount"
          value={`₹${shipment.codAmount}`}
        />

        <SummaryItem
          label="Current Status"
          value={shipment.currentStatus}
        />

        <SummaryItem
          label="Expected Delivery"
          value={new Date(
            shipment.expectedDeliveryDate
          ).toLocaleDateString()}
        />

        <SummaryItem
          label="Created At"
          value={formatDate(shipment.createdAt)}
        />

        <SummaryItem
          label="Updated At"
          value={formatDate(shipment.updatedAt)}
        />

      </div>
    </div>
  );
}
