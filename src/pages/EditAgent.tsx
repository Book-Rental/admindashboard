import { useState } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Rb_Button,
    Rb_LoadingSpinner,
} from "@rentbook/rentbook-ui-lib";
import { FaExclamationCircle } from "react-icons/fa";

import AgentForm from "../components/AgentForm";
import {
    useAgent,
    useUpdateAgent,
} from "../hooks/useAgents";
import { AgentFormData } from "../types/agent";

export default function EditAgent() {
    const agentId = window.location.pathname.split("/")[2];

    const {
        data: agent,
        isLoading,
        isError,
    } = useAgent(agentId);

    const updateAgentMutation = useUpdateAgent();

    const [showModal, setShowModal] = useState(false);
    const [validationMessage, setValidationMessage] = useState("");

    const goBack = () => {
        window.history.pushState({}, "", "/agents");
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    const showError = (message: string) => {
        setValidationMessage(message);
        setShowModal(true);
    };

    const handleSubmit = (data: AgentFormData) => {
        const updateData = {
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            vehicleType: data.vehicleType,
            vehicleNumber: data.vehicleNumber,
            address: data.address,
            emergencyContact: data.emergencyContact,
            notes: data.notes,
            photo: data.photo,
            isActive: data.isActive,
        };

        updateAgentMutation.mutate(
            {
                id: agentId,
                data: updateData,
            },
            {
                onSuccess: goBack,
                onError: (error) => {
                    console.error(
                        "Update agent error:",
                        error
                    );

                    showError(
                        error instanceof Error
                            ? error.message
                            : "Failed to update agent. Please try again."
                    );
                },
            }
        );
    };

    if (isLoading) {
        return (
            <Rb_LoadingSpinner
                text="Loading agent details..."
            />
        );
    }

    if (isError || !agent) {
        return (
            <div className="min-h-screen mx-auto w-full bg-gray-50 p-6">
                <div className="rounded-2xl border border-red-100 bg-white p-8 shadow-sm">

                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl text-red-500">
                        <FaExclamationCircle />
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900">
                        Unable to load agent
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        We couldn't load the agent details.
                        Please try again.
                    </p>

                    <Rb_Button
                        type="button"
                        className="mt-5"
                        onClick={goBack}
                    >
                        Back to Agents
                    </Rb_Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <AgentForm
                initialData={agent}
                onSubmit={handleSubmit}
                onCancel={goBack}
                isLoading={updateAgentMutation.isPending}
                title="Edit Agent"
                description="Update the agent's information and save the latest details."
                submitText="Save Changes"
            />

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            >
                <ModalHeader
                    onClose={() => setShowModal(false)}
                >
                    Update Error
                </ModalHeader>

                <ModalBody>
                    <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
                            <FaExclamationCircle />
                        </div>

                        <p className="text-sm leading-5 text-red-700">
                            {validationMessage}
                        </p>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Rb_Button
                        onClick={() => setShowModal(false)}
                    >
                        OK
                    </Rb_Button>
                </ModalFooter>
            </Modal>
        </>
    );
}