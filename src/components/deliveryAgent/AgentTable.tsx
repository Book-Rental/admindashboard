import { useEffect, useRef, useState } from "react";

import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaEllipsisV,
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!openMenuId) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const activeRef = menuRefs.current[openMenuId];

      if (
        activeRef &&
        !activeRef.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [openMenuId]);

  const toggleMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <h2 className="text-base font-semibold text-slate-800">
          All Delivery Agents
        </h2>

        <div className="w-full sm:w-auto">
          <Rb_Button onClick={onAdd}>
            <div className="flex items-center justify-center gap-2 whitespace-nowrap">
              <FaPlus className="text-xs" />
              Add New Agent
            </div>
          </Rb_Button>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden w-full min-w-0 overflow-x-auto sm:block">
        <table className="w-full min-w-[850px] table-fixed">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="w-[24%] px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-4">
                Agent
              </th>

              <th className="w-[22%] px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-4">
                Email
              </th>

              <th className="w-[14%] px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-4">
                Phone
              </th>

              <th className="w-[14%] px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-4">
                Vehicle
              </th>

              <th className="w-[12%] px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-4">
                Status
              </th>

              <th className="w-[14%] px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {agents.length > 0 ? (
              agents.map((agent) => (
                <tr
                  key={agent.agentId}
                  onClick={() => onView(agent.agentId)}
                  className="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50"
                >
                  {/* AGENT */}
                  <td className="min-w-0 px-3 py-4 sm:px-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600">
                        {agent.photo ? (
                          <img
                            src={agent.photo}
                            alt={agent.fullName}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";

                              const fallback =
                                e.currentTarget
                                  .nextElementSibling as HTMLDivElement;

                              if (fallback) {
                                fallback.style.display = "flex";
                              }
                            }}
                          />
                        ) : null}

                        <div
                          className={`h-full w-full items-center justify-center text-sm font-semibold uppercase text-white ${
                            agent.photo ? "hidden" : "flex"
                          }`}
                        >
                          {agent.fullName.slice(0, 2)}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p
                          className="truncate text-sm font-semibold text-slate-800"
                          title={agent.fullName}
                        >
                          {agent.fullName}
                        </p>

                        <p
                          className="truncate text-xs text-slate-400"
                          title={agent.agentId}
                        >
                          {agent.agentId}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="min-w-0 px-3 py-4 text-sm text-slate-600 sm:px-4">
                    <span
                      className="block truncate"
                      title={agent.email}
                    >
                      {agent.email}
                    </span>
                  </td>

                  {/* PHONE */}
                  <td className="px-3 py-4 text-sm text-slate-600 sm:px-4">
                    <span className="whitespace-nowrap">
                      {agent.phoneNumber}
                    </span>
                  </td>

                  {/* VEHICLE */}
                  <td className="min-w-0 px-3 py-4 sm:px-4">
                    <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
                      <VehicleIcon type={agent.vehicle.type} />

                      <span
                        className="truncate"
                        title={agent.vehicle.type}
                      >
                        {agent.vehicle.type}
                      </span>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-3 py-4 sm:px-4">
                    <div className="whitespace-nowrap">
                      <StatusBadge status={agent.status} />
                    </div>
                  </td>

                  {/* DESKTOP ACTIONS */}
                  <td className="px-3 py-4 sm:px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        aria-label="View agent"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(agent.agentId);
                        }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white transition-colors hover:border-blue-300 hover:bg-blue-50"
                      >
                        <FaEye className="text-xs text-blue-600" />
                      </button>

                      <button
                        type="button"
                        aria-label="Edit agent"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(agent.agentId);
                        }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white transition-colors hover:border-green-300 hover:bg-green-50"
                      >
                        <FaEdit className="text-xs text-green-600" />
                      </button>

                      <button
                        type="button"
                        aria-label="Delete agent"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(agent.agentId);
                        }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white transition-colors hover:border-red-300 hover:bg-red-50"
                      >
                        <FaTrash className="text-xs text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-sm text-slate-500"
                >
                  No delivery agents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE TABLE */}
      <div className="block w-full sm:hidden">
        <table className="w-full table-fixed">

          <thead className="bg-slate-50">
            <tr className="text-left">

              {/* More width for agent */}
              <th className="w-[74%] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
  Agent
</th>

<th className="w-[26%] px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
  Actions
</th>

            </tr>
          </thead>

          <tbody>
            {agents.length > 0 ? (
              agents.map((agent) => (
                <tr
                  key={agent.agentId}
                  onClick={() => onView(agent.agentId)}
                  className="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50"
                >
                  {/* MOBILE AGENT */}
                  <td className="min-w-0 px-4 py-4">
                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600">
                        {agent.photo ? (
                          <img
                            src={agent.photo}
                            alt={agent.fullName}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";

                              const fallback =
                                e.currentTarget
                                  .nextElementSibling as HTMLDivElement;

                              if (fallback) {
                                fallback.style.display = "flex";
                              }
                            }}
                          />
                        ) : null}

                        <div
                          className={`h-full w-full items-center justify-center text-sm font-semibold uppercase text-white ${
                            agent.photo ? "hidden" : "flex"
                          }`}
                        >
                          {agent.fullName.slice(0, 2)}
                        </div>
                      </div>

                      {/* More available width for name and ID */}
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-sm font-semibold text-slate-800"
                          title={agent.fullName}
                        >
                          {agent.fullName}
                        </p>

                        <p
                          className="truncate text-xs text-slate-400"
                          title={agent.agentId}
                        >
                          {agent.agentId}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* MOBILE ACTIONS - RIGHT SIDE */}
                 <td
  className="relative px-3 py-4 pr-5"
  onClick={(e) => e.stopPropagation()}
>
                    <div
                      ref={(el) => {
                        menuRefs.current[agent.agentId] = el;
                      }}
                      className="group relative flex w-full items-center justify-end"
                    >
                      {/* Kebab trigger */}
                      <button
                        type="button"
                        aria-label="Open actions"
                        aria-expanded={openMenuId === agent.agentId}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(agent.agentId);
                        }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-transparent text-slate-500 transition-colors hover:bg-slate-100"
                      >
                        <FaEllipsisV className="text-xs" />
                      </button>

                      {/* Actions flyout */}
                      <div
                        className={`absolute right-0 top-full z-20 mt-1 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg transition-opacity duration-150 ${
                          openMenuId === agent.agentId
                            ? "pointer-events-auto opacity-100"
                            : "pointer-events-none opacity-0"
                        }`}
                      >
                        {/* View */}
                        <button
                          type="button"
                          aria-label="View agent"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            onView(agent.agentId);
                          }}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white transition-colors hover:border-blue-300 hover:bg-blue-50"
                        >
                          <FaEye className="text-xs text-blue-600" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          aria-label="Edit agent"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            onEdit(agent.agentId);
                          }}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white transition-colors hover:border-green-300 hover:bg-green-50"
                        >
                          <FaEdit className="text-xs text-green-600" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          aria-label="Delete agent"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            onDelete(agent.agentId);
                          }}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white transition-colors hover:border-red-300 hover:bg-red-50"
                        >
                          <FaTrash className="text-xs text-red-600" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="p-8 text-center text-sm text-slate-500"
                >
                  No delivery agents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col gap-4 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-center text-sm text-slate-500 sm:text-left">
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

        {meta.totalPages > 1 && (
          <div className="flex w-full justify-center sm:w-auto sm:justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={meta.totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>

    </div>
  );
};

export default AgentTable;