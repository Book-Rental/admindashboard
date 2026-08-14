import { Rb_LoadingSpinner } from "@rentbook/rentbook-ui-lib";
import { useHubs } from "../hooks/useHubs";

function HubList() {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useHubs();

    const handleHubClick = (hubId: string) => {
        window.history.pushState({}, "", `/hubs/${hubId}`);
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>,
        hubId: string
    ) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleHubClick(hubId);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <Rb_LoadingSpinner text="Loading hubs..." />
            </div>
        );
    }
    if (isError) {
        return (
            <div className="min-h-[70vh] bg-[#F5F7FB] p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex min-h-[50vh] max-w-2xl items-center justify-center">
                    <div className="w-full rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm sm:p-10">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                            <span className="text-2xl">!</span>
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-gray-900">
                            Unable to load hubs
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Something went wrong while fetching the logistics
                            hubs.
                        </p>

                        {error instanceof Error && (
                            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                                {error.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const hubs = data?.data ?? [];

    if (hubs.length === 0) {
        return (
            <div className="min-h-[70vh] bg-[#F5F7FB] p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex min-h-[50vh] max-w-2xl items-center justify-center">
                    <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                            <span className="text-2xl">⌂</span>
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-gray-900">
                            No hubs available
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            There are currently no logistics hubs to display.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F7FB] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-[1600px]">

                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-600" />

                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                    Operations
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                Logistics Hubs
                            </h1>

                            <p className="mt-1.5 max-w-xl text-sm text-gray-500 sm:text-base">
                                View and manage all logistics hubs from one
                                place.
                            </p>
                        </div>

                        {/* Total Hubs */}
                        <div className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:w-auto sm:px-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                                <span className="text-lg font-bold text-blue-600">
                                    {hubs.length}
                                </span>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Total Hubs
                                </p>

                                <p className="text-sm font-semibold text-gray-900">
                                    Active locations
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:block">

                    {/* Table Header */}
                    <div className="grid grid-cols-[2fr_1.3fr_1.3fr_0.9fr_0.8fr] gap-5 border-b border-gray-200 bg-gray-50/80 px-6 py-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Hub
                        </p>

                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Manager
                        </p>

                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Location
                        </p>

                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Capacity
                        </p>

                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Status
                        </p>
                    </div>

                    {/* Rows */}
                    {hubs.map((hub) => (
                        <div
                            key={hub._id}
                            onClick={() => handleHubClick(hub._id)}
                            onKeyDown={(event) =>
                                handleKeyDown(event, hub._id)
                            }
                            role="button"
                            tabIndex={0}
                            className="group grid cursor-pointer grid-cols-[2fr_1.3fr_1.3fr_0.9fr_0.8fr] items-center gap-5 border-b border-gray-100 px-6 py-5 outline-none transition-all last:border-b-0 hover:bg-blue-50/40 focus:bg-blue-50/40 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            {/* Hub */}
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600 transition-colors group-hover:bg-blue-100">
                                    {hub.hubName
                                        ?.slice(0, 2)
                                        .toUpperCase()}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-gray-900">
                                        {hub.hubName}
                                    </p>

                                    <div className="mt-1 flex min-w-0 items-center gap-2">
                                        <span className="truncate text-xs font-medium text-gray-500">
                                            {hub.hubCode}
                                        </span>

                                        <span className="text-gray-300">
                                            •
                                        </span>

                                        <span className="truncate text-xs text-gray-400">
                                            {hub.hubId}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Manager */}
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-gray-800">
                                    {hub.managerName || "Not assigned"}
                                </p>

                                <p className="mt-1 truncate text-xs text-gray-400">
                                    {hub.phoneNumber || "No phone number"}
                                </p>
                            </div>

                            {/* Location */}
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-gray-800">
                                    {hub.address.city}
                                </p>

                                <p className="mt-1 truncate text-xs text-gray-400">
                                    {hub.address.state} ·{" "}
                                    {hub.address.pincode}
                                </p>
                            </div>

                            {/* Capacity */}
                            <div>
                                <p className="text-sm font-bold text-gray-900">
                                    {hub.capacity.toLocaleString()}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    total capacity
                                </p>
                            </div>

                            {/* Status */}
                            <div>
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${hub.status === "Active"
                                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100"
                                        : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-100"
                                        }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${hub.status === "Active"
                                            ? "bg-emerald-500"
                                            : "bg-red-500"
                                            }`}
                                    />

                                    {hub.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile / Tablet Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:hidden">
                    {hubs.map((hub) => (
                        <div
                            key={hub._id}
                            onClick={() => handleHubClick(hub._id)}
                            onKeyDown={(event) =>
                                handleKeyDown(event, hub._id)
                            }
                            role="button"
                            tabIndex={0}
                            className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 shadow-sm outline-none transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:ring-2 focus:ring-blue-500 sm:p-5"
                        >
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                                        {hub.hubName
                                            ?.slice(0, 2)
                                            .toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="truncate font-semibold text-gray-900">
                                            {hub.hubName}
                                        </h2>

                                        <p className="mt-1 truncate text-xs text-gray-500">
                                            {hub.hubCode} · {hub.hubId}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${hub.status === "Active"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-red-50 text-red-700"
                                        }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${hub.status === "Active"
                                            ? "bg-emerald-500"
                                            : "bg-red-500"
                                            }`}
                                    />

                                    {hub.status}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-gray-50 p-3.5">
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                        Manager
                                    </p>

                                    <p className="mt-1.5 truncate text-sm font-semibold text-gray-800">
                                        {hub.managerName || "Not assigned"}
                                    </p>

                                    <p className="mt-1 truncate text-xs text-gray-400">
                                        {hub.phoneNumber || "No phone"}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-gray-50 p-3.5">
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                        Location
                                    </p>

                                    <p className="mt-1.5 truncate text-sm font-semibold text-gray-800">
                                        {hub.address.city}
                                    </p>

                                    <p className="mt-1 truncate text-xs text-gray-400">
                                        {hub.address.pincode}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-gray-50 p-3.5">
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                        Capacity
                                    </p>

                                    <p className="mt-1.5 text-sm font-bold text-gray-900">
                                        {hub.capacity.toLocaleString()}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        total capacity
                                    </p>
                                </div>

                                <div className="rounded-xl bg-gray-50 p-3.5">
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                        State
                                    </p>

                                    <p className="mt-1.5 truncate text-sm font-semibold text-gray-800">
                                        {hub.address.state}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        {hub.address.country}
                                    </p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="mt-4 border-t border-gray-100 pt-4">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                    Address
                                </p>

                                <p className="mt-1.5 text-sm leading-5 text-gray-700">
                                    {hub.address.street},{" "}
                                    {hub.address.city},{" "}
                                    {hub.address.state} -{" "}
                                    {hub.address.pincode}
                                </p>
                            </div>

                            {/* View Details */}
                            <div className="mt-4 flex items-center justify-end border-t border-gray-100 pt-3">
                                <span className="text-xs font-semibold text-blue-600 transition-transform group-hover:translate-x-1">
                                    View details →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HubList;