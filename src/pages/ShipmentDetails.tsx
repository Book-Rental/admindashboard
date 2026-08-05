import { useMemo } from "react";
import { Rb_LoadingSpinner } from "@rentbook/rentbook-ui-lib";

import { useShipment } from "../hooks/useShipment";
import ShipmentSummary from "../components/ShipmentDetails/ShipmentSummary";

import SenderReceiver from "../components/ShipmentDetails/SenderReceiver";
import HubInformation from "../components/ShipmentDetails/HubInformation";
import AssignedAgent from "../components/ShipmentDetails/AssignedAgent";
import JourneyTimeline from "../components/ShipmentDetails/JourneyTimeline";
import { FaArrowLeft } from "react-icons/fa";
import BookDetails from "../components/ShipmentDetails/BookDetails";


const getStatusColor = (status: string) => {
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

export default function ShipmentDetails() {
  const shipmentId = useMemo(() => {
    return window.location.pathname.split("/")[2];
  }, []);

  const {
    data,
    isLoading,
    isError,
      refetch,
  } = useShipment(shipmentId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Rb_LoadingSpinner />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-red-500 text-lg">
        Failed to load shipment details.
      </div>
    );
  }

  const shipment = data.data;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Page Container */}

      <div className="max-w-7xl mx-auto p-6 lg:p-8">

        {/* Back Button */}

        <button
          onClick={() => {
            window.history.pushState(
              {},
              "",
              "/orders"
            );

            window.dispatchEvent(
              new PopStateEvent("popstate")
            );
          }}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-6 transition-colors"
        >
          <FaArrowLeft size={16} />

          Back to Shipments
        </button>

        {/* Header */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                Air Waybill
              </p>
              

              <h3 className="text-sm font-semibold text-slate-600 mt-1">
                {shipment.awbNumber}
              </h3>

              <div className="flex flex-wrap gap-6 mt-5">

                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">
                    Shipment Type
                  </p>

                  <p className="text-sm font-semibold text-slate-600 mt-1">
                    {shipment.shipmentType}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                    Payment
                  </p>

                  <p className="text-sm font-semibold text-slate-600 mt-1">
                    {shipment.paymentMode}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                    Expected Delivery
                  </p>

                  <p className="text-sm font-semibold text-slate-600 mt-1">
                    {new Date(
                      shipment.expectedDeliveryDate
                    ).toLocaleDateString()}
                  </p>
                </div>

              </div>

            </div>

            <div className="flex flex-col items-start lg:items-end gap-4">

              <span
                className={`px-4 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(
                  shipment.currentStatus
                )}`}
              >
                {shipment.currentStatus}
              </span>

              <div className="text-right">

                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                  Created
                </p>

                <p className="text-sm font-semibold text-slate-600 mt-1">
                  {new Date(
                    shipment.createdAt
                  ).toLocaleString()}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Content */}

        <div className="mt-8 space-y-8">

          <ShipmentSummary shipment={shipment} />

          <BookDetails
            orderItem={shipment.orderDetails?.orderItem}
          />

          <SenderReceiver
            sender={shipment.sender}
            receiver={shipment.receiver}
          />

          <HubInformation
            infrastructure={
              shipment.infrastructure
            }
          />

          <AssignedAgent
            agent={shipment.assignedAgent}
          />
<JourneyTimeline
  history={shipment.journeyHistory}
  shipmentId={shipment.shipmentId}
  hubId={shipment.journeyHistory[shipment.journeyHistory.length - 1].hubId}
  refetch={refetch}
/>

        </div>

      </div>

    </div>
  );
}