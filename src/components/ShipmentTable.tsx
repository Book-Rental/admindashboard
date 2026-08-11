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
  if (awb.length <= 12) {
    return awb;
  }

  return `${awb.slice(0, 12)}...`;
};

export default function ShipmentTable({ shipments }: Props) {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="w-full min-w-0 overflow-x-auto">

        <table
          className="
            w-full
            min-w-[900px]
            text-sm
            lg:min-w-0
            lg:table-fixed
          "
        >
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200 text-gray-600">
              <th
                className="
                  w-[15%]
                  whitespace-nowrap
                  p-3
                  text-left
                  font-semibold
                  sm:p-4
                "
              >
                AWB
              </th>

              <th
                className="
                  w-[21%]
                  whitespace-nowrap
                  p-3
                  text-left
                  font-semibold
                  sm:p-4
                "
              >
                Receiver
              </th>

              <th
                className="
                  w-[15%]
                  whitespace-nowrap
                  p-3
                  text-left
                  font-semibold
                  sm:p-4
                "
              >
                Created
              </th>

              <th
                className="
                  w-[13%]
                  whitespace-nowrap
                  p-3
                  text-left
                  font-semibold
                  sm:p-4
                "
              >
                Payment
              </th>

              <th
                className="
                  w-[19%]
                  whitespace-nowrap
                  p-3
                  text-left
                  font-semibold
                  sm:p-4
                "
              >
                Agent
              </th>

              <th
                className="
                  w-[17%]
                  whitespace-nowrap
                  p-3
                  text-left
                  font-semibold
                  sm:p-4
                "
              >
                Status
              </th>
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

                  window.dispatchEvent(
                    new PopStateEvent("popstate")
                  );
                }}
                className="
                  cursor-pointer
                  border-b
                  border-gray-200
                  transition
                  hover:bg-gray-50
                "
              >
                <td className="p-3 font-medium text-gray-700 sm:p-4">
                  <div className="group relative min-w-0">
                    <span
                      className="block truncate"
                      title={shipment.awbNumber}
                    >
                      {formatAwb(shipment.awbNumber)}
                    </span>

                    <div className="absolute bottom-full left-0 z-50 mb-2 hidden group-hover:block">
                      <div className="whitespace-nowrap rounded-md bg-gray-800 px-3 py-2 text-xs text-white shadow-lg">
                        {shipment.awbNumber}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-3 sm:p-4">
                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        font-medium
                        text-gray-800
                      "
                      title={shipment.receiverName}
                    >
                      {shipment.receiverName}
                    </p>

                    <p
                      className="
                        truncate
                        text-xs
                        text-gray-500
                      "
                      title={shipment.receiverCity}
                    >
                      {shipment.receiverCity}
                    </p>
                  </div>
                </td>

                <td className="whitespace-nowrap p-3 text-gray-600 sm:p-4">
                  {new Date(
                    shipment.createdAt
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                <td className="p-3 sm:p-4">
                  <span
                    className={`
                      inline-block
                      whitespace-nowrap
                      rounded-full
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      sm:px-3
                      ${paymentBadge(
                      shipment.paymentMode
                    )}
                    `}
                  >
                    {shipment.paymentMode}
                  </span>
                </td>

                <td className="p-3 sm:p-4">
                  {shipment.assignedAgent ? (
                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          font-medium
                          text-gray-800
                        "
                        title={
                          shipment.assignedAgent
                            .fullName
                        }
                      >
                        {
                          shipment.assignedAgent
                            .fullName
                        }
                      </p>

                      <p
                        className="
                          truncate
                          text-xs
                          text-gray-500
                        "
                        title={
                          shipment.assignedAgent
                            .phoneNumber
                        }
                      >
                        {
                          shipment.assignedAgent
                            .phoneNumber
                        }
                      </p>
                    </div>
                  ) : (
                    <span className="whitespace-nowrap text-sm italic text-gray-400">
                      Unassigned
                    </span>
                  )}
                </td>

                <td className="p-3 sm:p-4">
                  <span
                    className={`
                      inline-block
                      max-w-full
                      truncate
                      whitespace-nowrap
                      rounded-md
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      sm:px-3
                      ${shipmentBadge(
                      shipment.currentStatus
                    )}
                    `}
                    title={shipment.currentStatus}
                  >
                    {shipment.currentStatus}
                  </span>
                </td>
              </tr>
            ))}

            {shipments.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-sm text-gray-400"
                >
                  No shipments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}