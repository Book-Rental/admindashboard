import { useCreateAgent } from "../hooks/useAgents";
import AgentForm from "../components/AgentForm";
import { AgentFormData } from "../types/agent";

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
            onSuccess: goBack,
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