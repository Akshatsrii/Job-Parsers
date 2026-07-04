import { classNames } from "../../utils/helpers.js";

export default function Card({ children, className = "", title, icon: Icon }) {
  return (
    <div className={classNames("card", className)}>
      {title && (
        <div className="mb-3 flex items-center gap-2">
          {Icon && <Icon size={18} className="text-primary-600" />}
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {title}
          </h3>
        </div>
      )}
      {children}
    </div>
  );
}
