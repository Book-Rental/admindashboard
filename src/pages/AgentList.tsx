import { useMemo, useState } from "react";

import {
    Rb_Button,
    Rb_LoadingSpinner,
    Search as SearchField,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@rentbook/rentbook-ui-lib";

import AgentTable from "../components/AgentTable";
import {
    useAgents,
    useDeleteAgent,
} from "../hooks/useAgents";

export default function AgentList() {
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] =
        useState(false);
    const [selectedAgentId, setSelectedAgentId] =
        useState("");

    const {
        data: agents = [],
        isLoading,
        isError,
    } = useAgents();

    const deleteAgentMutation = useDeleteAgent();

    const filteredAgents = useMemo(() => {
        const value = search.toLowerCase().trim();

        if (!value) {
            return agents;
        }

        return agents.filter((agent) =>
            agent.name.toLowerCase().includes(value) ||
            agent.email.toLowerCase().includes(value) ||
            agent.phone.includes(value) ||
            agent.agentId.toLowerCase().includes(value) ||
            agent.vehicleType.toLowerCase().includes(value) ||
            agent.agentStatus.toLowerCase().includes(value)
        );
    }, [agents, search]);

    const goToAddAgent = () => {
        window.history.pushState(
            {},
            "",
            "/agents/new"
        );

        window.dispatchEvent(
            new PopStateEvent("popstate")
        );
    };

    const goToAgentDetails = (id: string) => {
        window.history.pushState(
            {},
            "",
            `/agents/${id}`
        );

        window.dispatchEvent(
            new PopStateEvent("popstate")
        );
    };

    const goToEditAgent = (id: string) => {
        window.history.pushState(
            {},
            "",
            `/agents/${id}/edit`
        );

        window.dispatchEvent(
            new PopStateEvent("popstate")
        );
    };

    const handleDelete = (id: string) => {
        setSelectedAgentId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedAgentId) {
            return;
        }

        deleteAgentMutation.mutate(
            { id: selectedAgentId, updatedBy: selectedAgentId },
            {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setSelectedAgentId("");
                },
            }
        );
    };

    const closeDeleteModal = () => {
        if (deleteAgentMutation.isPending) {
            return;
        }

        setShowDeleteModal(false);
        setSelectedAgentId("");
    };

    if (isLoading) {
        return (
            <Rb_LoadingSpinner
                text="Loading agents..."
            />
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <p className="text-red-500">
                    Failed to load agents.
                </p>
            </div>
        );
    }

    const selectedAgent = agents.find(
        (agent) =>
            agent.agentId === selectedAgentId
    );

    return (
        <>
            <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">

                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h1 className="text-xl font-semibold text-gray-800 sm:text-2xl">
                            Delivery Agents
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage your delivery agents
                        </p>
                    </div>

                    <Rb_Button
                        type="button"
                        onClick={goToAddAgent}
                        className="w-full sm:w-auto"
                    >
                        + Add New Agent
                    </Rb_Button>
                </div>

                {/* Search */}
                <div className="mb-5 rounded-xl border bg-white p-3 sm:p-4">
                    <SearchField
                        placeholder="Search agents..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />
                </div>

                <AgentTable
                    agents={filteredAgents}
                    onView={goToAgentDetails}
                    onEdit={goToEditAgent}
                    onDelete={handleDelete}
                />
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={closeDeleteModal}
            >
                <ModalHeader
                    onClose={closeDeleteModal}
                >
                    Delete Agent
                </ModalHeader>

                <ModalBody>
                    <p className="text-sm text-gray-600">
                        Are you sure you want to
                        delete{" "}
                        <span className="font-semibold text-gray-800">
                            {selectedAgent?.name ||
                                "this agent"}
                        </span>
                        ?
                    </p>

                    <p className="mt-2 text-xs text-red-500">
                        This action cannot be undone.
                    </p>
                </ModalBody>

                <ModalFooter>
                    <Rb_Button
                        type="button"
                        variant="secondary"
                        onClick={closeDeleteModal}
                        disabled={
                            deleteAgentMutation.isPending
                        }
                    >
                        Cancel
                    </Rb_Button>

                    <Rb_Button
                        type="button"
                        onClick={confirmDelete}
                        isLoading={
                            deleteAgentMutation.isPending
                        }
                    >
                        Delete Agent
                    </Rb_Button>
                </ModalFooter>
            </Modal>
        </>
    );
}