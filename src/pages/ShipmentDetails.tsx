import { useMemo } from "react";

import { Rb_LoadingSpinner } from "@rentbook/rentbook-ui-lib";

import { useShipment } from "../hooks/useShipment";
import ShipmentSummary from "../components/ShipmentDetails/ShipmentSummary";
import SenderReceiver from "../components/ShipmentDetails/SenderReceiver";
import HubInformation from "../components/ShipmentDetails/HubInformation";
import AssignedAgent from "../components/ShipmentDetails/AssignedAgent";
import JourneyTimeline from "../components/ShipmentDetails/JourneyTimeline";
import { FaArrowLeft } from "react-icons/fa";



const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    case "In Transit":
      return "bg-indigo-100 text-indigo-700";

    case "Pickup Assigned":
      return "bg-blue-100 text-blue-700";

    case "Picked Up":
      return "bg-purple-100 text-purple-700";

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
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
            <FaArrowLeft size={18} />

          Back to Shipments
        </button>

        {/* Header */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <p className="text-sm text-slate-500">
                Air Waybill
              </p>

              <h3 className="text-1xl font-bold text-slate-800 mt-1">
                {shipment.awbNumber}
              </h3>

              <div className="flex flex-wrap gap-6 mt-5">

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    Shipment Type
                  </p>

                  <p className="font-semibold mt-1">
                    {shipment.shipmentType}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    Payment
                  </p>

                  <p className="font-semibold mt-1">
                    {shipment.paymentMode}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    Expected Delivery
                  </p>

                  <p className="font-semibold mt-1">
                    {new Date(
                      shipment.expectedDeliveryDate
                    ).toLocaleDateString()}
                  </p>
                </div>

              </div>

            </div>

            <div className="flex flex-col items-start lg:items-end gap-4">

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  shipment.currentStatus
                )}`}
              >
                {shipment.currentStatus}
              </span>

              <div className="text-right">

                <p className="text-sm text-slate-500">
                  Created
                </p>

                <p className="font-medium">
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
          />

        </div>

      </div>

    </div>
  );
}