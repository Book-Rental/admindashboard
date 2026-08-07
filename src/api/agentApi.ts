import axios from "axios";
import {
    Agent,
    AgentDetails,
    AgentFormData,
    AgentResponse,
    UpdateAgentData,
} from "../types/agent";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const getAgents = async (
    hubId: string,
    page = 1,
    limit = 10
): Promise<AgentResponse> => {
    const { data } = await axios.get<AgentResponse>(
        `${API_BASE_URL}/agent/hub/${hubId}?page=${page}&limit=${limit}`
    );

    return data;
};

export const getAgentById = async (
    id: string
): Promise<AgentDetails> => {
    const response = await fetch(`${API_BASE_URL}/agent/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch agent");
    }

    const result = await response.json();

    return result.agent ?? result.data ?? result;
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

    formData.append("isActive", String(data.isActive));

    // Backend multer expects "photo"
    if (data.photo instanceof File) {
        formData.append("photo", data.photo);
    }

    const response = await fetch(`${API_BASE_URL}/agent/create`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.message || "Failed to create agent"
        );
    }

    const result = await response.json();

    return result.agent ?? result.data ?? result;
};

export const updateAgent = async (
    id: string,
    data: UpdateAgentData
): Promise<AgentDetails> => {
    const formData = new FormData();

    if (data.fullName !== undefined) {
        formData.append("fullName", data.fullName.trim());
    }

    if (data.email !== undefined) {
        formData.append("email", data.email.trim());
    }

    if (data.phoneNumber !== undefined) {
        formData.append(
            "phoneNumber",
            data.phoneNumber.trim()
        );
    }

    if (data.vehicleType !== undefined) {
        formData.append(
            "vehicleType",
            data.vehicleType
        );
    }

    if (data.vehicleNumber !== undefined) {
        formData.append(
            "vehicleNumber",
            data.vehicleNumber.trim()
        );
    }

    if (data.address !== undefined) {
        formData.append(
            "address",
            data.address.trim()
        );
    }

    if (data.emergencyContact !== undefined) {
        formData.append(
            "emergencyContact",
            data.emergencyContact.trim()
        );
    }

    if (data.notes !== undefined) {
        formData.append(
            "notes",
            data.notes.trim()
        );
    }

    // IMPORTANT:
    // Send boolean as string because this is multipart/form-data
    if (data.isActive !== undefined) {
        formData.append(
            "isActive",
            String(data.isActive)
        );
    }

    if (data.status !== undefined) {
        formData.append(
            "status",
            data.status
        );
    }

    if (data.hubId !== undefined) {
        formData.append(
            "hubId",
            data.hubId
        );
    }


    if (data.photo === null) {
        formData.append("photo", "");
    }
    else if (data.photo instanceof File) {
        formData.append("photo", data.photo);
    }

    const response = await fetch(
        `${API_BASE_URL}/agent/${id}`,
        {
            method: "PATCH",
            body: formData,
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.message || "Failed to update agent"
        );
    }

    const result = await response.json();

    return result.agent ?? result.data ?? result;
};


export const deleteAgent = async (
    id: string,
    updatedBy: string
): Promise<string> => {
    const response = await fetch(
        `${API_BASE_URL}/agent/${id}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                updatedBy,
            }),
        }
    );

    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => null);

        throw new Error(
            error?.message ||
            "Failed to delete agent"
        );
    }

    return id;
};
