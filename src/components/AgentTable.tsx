import {
    Rb_Button,
    Rb_Image,
} from "@rentbook/rentbook-ui-lib";

import { Agent } from "../types/agent";

interface AgentWithPhoto extends Agent {
    photo?: string | null;
}

interface Props {
    agents: AgentWithPhoto[];
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0][0]?.toUpperCase() || "";
    }

    return `${parts[0][0]}${parts[
        parts.length - 1
    ][0]}`.toUpperCase();
};

const getStatusClass = (status: string) => {
    switch (status) {
        case "Active":
            return "bg-green-100 text-green-700";

        case "On Delivery":
            return "bg-blue-100 text-blue-700";

        case "Inactive":
        default:
            return "bg-gray-100 text-gray-600";
    }
};

const formatJoinedDate = (date?: string) => {
    if (!date) {
        return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export default function AgentTable({
    agents,
    onView,
    onEdit,
    onDelete,
}: Props) {
    return (
        <>
            {/* ================= MOBILE ================= */}
            <div className="space-y-4 md:hidden">
                {agents.map((agent) => (
                    <div
                        key={agent.agentId}
                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-start gap-3">

                            {/* Avatar */}
                            {agent.photo ? (
                                <Rb_Image
                                    src={agent.photo}
                                    alt={agent.name}
                                    width={52}
                                    height={52}
                                    shape="circle"
                                />
                            ) : (
                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        min-w-12
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-indigo-100
                                        font-semibold
                                        text-indigo-700
                                    "
                                >
                                    {getInitials(
                                        agent.name
                                    )}
                                </div>
                            )}

                            <div className="min-w-0 flex-1">

                                <div className="flex items-start justify-between gap-2">

                                    <div className="min-w-0">
                                        <h3 className="truncate font-semibold text-gray-800">
                                            {agent.name}
                                        </h3>

                                        <p className="text-xs text-gray-500">
                                            {agent.agentId}
                                        </p>
                                    </div>

                                    <span
                                        className={`
                                            shrink-0
                                            rounded-full
                                            px-2.5
                                            py-1
                                            text-xs
                                            ${getStatusClass(
                                            agent.agentStatus
                                        )}
                                        `}
                                    >
                                        {agent.agentStatus}
                                    </span>
                                </div>

                                <div className="mt-3 space-y-1 text-sm">

                                    <p className="break-all text-gray-600">
                                        {agent.email}
                                    </p>

                                    <p className="text-gray-600">
                                        {agent.phone}
                                    </p>

                                    <p className="text-gray-500">
                                        {agent.vehicleType}
                                    </p>

                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-4">

                            <Rb_Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                    onView(agent.agentId)
                                }
                            >
                                View
                            </Rb_Button>

                            <Rb_Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="w-full"
                                onClick={() =>
                                    onEdit(agent.agentId)
                                }
                            >
                                Edit
                            </Rb_Button>

                            <Rb_Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                    onDelete(agent.agentId)
                                }
                            >
                                Delete
                            </Rb_Button>

                        </div>
                    </div>
                ))}

                {agents.length === 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-400">
                        No agents found.
                    </div>
                )}
            </div >

            {/* ================= DESKTOP ================= */}
            < div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block" >

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[900px]">

                        <thead className="border-b bg-gray-50">
                            <tr>

                                <th className="p-4 text-left text-sm font-medium text-gray-500">
                                    Agent
                                </th>

                                <th className="p-4 text-left text-sm font-medium text-gray-500">
                                    Contact
                                </th>

                                <th className="p-4 text-left text-sm font-medium text-gray-500">
                                    Vehicle
                                </th>

                                <th className="p-4 text-left text-sm font-medium text-gray-500">
                                    Status
                                </th>

                                <th className="p-4 text-left text-sm font-medium text-gray-500">
                                    Joined
                                </th>

                                <th className="p-4 text-left text-sm font-medium text-gray-500">
                                    Actions
                                </th>

                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {agents.map((agent) => (
                                <tr
                                    key={agent.agentId}
                                    className="transition-colors hover:bg-gray-50"
                                >

                                    {/* Agent */}
                                    <td className="p-4">

                                        <div className="flex items-center gap-3">

                                            {agent.photo ? (
                                                <Rb_Image
                                                    src={
                                                        agent.photo
                                                    }
                                                    alt={
                                                        agent.name
                                                    }
                                                    width={44}
                                                    height={44}
                                                    shape="circle"
                                                />
                                            ) : (
                                                <div
                                                    className="
                                                        flex
                                                        h-11
                                                        w-11
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-indigo-100
                                                        font-semibold
                                                        text-indigo-700
                                                    "
                                                >
                                                    {getInitials(
                                                        agent.name
                                                    )}
                                                </div>
                                            )}

                                            <div className="min-w-0">

                                                <p className="truncate font-medium text-gray-800">
                                                    {agent.name}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {agent.agentId}
                                                </p>

                                            </div>

                                        </div>

                                    </td>

                                    {/* Contact */}
                                    <td className="p-4">

                                        <p className="text-sm text-gray-700">
                                            {agent.email}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {agent.phone}
                                        </p>

                                    </td>

                                    {/* Vehicle */}
                                    <td className="p-4">

                                        <p className="text-sm text-gray-700">
                                            {agent.vehicleType}
                                        </p>

                                    </td>

                                    {/* Status */}
                                    <td className="p-4">

                                        <span
                                            className={`
                                                inline-block
                                                rounded-full
                                                px-3
                                                py-1
                                                text-xs
                                                ${getStatusClass(
                                                agent.agentStatus
                                            )}
                                            `}
                                        >
                                            {agent.agentStatus}
                                        </span>

                                    </td>

                                    {/* Joined */}
                                    <td className="p-4 text-sm text-gray-700">

                                        {formatJoinedDate(
                                            agent.joinedAt
                                        )}

                                    </td>

                                    {/* Actions */}
                                    <td className="p-4">

                                        <div className="flex gap-2">

                                            <Rb_Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    onView(
                                                        agent.agentId
                                                    )
                                                }
                                            >
                                                View
                                            </Rb_Button>

                                            <Rb_Button
                                                type="button"
                                                size="sm"
                                                variant="secondary"
                                                onClick={() =>
                                                    onEdit(
                                                        agent.agentId
                                                    )
                                                }
                                            >
                                                Edit
                                            </Rb_Button>

                                            <Rb_Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    onDelete(
                                                        agent.agentId
                                                    )
                                                }
                                            >
                                                Delete
                                            </Rb_Button>

                                        </div>

                                    </td>

                                </tr>
                            ))}

                            {agents.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-10 text-center text-gray-400"
                                    >
                                        No agents found.
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

            </div>
        </>
    );
}