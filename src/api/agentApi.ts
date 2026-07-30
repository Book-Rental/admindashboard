import {
    Agent,
    AgentDetails,
    AgentFormData,
    UpdateAgentData,
} from "../types/agent";

const API_BASE_URL =
    "https://be-logistics-service.onrender.com/api/agent";

export const getAgents = async (): Promise<Agent[]> => {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch agents");
    }

    const result = await response.json();

    return result.agents ?? [];
};


export const getAgentById = async (
    id: string
): Promise<AgentDetails> => {
    const response = await fetch(
        `${API_BASE_URL}/${id}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch agent");
    }

    const result = await response.json();


    return result.agent ??
        result.data ??
        result;
};


export const createAgent = async (
    data: AgentFormData
): Promise<Agent> => {
    const formData = new FormData();

    formData.append("hubId", data.hubId);
    formData.append("fullName", data.fullName.trim());
    formData.append("email", data.email.trim());
    formData.append("password", data.password.trim());
    formData.append("phoneNumber", data.phoneNumber.trim());
    formData.append("vehicleType", data.vehicleType);
    formData.append("vehicleNumber", data.vehicleNumber.trim());
    formData.append("address", data.address.trim());
    formData.append(
        "emergencyContact",
        data.emergencyContact.trim()
    );
    formData.append("notes", data.notes.trim());

    formData.append(
        "status",
        data.isActive ? "Active" : "Inactive"
    );

    formData.append("isAvailable", "true");
    formData.append("isActive", String(data.isActive));

    // IMPORTANT
    // Backend multer expects: profilePic
    if (data.photo instanceof File) {
        formData.append("profilePic", data.photo);
    }

    const response = await fetch(
        `${API_BASE_URL}/create`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.message || "Failed to create agent"
        );
    }

    const result = await response.json();

    return (
        result.agent ??
        result.data ??
        result
    );
};



export const updateAgent = async (
    id: string,
    data: UpdateAgentData
): Promise<AgentDetails> => {
    const payload: Record<string, unknown> = {
        fullName: data.fullName?.trim() ?? "",
        email: data.email?.trim() ?? "",
        phoneNumber: data.phoneNumber?.trim() ?? "",
        vehicleType: data.vehicleType ?? "",
        vehicleNumber: data.vehicleNumber?.trim() ?? "",
        address: data.address?.trim() ?? "",
        emergencyContact: data.emergencyContact?.trim() ?? "",
        notes: data.notes?.trim() ?? "",
        status: data.isActive ? "Active" : "Inactive",
        isActive: data.isActive ?? false,
    };

    // Photo upload will be implemented later with Cloudinary.
    // Do NOT send File as JSON.
    if (typeof data.photo === "string") {
        payload.photo = data.photo;
    }

    const response = await fetch(
        `${API_BASE_URL}/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.message || "Failed to update agent"
        );
    }

    const result = await response.json();

    return (
        result.agent ??
        result.data ??
        result
    );
};
/**
 * DELETE AGENT
 */
export const deleteAgent = async (
    id: string,
    updatedBy: string
): Promise<string> => {
    const response = await fetch(
        `${API_BASE_URL}/${id}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                updatedBy,
            }),
        },

    );

    if (!response.ok) {
        const error =
            await response.json().catch(
                () => null
            );

        throw new Error(
            error?.message ||
            "Failed to delete agent"
        );
    }

    return id;
};
