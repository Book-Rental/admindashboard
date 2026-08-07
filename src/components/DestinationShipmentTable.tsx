import type {
    DestinationShipment,
} from "../types/destinationShipment";

import { Checkbox } from "@rentbook/rentbook-ui-lib";

interface Props {
    shipments: DestinationShipment[];
    selectedShipments: string[];
    onToggleShipment: (
        shipmentId: string
    ) => void;
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
    const allSelected =
        shipments.length > 0 &&
        shipments.every((shipment) =>
            selectedShipments.includes(
                shipment.shipmentId
            )
        );

    return (
        <div className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-200">
            {/* Horizontal scroll only for the table */}
            <div className="w-full overflow-x-auto">
                <table className="min-w-[950px] w-full text-left">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            {/* Select All */}
                            <th className="w-12 whitespace-nowrap p-3 sm:p-4">
                                <Checkbox
                                    label=""
                                    checked={
                                        allSelected
                                    }
                                    onChange={
                                        onToggleAll
                                    }
                                />
                            </th>

                            <th className="whitespace-nowrap p-3 font-semibold text-gray-700 sm:p-4">
                                AWB
                            </th>

                            <th className="whitespace-nowrap p-3 font-semibold text-gray-700 sm:p-4">
                                Receiver
                            </th>

                            <th className="whitespace-nowrap p-3 font-semibold text-gray-700 sm:p-4">
                                Created
                            </th>

                            <th className="whitespace-nowrap p-3 font-semibold text-gray-700 sm:p-4">
                                Payment
                            </th>

                            <th className="whitespace-nowrap p-3 font-semibold text-gray-700 sm:p-4">
                                Agent
                            </th>

                            <th className="whitespace-nowrap p-3 font-semibold text-gray-700 sm:p-4">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {shipments.map(
                            (shipment) => {
                                const isSelected =
                                    selectedShipments.includes(
                                        shipment.shipmentId
                                    );

                                return (
                                    <tr
                                        key={
                                            shipment.shipmentId
                                        }
                                        className={`border-b transition ${isSelected
                                                ? "bg-blue-50"
                                                : "hover:bg-gray-50"
                                            }`}
                                    >
                                        {/* Individual Checkbox */}
                                        <td className="p-3 sm:p-4">
                                            <Checkbox
                                                label=""
                                                checked={
                                                    isSelected
                                                }
                                                onChange={() =>
                                                    onToggleShipment(
                                                        shipment.shipmentId
                                                    )
                                                }
                                            />
                                        </td>

                                        {/* AWB */}
                                        <td className="p-3 font-medium text-gray-700 sm:p-4">
                                            <div className="group relative inline-block">
                                                <span className="cursor-pointer whitespace-nowrap">
                                                    {formatAwb(
                                                        shipment.awbNumber
                                                    )}
                                                </span>

                                                <div className="absolute bottom-full left-0 z-50 mb-2 hidden group-hover:block">
                                                    <div className="whitespace-nowrap rounded-md bg-gray-800 px-3 py-2 text-xs text-white shadow-lg">
                                                        {
                                                            shipment.awbNumber
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Receiver */}
                                        <td className="min-w-[180px] p-3 sm:p-4">
                                            <div>
                                                <p className="max-w-[220px] truncate font-medium text-gray-800">
                                                    {
                                                        shipment
                                                            .receiver
                                                            .name
                                                    }
                                                </p>

                                                <p className="max-w-[220px] truncate text-xs text-gray-500">
                                                    {
                                                        shipment
                                                            .receiver
                                                            .city
                                                    }
                                                </p>
                                            </div>
                                        </td>

                                        {/* Created Date */}
                                        <td className="whitespace-nowrap p-3 text-gray-600 sm:p-4">
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
                                        <td className="min-w-[120px] p-3 sm:p-4">
                                            <span
                                                className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium sm:px-3 ${paymentBadge(
                                                    shipment.paymentMode
                                                )}`}
                                            >
                                                {
                                                    shipment.paymentMode
                                                }
                                            </span>

                                            {shipment.paymentMode ===
                                                "COD" &&
                                                shipment.codAmount >
                                                0 && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        ₹
                                                        {
                                                            shipment.codAmount
                                                        }
                                                    </p>
                                                )}
                                        </td>

                                        {/* Assigned Agent */}
                                        <td className="min-w-[170px] p-3 sm:p-4">
                                            {shipment.assignedAgent ? (
                                                <div>
                                                    <p className="max-w-[180px] truncate font-medium text-gray-800">
                                                        {
                                                            shipment
                                                                .assignedAgent
                                                                .fullName
                                                        }
                                                    </p>

                                                    <p className="whitespace-nowrap text-xs text-gray-500">
                                                        {
                                                            shipment
                                                                .assignedAgent
                                                                .phoneNumber
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="whitespace-nowrap text-sm italic text-gray-400">
                                                    Unassigned
                                                </span>
                                            )}
                                        </td>

                                        {/* Shipment Status */}
                                        <td className="min-w-[180px] p-3 sm:p-4">
                                            <span
                                                className={`inline-block whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium sm:px-3 ${shipmentBadge(
                                                    shipment.currentStatus
                                                )}`}
                                            >
                                                {
                                                    shipment.currentStatus
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                );
                            }
                        )}

                        {shipments.length ===
                            0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-8 text-center text-gray-400"
                                    >
                                        No shipments
                                        found.
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
