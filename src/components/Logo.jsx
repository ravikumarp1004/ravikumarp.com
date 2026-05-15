import { forwardRef } from "react";

/**
 * Premium "RK." logo mark.
 * - Custom SVG monogram with subtle teal/cyan gradient
 * - Gentle shimmer + soft pulse animation
 * - Smooth hover lift/glow
 * - Click scrolls to top of page
 */
export const Logo = forwardRef(function Logo(
  { className = "", size = "md", onClick, ariaLabel = "Scroll to top" },
  ref,
) {
  const sizes = {
    sm: { box: "h-9 w-9" },
    md: { box: "h-10 w-10 sm:h-11 sm:w-11" },
    lg: { box: "h-12 w-12 sm:h-14 sm:w-14" },
  };
  const s = sizes[size] ?? sizes.md;

  const handleClick = () => {
    if (onClick) return onClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`group inline-flex items-center bg-transparent border-0 p-0 cursor-pointer transition-transform duration-500 ease-out hover:-translate-y-[1px] ${className}`}
    >
      {/* Mark */}
      <span
        className={`relative ${s.box} inline-flex items-center justify-center rounded-xl logo-mark`}
      >
        <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="rk-stroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5eead4" />
              <stop offset="55%" stopColor="#20b2a6" />
              <stop offset="100%" stopColor="#0e8d83" />
            </linearGradient>
            <linearGradient id="rk-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#26c4b8" stopOpacity="0" />
              <stop offset="100%" stopColor="#20b2a6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Rounded container */}
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="10"
            fill="url(#rk-fill)"
            stroke="url(#rk-stroke)"
            strokeWidth="1.4"
          />

          {/* Centered RK monogram */}
          <g
            fill="none"
            stroke="url(#rk-stroke)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* R */}
            <path d="M10 28 V12 H17 a4.2 4.2 0 0 1 0 8.4 H12 M17 20.4 L21 28" />
            {/* K */}
            <path d="M24 12 V28 M24 20 L30 12 M24 20 L30 28" />
          </g>
          {/* Accent dot */}
          <circle cx="32.5" cy="28" r="1.6" fill="#26c4b8" />
        </svg>

        {/* Shimmer overlay */}
        <span aria-hidden="true" className="logo-shimmer" />
      </span>
    </button>
  );
});

export default Logo;
