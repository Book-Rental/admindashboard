import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { JourneyHistory } from "../../types/shipmentDetails";
import { updateShipmentStatus } from "../../api/shipmentApi";

interface JourneyTimelineProps {
  history: JourneyHistory[];
  shipmentId: string;
  hubId: string;
  refetch: () => Promise<unknown>;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function JourneyTimeline({
  history,
  shipmentId,
  hubId,
  refetch,
}: JourneyTimelineProps) {
  const [loading, setLoading] = useState(false);

  const latestJourney = history[history.length - 1];

  const showReachedHubButton =
    latestJourney?.status === "Pickup Completed";

  const handleClick = async () => {
    try {
      setLoading(true);

      await updateShipmentStatus(shipmentId, {
        status: "Arrived At Origin Hub",
        event: "Arrived At Hub",
        hubId,
        remarks: "Reached to hub.",
        updatedBy: hubId,
      });

      await refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-slate-800">
          Shipment Journey
        </h2>

        {showReachedHubButton && (
          <button
            onClick={handleClick}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Updating..." : "Reached to Hub"}
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="mt-2">
        {history.map((item, index) => {
          const isLast = index === history.length - 1;

          return (
            <div
              key={item._id}
              className="relative flex gap-4"
            >
              {/* Vertical Line */}
              {!isLast && (
                <div className="absolute left-[9px] top-5 h-full w-px bg-blue-300" />
              )}

              {/* Circle */}
              <div className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                <FiCheckCircle className="h-3.5 w-3.5 text-white" />
              </div>

              {/* Content */}
              <div className="pb-6 flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      {item.event}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.status}
                    </p>

                    {item.remarks && (
                      <p className="mt-2 text-xs font-medium text-sky-600">
                        {item.remarks}
                      </p>
                    )}
                  </div>

                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {formatDate(item.eventAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}