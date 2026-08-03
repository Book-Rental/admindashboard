import { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaTruck,
  FaBookOpen,
  FaBars,
  FaTimes,
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
  {
    label: "Orders",
    path: "/orders",
    icon: FaClipboardList,
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

      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden h-11 w-11 rounded-xl bg-blue-600 text-white shadow-lg flex items-center justify-center"
      >
        <FaBars />
      </button>

      {/* Overlay */}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed
          top-0
          left-0
          h-screen
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
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      transition-colors
                      duration-150
                      ${
                        active
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                    `}
                  >

                    <Icon
                      className={`text-base ${
                        active
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