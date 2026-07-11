import { classNames } from "../../utils/helpers.js";

export default function Input({
  label,
  error,
  className = "",
  icon: Icon,
  ...rest
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        <input
          className={classNames(
            "input-field",
            Icon && "pl-11",
            error && "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10",
            className
          )}
          {...rest}
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-semibold text-rose-500">{error}</p>}
    </div>

  );
}
