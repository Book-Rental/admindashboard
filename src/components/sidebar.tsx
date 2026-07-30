import { useEffect, useState } from "react";
import {
    FaClipboardList,
    FaSignOutAlt,
    FaBookOpen,
    FaBars,
    FaTimes,
    FaMotorcycle,
} from "react-icons/fa";

interface NavItem {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [


    {
        label: "Orders",
        path: "/orders",
        icon: FaClipboardList,
    },
    {
        label: "Agents",
        path: "/agents",
        icon: FaMotorcycle,
    },
];

function navigate(path: string) {
    if (window.location.pathname === path) return;

    window.history.pushState({}, "", path);

    window.dispatchEvent(
        new PopStateEvent("popstate")
    );
}

export default function Sidebar() {
    const [currentPath, setCurrentPath] = useState(
        window.location.pathname
    );

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const onPopState = () => {
            setCurrentPath(window.location.pathname);
        };

        window.addEventListener("popstate", onPopState);

        return () => {
            window.removeEventListener("popstate", onPopState);
        };
    }, []);

    // Close mobile sidebar whenever route changes
    useEffect(() => {
        setIsOpen(false);
    }, [currentPath]);

    const handleNavigate = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
                className="md:hidden fixed top-4 left-4 z-30
                    inline-flex items-center justify-center
                    h-10 w-10 rounded-lg
                    bg-sky-700 text-white shadow-md"
            >
                <FaBars className="h-4 w-4" />
            </button>

            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="md:hidden fixed inset-0 z-40 bg-black/40"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`w-64 shrink-0 bg-sky-700 text-indigo-100
                    flex flex-col fixed inset-y-0 left-0 z-50
                    transition-transform duration-200

                    ${isOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }

                    md:static md:translate-x-0 md:min-h-screen`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between gap-2 px-6 py-6">
                    <div className="flex items-center gap-2">
                        <FaBookOpen className="h-6 w-6 text-white" />

                        <span className="text-lg font-semibold text-white">
                            RentBook
                        </span>
                    </div>

                    {/* Mobile close */}
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                        className="md:hidden text-indigo-100 hover:text-white"
                    >
                        <FaTimes className="h-4 w-4" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-1">
                    {NAV_ITEMS.map(
                        ({ label, path, icon: Icon }) => {
                            const isActive =
                                path === "/"
                                    ? currentPath === "/"
                                    : currentPath.startsWith(path);

                            return (
                                <button
                                    key={path}
                                    onClick={() =>
                                        handleNavigate(path)
                                    }
                                    className={`w-full flex items-center gap-3
                                        px-3 py-2.5 rounded-lg
                                        text-sm font-medium

                                        ${isActive
                                            ? "bg-white text-indigo-700"
                                            : "text-indigo-100 hover:bg-indigo-600"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />

                                    {label}
                                </button>
                            );
                        }
                    )}
                </nav>

                {/* Bottom actions */}
                <div
                    className="px-3 pb-6 space-y-1
                        border-t border-indigo-600 pt-3"
                >


                    <button
                        className="w-full flex items-center gap-3
                            px-3 py-2.5 rounded-lg
                            text-sm font-medium
                            text-indigo-100
                            hover:bg-indigo-600"
                    >
                        <FaSignOutAlt className="h-4 w-4" />

                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}