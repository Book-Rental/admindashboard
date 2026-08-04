interface ShipmentSummaryProps {
  shipment: any;
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
    <p className="text-xs uppercase tracking-wide text-slate-500">
      {label}
    </p>

    <p className="mt-1 font-semibold text-slate-800 break-words">
      {value}
    </p>
  </div>
);

export default function ShipmentSummary({
  shipment,
}: ShipmentSummaryProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <h2 className="text-xl font-semibold mb-6">
        Shipment Summary
      </h2>

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