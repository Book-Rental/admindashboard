import { useEffect, useState } from "react";
import {
  FaTruck,
  FaBookOpen,
  FaTimes,
  FaClipboardList,
  FaBuilding,
} from "react-icons/fa";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [

  {
    label: "Delivery Agents",
    path: "/agents",
    icon: FaTruck,
  },
  { label: "Orders", path: "/orders", icon: FaClipboardList },
  { label: "Destination hub orders", path: "/destination-shipments", icon: FaClipboardList },
  {
    label: "Hubs",
    path: "/hubs",
    icon: FaBuilding,
  },

];
function navigate(path: string) {
  if (window.location.pathname === path) {
    return;
  }

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
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-mobile-sidebar", handleToggle);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener(
      "popstate",
      onPopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        onPopState
      );
    };
  }, []);

  // Close mobile drawer after route changes
  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // Normalize path (remove trailing slash)
  const normalizedPath =
    currentPath.replace(/\/+$/, "") || "/";

  return (
    <>
      {/* Mobile Toggle */}

      {isOpen && (
        <div
          className="  fixed
      top-16
      inset-x-0
      bottom-0
      bg-black/40
      z-40
      md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed
    top-16
          left-0
    h-[calc(100vh-64px)]
          w-64
          z-40
          bg-white
          border-r
          border-slate-200
          flex
          flex-col
          transition-transform
          duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}

        <div className="h-20 px-6 border-b border-slate-100 flex items-center justify-between shrink-0">

          <div className="flex items-center gap-3">

            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <FaBookOpen className="text-white text-base" />
            </div>

            <div>
              <h2 className="font-bold text-slate-800 text-lg leading-tight">
                RentBook
              </h2>

              <p className="text-[11px] text-slate-400">
                Admin Dashboard
              </p>
            </div>

          </div>

          <button
            aria-label="Close sidebar"

            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes className="text-slate-500" />
          </button>

        </div>

        {/* Navigation */}

        <nav className="flex-1 px-4 py-6 overflow-y-auto">

          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-3">
            Main Menu
          </p>

          <div className="space-y-1">

            {NAV_ITEMS.map(
              ({ label, path, icon: Icon }) => {

                const active =
                  path === "/"
                    ? normalizedPath === "/"
                    : normalizedPath.startsWith(path);

                return (
                  <button
                    key={path}
                    onClick={() =>
                      handleNavigate(path)
                    }
                    className={`
                      w-full
                      flex
                      items-center
                      gap-3
                      rounded-lg
                      border-l-2
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      transition-colors
                      duration-150
                      ${active
                        ? "border-blue-600 bg-blue-50 text-blue-600 font-medium"
                        : "border-transparent text-slate-600 hover:bg-slate-50"
                      }
                    `}
                  >

                    <Icon
                      className={`text-base ${active
                        ? "text-blue-600"
                        : "text-slate-400"
                        }`}
                    />

                    <span>{label}</span>

                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                    )}

                  </button>
                );
              }
            )}

          </div>

        </nav>
      </aside>
    </>
  );
}