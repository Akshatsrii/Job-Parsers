import { classNames } from "../../utils/helpers.js";

const VARIANTS = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm rounded-xl",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl",
  outline: "border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl",
  danger: "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-xl",
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
        "inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95",
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
