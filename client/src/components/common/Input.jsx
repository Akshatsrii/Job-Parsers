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
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}
        <input
          className={classNames(
            "input-field",
            Icon && "pl-10",
            error && "border-red-400 focus:border-red-500 focus:ring-red-100",
            className
          )}
          {...rest}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
