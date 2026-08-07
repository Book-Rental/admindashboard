import { useEffect, useMemo, useState } from "react";

import {
    Rb_LoadingSpinner,
    Rb_Button,
    Dropdown,
} from "@rentbook/rentbook-ui-lib";

import DestinationShipmentTable from "../components/DestinationShipmentTable";

import {
    useDestinationShipments,
} from "../hooks/useDestinationShipment";

import type {
    DestinationShipment,
} from "../types/destinationShipment";

interface PincodeOption {
    label: string;
    value: string;
}

export default function DestinationShipment() {
    const hubId =
        window.HOST_USER_INFO?.referenceId ?? "";

    const [selectedPincode, setSelectedPincode] =
        useState("");

    const [selectedShipments, setSelectedShipments] =
        useState<string[]>([]);

    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useDestinationShipments(
        hubId,
        selectedPincode || undefined
    );

    const shipments: DestinationShipment[] =
        data?.data?.shipments ?? [];

    const totalRecords =
        data?.data?.meta?.totalRecords ?? 0;

    /*
     * Keep the initial/all shipment data separately
     * for building the pincode dropdown.
     */
    const [allShipments, setAllShipments] =
        useState<DestinationShipment[]>([]);


    useEffect(() => {
        if (
            !selectedPincode &&
            data?.data?.shipments
        ) {
            setAllShipments(
                data.data.shipments
            );
        }
    }, [
        data,
        selectedPincode,
    ]);


    const pincodeOptions: PincodeOption[] = useMemo(() => {
        const uniquePincodes = Array.from(
            new Set(
                allShipments
                    .map(
                        (shipment: DestinationShipment) =>
                            shipment.receiver?.pincode
                    )
                    .filter(
                        (pincode): pincode is string =>
                            Boolean(pincode)
                    )
            )
        );

        return uniquePincodes.map(
            (pincode: string): PincodeOption => ({
                label: pincode,
                value: pincode,
            })
        );
    }, [allShipments]);

    const handleToggleShipment = (
        shipmentId: string
    ) => {
        setSelectedShipments(
            (previous) => {
                if (
                    previous.includes(
                        shipmentId
                    )
                ) {
                    return previous.filter(
                        (id) =>
                            id !== shipmentId
                    );
                }

                return [
                    ...previous,
                    shipmentId,
                ];
            }
        );
    };


    const handleToggleAll = () => {
        const currentShipmentIds =
            shipments.map(
                (
                    shipment: DestinationShipment
                ) =>
                    shipment.shipmentId
            );

        const allSelected =
            currentShipmentIds.length > 0 &&
            currentShipmentIds.every(
                (id) =>
                    selectedShipments.includes(
                        id
                    )
            );

        if (allSelected) {
            setSelectedShipments(
                (previous) =>
                    previous.filter(
                        (id) =>
                            !currentShipmentIds.includes(
                                id
                            )
                    )
            );

            return;
        }

        setSelectedShipments(
            (previous) => {
                const updated = [
                    ...previous,
                ];

                currentShipmentIds.forEach(
                    (id) => {
                        if (
                            !updated.includes(
                                id
                            )
                        ) {
                            updated.push(id);
                        }
                    }
                );

                return updated;
            }
        );
    };


    const clearSelection = () => {
        setSelectedShipments([]);
    };


    useEffect(() => {
        setSelectedShipments([]);
    }, [selectedPincode]);


    useEffect(() => {
        window.dispatchEvent(
            new CustomEvent(
                "widget-loading-status",
                {
                    detail:
                        isLoading ||
                        isFetching,
                }
            )
        );
    }, [
        isLoading,
        isFetching,
    ]);


    useEffect(() => {
        if (!isError) {
            return;
        }

        window.dispatchEvent(
            new CustomEvent(
                "app-toast-notification",
                {
                    detail: {
                        message:
                            "Failed to load shipments",
                        type: "error",
                    },
                }
            )
        );
    }, [isError]);


    const handleShowAgents = () => {
        console.log(
            "Selected shipment IDs:",
            selectedShipments
        );
    };

    return (
        <div className="w-full min-w-0 p-3 sm:p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-4 sm:mb-6">
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl md:text-3xl">
                    Shipment List
                </h1>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:gap-4 lg:mb-6 lg:flex-row lg:items-center lg:justify-between">

                {/* Pincode Filter */}
                <div
                    className="
        w-full
        max-w-full
        sm:max-w-[355px]
        sm:w-64

        [&_.dropdown]:!w-full
        [&_.dropdown]:!max-w-full

        [&_.dropdown__select]:!mt-0
        [&_.dropdown__select]:!h-11
        [&_.dropdown__select]:!w-full
        [&_.dropdown__select]:!max-w-full
        [&_.dropdown__select]:!min-w-0
        [&_.dropdown__select]:!rounded-lg
        [&_.dropdown__select]:!border
        [&_.dropdown__select]:!border-gray-300
        [&_.dropdown__select]:!bg-white
        [&_.dropdown__select]:!px-3.5
        [&_.dropdown__select]:!text-sm
        [&_.dropdown__select]:!text-gray-900
        [&_.dropdown__select]:!outline-none
        [&_.dropdown__select]:!box-border
        [&_.dropdown__select]:!transition-colors

        [&_.dropdown__select:hover]:!border-gray-400

        [&_.dropdown__select:focus]:!border-blue-500

        [&_.dropdown__select:disabled]:!border-gray-200
        [&_.dropdown__select:disabled]:!bg-gray-50
        [&_.dropdown__select:disabled]:!text-gray-400
    "
                >
                    <Dropdown
                        label=""
                        value={selectedPincode}
                        onChange={(value: string) => {
                            setSelectedPincode(value);
                        }}
                        options={pincodeOptions}
                        placeholder="Select Pincode"
                    />
                </div>
                {selectedShipments.length > 0 && (
                    <div className="flex w-full flex-wrap items-center gap-2 sm:gap-3 lg:w-auto">
                        <span className="text-sm text-gray-600">
                            {
                                selectedShipments.length
                            }{" "}
                            selected
                        </span>

                        <Rb_Button
                            variant="outline"
                            size="md"
                            className="flex-1 sm:flex-none min-w-[130px] sm:min-w-0"
                            onClick={
                                clearSelection
                            }
                        >
                            Clear Selection
                        </Rb_Button>

                        <Rb_Button
                            variant="primary"
                            size="md"
                            className="flex-1 sm:flex-none min-w-[110px] sm:min-w-0"
                            onClick={
                                handleShowAgents
                            }
                        >
                            Show Agents
                        </Rb_Button>
                    </div>
                )}
            </div>

            {/* Shipment Table */}
            <div className="relative w-full min-w-0 overflow-x-auto rounded-lg">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16 sm:py-20">
                        <Rb_LoadingSpinner />
                    </div>
                ) : (
                    <>
                        <DestinationShipmentTable
                            shipments={
                                shipments
                            }
                            selectedShipments={
                                selectedShipments
                            }
                            onToggleShipment={
                                handleToggleShipment
                            }
                            onToggleAll={
                                handleToggleAll
                            }
                        />

                        {isError && (
                            <div className="mt-4 text-sm text-red-500 sm:mt-5">
                                Failed to load
                                shipments.
                            </div>
                        )}

                        {!isError && (
                            <div className="mt-4 sm:mt-5">
                                <p className="text-sm text-gray-500">
                                    Showing{" "}
                                    {
                                        shipments.length
                                    }{" "}
                                    of{" "}
                                    {
                                        totalRecords
                                    }{" "}
                                    shipments
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

