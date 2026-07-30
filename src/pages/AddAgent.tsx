import { useCreateAgent } from "../hooks/useAgents";
import AgentForm from "../components/AgentForm";
import { AgentFormData } from "../types/agent";

export default function AddAgent() {
    const createAgentMutation = useCreateAgent();

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
            onSubmit={handleSubmit}
            onCancel={goBack}
            isLoading={createAgentMutation.isPending}
            title="Add New Agent"
            description="Create a delivery agent profile and assign their vehicle details."
            submitText="Create Agent"
        />
    );
}