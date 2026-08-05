import { Shipment } from "../types/shipment";

interface Props {
  shipments: Shipment[];
}

const shipmentBadge = (status: string) => {
  switch (status) {
    case "Created":
      return "bg-blue-50 text-blue-700";

    case "Ready For Pickup":
      return "bg-gray-50 text-gray-700";

    case "Pickup Assigned":
      return "bg-violet-50 text-violet-700";

    case "Out For Pickup":
      return "bg-blue-50 text-blue-700";

    case "Pickup Completed":
      return "bg-emerald-50 text-emerald-700";
    case "Arrived At Origin Hub":
      return "bg-cyan-50 text-cyan-700";

    case "Delivery Agent Assigned":
      return "bg-violet-50 text-violet-700";

    case "Out For Delivery":
      return "bg-blue-50 text-blue-700";

    case "In Transit":
      return "bg-orange-50 text-orange-700";

    case "Delivered":
      return "bg-emerald-50 text-emerald-700";

    case "Cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const paymentBadge = (mode: string) => {
  switch (mode.toLowerCase()) {
    case "prepaid":
      return "bg-green-100 text-green-700";

    case "cod":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatAwb = (awb: string) => {
  if (awb.length <= 12) return awb;

  return `${awb.slice(0, 12)}...`;
};

export default function ShipmentTable({ shipments }: Props) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full min-w-[1050px] text-sm">
        <thead className="bg-gray-50">
          <tr className="border-b text-gray-600">
            <th className="p-4 text-left">AWB</th>
            <th className="p-4 text-left">Receiver</th>
            <th className="p-4 text-left">Created</th>
            {/* <th className="p-4 text-left">Route</th> */}
            <th className="p-4 text-left">Payment</th>
            <th className="p-4 text-left">Agent</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {shipments.map((shipment) => (
            <tr
              key={shipment.shipmentId}
              onClick={() => {
                window.history.pushState(
                  {},
                  "",
                  `/orders/${shipment.shipmentId}`
                );

                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="border-b hover:bg-gray-50 transition cursor-pointer"
            >
              {/* AWB */}
              <td className="p-4 font-medium text-gray-700">
                <div className="relative inline-block group">
                  <span className="cursor-pointer">
                    {formatAwb(shipment.awbNumber)}
                  </span>

                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50">
                    <div className="bg-gray-800 text-white text-xs rounded-md px-3 py-2 whitespace-nowrap shadow-lg">
                      {shipment.awbNumber}
                    </div>
                  </div>
                </div>
              </td>

              {/* Receiver */}
              <td className="p-4">
                <div>
                  <p className="font-medium text-gray-800">
                    {shipment.receiverName}
                  </p>

                  <p className="text-xs text-gray-500">
                    {shipment.receiverCity}
                  </p>
                </div>
              </td>

              {/* Created Date */}
              <td className="p-4 text-gray-600">
                {new Date(shipment.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>

              {/* Route */}
              {/* <td className="p-4">
                <div className="font-medium text-gray-700">
                  {shipment.originHub.hubCode}
                </div>

                <div className="text-xs text-gray-400">↓</div>

                <div className="font-medium text-gray-700">
                  {shipment.destinationHub.hubCode}
                </div>
              </td> */}

              {/* Payment */}
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${paymentBadge(
                    shipment.paymentMode
                  )}`}
                >
                  {shipment.paymentMode}
                </span>
              </td>

              {/* Assigned Agent */}
              <td className="p-4">
                {shipment.assignedAgent ? (
                  <div>
                    <p className="font-medium text-gray-800">
                      {shipment.assignedAgent.fullName}
                    </p>

                    <p className="text-xs text-gray-500">
                      {shipment.assignedAgent.phoneNumber}
                    </p>
                  </div>
                ) : (
                  <span className="text-gray-400 italic">
                    Unassigned
                  </span>
                )}
              </td>

              {/* Shipment Status */}
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium ${shipmentBadge(
                    shipment.currentStatus
                  )}`}
                >
                  {shipment.currentStatus}
                </span>
              </td>
            </tr>
          ))}

          {shipments.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-gray-400"
              >
                No shipments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}