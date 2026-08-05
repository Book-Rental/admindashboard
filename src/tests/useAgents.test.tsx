import React from "react";

import {
    renderHook,
    waitFor,
} from "@testing-library/react";

import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    useAgents,
    useAgent,
    useCreateAgent,
    useUpdateAgent,
    useDeleteAgent,
} from "../hooks/useAgents";

import {
    getAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    getAgentById,
} from "../api/agentApi";

/* -------------------------------------------------------------------------- */
/* API MOCKS                                                                  */
/* -------------------------------------------------------------------------- */

vi.mock("../api/agentApi", () => ({
    getAgents: vi.fn(),
    createAgent: vi.fn(),
    updateAgent: vi.fn(),
    deleteAgent: vi.fn(),
    getAgentById: vi.fn(),
}));

/* -------------------------------------------------------------------------- */
/* TEST DATA                                                                  */
/* -------------------------------------------------------------------------- */

const mockAgents = {
    agents: [
        {
            _id: "agent-1",
            fullName: "John Doe",
        },
    ],
    total: 1,
    page: 1,
    limit: 10,
};

const mockAgent = {
    _id: "agent-1",
    fullName: "John Doe",
    email: "john@example.com",
};

const mockFormData = {
    hubId: "hub-123",
    fullName: "John Doe",
    email: "john@example.com",
    password: "password123",
    phoneNumber: "9876543210",
    vehicleType: "Bike",
    vehicleNumber: "TS09AB1234",
    address: "Hyderabad",
    emergencyContact: "9123456780",
    notes: "Test agent",
    photo: null,
    isActive: true,
};

const mockUpdateData = {
    fullName: "John Updated",
    email: "john.updated@example.com",
    phoneNumber: "9876543210",
    vehicleType: "Bike",
    vehicleNumber: "TS09AB1234",
    address: "Hyderabad",
    emergencyContact: "9123456780",
    notes: "Updated agent",
    photo: null,
    isActive: true,
};

/* -------------------------------------------------------------------------- */
/* QUERY CLIENT                                                               */
/* -------------------------------------------------------------------------- */

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
                retry: false,
            },
        },
    });

const createWrapper = (
    queryClient: QueryClient
) => {
    return function Wrapper({
        children,
    }: {
        children: React.ReactNode;
    }) {
        return (
            <QueryClientProvider
                client={queryClient}
            >
                {children}
            </QueryClientProvider>
        );
    };
};

/* -------------------------------------------------------------------------- */
/* TEST SETUP                                                                 */
/* -------------------------------------------------------------------------- */

describe("useAgents hooks", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    /* ---------------------------------------------------------------------- */
    /* useAgents                                                               */
    /* ---------------------------------------------------------------------- */

    describe("useAgents", () => {
        it("fetches agents with hubId, page and limit", async () => {
            vi.mocked(getAgents).mockResolvedValue(
                mockAgents as never
            );

            const queryClient =
                createTestQueryClient();

            const { result } = renderHook(
                () =>
                    useAgents(
                        "hub-123",
                        2,
                        20
                    ),
                {
                    wrapper:
                        createWrapper(
                            queryClient
                        ),
                }
            );

            await waitFor(() => {
                expect(
                    result.current.isSuccess
                ).toBe(true);
            });

            expect(getAgents).toHaveBeenCalledTimes(
                1
            );

            expect(getAgents).toHaveBeenCalledWith(
                "hub-123",
                2,
                20
            );

            expect(
                result.current.data
            ).toEqual(mockAgents);
        });

        it("uses default page and limit", async () => {
            vi.mocked(getAgents).mockResolvedValue(
                mockAgents as never
            );

            const queryClient =
                createTestQueryClient();

            renderHook(
                () => useAgents("hub-123"),
                {
                    wrapper:
                        createWrapper(
                            queryClient
                        ),
                }
            );

            await waitFor(() => {
                expect(
                    getAgents
                ).toHaveBeenCalled();
            });

            expect(getAgents).toHaveBeenCalledWith(
                "hub-123",
                1,
                10
            );
        });

        it("does not fetch when hubId is empty", async () => {
            const queryClient =
                createTestQueryClient();

            const { result } = renderHook(
                () => useAgents(""),
                {
                    wrapper:
                        createWrapper(
                            queryClient
                        ),
                }
            );

            await waitFor(() => {
                expect(
                    result.current.fetchStatus
                ).toBe("idle");
            });

            expect(
                getAgents
            ).not.toHaveBeenCalled();
        });
    });

    /* ---------------------------------------------------------------------- */
    /* useAgent                                                                */
    /* ---------------------------------------------------------------------- */

    describe("useAgent", () => {
        it("fetches an agent by id", async () => {
            vi.mocked(
                getAgentById
            ).mockResolvedValue(
                mockAgent as never
            );

            const queryClient =
                createTestQueryClient();

            const { result } = renderHook(
                () =>
                    useAgent(
                        "agent-123"
                    ),
                {
                    wrapper:
                        createWrapper(
                            queryClient
                        ),
                }
            );

            await waitFor(() => {
                expect(
                    result.current.isSuccess
                ).toBe(true);
            });

            expect(
                getAgentById
            ).toHaveBeenCalledTimes(1);

            expect(
                getAgentById
            ).toHaveBeenCalledWith(
                "agent-123"
            );

            expect(
                result.current.data
            ).toEqual(mockAgent);
        });

        it("does not fetch when agentId is empty", async () => {
            const queryClient =
                createTestQueryClient();

            const { result } = renderHook(
                () => useAgent(""),
                {
                    wrapper:
                        createWrapper(
                            queryClient
                        ),
                }
            );

            await waitFor(() => {
                expect(
                    result.current.fetchStatus
                ).toBe("idle");
            });

            expect(
                getAgentById
            ).not.toHaveBeenCalled();
        });
    });

    /* ---------------------------------------------------------------------- */
    /* useCreateAgent                                                          */
    /* ---------------------------------------------------------------------- */

    describe("useCreateAgent", () => {
        it("creates an agent with the provided form data", async () => {
            vi.mocked(
                createAgent
            ).mockResolvedValue(
                mockAgent as never
            );

            const queryClient =
                createTestQueryClient();

            const { result } = renderHook(
                () => useCreateAgent(),
                {
                    wrapper:
                        createWrapper(
                            queryClient
                        ),
                }
            );

            result.current.mutate(
                mockFormData as never
            );

            await waitFor(() => {
                expect(
                    result.current.isSuccess
                ).toBe(true);
            });

            expect(
                createAgent
            ).toHaveBeenCalledTimes(1);

            expect(
                createAgent
            ).toHaveBeenCalledWith(
                mockFormData
            );
        });

        it("invalidates agents query after successful creation", async () => {
            vi.mocked(
                createAgent
            ).mockResolvedValue(
                mockAgent as never
            );

            const queryClient =
                createTestQueryClient();

            const invalidateSpy = vi.spyOn(
                queryClient,
                "invalidateQueries"
            );

            const { result } = renderHook(
                () => useCreateAgent(),
                {
                    wrapper:
                        createWrapper(
                            queryClient
                        ),
                }
            );

            result.current.mutate(
                mockFormData as never
            );

            await waitFor(() => {
                expect(
                    result.current.isSuccess
                ).toBe(true);
            });

            expect(
                invalidateSpy
            ).toHaveBeenCalledWith({
                queryKey: [
                    "agents",
                ],
            });
        });
    });

    /* ---------------------------------------------------------------------- */
    /* useUpdateAgent                                                          */
    /* ---------------------------------------------------------------------- */

    describe("useUpdateAgent", () => {
        it("updates an agent with id and data", async () => {
            vi.mocked(
                updateAgent
            ).mockResolvedValue(
                mockAgent as never
            );

            const queryClient =
                createTestQueryClient();

            const { result } = renderHook(
                () => useUpdateAgent(),
                {
                    wrapper:
                        createWrapper(
                            queryClient
                        ),
                }
            );

            result.current.mutate({
                id: "agent-123",
                data: mockUpdateData as never,
            });

            await waitFor(() => {
                expect(
                    result.current.isSuccess
                ).toBe(true);
            });

            expect(
                updateAgent
            ).toHaveBeenCalledTimes(1);

            expect(
                updateAgent
            ).toHaveBeenCalledWith(
                "agent-123",
                mockUpdateData
            );
        });

        it("invalidates agents list after successful update", async () => {
            vi.mocked(
                updateAgent
            ).mockResolvedValue(
                mockAgent as never
            );

            const queryClient =
                createTestQueryClient();

            const invalidateSpy = vi.spyOn(
                queryClient,
                "invalidateQueries"
            );

            const { result } = renderHook(
                () => useUpdateAgent(),
                {
                    wrapper:
                        createWrapper(
                            queryClient
                        ),
                }
            );

            result.current.mutate({
                id: "agent-123",
                data: mockUpdateData as never,
            });

            await waitFor(() => {
                expect(
                    result.current.isSuccess
                ).toBe(true);
            });

            expect(
                invalidateSpy
            ).toHaveBeenCalledWith({
                queryKey: [
                    "agents",
                ],
            });
        });

        it("invalidates the specific agent query after successful update", async () => {
            vi.mocked(
                updateAgent
            ).mockResolvedValue(
                mockAgent as never
            );

            const queryClient =
                createTestQueryClient();

            const invalidateSpy = vi.spyOn(
                queryClient,
                "invalidateQueries"
            );

            const { result } = renderHook(
                () => useUpdateAgent(),
                {
                    wrapper:
                        createWrapper(
                            queryClient
                        ),
                }
            );

            result.current.mutate({
                id: "agent-123",
                data: mockUpdateData as never,
            });

            await waitFor(() => {
                expect(
                    result.current.isSuccess
                ).toBe(true);
            });

            expect(
                invalidateSpy
            ).toHaveBeenCalledWith({
                queryKey: [
                    "agents",
                    "agent-123",
                ],
            });
        });
    });

    /* ---------------------------------------------------------------------- */
    /* useDeleteAgent                                                          */
    /* ---------------------------------------------------------------------- */

    describe("useDeleteAgent", () => {
        it("deletes an agent with id and updatedBy", async () => {
            vi.mocked(
                deleteAgent
            ).mockResolvedValue(
                undefined as never
            );

            const queryClient =
                createTestQueryClient();

            const { result } = renderHook(
                () => useDeleteAgent(),
                {
                    wrapper:
                        createWrapper(
                            queryClient
                        ),
                }
            );

            result.current.mutate({
                id: "agent-123",
                updatedBy: "admin-123",
            });

            await waitFor(() => {
                expect(
                    result.current.isSuccess
                ).toBe(true);
            });

            expect(
                deleteAgent
            ).toHaveBeenCalledTimes(1);

            expect(
                deleteAgent
            ).toHaveBeenCalledWith(
                "agent-123",
                "admin-123"
            );
        });

        it("invalidates agents query after successful deletion", async () => {
            vi.mocked(
                deleteAgent
            ).mockResolvedValue(
                undefined as never
            );

            const queryClient =
                createTestQueryClient();

            const invalidateSpy = vi.spyOn(
                queryClient,
                "invalidateQueries"
            );

            const { result } = renderHook(
                () => useDeleteAgent(),
                {
                    wrapper:
                        createWrapper(
                            queryClient
                        ),
                }
            );

            result.current.mutate({
                id: "agent-123",
                updatedBy: "admin-123",
            });

            await waitFor(() => {
                expect(
                    result.current.isSuccess
                ).toBe(true);
            });

            expect(
                invalidateSpy
            ).toHaveBeenCalledWith({
                queryKey: [
                    "agents",
                ],
            });
        });
    });
});
