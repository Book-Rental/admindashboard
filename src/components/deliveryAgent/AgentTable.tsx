import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

import {
  Pagination,
  Rb_Button,
} from "@rentbook/rentbook-ui-lib";

import StatusBadge from "./StatusBadge";
import VehicleIcon from "../VehicleIcon";

import {
  Agent,
  AgentMeta,
} from "../../types/agent";

interface AgentTableProps {
  agents: Agent[];
  meta: AgentMeta;

  currentPage: number;
  onPageChange: (page: number) => void;

  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const AgentTable = ({
  agents,
  meta,
  currentPage,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onAdd,
}: AgentTableProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-base font-semibold text-slate-800">
          All Delivery Agents
        </h2>

        <Rb_Button onClick={onAdd}>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <FaPlus className="text-xs" />
            Add New Agent
          </div>
        </Rb_Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Agent
              </th>

              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </th>

              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phone
              </th>

              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Vehicle
              </th>

              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {agents.length > 0 ? (
              agents.map((agent) => (
                <tr
                  key={agent.agentId}
                  className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm uppercase">
                        {agent.fullName.slice(0, 2)}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {agent.fullName}
                        </p>

                        <p className="text-xs text-slate-400">
                          {agent.agentId}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {agent.email}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {agent.phoneNumber}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <VehicleIcon type={agent.vehicle.type} />
                      <span>{agent.vehicle.type}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={agent.status} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onView(agent.agentId)}
                        className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 flex items-center justify-center transition-colors"
                      >
                        <FaEye className="text-blue-600 text-xs" />
                      </button>

                      <button
                        onClick={() => onEdit(agent.agentId)}
                        className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-green-50 hover:border-green-300 flex items-center justify-center transition-colors"
                      >
                        <FaEdit className="text-green-600 text-xs" />
                      </button>

                      <button
                        onClick={() => onDelete(agent.agentId)}
                        className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-300 flex items-center justify-center transition-colors"
                      >
                        <FaTrash className="text-red-600 text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-slate-500"
                >
                  No delivery agents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold">
            {agents.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold">
            {meta.totalRecords}
          </span>{" "}
          agents
        </p>

        <Pagination
          currentPage={currentPage}
          totalPages={meta.totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default AgentTable;
