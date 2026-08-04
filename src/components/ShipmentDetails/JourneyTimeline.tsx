import { JourneyHistory } from "../../types/shipmentDetails";

interface JourneyTimelineProps {
  history: JourneyHistory[];
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
}: JourneyTimelineProps) {

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <h2 className="text-xl font-semibold mb-8">
        Shipment Journey
      </h2>

      <div className="space-y-8">

        {history.map((item, index) => (
          <div
            key={item._id}
            className="flex gap-5"
          >
            {/* Timeline */}

            <div className="flex flex-col items-center">

              <div className="w-4 h-4 rounded-full bg-blue-600" />

              {index !== history.length - 1 && (
                <div className="w-0.5 flex-1 bg-slate-300 mt-1 min-h-[60px]" />
              )}

            </div>

            {/* Content */}

            <div className="flex-1 pb-6">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">

                <div>

                  <h3 className="font-semibold text-slate-800">
                    {item.event}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {item.status}
                  </p>

                </div>

                <span className="text-sm text-slate-500">
                  {formatDate(item.eventAt)}
                </span>

              </div>

              {item.remarks && (
                <p className="mt-3 text-slate-700">
                  {item.remarks}
                </p>
              )}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}