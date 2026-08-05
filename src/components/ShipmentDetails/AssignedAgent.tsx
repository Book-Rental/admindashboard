import { AssignedAgent as Agent } from "../../types/shipmentDetails";


interface AssignedAgentProps {
  agent: Agent | null;
}

export default function AssignedAgent({
  agent,
}: AssignedAgentProps) {

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <h2 className="text-base font-semibold text-slate-800 mb-6">
        Assigned Delivery Agent
      </h2>

      {!agent ? (
        <div className="text-sm text-slate-400">
          No delivery agent assigned.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Agent Name
            </p>

            <p className="text-sm font-semibold text-slate-600 mt-1">
              {agent.fullName}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Phone
            </p>

            <p className="text-sm font-semibold text-slate-600 mt-1">
              {agent.phoneNumber}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Vehicle
            </p>

            <p className="text-sm font-semibold text-slate-600 mt-1">
              {agent.vehicleType}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Status
            </p>

            <span className="inline-flex mt-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              {agent.status}
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
