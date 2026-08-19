import {
    Rb_BreadCrumb,
    Rb_LoadingSpinner,
} from "@rentbook/rentbook-ui-lib";

import { useHubById } from "../hooks/useHubById";
import { useHubEmployees } from "../hooks/useHubEmployees";

function HubDetails() {
    const path = window.location.pathname;
    const hubId = path.split("/").filter(Boolean).pop();

    const {
        data: hubResponse,
        isLoading: isHubLoading,
        isError: isHubError,
        error: hubError,
    } = useHubById(hubId);

    const {
        data: employeeResponse,
        isLoading: isEmployeesLoading,
        isError: isEmployeesError,
        error: employeesError,
    } = useHubEmployees(hubId);


    if (isHubLoading || isEmployeesLoading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <Rb_LoadingSpinner text="Loading hub details..." />
            </div>
        );
    }


    if (isHubError || isEmployeesError) {
        const errorMessage =
            hubError instanceof Error
                ? hubError.message
                : employeesError instanceof Error
                    ? employeesError.message
                    : "Unable to load hub details.";

        return (
            <div className="min-h-screen bg-[#F5F7FB] p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center">
                    <div className="w-full rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm sm:p-10">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-600">
                            !
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-gray-900">
                            Failed to load hub details
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            We couldn't retrieve the information for this hub.
                        </p>

                        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-xs text-red-600">
                            {errorMessage}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const hub = hubResponse?.data;

    const employees =
        employeeResponse?.data?.employees ?? [];

    const employeeMeta =
        employeeResponse?.data?.meta;

    const totalEmployees =
        employeeMeta?.totalRecords ?? employees.length;

    if (!hub) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-[#F5F7FB] px-4">
                <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                    <p className="font-medium text-gray-700">
                        Hub not found.
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        The requested hub could not be found.
                    </p>
                </div>
            </div>
        );
    }


    const handleBreadcrumbNavigate = (path: string) => {
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

    const getStatusClass = (status: string) => {
        return status.toLowerCase() === "active"
            ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
            : "bg-red-50 text-red-700 ring-red-100";
    };

    const capacityPercentage =
        hub.capacity > 0
            ? Math.min(
                Math.round(
                    (hub.currentLoad / hub.capacity) * 100
                ),
                100
            )
            : 0;

    return (
        <div className="min-h-screen bg-[#F5F7FB] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-[1600px]">

                <div className="mb-5">
                    <Rb_BreadCrumb
                        items={[
                            {
                                label: "Hubs",
                                path: "/hubs",
                            },
                            {
                                label:
                                    hub.hubName ||
                                    "Hub Details",
                            },
                        ]}
                        onNavigate={handleBreadcrumbNavigate}
                    />
                </div>

                <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="p-5 sm:p-6 lg:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                            {/* Hub Identity */}
                            <div className="flex min-w-0 items-start gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-600 sm:h-16 sm:w-16 sm:text-xl">
                                    {hub.hubName
                                        ?.slice(0, 2)
                                        .toUpperCase()}
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="truncate text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                            {hub.hubName}
                                        </h1>

                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getStatusClass(
                                                hub.status
                                            )}`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${hub.status.toLowerCase() ===
                                                    "active"
                                                    ? "bg-emerald-500"
                                                    : "bg-red-500"
                                                    }`}
                                            />

                                            {hub.status}
                                        </span>
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
                                        <span>
                                            Code{" "}
                                            <strong className="font-semibold text-gray-700">
                                                {hub.hubCode}
                                            </strong>
                                        </span>

                                        <span>
                                            ID{" "}
                                            <strong className="font-semibold text-gray-700">
                                                {hub.hubId}
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Manager */}
                            <div className="flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3.5 sm:p-4 lg:w-auto lg:min-w-[280px]">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                    {hub.managerName
                                        ?.charAt(0)
                                        .toUpperCase() ||
                                        "M"}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                        Hub Manager
                                    </p>

                                    <p className="mt-0.5 truncate font-semibold text-gray-800">
                                        {hub.managerName ||
                                            "Not assigned"}
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-gray-500">
                                        {hub.phoneNumber}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {/* Employees */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Employees
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {totalEmployees}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Assigned to this hub
                        </p>
                    </div>

                    {/* Capacity */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Capacity
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {hub.capacity.toLocaleString()}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Maximum capacity
                        </p>
                    </div>

                    {/* Current Load */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Current Load
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {hub.currentLoad.toLocaleString()}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            {capacityPercentage}% utilized
                        </p>
                    </div>

                    {/* Availability */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Employee Status
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {
                                employees.filter(
                                    (employee) =>
                                        employee.isActive
                                ).length
                            }
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Currently active
                        </p>
                    </div>
                </div>

                {/* =========================
                    Hub Information
                ========================== */}
                <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-5">

                    {/* Hub Information */}
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-3">
                        <div className="border-b border-gray-100 p-5 sm:p-6">
                            <h2 className="font-semibold text-gray-900">
                                Hub Information
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Contact and location details
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                    Email
                                </p>

                                <p className="mt-1.5 break-all text-sm font-medium text-gray-800">
                                    {hub.email ||
                                        "Not available"}
                                </p>
                            </div>

                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                    Phone
                                </p>

                                <p className="mt-1.5 text-sm font-medium text-gray-800">
                                    {hub.phoneNumber ||
                                        "Not available"}
                                </p>
                            </div>

                            <div className="sm:col-span-2">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                    Address
                                </p>

                                <div className="mt-2 rounded-xl bg-gray-50 p-3.5">
                                    <p className="text-sm leading-6 text-gray-700">
                                        {hub.address.street},{" "}
                                        {hub.address.city},{" "}
                                        {hub.address.state},{" "}
                                        {hub.address.country}{" "}
                                        <span className="font-semibold">
                                            -{" "}
                                            {
                                                hub.address
                                                    .pincode
                                            }
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pincodes */}
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
                        <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Serviceable Pincodes
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Areas serviced by this hub
                                </p>
                            </div>

                            <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                {
                                    hub.serviceablePincodes
                                        .length
                                }
                            </span>
                        </div>

                        <div className="p-5 sm:p-6">
                            {hub.serviceablePincodes.length >
                                0 ? (
                                <div className="flex max-h-[180px] flex-wrap gap-2 overflow-y-auto">
                                    {hub.serviceablePincodes.map(
                                        (pincode) => (
                                            <span
                                                key={pincode}
                                                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700"
                                            >
                                                {pincode}
                                            </span>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No serviceable pincodes.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* =========================
                    Employees
                ========================== */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                    {/* Header */}
                    <div className="border-b border-gray-100 p-5 sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Hub Employees
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Employees currently assigned to this hub
                                </p>
                            </div>

                            <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                                {totalEmployees}{" "}
                                {totalEmployees === 1
                                    ? "Employee"
                                    : "Employees"}
                            </span>
                        </div>
                    </div>

                    {/* Empty */}
                    {employees.length === 0 ? (
                        <div className="p-10 text-center sm:p-14">
                            <p className="font-semibold text-gray-700">
                                No employees found
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                There are currently no employees assigned to this hub.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop */}
                            <div className="hidden overflow-x-auto md:block">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/70 text-left">
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                                Employee
                                            </th>

                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                                Employee ID
                                            </th>

                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                                Email
                                            </th>

                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                                Phone
                                            </th>

                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                                Role
                                            </th>

                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {employees.map(
                                            (employee) => (
                                                <tr
                                                    key={employee._id}
                                                    className="cursor-pointer border-b border-gray-100 transition-colors last:border-0 hover:bg-blue-50/30"
                                                    onClick={() => {
                                                        window.history.pushState(
                                                            {},
                                                            "",
                                                            `/employee/${employee._id}`
                                                        );

                                                        window.dispatchEvent(
                                                            new PopStateEvent("popstate")
                                                        );
                                                    }}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {employee.photo ? (
                                                                <img
                                                                    src={
                                                                        employee.photo
                                                                    }
                                                                    alt={
                                                                        employee.fullName
                                                                    }
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                                                                    {employee.fullName
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>
                                                            )}

                                                            <p className="font-semibold text-gray-900">
                                                                {
                                                                    employee.fullName
                                                                }
                                                            </p>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                                        {
                                                            employee.employeeId
                                                        }
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <p className="max-w-[260px] truncate text-sm text-gray-600">
                                                            {
                                                                employee.email
                                                            }
                                                        </p>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {
                                                            employee.phoneNumber
                                                        }
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getRoleClass(
                                                                employee.role
                                                            )}`}
                                                        >
                                                            {getRoleLabel(
                                                                employee.role
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getStatusClass(
                                                                employee.status
                                                            )}`}
                                                        >
                                                            {
                                                                employee.status
                                                            }
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile */}
                            <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
                                {employees.map(
                                    (employee) => (
                                        <div
                                            key={employee._id}
                                            className="cursor-pointer rounded-xl border border-gray-200 p-4 transition-colors hover:bg-blue-50"
                                            onClick={() => {
                                                window.history.pushState(
                                                    {},
                                                    "",
                                                    `/employees/${employee._id}`
                                                );

                                                window.dispatchEvent(
                                                    new PopStateEvent("popstate")
                                                );
                                            }}
                                        >
                                            <div className="flex items-start gap-3">

                                                {employee.photo ? (
                                                    <img
                                                        src={
                                                            employee.photo
                                                        }
                                                        alt={
                                                            employee.fullName
                                                        }
                                                        className="h-11 w-11 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                                                        {employee.fullName
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </div>
                                                )}

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {
                                                                    employee.fullName
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 text-xs text-gray-400">
                                                                {
                                                                    employee.employeeId
                                                                }
                                                            </p>
                                                        </div>

                                                        <span
                                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClass(
                                                                employee.status
                                                            )}`}
                                                        >
                                                            {
                                                                employee.status
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="mt-3 space-y-1.5">
                                                        <p className="break-all text-sm text-gray-500">
                                                            {
                                                                employee.email
                                                            }
                                                        </p>

                                                        <p className="text-sm text-gray-500">
                                                            {
                                                                employee.phoneNumber
                                                            }
                                                        </p>

                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getRoleClass(
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
                                    )
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HubDetails;