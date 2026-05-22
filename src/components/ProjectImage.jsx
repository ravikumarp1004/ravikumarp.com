import { useEffect, useState } from "react";

/**
 * Project image with optional slideshow.
 * - If `images` array (length > 1) is provided, cross-fades through them every `intervalMs` (default 2000ms).
 * - Otherwise renders a single <img> identical to the previous static behavior.
 * Card size/layout is controlled by the parent's aspect wrapper.
 */
export const ProjectImage = ({
  src,
  images,
  alt,
  className = "",
  intervalMs = 2000,
}) => {
  const slides = Array.isArray(images) && images.length > 0 ? images : [src];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs]);

  if (slides.length === 1) {
    return (
      <img
        src={slides[0]}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${className}`}
      />
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110">
      {slides.map((s, i) => (
        <img
          key={s}
          src={s}
          alt={alt}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      ))}
    </div>
  );
};
