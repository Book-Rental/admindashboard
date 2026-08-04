import { useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaEdit,
    FaTrash,
    FaCamera,
    FaUser,
    FaMapMarkerAlt,
    FaCar,
    FaPhone,
    FaEnvelope,
    FaStickyNote,
    FaCalendarAlt,
    FaIdCard,
    FaCheckCircle,
    FaClock,
    FaHashtag,
    FaLocationArrow,
    FaCircle,
    FaShieldAlt,
} from "react-icons/fa";

import {
    Rb_Button,
    Rb_Image,
    Rb_LoadingSpinner,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Rb_BreadCrumb,
} from "@rentbook/rentbook-ui-lib";

import {
    useAgent,
    useDeleteAgent,
} from "../hooks/useAgents";
import { showToast } from "../utils/showToaster";

const getInitials = (name: string = "") => {
    const trimmedName = name.trim();

    if (!trimmedName) {
        return "?";
    }

    const parts = trimmedName.split(/\s+/);

    // If only one name exists, show first letter
    if (parts.length === 1) {
        return parts[0][0]?.toUpperCase() || "?";
    }

    // First letter of first name + first letter of last name
    return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
};

const formatDate = (date?: string | null) => {
    if (!date) {
        return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};



export default function AgentDetails() {
    const agentId = window.location.pathname.split("/")[2];

    const [showDeleteModal, setShowDeleteModal] = useState(false);



    const {
        data: agent,
        isLoading,
        isError,
    } = useAgent(agentId);

    const deleteMutation = useDeleteAgent();
    useEffect(() => {
        const event = new CustomEvent("widget-loading-status", {
            detail: isLoading,
        });

        window.dispatchEvent(event);
    }, [isLoading]);


    const goBack = () => {
        window.history.pushState({}, "", "/agents");

        window.dispatchEvent(
            new PopStateEvent("popstate")
        );
    };

    const goToEdit = () => {
        window.history.pushState(
            {},
            "",
            `/agents/${agentId}/edit`
        );

        window.dispatchEvent(
            new PopStateEvent("popstate")
        );
    };


    const handleDelete = () => {
        const updatedBy =
            typeof agent?.hubId === "string"
                ? agent.hubId
                : agent?.hubId?._id || "";

        deleteMutation.mutate(
            {
                id: agentId,
                updatedBy,
            },
            {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    showToast("Agent deleted successfully", "success");
                    goBack();
                },

                onError: (error: unknown) => {
                    const axiosError = error as {
                        response?: {
                            data?: {
                                message?: string;
                            };
                        };
                    };

                    const message =
                        axiosError.response?.data?.message ||
                        (error instanceof Error
                            ? error.message
                            : "Failed to delete agent");

                    showToast(message, "error");
                },
            }
        );
    };


    if (isLoading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
                <Rb_LoadingSpinner text="Loading agent details..." />
            </div>
        );
    }



    if (isError || !agent) {
        return (
            <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
                <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                            <FaCircle className="text-xs" />
                        </div>

                        <p className="text-sm text-red-500">
                            Unable to load agent details.
                        </p>
                    </div>

                    <Rb_Button
                        type="button"
                        className="mt-5"
                        onClick={goBack}
                    >
                        <span className="inline-flex items-center gap-2">
                            <FaArrowLeft />
                            Back to Agents
                        </span>
                    </Rb_Button>
                </div>
            </div>
        );
    }


    const fullName = agent.fullName || "";
    const photo = agent.photo || "";
    const initials = getInitials(fullName);

    const hubId =
        typeof agent.hubId === "string"
            ? agent.hubId
            : agent.hubId?._id || "-";

    const hubCode =
        typeof agent.hubId === "string"
            ? "-"
            : agent.hubId?.hubCode || "-";

    return (
        <>
            <div className="min-h-screen w-full mx-auto bg-gray-50 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">

                <div className="mb-8 sm:mb-10">
                    <Rb_BreadCrumb
                        items={[
                            {
                                label: "Delivery Agents",
                                path: "/agents",
                            },
                            {
                                label: agent.fullName || "Agent Details",
                            },
                        ]}
                        onNavigate={(path) => {
                            window.history.pushState({}, "", path);

                            window.dispatchEvent(
                                new PopStateEvent("popstate")
                            );
                        }}
                    />
                </div>

                <div className="mb-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                    <div className="h-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 sm:h-28" />

                    <div className="px-5 pb-5 sm:px-7 sm:pb-6">
                        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between">

                            {/* PROFILE */}
                            <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-end">

                                {/* AVATAR */}
                                <div className="relative -mt-12 shrink-0 sm:-mt-14">
                                    <div
                                        className="
                                                flex
                                                h-24
                                                w-24
                                                items-center
                                                justify-center
                                                overflow-hidden
                                                rounded-full
                                                border-4
                                                border-white
                                                bg-gray-100
                                                text-2xl
                                                font-bold
                                                text-gray-700
                                                shadow-lg
                                                sm:h-28
                                                sm:w-28
                                                sm:text-3xl
                                            "
                                    >
                                        {photo ? (
                                            <Rb_Image
                                                src={photo}
                                                alt={fullName || "Agent"}
                                                className="!h-full !w-full !rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="select-none">
                                                {initials}
                                            </span>
                                        )}
                                    </div>

                                    {/* Active indicator */}
                                    {agent.isActive && (
                                        <span
                                            className="
                                                    absolute
                                                    bottom-1
                                                    right-1
                                                    h-5
                                                    w-5
                                                    rounded-full
                                                    border-4
                                                    border-white
                                                    bg-green-500
                                                    sm:h-6
                                                    sm:w-6
                                                "
                                            aria-label="Active"
                                        />
                                    )}
                                </div>

                                {/* NAME + META */}
                                <div
                                    className="
                                            min-w-0
                                            flex-1
                                            pt-4
                                            sm:ml-5
                                            sm:pb-1
                                            sm:pt-0
                                        "
                                >
                                    <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">

                                        <h1
                                            className="
                                                    min-w-0
                                                    max-w-full
                                                    break-words
                                                    text-2xl
                                                    font-bold
                                                    leading-tight
                                                    tracking-tight
                                                    text-gray-900
                                                    sm:text-3xl
                                                "
                                        >
                                            {fullName || "-"}
                                        </h1>

                                        <StatusBadge
                                            status={agent.status}
                                        />
                                    </div>

                                    {/* META */}
                                    <div
                                        className="
                                                mt-2
                                                flex
                                                flex-col
                                                gap-1.5
                                                text-sm
                                                text-gray-500
                                                sm:flex-row
                                                sm:flex-wrap
                                                sm:items-center
                                                sm:gap-x-4
                                            "
                                    >
                                        <span className="inline-flex min-w-0 items-center gap-1.5">
                                            <FaIdCard className="shrink-0 text-xs text-gray-400" />

                                            <span className="shrink-0">
                                                Agent ID:
                                            </span>

                                            <span className="min-w-0 break-all font-medium text-gray-700">
                                                {agent._id}
                                            </span>
                                        </span>

                                        <span className="hidden text-gray-300 sm:inline">
                                            •
                                        </span>

                                        <span className="inline-flex items-center gap-1.5">
                                            <FaCalendarAlt className="shrink-0 text-xs text-gray-400" />

                                            <span>
                                                Joined{" "}
                                                {formatDate(
                                                    agent.joinedOn
                                                )}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="
                                        mt-5
                                        flex
                                        w-full
                                        flex-col
                                        gap-3
                                        sm:flex-row
                                        lg:ml-6
                                        lg:mt-0
                                        lg:w-auto
                                        lg:shrink-0
                                    "
                            >
                                <Rb_Button
                                    type="button"
                                    variant="outline"
                                    onClick={goToEdit}
                                    className="!w-full sm:!w-auto"
                                >
                                    <span className="inline-flex items-center justify-center gap-2">
                                        <FaEdit />
                                        Edit Agent
                                    </span>
                                </Rb_Button>

                                <Rb_Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setShowDeleteModal(true)
                                    }
                                    className="
                                            !w-full
                                            !border-red-200
                                            !text-red-600
                                            hover:!bg-red-50
                                            sm:!w-auto
                                        "
                                >
                                    <span className="inline-flex items-center justify-center gap-2">
                                        <FaTrash />
                                        Delete Agent
                                    </span>
                                </Rb_Button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                    <SectionCard
                        title="Contact Information"
                        description="Agent communication details."
                        icon={<FaUser />}
                        iconClass="bg-blue-100 text-blue-600"
                    >
                        <div>
                            <Info
                                label="Full Name"
                                value={agent.fullName}
                                icon={<FaUser />}
                            />

                            <Info
                                label="Email Address"
                                value={agent.email}
                                icon={<FaEnvelope />}
                            />

                            <Info
                                label="Phone Number"
                                value={agent.phoneNumber}
                                icon={<FaPhone />}
                            />

                            <Info
                                label="Emergency Contact"
                                value={agent.emergencyContact}
                                icon={<FaPhone />}
                            />

                            <Info
                                label="Address"
                                value={agent.address}
                                icon={<FaMapMarkerAlt />}
                            />
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Vehicle & Hub"
                        description="Vehicle and assigned hub information."
                        icon={<FaCar />}
                        iconClass="bg-blue-100 text-blue-600"
                    >
                        <div>
                            <Info
                                label="Vehicle Type"
                                value={agent.vehicleType}
                                icon={<FaCar />}
                            />

                            <Info
                                label="Vehicle Number"
                                value={agent.vehicleNumber}
                                icon={<FaHashtag />}
                            />

                            <Info
                                label="Hub ID"
                                value={hubId}
                                icon={<FaIdCard />}
                            />

                            <Info
                                label="Hub Code"
                                value={hubCode}
                                icon={<FaHashtag />}
                            />

                            <Info
                                label="Location Type"
                                value={
                                    agent.currentLocation?.type || "-"
                                }
                                icon={<FaMapMarkerAlt />}
                            />
                        </div>
                    </SectionCard>

                    {/* ACCOUNT */}
                    <SectionCard
                        title="Account Status"
                        description="Current agent account information."
                        icon={<FaShieldAlt />}
                        iconClass="bg-blue-100 text-blue-600"
                    >
                        <div>
                            <Info
                                label="Status"
                                value={agent.status}
                                icon={<FaCheckCircle />}
                                valueComponent={
                                    <StatusBadge
                                        status={agent.status}
                                    />
                                }
                            />

                            <Info
                                label="Availability"
                                value={
                                    agent.isAvailable
                                        ? "Available"
                                        : "Unavailable"
                                }
                                icon={<FaClock />}
                                valueClass={
                                    agent.isAvailable
                                        ? "text-green-600"
                                        : "text-gray-700"
                                }
                            />

                            <Info
                                label="Account"
                                value={
                                    agent.isActive
                                        ? "Active"
                                        : "Inactive"
                                }
                                icon={<FaCheckCircle />}
                                valueClass={
                                    agent.isActive
                                        ? "text-green-600"
                                        : "text-gray-700"
                                }
                            />

                            <Info
                                label="Joined On"
                                value={formatDate(agent.joinedOn)}
                                icon={<FaCalendarAlt />}
                            />

                            <Info
                                label="Agent ID"
                                value={agent._id}
                                icon={<FaIdCard />}
                            />
                        </div>
                    </SectionCard>
                </div>


                <div className="mt-6">
                    <SectionCard
                        title="Current Location"
                        description="Latest location information for the agent."
                        icon={<FaMapMarkerAlt />}
                        iconClass="bg-blue-100 text-blue-600"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-6">
                            <Info
                                label="Location Type"
                                value={agent.currentLocation?.type || "-"}
                                icon={<FaMapMarkerAlt />}
                            />

                            <Info
                                label="Coordinates"
                                value={
                                    agent.currentLocation?.coordinates
                                        ? agent.currentLocation.coordinates.join(", ")
                                        : "-"
                                }
                                icon={<FaLocationArrow />}
                            />

                            <Info
                                label="Location Updated At"
                                value={formatDate(agent.currentLocation?.updatedAt)}
                                icon={<FaCalendarAlt />}
                            />
                        </div>
                    </SectionCard>
                </div>

                {/* SYSTEM INFORMATION */}
                <div className="mt-6">
                    <SectionCard
                        title="System Information"
                        description="Agent record timestamps."
                        icon={<FaCalendarAlt />}
                        iconClass="bg-blue-100 text-blue-600"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
                            <Info
                                label="Created At"
                                value={formatDate(agent.createdAt)}
                                icon={<FaCalendarAlt />}
                            />

                            <Info
                                label="Last Updated"
                                value={formatDate(agent.updatedAt)}
                                icon={<FaClock />}
                            />
                        </div>
                    </SectionCard>
                </div>


                {agent.notes && (
                    <div className="mt-6">
                        <SectionCard
                            title="Notes"
                            description="Additional information about this agent."
                            icon={<FaStickyNote />}
                            iconClass="bg-blue-100 text-blue-600"
                        >
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                                    {agent.notes}
                                </p>
                            </div>
                        </SectionCard>
                    </div>
                )}


                {photo && (
                    <div className="mt-6">
                        <SectionCard
                            title="Agent Photo"
                            description="Profile photo of the delivery agent."
                            icon={<FaCamera />}
                            iconClass="bg-blue-100 text-blue-600"
                        >
                            <div className="flex justify-center">
                                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-2 shadow-sm">
                                    <Rb_Image
                                        src={photo}
                                        alt={fullName || "Agent"}
                                        className="
                                                !h-56
                                                !w-56
                                                !rounded-2xl
                                                object-cover
                                                sm:!h-72
                                                sm:!w-72
                                            "
                                    />
                                </div>
                            </div>
                        </SectionCard>
                    </div>
                )}
            </div >


            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    if (!deleteMutation.isPending) {
                        setShowDeleteModal(false);
                    }
                }}
            >
                <ModalHeader
                    onClose={() => {
                        if (!deleteMutation.isPending) {
                            setShowDeleteModal(false);
                        }
                    }}
                >
                    Delete Agent
                </ModalHeader>

                <ModalBody>
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                            <FaTrash />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm leading-6 text-gray-600">
                                Are you sure you want to delete{" "}
                                <span className="font-semibold text-gray-900">
                                    {fullName}
                                </span>
                                ?
                            </p>

                            <p className="mt-2 text-xs text-red-500">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Rb_Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowDeleteModal(false)}
                        disabled={deleteMutation.isPending}
                    >
                        Cancel
                    </Rb_Button>

                    <Rb_Button
                        type="button"
                        onClick={handleDelete}
                        isLoading={deleteMutation.isPending}
                    >
                        <span className="inline-flex items-center gap-2">
                            <FaTrash />
                            Delete Agent
                        </span>
                    </Rb_Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

interface SectionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    iconClass?: string;
    children: React.ReactNode;
}

function SectionCard({
    title,
    description,
    icon,
    iconClass = "bg-gray-900",
    children,
}: SectionCardProps) {
    return (
        <section className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="p-5 sm:p-6">

                <div className="mb-5 flex items-center gap-3">
                    <div
                        className={`
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            text-sm
                            ${iconClass}
                        `}
                    >
                        {icon}
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                            {title}
                        </h2>

                        <p className="mt-0.5 text-xs leading-5 text-gray-500 sm:text-sm">
                            {description}
                        </p>
                    </div>
                </div>

                <div>
                    {children}
                </div>
            </div>
        </section>
    );
}



interface InfoProps {
    label: string;
    value?: string | null;
    icon?: React.ReactNode;
    valueClass?: string;
    valueComponent?: React.ReactNode;
}

function Info({
    label,
    value,
    icon,
    valueClass = "text-gray-800",
    valueComponent,
}: InfoProps) {
    return (
        <div className="flex min-w-0 items-start gap-3 border-b border-gray-100 py-3.5 last:border-b-0">

            {icon && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center text-sm text-gray-400">
                    {icon}
                </div>
            )}

            {/* CONTENT */}
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4">
                <p className="text-sm text-gray-500">
                    {label}
                </p>

                <div className="min-w-0 sm:text-right">
                    {valueComponent ? (
                        valueComponent
                    ) : (
                        <p
                            className={`
                                break-words
                                whitespace-pre-wrap
                                text-sm
                                font-medium
                                leading-5
                                ${valueClass}
                            `}
                        >
                            {value || "-"}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

interface StatusBadgeProps {
    status?: string | null;
}

function StatusBadge({
    status,
}: StatusBadgeProps) {
    const className =
        status === "Active"
            ? "bg-green-50 text-green-700 ring-green-600/20"
            : status === "On Delivery"
                ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                : "bg-gray-100 text-gray-600 ring-gray-500/20";

    return (
        <span
            className={`
                inline-flex
                shrink-0
                items-center
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ring-1
                ring-inset
                ${className}
            `}
        >
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />

            {status || "Unknown"}
        </span>
    );
}