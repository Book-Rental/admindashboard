import { useState } from "react";

import {
    Rb_Button,
    Rb_LoadingSpinner,
} from "@rentbook/rentbook-ui-lib";

import type {
    Agent,
    AgentAnalytics,
} from "../types/agent";

interface AgentsModalProps {
    isOpen: boolean;
    agents: Agent[];
    analytics: AgentAnalytics | null;
    isLoading: boolean;

    selectedAgentId: string | null;
    selectedShipmentCount: number;
    isAssigningAgent: boolean;

    onSelectAgent: (agentId: string) => void;

    onAssignAgent: () => void;

    onClose: () => void;
}

const getAgentInitials = (name: string): string => {
    const trimmedName = name.trim();

    if (!trimmedName) {
        return "NA";
    }

    return trimmedName.slice(0, 2).toUpperCase();
};

interface AgentAvatarProps {
    name: string;
    photo?: string | null;
}

function AgentAvatar({
    name,
    photo,
}: AgentAvatarProps) {
    const [imageError, setImageError] = useState(false);

    const shouldShowImage =
        Boolean(photo) && !imageError;

    if (!shouldShowImage) {
        return (
            <div
                className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-gray-200
          text-sm
          font-semibold
          text-gray-600
        "
            >
                {getAgentInitials(name)}
            </div>
        );
    }

    return (
        <img
            src={photo!}
            alt={name}
            onError={() => setImageError(true)}
            className="
        h-10
        w-10
        shrink-0
        rounded-full
        object-cover
      "
        />
    );
}

export default function AgentsModal({
    isOpen,
    agents,
    isLoading,
    selectedAgentId,
    selectedShipmentCount,
    isAssigningAgent,
    onSelectAgent,
    onAssignAgent,
    onClose,
}: AgentsModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-black/40
        p-2
        sm:p-4
      "
            onClick={onClose}
        >
            <div
                className="
          flex
          max-h-[96vh]
          w-full
          max-w-5xl
          min-w-0
          flex-col
          overflow-hidden
          rounded-xl
          bg-white
          shadow-xl
          sm:max-h-[92vh]
        "
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                <div
                    className="
            flex
            shrink-0
            items-start
            justify-between
            gap-3
            border-b
            border-gray-200
            px-4
            py-4
            sm:px-6
            sm:py-5
          "
                >
                    <div className="min-w-0">
                        <h2
                            className="
                truncate
                text-base
                font-semibold
                text-gray-900
                sm:text-lg
              "
                        >
                            Delivery Agents
                        </h2>

                        <p
                            className="
                mt-1
                max-w-xl
                text-xs
                leading-5
                text-gray-500
                sm:text-sm
              "
                        >
                            Select an agent to assign
                            the selected shipments
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              text-2xl
              leading-none
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
            "
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
                <div
                    className="
            min-h-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            p-3
            sm:p-5
            md:p-6
          "
                >
                    {isLoading ? (
                        <div
                            className="
                flex
                items-center
                justify-center
                py-16
              "
                        >
                            <Rb_LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            {agents.length === 0 ? (
                                <div
                                    className="
                    py-12
                    text-center
                    sm:py-16
                  "
                                >
                                    <p
                                        className="
                      text-sm
                      text-gray-500
                    "
                                    >
                                        No agents found
                                        for this hub.
                                    </p>
                                </div>
                            ) : (
                                <div
                                    className="
                    w-full
                    min-w-0
                    overflow-x-auto
                    rounded-lg
                    border
                    border-gray-200
                  "
                                >
                                    <table
                                        className="
                      w-full
                      min-w-[850px]
                      table-auto
                      text-left
                    "
                                    >

                                        <thead>
                                            <tr
                                                className="
                          border-b
                          border-gray-200
                          bg-gray-50
                          text-left
                        "
                                            >
                                                <th
                                                    className="
                            w-12
                            whitespace-nowrap
                            px-3
                            py-3
                            sm:px-4
                          "
                                                />

                                                <th
                                                    className="
                            whitespace-nowrap
                            px-3
                            py-3
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wide
                            text-gray-600
                            sm:px-4
                          "
                                                >
                                                    Agent
                                                </th>

                                                <th
                                                    className="
                            whitespace-nowrap
                            px-3
                            py-3
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wide
                            text-gray-600
                            sm:px-4
                          "
                                                >
                                                    Phone
                                                </th>

                                                <th
                                                    className="
                            whitespace-nowrap
                            px-3
                            py-3
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wide
                            text-gray-600
                            sm:px-4
                          "
                                                >
                                                    Vehicle
                                                </th>

                                                <th
                                                    className="
                            whitespace-nowrap
                            px-3
                            py-3
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wide
                            text-gray-600
                            sm:px-4
                          "
                                                >
                                                    Status
                                                </th>

                                                <th
                                                    className="
                            whitespace-nowrap
                            px-3
                            py-3
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wide
                            text-gray-600
                            sm:px-4
                          "
                                                >
                                                    Availability
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {agents.map((agent) => {
                                                const isSelected =
                                                    selectedAgentId ===
                                                    agent.agentId;

                                                const isInactive =
                                                    agent.status !== "Active";

                                                return (
                                                    <tr
                                                        key={agent.agentId}
                                                        className={`
                              border-b
                              border-gray-100
                              last:border-b-0
                              transition
                              ${isSelected
                                                                ? "bg-blue-50"
                                                                : "hover:bg-gray-50"
                                                            }
                            `}
                                                    >
                                                        <td
                                                            className="
                                px-3
                                py-4
                                sm:px-4
                              "
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    isSelected
                                                                }
                                                                disabled={
                                                                    isInactive ||
                                                                    isAssigningAgent
                                                                }
                                                                onChange={() =>
                                                                    onSelectAgent(
                                                                        agent.agentId
                                                                    )
                                                                }
                                                                className="
                                  h-4
                                  w-4
                                  cursor-pointer
                                  rounded
                                  border-gray-300
                                  text-blue-600
                                  focus:ring-blue-500
                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                                                                aria-label={`Select ${agent.fullName}`}
                                                            />
                                                        </td>

                                                        <td
                                                            className="
                                min-w-[220px]
                                max-w-[300px]
                                px-3
                                py-4
                                sm:px-4
                              "
                                                        >
                                                            <div
                                                                className="
                                  flex
                                  min-w-0
                                  items-center
                                  gap-3
                                "
                                                            >
                                                                <AgentAvatar
                                                                    name={
                                                                        agent.fullName
                                                                    }
                                                                    photo={
                                                                        agent.photo
                                                                    }
                                                                />

                                                                <div
                                                                    className="
                                    min-w-0
                                    flex-1
                                  "
                                                                >
                                                                    <p
                                                                        className="
                                      truncate
                                      text-sm
                                      font-medium
                                      text-gray-900
                                    "
                                                                        title={
                                                                            agent.fullName
                                                                        }
                                                                    >
                                                                        {
                                                                            agent.fullName
                                                                        }
                                                                    </p>

                                                                    <p
                                                                        className="
                                      max-w-[220px]
                                      truncate
                                      text-xs
                                      text-gray-500
                                    "
                                                                        title={
                                                                            agent.email
                                                                        }
                                                                    >
                                                                        {agent.email}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td
                                                            className="
                                whitespace-nowrap
                                px-3
                                py-4
                                text-sm
                                text-gray-600
                                sm:px-4
                              "
                                                        >
                                                            {
                                                                agent.phoneNumber
                                                            }
                                                        </td>

                                                        <td
                                                            className="
                                min-w-[140px]
                                px-3
                                py-4
                                sm:px-4
                              "
                                                        >
                                                            <p
                                                                className="
                                  whitespace-nowrap
                                  text-sm
                                  font-medium
                                  text-gray-700
                                "
                                                            >
                                                                {
                                                                    agent.vehicle
                                                                        .type
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                  max-w-[140px]
                                  truncate
                                  text-xs
                                  text-gray-500
                                "
                                                                title={
                                                                    agent.vehicle
                                                                        .number
                                                                }
                                                            >
                                                                {
                                                                    agent.vehicle
                                                                        .number
                                                                }
                                                            </p>
                                                        </td>

                                                        <td
                                                            className="
                                whitespace-nowrap
                                px-3
                                py-4
                                sm:px-4
                              "
                                                        >
                                                            <span
                                                                className={
                                                                    agent.status ===
                                                                        "Active"
                                                                        ? `
                                      inline-flex
                                      whitespace-nowrap
                                      rounded-full
                                      bg-green-100
                                      px-3
                                      py-1
                                      text-xs
                                      font-medium
                                      text-green-700
                                    `
                                                                        : `
                                      inline-flex
                                      whitespace-nowrap
                                      rounded-full
                                      bg-red-100
                                      px-3
                                      py-1
                                      text-xs
                                      font-medium
                                      text-red-700
                                    `
                                                                }
                                                            >
                                                                {
                                                                    agent.status
                                                                }
                                                            </span>
                                                        </td>

                                                        <td
                                                            className="
                                whitespace-nowrap
                                px-3
                                py-4
                                sm:px-4
                              "
                                                        >
                                                            <span
                                                                className={
                                                                    agent.isAvailable
                                                                        ? `
                                      inline-flex
                                      whitespace-nowrap
                                      rounded-full
                                      bg-blue-100
                                      px-3
                                      py-1
                                      text-xs
                                      font-medium
                                      text-blue-700
                                    `
                                                                        : `
                                      inline-flex
                                      whitespace-nowrap
                                      rounded-full
                                      bg-gray-100
                                      px-3
                                      py-1
                                      text-xs
                                      font-medium
                                      text-gray-600
                                    `
                                                                }
                                                            >
                                                                {agent.isAvailable
                                                                    ? "Available"
                                                                    : "Unavailable"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div
                    className="
            flex
            shrink-0
            flex-col
            gap-3
            border-t
            border-gray-200
            px-4
            py-4
            sm:px-6
            md:flex-row
            md:items-center
            md:justify-between
          "
                >
                    <div
                        className="
              min-w-0
              text-sm
              text-gray-500
            "
                    >
                        {selectedAgentId ? (
                            <span>
                                Ready to assign{" "}
                                <strong>
                                    {selectedShipmentCount}
                                </strong>{" "}
                                shipment
                                {selectedShipmentCount !==
                                    1
                                    ? "s"
                                    : ""}
                            </span>
                        ) : (
                            <span>
                                Select an agent to
                                continue
                            </span>
                        )}
                    </div>

                    <div
                        className="
              flex
              w-full
              flex-col
              gap-2
              sm:flex-row
              sm:justify-end
              md:w-auto
            "
                    >
                        <Rb_Button
                            variant="outline"
                            size="md"
                            onClick={onClose}
                            disabled={isAssigningAgent}
                        >
                            Cancel
                        </Rb_Button>

                        <Rb_Button
                            variant="primary"
                            size="md"
                            onClick={onAssignAgent}
                            disabled={
                                !selectedAgentId ||
                                isAssigningAgent
                            }
                        >
                            {isAssigningAgent
                                ? "Assigning..."
                                : "Assign to Agent"}
                        </Rb_Button>
                    </div>
                </div>
            </div>
        </div>
    );
}