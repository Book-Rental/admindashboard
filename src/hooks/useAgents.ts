import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    AgentDetails,
    AgentFormData,
    UpdateAgentData,
} from "../types/agent";

import {
    getAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    getAgentById,
} from "../api/agentApi";

export const AGENTS_QUERY_KEY = ["agents"];


export const useAgents = (
    hubId: string,
    page = 1,
    limit = 10
) => {
    return useQuery({
        queryKey: ["agents", hubId, page, limit],
        queryFn: () => getAgents(hubId, page, limit),
        enabled: !!hubId,
    });
};

export function useAgent(agentId: string) {
    return useQuery<AgentDetails>({
        queryKey: [
            ...AGENTS_QUERY_KEY,
            agentId,
        ],
        queryFn: () => getAgentById(agentId),
        enabled: Boolean(agentId),
    });
}

export function useCreateAgent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: AgentFormData) =>
            createAgent(formData),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: AGENTS_QUERY_KEY,
            });
        },
    });
}


export function useUpdateAgent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateAgentData;
        }) => updateAgent(id, data),

        onSuccess: (_, variables) => {
            // Refresh agent list
            queryClient.invalidateQueries({
                queryKey: AGENTS_QUERY_KEY,
            });

            // Refresh the specific agent details page
            queryClient.invalidateQueries({
                queryKey: [
                    ...AGENTS_QUERY_KEY,
                    variables.id,
                ],
            });
        },
    });
}

/**
 * Delete agent
 */
export function useDeleteAgent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            updatedBy,
        }: {
            id: string;
            updatedBy: string;
        }) => deleteAgent(id, updatedBy),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: AGENTS_QUERY_KEY,
            });
        },
    });
}