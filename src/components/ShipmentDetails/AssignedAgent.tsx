interface AssignedAgentProps {
  agent: any;
}

export default function AssignedAgent({
  agent,
}: AssignedAgentProps) {

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <h2 className="text-xl font-semibold mb-6">
        Assigned Delivery Agent
      </h2>

      {!agent ? (
        <div className="text-slate-500">
          No delivery agent assigned.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div>
            <p className="text-xs text-slate-500">
              Agent Name
            </p>

            <p className="font-semibold mt-1">
              {agent.fullName}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Phone
            </p>

            <p className="mt-1">
              {agent.phoneNumber}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Vehicle
            </p>

            <p className="mt-1">
              {agent.vehicleType}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Status
            </p>

            <span className="inline-flex mt-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              {agent.status}
            </span>
          </div>

        </div>
      )}

    </div>
  );
}