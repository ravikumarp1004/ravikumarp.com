import { useRef, useState, useEffect, useCallback } from "react";
import { BadgeCheck, ChevronLeft, ChevronRight, ExternalLink, FileText } from "lucide-react";
import { certifications } from "../data/certifications";

export const Certifications = () => {
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const pointerRef = useRef({ id: null, startX: 0, startY: 0, locked: null });
  const wheelRef = useRef({ accum: 0, lockedUntil: 0 });
  const stageRef = useRef(null);
  const total = certifications.length;

  const goTo = useCallback(
    (i) => {
      if (total === 0) return;
      setActive(((i % total) + total) % total);
      setDrag(0);
    },
    [total],
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Horizontal wheel / trackpad gesture support (desktop)
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e) => {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      // Only react to predominantly-horizontal gestures so vertical page scroll is preserved
      if (absX < 8 || absX <= absY) return;
      e.preventDefault();
      const now = Date.now();
      const w = wheelRef.current;
      if (now < w.lockedUntil) return;
      w.accum += e.deltaX;
      const threshold = 40;
      if (w.accum >= threshold) {
        next();
        w.accum = 0;
        w.lockedUntil = now + 500;
      } else if (w.accum <= -threshold) {
        prev();
        w.accum = 0;
        w.lockedUntil = now + 500;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  const onPointerDown = (e) => {
    pointerRef.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      locked: null,
    };
  };

  const onPointerMove = (e) => {
    const p = pointerRef.current;
    if (p.id !== e.pointerId) return;
    const dx = e.clientX - p.startX;
    const dy = e.clientY - p.startY;

    if (p.locked === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      // Lock direction once intent is clear; allow vertical scrolling on mobile.
      p.locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (p.locked === "x") {
      e.preventDefault?.();
      setDrag(dx);
    }
  };

  const endPointer = (e) => {
    const p = pointerRef.current;
    if (p.id !== e.pointerId) return;
    const dx = drag;
    pointerRef.current = { id: null, startX: 0, startY: 0, locked: null };
    const threshold = 70;
    if (dx <= -threshold) next();
    else if (dx >= threshold) prev();
    else setDrag(0);
  };

  return (
    <section id="certifications" className="py-5 md:py-8 relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
            Credentials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 animate-fade-in animation-delay-100 text-secondary-foreground">
            Certifications &
            <span className="font-serif italic font-normal text-white"> achievements.</span>
          </h2>
          <p className="text-muted-foreground animate-fade-in animation-delay-200">
            Industry-recognized certifications across CCM and cloud platforms that support my
            day-to-day work.
          </p>
        </div>

        <div className="w-full relative">
          {/* Stacked card stage */}
          <div
            ref={stageRef}
            className="relative mx-auto select-none"
            style={{
              maxWidth: "640px",
              minHeight: "150px",
              perspective: "1400px",
              touchAction: "pan-y",
              cursor: pointerRef.current.id != null ? "grabbing" : "grab",
              WebkitUserSelect: "none",
              userSelect: "none",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endPointer}
            onPointerCancel={endPointer}
            role="region"
            aria-roledescription="carousel"
            aria-label="Certifications"
          >
            {certifications.map((cert, idx) => {
              // Signed offset relative to active, wrapped to nearest
              let offset = idx - active;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const abs = Math.abs(offset);
              const isActive = offset === 0;
              const dragInfluence = isActive ? drag : 0;
              // Push back cards far enough that only a side sliver shows.
              // Mobile uses a tighter offset; desktop a wider one.
              const baseOffset = 84;
              const tx = offset * baseOffset + dragInfluence;
              const ty = abs * 6;
              const scale = Math.max(0.86, 1 - abs * 0.05);
              const rotate = offset * -3;
              const opacity = abs > 2 ? 0 : 1;
              const z = 100 - abs;
              const blur = abs >= 1 ? 1 : 0;
              const pointer = abs <= 1 ? "auto" : "none";
              const contentOpacity = isActive ? 1 : 0;

              return (
                <article
                  key={cert.title}
                  aria-hidden={!isActive}
                  className={isActive ? "relative mx-auto" : "absolute inset-0 mx-auto"}
                  style={{
                    transform: `translate3d(${tx}px, ${ty}px, 0) rotate(${rotate}deg) scale(${scale})`,
                    opacity,
                    zIndex: z,
                    filter: blur ? `blur(${blur}px)` : undefined,
                    pointerEvents: pointer,
                    transition:
                      pointerRef.current.id != null && isActive
                        ? "none"
                        : "transform 850ms cubic-bezier(0.22, 1, 0.36, 1), opacity 600ms ease, filter 600ms ease",
                    willChange: "transform, opacity",
                  }}
                  onClickCapture={(e) => {
                    if (!isActive && abs <= 1) {
                      e.preventDefault();
                      e.stopPropagation();
                      goTo(idx);
                    }
                  }}
                >
                  <a
                    href={cert.credlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View badge on Credly: ${cert.title}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={(e) => {
                      // Prevent accidental navigation after a swipe drag.
                      if (Math.abs(drag) > 6) e.preventDefault();
                    }}
                    onDragStart={(e) => e.preventDefault()}
                    className={`group glass rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5 min-w-0 h-full border transition-all duration-500 ${
                      isActive
                        ? "border-primary/50 shadow-[0_10px_40px_-10px_color-mix(in_srgb,var(--color-primary)_45%,transparent)]"
                        : "border-border/40 bg-background/40 cursor-pointer hover:border-primary/30"
                    }`}
                  >
                    <div
                      className="flex gap-4 sm:gap-5 min-w-0 w-full transition-opacity duration-300"
                      style={{ opacity: contentOpacity }}
                    >
                      <div className="w-14 h-14 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors overflow-hidden">
                        <img
                          src={cert.badgeImage}
                          alt={`${cert.title} badge`}
                          className="w-full h-full object-contain p-1"
                          loading="lazy"
                          draggable={false}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-base sm:text-lg font-semibold group-hover:text-primary transition-colors">
                            {cert.title}
                          </h3>
                          <div className="flex items-center gap-2 shrink-0 mt-1">
                            {cert.certificateFile && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  window.open(
                                    cert.certificateFile,
                                    "_blank",
                                    "noopener,noreferrer",
                                  );
                                }}
                                aria-label={`Open certificate PDF: ${cert.title}`}
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                            )}
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{cert.issuer}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                            {cert.date}
                          </span>
                          <span className="opacity-60 truncate min-w-0 max-w-full">
                            ID: {cert.credentialId}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                </article>
              );
            })}
          </div>

          {/* Swipe hint */}
          {total > 1 && (
            <div
              aria-hidden="true"
              className="pointer-events-none mt-3 flex items-center justify-center gap-1 text-[10px] uppercase tracking-[0.2em] text-primary/60"
            >
              <span className="animate-pulse">‹ swipe ›</span>
            </div>
          )}

          {/* Dots */}
          {total > 1 && (
            <div className="flex justify-center gap-2 mt-3">
              {certifications.map((cert, i) => (
                <button
                  key={cert.title}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to certification ${i + 1}`}
                  aria-current={i === active}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active
                      ? "w-6 bg-primary shadow-[0_0_10px_color-mix(in_srgb,var(--color-primary)_60%,transparent)]"
                      : "w-1.5 bg-border/60 hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
          )}

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous certification"
                className="carousel-nav-arrow group/arrow absolute left-1 sm:left-2 lg:-left-14 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 rounded-full bg-background/70 backdrop-blur-md border border-primary/40 text-primary hover:text-primary hover:border-primary hover:scale-110 hover:bg-primary/15 z-30 flex items-center justify-center transition-all duration-300 shadow-[0_0_16px_color-mix(in_srgb,var(--color-primary)_35%,transparent)] hover:shadow-[0_0_24px_color-mix(in_srgb,var(--color-primary)_65%,transparent)]"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover/arrow:-translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next certification"
                className="carousel-nav-arrow group/arrow absolute right-1 sm:right-2 lg:-right-14 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 rounded-full bg-background/70 backdrop-blur-md border border-primary/40 text-primary hover:text-primary hover:border-primary hover:scale-110 hover:bg-primary/15 z-30 flex items-center justify-center transition-all duration-300 shadow-[0_0_16px_color-mix(in_srgb,var(--color-primary)_35%,transparent)] hover:shadow-[0_0_24px_color-mix(in_srgb,var(--color-primary)_65%,transparent)]"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover/arrow:translate-x-0.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
