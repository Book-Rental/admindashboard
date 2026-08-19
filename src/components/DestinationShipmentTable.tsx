import type {
    DestinationShipment,
} from "../types/destinationShipment";

import { Checkbox } from "@rentbook/rentbook-ui-lib";

interface Props {
    shipments: DestinationShipment[];
    selectedShipments: string[];
    onToggleShipment: (shipmentId: string) => void;
    onToggleAll: () => void;
}

const shipmentBadge = (status: string) => {
    switch (status) {
        case "Created":
            return "bg-blue-50 text-blue-700";

        case "Ready For Pickup":
            return "bg-gray-50 text-gray-700";

        case "Pickup Assigned":
            return "bg-violet-50 text-violet-700";

        case "Out For Pickup":
            return "bg-blue-50 text-blue-700";

        case "Pickup Completed":
            return "bg-emerald-50 text-emerald-700";

        case "Arrived At Origin Hub":
            return "bg-cyan-50 text-cyan-700";

        case "Arrived At Destination Hub":
            return "bg-cyan-50 text-cyan-700";

        case "Delivery Agent Assigned":
            return "bg-violet-50 text-violet-700";

        case "Out For Delivery":
            return "bg-blue-50 text-blue-700";

        case "In Transit":
            return "bg-orange-50 text-orange-700";

        case "Delivered":
            return "bg-emerald-50 text-emerald-700";

        case "Cancelled":
            return "bg-red-50 text-red-700";

        default:
            return "bg-gray-100 text-gray-700";
    }
};

const paymentBadge = (mode: string) => {
    switch (mode.toLowerCase()) {
        case "prepaid":
            return "bg-green-100 text-green-700";

        case "cod":
            return "bg-yellow-100 text-yellow-700";

        default:
            return "bg-gray-100 text-gray-700";
    }
};

const formatAwb = (awb: string) => {
    if (awb.length <= 12) {
        return awb;
    }

    return `${awb.slice(0, 12)}...`;
};

export default function DestinationShipmentTable({
    shipments,
    selectedShipments,
    onToggleShipment,
    onToggleAll,
}: Props) {
    const selectableShipments = shipments.filter(
        (shipment) =>
            !shipment.assignedAgent &&
            shipment.currentStatus ===
                "Arrived At Destination Hub"
    );

    const allSelected =
        selectableShipments.length > 0 &&
        selectableShipments.every((shipment) =>
            selectedShipments.includes(
                shipment.shipmentId
            )
        );

    return (
        <div className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="w-full min-w-0 overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            {/* Checkbox */}
                            <th className="w-[5%] px-2 py-3 sm:px-3 sm:py-4">
                                <div className="flex h-full items-center justify-center">
                                    <Checkbox
                                        label=""
                                        checked={allSelected}
                                        onChange={onToggleAll}
                                        disabled={
                                            selectableShipments.length === 0
                                        }
                                    />
                                </div>
                            </th>

                            {/* AWB */}
                            <th className="w-[15%] whitespace-nowrap px-2 py-3 font-semibold text-gray-700 sm:px-3 sm:py-4">
                                AWB
                            </th>

                            {/* Receiver */}
                            <th className="w-[18%] whitespace-nowrap px-2 py-3 font-semibold text-gray-700 sm:px-3 sm:py-4">
                                Receiver
                            </th>

                            {/* Created */}
                            <th className="w-[13%] whitespace-nowrap px-2 py-3 font-semibold text-gray-700 sm:px-3 sm:py-4">
                                Created
                            </th>

                            {/* Payment */}
                            <th className="w-[12%] whitespace-nowrap px-2 py-3 font-semibold text-gray-700 sm:px-3 sm:py-4">
                                <div className="flex items-center justify-center">
                                    Payment
                                </div>
                            </th>

                            {/* Agent */}
                            <th className="w-[18%] whitespace-nowrap px-2 py-3 font-semibold text-gray-700 sm:px-3 sm:py-4">
                                Agent
                            </th>

                            {/* Status */}
                            <th className="w-[19%] whitespace-nowrap px-2 py-3 font-semibold text-gray-700 sm:px-3 sm:py-4">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {shipments.map((shipment) => {
                            const isSelected =
                                selectedShipments.includes(
                                    shipment.shipmentId
                                );

                            const canSelect =
                                !shipment.assignedAgent &&
                                shipment.currentStatus ===
                                    "Arrived At Destination Hub";

                            return (
                                <tr
                                    key={shipment.shipmentId}
                                    className={`
                                        border-b
                                        border-gray-200
                                        transition
                                        ${
                                            isSelected
                                                ? "bg-blue-50"
                                                : "hover:bg-gray-50"
                                        }
                                    `}
                                >
                                    {/* Checkbox */}
                                    <td className="px-2 py-3 sm:px-3 sm:py-4">
                                        <div className="flex min-h-[42px] items-center justify-center">
                                            <div
                                                className={
                                                    canSelect
                                                        ? "flex items-center"
                                                        : "flex items-center opacity-50"
                                                }
                                            >
                                                <Checkbox
                                                    label=""
                                                    checked={isSelected}
                                                    onChange={() => {
                                                        if (canSelect) {
                                                            onToggleShipment(
                                                                shipment.shipmentId
                                                            );
                                                        }
                                                    }}
                                                    disabled={!canSelect}
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    {/* AWB */}
                                    <td className="relative overflow-visible px-2 py-3 font-medium text-gray-700 sm:px-3 sm:py-4">
                                        <div className="group relative min-w-0">
                                            <span className="block truncate whitespace-nowrap">
                                                {formatAwb(
                                                    shipment.awbNumber
                                                )}
                                            </span>

                                            <div className="pointer-events-none absolute bottom-full left-0 z-[9999] mb-2 hidden group-hover:block">
                                                <div className="whitespace-nowrap rounded-md bg-gray-800 px-3 py-2 text-xs text-white shadow-lg">
                                                    {shipment.awbNumber}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Receiver */}
                                    <td className="min-w-0 overflow-hidden px-2 py-3 sm:px-3 sm:py-4">
                                        <div className="min-w-0">
                                            <p
                                                className="truncate font-medium text-gray-800"
                                                title={shipment.receiver.name}
                                            >
                                                {shipment.receiver.name}
                                            </p>

                                            <p
                                                className="truncate text-xs text-gray-500"
                                                title={shipment.receiver.city}
                                            >
                                                {shipment.receiver.city}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Created Date */}
                                    <td className="whitespace-nowrap px-2 py-3 text-gray-600 sm:px-3 sm:py-4">
                                        {new Date(
                                            shipment.createdAt
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )}
                                    </td>

                                    {/* Payment */}
                                    <td className="min-w-0 overflow-hidden px-2 py-3 sm:px-3 sm:py-4">
                                        <div className="flex min-h-[42px] flex-col items-center justify-center gap-1">
                                            <span
                                                className={`
                                                    inline-flex
                                                    min-w-[66px]
                                                    items-center
                                                    justify-center
                                                    whitespace-nowrap
                                                    rounded-full
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-medium
                                                    ${paymentBadge(
                                                        shipment.paymentMode
                                                    )}
                                                `}
                                                title={
                                                    shipment.paymentMode
                                                }
                                            >
                                                {shipment.paymentMode}
                                            </span>

                                            {shipment.paymentMode
                                                .toLowerCase() === "cod" &&
                                                shipment.codAmount > 0 && (
                                                    <p className="min-w-[66px] text-center whitespace-nowrap text-xs text-gray-500">
                                                        ₹{shipment.codAmount}
                                                    </p>
                                                )}
                                        </div>
                                    </td>

                                    {/* Agent */}
                                    <td className="min-w-0 overflow-hidden px-2 py-3 sm:px-3 sm:py-4">
                                        {shipment.assignedAgent ? (
                                            <div className="min-w-0">
                                                <p
                                                    className="truncate font-medium text-gray-800"
                                                    title={
                                                        shipment.assignedAgent
                                                            .fullName
                                                    }
                                                >
                                                    {
                                                        shipment.assignedAgent
                                                            .fullName
                                                    }
                                                </p>

                                                <p
                                                    className="truncate text-xs text-gray-500"
                                                    title={
                                                        shipment.assignedAgent
                                                            .phoneNumber
                                                    }
                                                >
                                                    {
                                                        shipment.assignedAgent
                                                            .phoneNumber
                                                    }
                                                </p>
                                            </div>
                                        ) : (
                                            <span className="block truncate text-sm italic text-gray-400">
                                                Unassigned
                                            </span>
                                        )}
                                    </td>

                                    {/* Status */}
                                    <td className="min-w-0 overflow-hidden px-2 py-3 sm:px-3 sm:py-4">
                                        <span
                                            className={`
                                                inline-block
                                                max-w-full
                                                truncate
                                                whitespace-nowrap
                                                rounded-md
                                                px-2
                                                py-1
                                                text-xs
                                                font-medium
                                                sm:px-3
                                                ${shipmentBadge(
                                                    shipment.currentStatus
                                                )}
                                            `}
                                            title={
                                                shipment.currentStatus
                                            }
                                        >
                                            {shipment.currentStatus}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}

                        {shipments.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="p-8 text-center text-sm text-gray-400"
                                >
                                    No shipments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}