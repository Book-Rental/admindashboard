import {
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
import { showToast } from "../utils/showToaster";
import { AxiosError } from "axios";
import { useEffect } from "react";

export default function EditAgent() {
    const agentId = window.location.pathname.split("/")[2];

    const {
        data: agent,
        isLoading: isAgentLoading,
        isError,
    } = useAgent(agentId);

    const updateAgentMutation = useUpdateAgent();
    const isLoading =
        isAgentLoading || updateAgentMutation.isPending;

    useEffect(() => {
        const event = new CustomEvent("widget-loading-status", {
            detail: isLoading,
        });

        window.dispatchEvent(event);
    }, [isLoading]);

    const goBack = () => {
        window.history.pushState({}, "", "/agents");
        window.dispatchEvent(new PopStateEvent("popstate"));
    };



    const handleSubmit = (data: AgentFormData) => {
        const updateData = {
            hubId: data.hubId,
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
                onSuccess: () => {
                    showToast("Agent updated successfully", "success");
                    goBack();
                },

                onError: (error: unknown) => {
                    const axiosError =
                        error as AxiosError<{ message?: string }>;

                    const message =
                        axiosError.response?.data?.message ||
                        (error instanceof Error
                            ? error.message
                            : "Failed to update agent");

                    showToast(message, "error");
                },
            }
        );
    };
    if (isAgentLoading) {
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
                hubId={typeof agent.hubId === "string" ? agent.hubId : agent.hubId._id}
                initialData={agent}
                onSubmit={handleSubmit}
                onCancel={goBack}
                isLoading={updateAgentMutation.isPending}
                title="Edit Agent"
                description="Update the agent's information and save the latest details."
                submitText="Save Changes"
            />


        </>
    );
}