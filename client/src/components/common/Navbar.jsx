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
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-primary-600 hover:text-primary-700 transition-colors">
          <Briefcase size={22} className="text-primary-600" />
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
                  "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-200",
                  isActive
                    ? "bg-primary-50 text-primary-600"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                )
              }
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

