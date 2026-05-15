export const Button = ({ className = "", size = "default", children, ...props }) => {
  const baseClasses =
    "relative overflow-hidden rounded-full font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/10 transition-all";

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // If caller provides padding/text-size overrides, skip default sizing
  const hasSizeOverride = /(^|\s)(px-|py-|text-)/.test(className);
  const classes = `${baseClasses} ${hasSizeOverride ? "" : sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      <span className="relative flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};
