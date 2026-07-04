import { NavLink } from "react-router-dom";
import { Briefcase, Home, History as HistoryIcon, LayoutDashboard } from "lucide-react";
import { classNames } from "../../utils/helpers.js";

const LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/parser", label: "Parser", icon: Briefcase },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/history", label: "History", icon: HistoryIcon },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-bold text-primary-700">
          <Briefcase size={22} />
          Job Parser
        </NavLink>

        <div className="flex items-center gap-1">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                classNames(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-100"
                )
              }
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
