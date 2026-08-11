import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    assignAgentToShipments,
} from "../api/shipmentApi";

import {
    Rb_LoadingSpinner,
    Rb_Button,
    Dropdown,
    Pagination,
} from "@rentbook/rentbook-ui-lib";

import DestinationShipmentTable from "../components/DestinationShipmentTable";
import AgentsModal from "../components/AgentsModal";

import {
    useDestinationShipments,
    useHubById,
} from "../hooks/useDestinationShipment";

import { getAgents } from "../api/agentApi";

import type {
    DestinationShipment,
} from "../types/destinationShipment";

import type {
    Agent,
    AgentAnalytics,
} from "../types/agent";

interface PincodeOption {
    label: string;
    value: string;
}

const PAGE_LIMIT = 10;

export default function DestinationShipment() {
    const hubId =
        window.HOST_USER_INFO?.referenceId ?? "";

    const [
        selectedPincode,
        setSelectedPincode,
    ] = useState("");

    const [
        selectedStatus,
        setSelectedStatus,
    ] = useState("");

    const [
        selectedAgentFilter,
        setSelectedAgentFilter,
    ] = useState("");

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const [
        selectedShipments,
        setSelectedShipments,
    ] = useState<string[]>([]);

    const [
        removedShipmentIds,
        setRemovedShipmentIds,
    ] = useState<string[]>([]);

    const [
        selectedAgentId,
        setSelectedAgentId,
    ] = useState<string | null>(null);

    const [
        isAssigningAgent,
        setIsAssigningAgent,
    ] = useState(false);

    const [
        isAgentsModalOpen,
        setIsAgentsModalOpen,
    ] = useState(false);

    const [
        agents,
        setAgents,
    ] = useState<Agent[]>([]);

    const [
        analytics,
        setAnalytics,
    ] = useState<AgentAnalytics | null>(
        null
    );

    const [
        isAgentsLoading,
        setIsAgentsLoading,
    ] = useState(false);

    const {
        data: hubData,
        isLoading: isHubLoading,
        isError: isHubError,
    } = useHubById(hubId);

    const {
        data,
        isLoading: isShipmentLoading,
        isFetching: isShipmentFetching,
        isError: isShipmentError,
    } = useDestinationShipments(
        hubId,
        {
            pincode:
                selectedPincode ||
                undefined,

            status:
                selectedStatus ||
                undefined,

            agentId:
                selectedAgentFilter ||
                undefined,

            page: currentPage,

            limit: PAGE_LIMIT,
        }
    );

    const allShipments: DestinationShipment[] =
        data?.data?.shipments ?? [];

    const pagination =
        data?.data?.meta;

    const totalPages =
        pagination?.totalPages ?? 1;

    const totalRecords =
        pagination?.totalRecords ?? 0;

    const shipments =
        allShipments.filter(
            (shipment) =>
                !removedShipmentIds.includes(
                    shipment.shipmentId
                )
        );

    const pincodeOptions: PincodeOption[] =
        useMemo(() => {
            const serviceablePincodes =
                hubData?.data
                    ?.serviceablePincodes ?? [];

            return [
                {
                    label: "All Pincodes",
                    value: "",
                },

                ...serviceablePincodes.map(
                    (pincode: string) => ({
                        label: pincode,
                        value: pincode,
                    })
                ),
            ];
        }, [hubData]);

    const statusOptions = [
        {
            label: "All Statuses",
            value: "",
        },
        {
            label:
                "Arrived At Destination Hub",
            value:
                "Arrived At Destination Hub",
        },
        {
            label:
                "Delivery Agent Assigned",
            value:
                "Delivery Agent Assigned",
        },
        {
            label: "Out For Delivery",
            value: "Out For Delivery",
        },
        {
            label: "Delivered",
            value: "Delivered",
        },
    ];

    const agentOptions = [
        {
            label: "All Agents",
            value: "",
        },

        ...agents.map(
            (agent) => ({
                label: agent.fullName,
                value: agent.agentId,
            })
        ),
    ];

    useEffect(() => {
        const fetchAgents = async () => {
            if (!hubId) {
                return;
            }

            try {
                const response =
                    await getAgents(
                        hubId,
                        1,
                        100
                    );

                setAgents(
                    response.data.agents
                );
            } catch (error) {
                console.error(
                    "Failed to fetch agents:",
                    error
                );
            }
        };

        fetchAgents();
    }, [hubId]);

    useEffect(() => {
        setSelectedShipments([]);
        setSelectedAgentId(null);
        setCurrentPage(1);
        setRemovedShipmentIds([]);
    }, [
        selectedPincode,
        selectedStatus,
        selectedAgentFilter,
    ]);

    useEffect(() => {
        window.dispatchEvent(
            new CustomEvent(
                "widget-loading-status",
                {
                    detail:
                        isHubLoading ||
                        isShipmentLoading ||
                        isShipmentFetching,
                }
            )
        );
    }, [
        isHubLoading,
        isShipmentLoading,
        isShipmentFetching,
    ]);

    useEffect(() => {
        if (!isHubError) {
            return;
        }

        window.dispatchEvent(
            new CustomEvent(
                "app-toast-notification",
                {
                    detail: {
                        message:
                            "Failed to load hub details",
                        type: "error",
                    },
                }
            )
        );
    }, [isHubError]);

    useEffect(() => {
        if (!isShipmentError) {
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
    }, [isShipmentError]);

    const handleToggleShipment = (
        shipmentId: string
    ) => {
        setSelectedShipments(
            (previous: string[]) => {
                if (
                    previous.includes(
                        shipmentId
                    )
                ) {
                    return previous.filter(
                        (id: string) =>
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
        const selectableShipmentIds =
            shipments
                .filter(
                    (
                        shipment: DestinationShipment
                    ) =>
                        !shipment.assignedAgent &&
                        shipment.currentStatus ===
                        "Arrived At Destination Hub"
                )
                .map(
                    (
                        shipment: DestinationShipment
                    ) =>
                        shipment.shipmentId
                );

        const allSelected =
            selectableShipmentIds.length > 0 &&
            selectableShipmentIds.every(
                (id: string) =>
                    selectedShipments.includes(id)
            );

        if (allSelected) {
            setSelectedShipments(
                (
                    previous: string[]
                ) =>
                    previous.filter(
                        (id: string) =>
                            !selectableShipmentIds.includes(
                                id
                            )
                    )
            );

            return;
        }

        setSelectedShipments(
            (previous: string[]) => {
                const updated = [...previous];

                selectableShipmentIds.forEach(
                    (id: string) => {
                        if (
                            !updated.includes(id)
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

    const clearFilters = () => {
        setSelectedPincode("");
        setSelectedStatus("");
        setSelectedAgentFilter("");

        setSelectedShipments([]);
        setRemovedShipmentIds([]);
        setSelectedAgentId(null);
        setCurrentPage(1);
    };

    const handlePageChange = (
        page: number
    ) => {
        setSelectedShipments([]);
        setCurrentPage(page);
    };

    const handleShowAgents = async () => {
        if (!hubId) {
            window.dispatchEvent(
                new CustomEvent(
                    "app-toast-notification",
                    {
                        detail: {
                            message:
                                "Hub ID not found",
                            type: "error",
                        },
                    }
                )
            );

            return;
        }

        try {
            setIsAgentsModalOpen(true);
            setIsAgentsLoading(true);

            setAgents([]);
            setAnalytics(null);

            const response =
                await getAgents(
                    hubId,
                    1,
                    100
                );

            setAgents(
                response.data.agents
            );

            setAnalytics(
                response.data.analytics
            );
        } catch (error) {
            console.error(
                "Failed to fetch agents:",
                error
            );

            setAgents([]);
            setAnalytics(null);

            window.dispatchEvent(
                new CustomEvent(
                    "app-toast-notification",
                    {
                        detail: {
                            message:
                                "Failed to load delivery agents",
                            type: "error",
                        },
                    }
                )
            );
        } finally {
            setIsAgentsLoading(false);
        }
    };

    const handleAssignAgent = async () => {
        if (!selectedAgentId) {
            window.dispatchEvent(
                new CustomEvent(
                    "app-toast-notification",
                    {
                        detail: {
                            message:
                                "Please select an agent",
                            type: "error",
                        },
                    }
                )
            );

            return;
        }

        if (
            selectedShipments.length ===
            0
        ) {
            window.dispatchEvent(
                new CustomEvent(
                    "app-toast-notification",
                    {
                        detail: {
                            message:
                                "Please select at least one shipment",
                            type: "error",
                        },
                    }
                )
            );

            return;
        }

        const updatedBy =
            window.HOST_USER_INFO
                ?.userId ??
            window.HOST_USER_INFO?._id ??
            "";

        if (!updatedBy) {
            window.dispatchEvent(
                new CustomEvent(
                    "app-toast-notification",
                    {
                        detail: {
                            message:
                                "User ID not found",
                            type: "error",
                        },
                    }
                )
            );

            return;
        }

        try {
            setIsAssigningAgent(true);

            await assignAgentToShipments(
                selectedAgentId,
                selectedShipments,
                updatedBy
            );

            setRemovedShipmentIds(
                (
                    previous: string[]
                ) => [
                        ...previous,
                        ...selectedShipments.filter(
                            (id: string) =>
                                !previous.includes(
                                    id
                                )
                        ),
                    ]
            );

            setSelectedShipments([]);
            setSelectedAgentId(null);
            setIsAgentsModalOpen(false);

            window.dispatchEvent(
                new CustomEvent(
                    "app-toast-notification",
                    {
                        detail: {
                            message:
                                "Agent assigned successfully",
                            type: "success",
                        },
                    }
                )
            );
        } catch (error) {
            console.error(
                "Failed to assign agent:",
                error
            );

            window.dispatchEvent(
                new CustomEvent(
                    "app-toast-notification",
                    {
                        detail: {
                            message:
                                "Failed to assign agent",
                            type: "error",
                        },
                    }
                )
            );
        } finally {
            setIsAssigningAgent(false);
        }
    };

    const handleCloseAgentsModal = () => {
        setIsAgentsModalOpen(false);
    };

    const isLoading =
        isHubLoading ||
        isShipmentLoading;

    const isError =
        isHubError ||
        isShipmentError;

    return (
        <>
            <div className="w-full min-w-0 overflow-x-hidden p-3 sm:p-5 md:p-6">
                <div className="mb-4 flex min-w-0 flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl md:text-3xl">
                        Shipment List
                    </h1>
                </div>

                <div className="mb-5 w-full min-w-0">

                    <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">

                        <div className="w-full min-w-0 sm:w-[220px] sm:max-w-full">
                            <Dropdown
                                label=""
                                value={
                                    selectedPincode
                                }
                                onChange={(
                                    value: string
                                ) => {
                                    setSelectedPincode(
                                        value ===
                                            "ALL"
                                            ? ""
                                            : value
                                    );
                                }}
                                options={
                                    pincodeOptions
                                }
                                placeholder="Select Pincode"
                                disabled={
                                    isHubLoading ||
                                    isHubError
                                }
                            />
                        </div>

                        <div className="w-full min-w-0 sm:w-[220px] sm:max-w-full">
                            <Dropdown
                                label=""
                                value={
                                    selectedStatus
                                }
                                onChange={(
                                    value: string
                                ) => {
                                    setSelectedStatus(
                                        value ===
                                            "ALL"
                                            ? ""
                                            : value
                                    );
                                }}
                                options={
                                    statusOptions
                                }
                                placeholder="Select Status"
                            />
                        </div>
                        <div className="w-full min-w-0 sm:w-[220px] sm:max-w-full">
                            <Dropdown
                                label=""
                                value={
                                    selectedAgentFilter
                                }
                                onChange={(
                                    value: string
                                ) => {
                                    setSelectedAgentFilter(
                                        value ===
                                            "ALL"
                                            ? ""
                                            : value
                                    );
                                }}
                                options={
                                    agentOptions
                                }
                                placeholder="Select Agent"
                            />
                        </div>

                        {(selectedPincode ||
                            selectedStatus ||
                            selectedAgentFilter) && (
                                <div className="w-full sm:w-auto">
                                    <Rb_Button
                                        variant="outline"
                                        size="md"
                                        onClick={
                                            clearFilters
                                        }
                                    >
                                        Clear Filters
                                    </Rb_Button>
                                </div>
                            )}
                    </div>

                    {selectedShipments.length >
                        0 && (
                            <div className="mt-4 flex w-full min-w-0 flex-col gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">

                                <span className="text-center text-sm font-medium text-gray-700 sm:text-left">
                                    {
                                        selectedShipments.length
                                    }{" "}
                                    {selectedShipments.length ===
                                        1
                                        ? "shipment"
                                        : "shipments"}{" "}
                                    selected
                                </span>

                                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                                    <Rb_Button
                                        variant="outline"
                                        size="md"
                                        onClick={
                                            clearSelection
                                        }
                                    >
                                        Clear Selection
                                    </Rb_Button>

                                    <Rb_Button
                                        variant="primary"
                                        size="md"
                                        onClick={
                                            handleShowAgents
                                        }
                                    >
                                        Show Agents
                                    </Rb_Button>
                                </div>
                            </div>
                        )}
                </div>
                <div className="relative w-full min-w-0 overflow-hidden rounded-lg">

                    {isLoading ? (
                        <div className="flex items-center justify-center py-16 sm:py-20">
                            <Rb_LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            <div className="w-full min-w-0">
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
                            </div>
                            {isError && (
                                <div className="mt-4 text-sm text-red-500 sm:mt-5">
                                    Failed to load shipments.
                                </div>
                            )}

                            {!isError && (
                                <>
                                    <div className="mt-4 flex w-full min-w-0 flex-col gap-4 border-t border-gray-200 pt-4 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">

                                        <div className="min-w-0">
                                            {shipments.length >
                                                0 ? (
                                                <p className="text-center text-sm text-gray-500 sm:text-left">
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
                                            ) : (
                                                <p className="text-center text-sm text-gray-500 sm:text-left">
                                                    No shipments available
                                                </p>
                                            )}
                                        </div>

                                        {totalPages >
                                            1 && (
                                                <div className="flex w-full min-w-0 justify-center overflow-x-auto sm:w-auto sm:justify-end">
                                                    <Pagination
                                                        currentPage={
                                                            currentPage
                                                        }
                                                        totalPages={
                                                            totalPages
                                                        }
                                                        siblingCount={
                                                            1
                                                        }
                                                        disabled={
                                                            isShipmentFetching
                                                        }
                                                        onPageChange={
                                                            handlePageChange
                                                        }
                                                    />
                                                </div>
                                            )}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            <AgentsModal
                isOpen={
                    isAgentsModalOpen
                }
                agents={agents}
                analytics={analytics}
                isLoading={
                    isAgentsLoading
                }
                selectedAgentId={
                    selectedAgentId
                }
                selectedShipmentCount={
                    selectedShipments.length
                }
                isAssigningAgent={
                    isAssigningAgent
                }
                onSelectAgent={(
                    agentId: string
                ) => {
                    setSelectedAgentId(
                        (
                            previous: string | null
                        ) =>
                            previous ===
                                agentId
                                ? null
                                : agentId
                    );
                }}
                onAssignAgent={
                    handleAssignAgent
                }
                onClose={
                    handleCloseAgentsModal
                }
            />
        </>
    );
}