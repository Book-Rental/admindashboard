import {
    Rb_BreadCrumb,
    Rb_LoadingSpinner,
} from "@rentbook/rentbook-ui-lib";

import { useEmployeeById } from "../hooks/useEmployeeById";

function EmployeeDetails() {
    const path = window.location.pathname;

    const employeeId = path
        .split("/")
        .filter(Boolean)
        .pop() ?? "";
    console.log(employeeId)
    const {
        data: employeeResponse,
        isLoading,
        isError,
        error,
    } = useEmployeeById(employeeId);

    if (isLoading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <Rb_LoadingSpinner text="Loading employee details..." />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-[#F5F7FB] p-6">
                <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center">
                    <div className="w-full rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-600">
                            !
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-gray-900">
                            Failed to load employee
                            details
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            We couldn't retrieve the
                            employee information.
                        </p>

                        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-xs text-red-600">
                            {error instanceof Error
                                ? error.message
                                : "Unable to load employee details."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const employee = employeeResponse?.data;

    if (!employee) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-[#F5F7FB]">
                <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                    <p className="font-semibold text-gray-700">
                        Employee not found.
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        The requested employee could not be
                        found.
                    </p>
                </div>
            </div>
        );
    }

    const handleBreadcrumbNavigate = (
        path: string
    ) => {
        window.history.pushState({}, "", path);

        window.dispatchEvent(
            new PopStateEvent("popstate")
        );
    };

    const getRoleLabel = (role: string) => {
        return role
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    const getStatusClass = (status: string) => {
        return status.toLowerCase() === "active"
            ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
            : "bg-red-50 text-red-700 ring-red-100";
    };

    const getRoleClass = (role: string) => {
        switch (role.toUpperCase()) {
            case "HUB_MANAGER":
            case "MANAGER":
                return "bg-purple-50 text-purple-700 ring-purple-100";

            case "TEAM_LEAD":
                return "bg-blue-50 text-blue-700 ring-blue-100";

            case "CASHIER":
                return "bg-orange-50 text-orange-700 ring-orange-100";

            case "AGENT":
                return "bg-emerald-50 text-emerald-700 ring-emerald-100";

            default:
                return "bg-gray-50 text-gray-700 ring-gray-100";
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F7FB] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-[1400px]">

                <div className="mb-5">
                    <Rb_BreadCrumb
                        items={[
                            {
                                label: "Employees",
                                path: "/employees",
                            },
                            {
                                label:
                                    employee.fullName ||
                                    "Employee Details",
                            },
                        ]}
                        onNavigate={
                            handleBreadcrumbNavigate
                        }
                    />
                </div>

                {/* Employee Header */}
                <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                            {employee.photo ? (
                                <img
                                    src={employee.photo}
                                    alt={employee.fullName}
                                    className="h-24 w-24 rounded-2xl object-cover"
                                />
                            ) : (
                                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-3xl font-bold text-blue-600">
                                    {employee.fullName
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                            )}

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                        {employee.fullName}
                                    </h1>

                                    <span
                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getStatusClass(
                                            employee.status
                                        )}`}
                                    >
                                        {employee.status}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-gray-500">
                                    Employee ID:{" "}
                                    <span className="font-semibold text-gray-700">
                                        {employee.EmployeeId}
                                    </span>
                                </p>

                                <div className="mt-3">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getRoleClass(
                                            employee.role
                                        )}`}
                                    >
                                        {getRoleLabel(
                                            employee.role
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 p-5 sm:p-6">
                        <h2 className="font-semibold text-gray-900">
                            Employee Information
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Basic employee details
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">

                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                Email
                            </p>

                            <p className="mt-1.5 break-all text-sm font-medium text-gray-800">
                                {employee.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                Phone
                            </p>

                            <p className="mt-1.5 text-sm font-medium text-gray-800">
                                {employee.phoneNumber}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                Address
                            </p>

                            <p className="mt-1.5 text-sm font-medium text-gray-800">
                                {employee.address ||
                                    "Not available"}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                Emergency Contact
                            </p>

                            <p className="mt-1.5 text-sm font-medium text-gray-800">
                                {employee.emergencyContact ||
                                    "Not available"}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                Joined On
                            </p>

                            <p className="mt-1.5 text-sm font-medium text-gray-800">
                                {new Date(
                                    employee.joinedOn
                                ).toLocaleDateString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                Availability
                            </p>

                            <p className="mt-1.5 text-sm font-medium text-gray-800">
                                {employee.isAvailable
                                    ? "Available"
                                    : "Unavailable"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Hub & Vehicle */}
                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 p-5">
                            <h2 className="font-semibold text-gray-900">
                                Hub Information
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 gap-5 p-5">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                    Hub Code
                                </p>

                                <p className="mt-1.5 text-sm font-medium text-gray-800">
                                    {employee.hub?.hubCode}
                                </p>
                            </div>

                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                    Hub ID
                                </p>

                                <p className="mt-1.5 break-all text-sm font-medium text-gray-800">
                                    {employee.hub?._id}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 p-5">
                            <h2 className="font-semibold text-gray-900">
                                Vehicle Information
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 gap-5 p-5">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                    Vehicle Type
                                </p>

                                <p className="mt-1.5 text-sm font-medium text-gray-800">
                                    {employee.vehicle
                                        ?.type ||
                                        "Not assigned"}
                                </p>
                            </div>

                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                    Vehicle Number
                                </p>

                                <p className="mt-1.5 text-sm font-medium text-gray-800">
                                    {employee.vehicle
                                        ?.number ||
                                        "Not assigned"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 p-5">
                        <h2 className="font-semibold text-gray-900">
                            Notes
                        </h2>
                    </div>

                    <div className="p-5">
                        <p className="text-sm text-gray-600">
                            {employee.notes ||
                                "No notes available."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeDetails;