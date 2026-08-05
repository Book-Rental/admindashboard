import axios from "axios";

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    getAgents,
    getAgentById,
    createAgent,
    updateAgent,
    deleteAgent,
} from "../api/agentApi";

/* -------------------------------------------------------------------------- */
/* AXIOS MOCK                                                                 */
/* -------------------------------------------------------------------------- */

vi.mock("axios", () => ({
    default: {
        get: vi.fn(),
    },
}));

/* -------------------------------------------------------------------------- */
/* TEST DATA                                                                  */
/* -------------------------------------------------------------------------- */

const mockAgent = {
    _id: "agent-123",
    fullName: "John Doe",
    email: "john@example.com",
};

const mockAgentDetails = {
    _id: "agent-123",
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "9876543210",
    vehicleType: "Bike",
};

const mockAgentResponse = {
    agents: [mockAgent],
    total: 1,
    page: 1,
    limit: 10,
};

const mockFormData = {
    hubId: "hub-123",
    fullName: " John Doe ",
    email: " john@example.com ",
    password: " password123 ",
    phoneNumber: " 9876543210 ",
    vehicleType: "Bike",
    vehicleNumber: " TS09AB1234 ",
    address: " Hyderabad ",
    emergencyContact: " 9123456780 ",
    notes: " Test agent ",
    isActive: true,
    photo: null,
};

const mockUpdateData = {
    fullName: " John Updated ",
    email: " john.updated@example.com ",
    phoneNumber: " 9876543210 ",
    vehicleType: "Bike",
    vehicleNumber: " TS09AB1234 ",
    address: " Hyderabad ",
    emergencyContact: " 9123456780 ",
    notes: " Updated agent ",
    isActive: true,
    status: "Active",
    hubId: "hub-123",
    photo: null,
};

/* -------------------------------------------------------------------------- */
/* FETCH MOCK                                                                 */
/* -------------------------------------------------------------------------- */

const mockFetch = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal(
        "fetch",
        mockFetch
    );
});

afterEach(() => {
    vi.unstubAllGlobals();
});

/* -------------------------------------------------------------------------- */
/* getAgents                                                                  */
/* -------------------------------------------------------------------------- */

describe("getAgents", () => {
    it("fetches agents using hubId, page and limit", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: mockAgentResponse,
        });

        const result = await getAgents(
            "hub-123",
            2,
            20
        );

        expect(
            axios.get
        ).toHaveBeenCalledTimes(1);

        expect(
            axios.get
        ).toHaveBeenCalledWith(
            "https://be-logistics-service.onrender.com/api/agent/hub/hub-123?page=2&limit=20"
        );

        expect(result).toEqual(
            mockAgentResponse
        );
    });

    it("uses default page and limit", async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: mockAgentResponse,
        });

        await getAgents("hub-123");

        expect(
            axios.get
        ).toHaveBeenCalledWith(
            "https://be-logistics-service.onrender.com/api/agent/hub/hub-123?page=1&limit=10"
        );
    });

    it("propagates axios errors", async () => {
        vi.mocked(axios.get).mockRejectedValue(
            new Error("Network error")
        );

        await expect(
            getAgents("hub-123")
        ).rejects.toThrow(
            "Network error"
        );
    });
});

/* -------------------------------------------------------------------------- */
/* getAgentById                                                               */
/* -------------------------------------------------------------------------- */

describe("getAgentById", () => {
    it("fetches agent by id", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(
                mockAgentDetails
            ),
        });

        const result =
            await getAgentById("agent-123");

        expect(
            mockFetch
        ).toHaveBeenCalledTimes(1);

        expect(
            mockFetch
        ).toHaveBeenCalledWith(
            "https://be-logistics-service.onrender.com/api/agent/agent-123"
        );

        expect(result).toEqual(
            mockAgentDetails
        );
    });

    it("returns agent from result.agent", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                agent: mockAgentDetails,
            }),
        });

        const result =
            await getAgentById("agent-123");

        expect(result).toEqual(
            mockAgentDetails
        );
    });

    it("returns agent from result.data", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                data: mockAgentDetails,
            }),
        });

        const result =
            await getAgentById("agent-123");

        expect(result).toEqual(
            mockAgentDetails
        );
    });

    it("throws error when request fails", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
        });

        await expect(
            getAgentById("agent-123")
        ).rejects.toThrow(
            "Failed to fetch agent"
        );
    });
});

/* -------------------------------------------------------------------------- */
/* createAgent                                                                */
/* -------------------------------------------------------------------------- */

describe("createAgent", () => {
    it("creates an agent successfully", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                agent: mockAgent,
            }),
        });

        const result =
            await createAgent(
                mockFormData as never
            );

        expect(
            mockFetch
        ).toHaveBeenCalledTimes(1);

        expect(
            mockFetch
        ).toHaveBeenCalledWith(
            "https://be-logistics-service.onrender.com/api/agent/create",
            expect.objectContaining({
                method: "POST",
                body: expect.any(FormData),
            })
        );

        expect(result).toEqual(
            mockAgent
        );
    });

    it("adds all create fields to FormData", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                agent: mockAgent,
            }),
        });

        await createAgent(
            mockFormData as never
        );

        const call =
            mockFetch.mock.calls[0];

        const request =
            call[1] as RequestInit;

        const formData =
            request.body as FormData;

        expect(
            formData.get("hubId")
        ).toBe("hub-123");

        expect(
            formData.get("fullName")
        ).toBe("John Doe");

        expect(
            formData.get("email")
        ).toBe("john@example.com");

        expect(
            formData.get("password")
        ).toBe("password123");

        expect(
            formData.get("phoneNumber")
        ).toBe("9876543210");

        expect(
            formData.get("vehicleType")
        ).toBe("Bike");

        expect(
            formData.get("vehicleNumber")
        ).toBe("TS09AB1234");

        expect(
            formData.get("address")
        ).toBe("Hyderabad");

        expect(
            formData.get("emergencyContact")
        ).toBe("9123456780");

        expect(
            formData.get("notes")
        ).toBe("Test agent");

        expect(
            formData.get("isActive")
        ).toBe("true");
    });

    it("includes photo when a File is provided", async () => {
        const file = new File(
            ["photo"],
            "agent.jpg",
            {
                type: "image/jpeg",
            }
        );

        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                agent: mockAgent,
            }),
        });

        await createAgent({
            ...mockFormData,
            photo: file,
        } as never);

        const request =
            mockFetch.mock.calls[0][1] as RequestInit;

        const formData =
            request.body as FormData;

        expect(
            formData.get("photo")
        ).toBe(file);
    });

    it("does not include photo when photo is not a File", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                agent: mockAgent,
            }),
        });

        await createAgent(
            mockFormData as never
        );

        const request =
            mockFetch.mock.calls[0][1] as RequestInit;

        const formData =
            request.body as FormData;

        expect(
            formData.get("photo")
        ).toBeNull();
    });

    it("throws backend error message when create fails", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            json: vi.fn().mockResolvedValue({
                message: "Email already exists",
            }),
        });

        await expect(
            createAgent(
                mockFormData as never
            )
        ).rejects.toThrow(
            "Email already exists"
        );
    });

    it("uses fallback error when create fails without message", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            json: vi.fn().mockRejectedValue(
                new Error("Invalid JSON")
            ),
        });

        await expect(
            createAgent(
                mockFormData as never
            )
        ).rejects.toThrow(
            "Failed to create agent"
        );
    });

    it("supports response.data fallback", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                data: mockAgent,
            }),
        });

        const result =
            await createAgent(
                mockFormData as never
            );

        expect(result).toEqual(
            mockAgent
        );
    });
});

/* -------------------------------------------------------------------------- */
/* updateAgent                                                                */
/* -------------------------------------------------------------------------- */

describe("updateAgent", () => {
    it("updates an agent successfully", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                agent: mockAgentDetails,
            }),
        });

        const result =
            await updateAgent(
                "agent-123",
                mockUpdateData as never
            );

        expect(
            mockFetch
        ).toHaveBeenCalledTimes(1);

        expect(
            mockFetch
        ).toHaveBeenCalledWith(
            "https://be-logistics-service.onrender.com/api/agent/agent-123",
            expect.objectContaining({
                method: "PATCH",
                body: expect.any(FormData),
            })
        );

        expect(result).toEqual(
            mockAgentDetails
        );
    });

    it("adds provided update fields to FormData", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                agent: mockAgentDetails,
            }),
        });

        await updateAgent(
            "agent-123",
            mockUpdateData as never
        );

        const request =
            mockFetch.mock.calls[0][1] as RequestInit;

        const formData =
            request.body as FormData;

        expect(
            formData.get("fullName")
        ).toBe("John Updated");

        expect(
            formData.get("email")
        ).toBe("john.updated@example.com");

        expect(
            formData.get("phoneNumber")
        ).toBe("9876543210");

        expect(
            formData.get("vehicleType")
        ).toBe("Bike");

        expect(
            formData.get("vehicleNumber")
        ).toBe("TS09AB1234");

        expect(
            formData.get("address")
        ).toBe("Hyderabad");

        expect(
            formData.get("emergencyContact")
        ).toBe("9123456780");

        expect(
            formData.get("notes")
        ).toBe("Updated agent");

        expect(
            formData.get("isActive")
        ).toBe("true");

        expect(
            formData.get("status")
        ).toBe("Active");

        expect(
            formData.get("hubId")
        ).toBe("hub-123");
    });

    it("includes photo when a new File is provided", async () => {
        const file = new File(
            ["photo"],
            "updated.jpg",
            {
                type: "image/jpeg",
            }
        );

        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                agent: mockAgentDetails,
            }),
        });

        await updateAgent(
            "agent-123",
            {
                photo: file,
            } as never
        );

        const request =
            mockFetch.mock.calls[0][1] as RequestInit;

        const formData =
            request.body as FormData;

        expect(
            formData.get("photo")
        ).toBe(file);
    });

    it("does not include undefined fields", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                agent: mockAgentDetails,
            }),
        });

        await updateAgent(
            "agent-123",
            {
                fullName: "John Doe",
            } as never
        );

        const request =
            mockFetch.mock.calls[0][1] as RequestInit;

        const formData =
            request.body as FormData;

        expect(
            formData.get("fullName")
        ).toBe("John Doe");

        expect(
            formData.get("email")
        ).toBeNull();

        expect(
            formData.get("phoneNumber")
        ).toBeNull();

        expect(
            formData.get("vehicleType")
        ).toBeNull();

        expect(
            formData.get("address")
        ).toBeNull();
    });

    it("throws backend error message when update fails", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            json: vi.fn().mockResolvedValue({
                message: "Agent not found",
            }),
        });

        await expect(
            updateAgent(
                "agent-123",
                {} as never
            )
        ).rejects.toThrow(
            "Agent not found"
        );
    });

    it("uses fallback error when update fails without message", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            json: vi.fn().mockRejectedValue(
                new Error("Invalid JSON")
            ),
        });

        await expect(
            updateAgent(
                "agent-123",
                {} as never
            )
        ).rejects.toThrow(
            "Failed to update agent"
        );
    });

    it("supports response.data fallback", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                data: mockAgentDetails,
            }),
        });

        const result =
            await updateAgent(
                "agent-123",
                {} as never
            );

        expect(result).toEqual(
            mockAgentDetails
        );
    });
});

/* -------------------------------------------------------------------------- */
/* deleteAgent                                                                */
/* -------------------------------------------------------------------------- */

describe("deleteAgent", () => {
    it("deletes an agent successfully", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
        });

        const result =
            await deleteAgent(
                "agent-123",
                "admin-123"
            );

        expect(
            mockFetch
        ).toHaveBeenCalledTimes(1);

        expect(
            mockFetch
        ).toHaveBeenCalledWith(
            "https://be-logistics-service.onrender.com/api/agent/agent-123",
            {
                method: "DELETE",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    updatedBy:
                        "admin-123",
                }),
            }
        );

        expect(result).toBe(
            "agent-123"
        );
    });

    it("throws backend error message when delete fails", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            json: vi.fn().mockResolvedValue({
                message: "Agent cannot be deleted",
            }),
        });

        await expect(
            deleteAgent(
                "agent-123",
                "admin-123"
            )
        ).rejects.toThrow(
            "Agent cannot be deleted"
        );
    });

    it("uses fallback error when delete fails without message", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            json: vi.fn().mockRejectedValue(
                new Error("Invalid JSON")
            ),
        });

        await expect(
            deleteAgent(
                "agent-123",
                "admin-123"
            )
        ).rejects.toThrow(
            "Failed to delete agent"
        );
    });
});
