import { useCreateAgent } from "../hooks/useAgents";
import AgentForm from "../components/AgentForm";
import { AgentFormData } from "../types/agent";
import { AxiosError } from "axios";
import { showToast } from "../utils/showToaster";

export default function AddAgent() {
    const createAgentMutation = useCreateAgent();
    const params = new URLSearchParams(window.location.search);

    const hubId = params.get("hubId") || "";

    const goBack = () => {
        window.history.pushState({}, "", "/agents");
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    const handleSubmit = (data: AgentFormData) => {
        createAgentMutation.mutate(data, {
            onSuccess: () => {
                showToast("Agent created successfully", "success");
                goBack();
            },

            onError: (error: unknown) => {
                const axiosError = error as AxiosError<{
                    message?: string;
                }>;

                const message =
                    axiosError.response?.data?.message ||
                    (error instanceof Error
                        ? error.message
                        : "Failed to create agent");

                showToast(message, "error");
            },
        });
    };

    return (
        <AgentForm
            hubId={hubId}
            onSubmit={handleSubmit}
            onCancel={goBack}
            isLoading={createAgentMutation.isPending}
            title="Add New Agent"
            description="Create a delivery agent profile and assign their vehicle details."
            submitText="Create Agent"
        />
    );
}