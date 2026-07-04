import { classNames } from "../../utils/helpers.js";

const VARIANTS = {
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export default function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  icon: Icon,
  className = "",
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        className
      )}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </button>
  );
}
