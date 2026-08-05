import { Infrastructure, Hub, } from "../../types/shipmentDetails";

interface HubInformationProps {
  infrastructure: Infrastructure;
}

const HubCard = ({
  title,
  hub,
}: {
  title: string;
  hub: Hub;
}) => {
  if (!hub) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

      <h3 className="text-base font-semibold text-slate-700 mb-4">
        {title}
      </h3>

      <div className="space-y-3">

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Hub Name
          </p>

          <p className="text-sm font-semibold text-slate-600 mt-1">
            {hub.hubName}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Hub Code
          </p>

          <p className="text-sm font-semibold text-slate-600 mt-1">{hub.hubCode}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Location
          </p>

          <p className="text-sm font-semibold text-slate-600 mt-1">
            {hub.address.city}, {hub.address.state}
          </p>
        </div>

      </div>

    </div>
  );
};

export default function HubInformation({
  infrastructure,
}: HubInformationProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <h2 className="text-base font-semibold text-slate-800 mb-6">
        Hub Information
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <HubCard
          title="Origin Hub"
          hub={infrastructure.originHub}
        />

        <HubCard
          title="Current Hub"
          hub={infrastructure.currentHub}
        />

        <HubCard
          title="Destination Hub"
          hub={infrastructure.destinationHub}
        />

      </div>

    </div>
  );
}
