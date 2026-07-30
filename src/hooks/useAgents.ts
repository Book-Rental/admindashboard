import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    Agent,
    AgentDetails,
    AgentFormData,
    UpdateAgentData,
} from "../types/agent";

import {
    getAgents,
    getAgentById,
    createAgent,
    updateAgent,
    deleteAgent,
} from "../api/agentApi";

export const AGENTS_QUERY_KEY = ["agents"];

/**
 * Get all agents
 */
export function useAgents() {
    return useQuery<Agent[]>({
        queryKey: AGENTS_QUERY_KEY,
        queryFn: getAgents,
    });
}

/**
 * Get single agent by ID
 *
 * GET /agent/:agentId returns AgentDetails,
 * not Agent.
 */
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

/**
 * Create agent
 */
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

/**
 * Update agent
 */
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