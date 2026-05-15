import { useMemo, useRef, useState, useEffect } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Github } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AnimatedBorderButton } from "../components/AnimatedBorderButton";
import { featuredProjects } from "../data/projects";

const FILTERS = ["All", "Cloud Platform", "Enterprise CCM", "Generative AI", "Workflow Automation"];

const PROJECT_CATEGORIES = {
  "Portfolio RAG Chatbot": ["Generative AI"],
  "Contact Message Form": ["Workflow Automation"],
  "Exstream Cloud-Native Workflows": ["Enterprise CCM", "Cloud Platform"],
};

const matchesFilter = (project, filter) => {
  if (filter === "All") return true;
  const cats = PROJECT_CATEGORIES[project.title] || [];
  return cats.includes(filter);
};

const SWIPE_AXIS_LOCK_PX = 10;
const SWIPE_ANIMATION_MS = 620;
const SWIPE_DISTANCE_RATIO = 0.2;
const SWIPE_VELOCITY_PX_MS = 0.45;
const SWIPE_GESTURE_COOLDOWN_MS = 180;

export const Projects = () => {
  const carouselRef = useRef(null);
  const [filter, setFilter] = useState("All");
  const [expandedTags, setExpandedTags] = useState({});
  const [expandedDesc, setExpandedDesc] = useState({});

  const toggleTags = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedTags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleDesc = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedDesc((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const visibleProjects = useMemo(
    () => featuredProjects.filter((p) => matchesFilter(p, filter)),
    [filter],
  );

  // Cinematic eased scroll (used by arrows + drag-release snap)
  const animationRef = useRef(null);
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const smoothScrollTo = (target, duration = 750) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    const start = carousel.scrollLeft;
    const max = carousel.scrollWidth - carousel.clientWidth;
    const end = Math.max(0, Math.min(max, target));
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      carousel.scrollLeft = start + (end - start) * easeInOutCubic(t);
      if (t < 1) animationRef.current = requestAnimationFrame(step);
    };
    animationRef.current = requestAnimationFrame(step);
  };

  const getSlideWidth = () => {
    const carousel = carouselRef.current;
    if (!carousel) return 0;
    const firstCard = carousel.querySelector("[data-project-slide]");
    return firstCard?.getBoundingClientRect().width || carousel.clientWidth;
  };

  const snapToNearest = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const w = getSlideWidth();
    if (!w) return;
    const idx = Math.round(carousel.scrollLeft / w);
    smoothScrollTo(idx * w, 700);
  };

  const scrollCarousel = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const w = getSlideWidth();
    if (!w) return;
    const currentIdx = Math.round(carousel.scrollLeft / w);
    goToIndex(currentIdx + direction);
  };

  // Update --progress on each slide based on distance from carousel center
  const updateSlideProgress = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    carousel.querySelectorAll("[data-project-slide]").forEach((slide) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(center - slideCenter) / slide.offsetWidth;
      const p = Math.max(0, Math.min(1, dist));
      slide.style.setProperty("--p", p.toFixed(3));
    });
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    updateSlideProgress();
    const onScroll = () => updateSlideProgress();
    carousel.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateSlideProgress);
    return () => {
      carousel.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateSlideProgress);
    };
  }, [visibleProjects.length]);

  // Reset scroll when filter changes
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
      requestAnimationFrame(updateSlideProgress);
    }
  }, [filter]);

  // Pointer drag (mouse, pen, touch) — one-card-per-gesture with axis lock
  const isAnimatingRef = useRef(false);
  const wheelState = useRef({ accum: 0, lockedUntil: 0, resetTimer: null });
  const dragState = useRef({
    active: false,
    locked: false,
    isHorizontal: false,
    startX: 0,
    startY: 0,
    startScroll: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    moved: false,
  });

  const animatedScrollTo = (target, duration = SWIPE_ANIMATION_MS) => {
    const carousel = carouselRef.current;
    if (!carousel) {
      isAnimatingRef.current = false;
      return;
    }
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    const start = carousel.scrollLeft;
    const max = carousel.scrollWidth - carousel.clientWidth;
    const end = Math.max(0, Math.min(max, target));

    if (Math.abs(end - start) < 0.5) {
      carousel.scrollLeft = end;
      carousel.style.scrollSnapType = "";
      isAnimatingRef.current = false;
      updateSlideProgress();
      return;
    }

    isAnimatingRef.current = true;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      carousel.scrollLeft = start + (end - start) * easeInOutCubic(t);
      updateSlideProgress();
      if (t < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        isAnimatingRef.current = false;
        carousel.style.scrollSnapType = "";
      }
    };
    animationRef.current = requestAnimationFrame(step);
  };

  const goToIndex = (idx) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const w = getSlideWidth();
    if (!w) return;
    const max = visibleProjects.length - 1;
    const clamped = Math.max(0, Math.min(max, idx));
    carousel.style.scrollSnapType = "none";
    animatedScrollTo(clamped * w);
  };

  const onPointerDown = (e) => {
    // Touch is handled natively (overflow-x-auto + snap-mandatory). This is
    // the most reliable across mobile browsers and avoids preventDefault
    // conflicts with the browser's pan gesture detection.
    if (e.pointerType === "touch") {
      dragState.current.active = false;
      return;
    }
    if (isAnimatingRef.current) return;
    const carousel = carouselRef.current;
    if (!carousel) return;
    // Ignore drags that start on interactive elements (buttons, links, inputs)
    // so clicks/taps on Read more, +N tag pill, action icons work cleanly.
    if (e.target?.closest?.("button, a, input, textarea, select, [role='button']")) {
      dragState.current.active = false;
      return;
    }
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    dragState.current = {
      active: true,
      locked: true,
      isHorizontal: true,
      startX: e.clientX,
      startY: e.clientY,
      startScroll: carousel.scrollLeft,
      lastX: e.clientX,
      lastT: performance.now(),
      velocity: 0,
      moved: false,
    };
    carousel.setPointerCapture?.(e.pointerId);
    carousel.style.cursor = "grabbing";
    carousel.style.scrollSnapType = "none";
  };

  const onPointerMove = (e) => {
    const s = dragState.current;
    if (!s.active) return;
    const carousel = carouselRef.current;
    if (!carousel) return;
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;

    if (!s.locked) {
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      if (ax < SWIPE_AXIS_LOCK_PX && ay < SWIPE_AXIS_LOCK_PX) return;
      if (ax > ay * 1.25) {
        s.locked = true;
        s.isHorizontal = true;
        carousel.setPointerCapture?.(e.pointerId);
        carousel.style.scrollSnapType = "none";
        e.preventDefault();
        s.startX = e.clientX;
        s.startScroll = carousel.scrollLeft;
        s.lastX = e.clientX;
        s.lastT = performance.now();
      } else if (ay > ax * 1.1) {
        s.active = false;
        return;
      }
    }

    if (!s.isHorizontal) return;
    e.preventDefault();
    const ddx = e.clientX - s.startX;
    if (Math.abs(ddx) > 4) s.moved = true;

    // Resistance drag — limited to ~half a slide so user can't skip cards
    const w = getSlideWidth() || carousel.clientWidth;
    const limit = w * 0.58;
    const clamped = Math.max(-limit, Math.min(limit, ddx * 0.92));
    carousel.scrollLeft = s.startScroll - clamped;
    updateSlideProgress();

    const now = performance.now();
    const dt = now - s.lastT;
    if (dt > 0) s.velocity = (s.lastX - e.clientX) / dt;
    s.lastX = e.clientX;
    s.lastT = now;
  };

  const onPointerUp = (e) => {
    const s = dragState.current;
    if (!s.active) return;
    s.active = false;
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.releasePointerCapture?.(e.pointerId);
    carousel.style.cursor = "";
    if (!s.isHorizontal) return;

    const w = getSlideWidth();
    if (!w) {
      carousel.style.scrollSnapType = "";
      return;
    }

    const currentIdx = Math.round(s.startScroll / w);
    const dx = s.lastX - s.startX;
    const distThreshold = w * SWIPE_DISTANCE_RATIO;
    const velThreshold = SWIPE_VELOCITY_PX_MS;

    let targetIdx = currentIdx;
    if (dx <= -distThreshold || s.velocity > velThreshold) {
      targetIdx = currentIdx + 1; // swiped left → next
    } else if (dx >= distThreshold || s.velocity < -velThreshold) {
      targetIdx = currentIdx - 1; // swiped right → prev
    }
    goToIndex(targetIdx);
  };

  const onWheel = (e) => {
    const carousel = carouselRef.current;
    if (!carousel || visibleProjects.length <= 1) return;

    const horizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.15;
    if (!horizontalIntent) return;

    e.preventDefault();
    if (isAnimatingRef.current || performance.now() < wheelState.current.lockedUntil) return;

    wheelState.current.accum += e.deltaX;
    if (wheelState.current.resetTimer) clearTimeout(wheelState.current.resetTimer);
    wheelState.current.resetTimer = window.setTimeout(() => {
      wheelState.current.accum = 0;
    }, 160);

    const w = getSlideWidth() || carousel.clientWidth;
    const threshold = Math.max(36, w * 0.12);
    if (Math.abs(wheelState.current.accum) < threshold) return;

    const currentIdx = Math.round(carousel.scrollLeft / w);
    const direction = wheelState.current.accum > 0 ? 1 : -1;
    wheelState.current.accum = 0;
    wheelState.current.lockedUntil = performance.now() + SWIPE_ANIMATION_MS + SWIPE_GESTURE_COOLDOWN_MS;
    goToIndex(currentIdx + direction);
  };


  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <section id="projects" className="py-5 md:py-8 relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mx-auto max-w-3xl mb-6">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
            Featured Work
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 animate-fade-in animation-delay-100 text-secondary-foreground">
            Projects that
            <span className="font-serif italic font-normal text-white"> make an impact.</span>
          </h2>
          <p className="text-muted-foreground animate-fade-in animation-delay-200">
            A curated selection of production-grade projects spanning AI-powered automation and
            scalable cloud-native solutions.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-in animation-delay-200">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${
                  active
                    ? "bg-primary/20 border-primary text-primary shadow-[0_0_12px_color-mix(in_srgb,var(--color-primary)_40%,transparent)]"
                    : "bg-surface border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        <div className="w-full relative">
          {visibleProjects.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              No projects match this filter yet.
            </div>
          ) : (
            <>
              <div
                ref={carouselRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onPointerLeave={onPointerUp}
                onWheel={onWheel}
                onClickCapture={(e) => {
                  if (dragState.current.moved) {
                    e.preventDefault();
                    e.stopPropagation();
                    dragState.current.moved = false;
                  }
                }}
                style={{ cursor: "grab", touchAction: "pan-x pan-y", WebkitOverflowScrolling: "touch" }}
                className="overflow-x-auto overscroll-x-contain snap-x snap-mandatory pb-3 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                aria-label="Projects carousel"
              >
                <div className="flex -ml-4">
                  {visibleProjects.map((project, idx) => {
                    const hasLive =
                      project.liveUrl && project.liveUrl !== "#" && project.liveUrl !== "";
                    const hasGithub =
                      project.githubUrl && project.githubUrl !== "#" && project.githubUrl !== "";
                    return (
                      <div
                        key={project.title}
                        data-project-slide
                        className="pl-4 basis-full shrink-0 grow-0 snap-center"
                        style={{
                          ["--p"]: 1,
                          transform: "scale(calc(1 - var(--p, 0) * 0.08))",
                          opacity: "calc(1 - var(--p, 0) * 0.45)",
                          transition:
                            "transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms cubic-bezier(0.22, 1, 0.36, 1)",
                          willChange: "transform, opacity",
                        }}
                      >
                        <div
                          onMouseMove={handleMouseMove}
                          className="project-glow group glass rounded-2xl overflow-hidden animate-fade-in border border-border/50 hover:border-primary/40 transition-all duration-500 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
                          style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                        >
                          <div className="relative overflow-hidden aspect-[16/8]">
                            <img
                              src={project.image}
                              alt={project.title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60" />
                            <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {hasLive && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`View ${project.title} live demo`}
                                  className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                                >
                                  <ArrowUpRight className="w-5 h-5" />
                                </a>
                              )}
                              {hasGithub && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`${project.title} on Github`}
                                  className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                                >
                                  <Github className="w-5 h-5" />
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="p-4 space-y-3 relative">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-base md:text-lg font-semibold group-hover:text-primary transition-colors">
                                {project.title}
                              </h3>
                              <ArrowUpRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                            </div>
                            <button
                              type="button"
                              onClick={(e) => toggleDesc(e, project.title)}
                              aria-expanded={!!expandedDesc[project.title]}
                              className="block w-full text-left cursor-pointer group/desc"
                            >
                              <p
                                className={`text-muted-foreground text-xs md:text-sm transition-all duration-500 ease-in-out overflow-hidden ${
                                  expandedDesc[project.title]
                                    ? "max-h-[600px]"
                                    : "max-h-[60px] md:max-h-[66px] line-clamp-3"
                                }`}
                              >
                                {project.description}
                              </p>
                              <span className="text-[10px] md:text-xs text-primary/70 group-hover/desc:text-primary mt-1 inline-block transition-colors">
                                {expandedDesc[project.title] ? "Show less" : "Read more"}
                              </span>
                            </button>
                            <div className="flex flex-wrap gap-1.5">
                              {(expandedTags[project.title]
                                ? project.techStack
                                : project.techStack.slice(0, 4)
                              ).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2.5 py-1 rounded-full bg-surface text-[10px] md:text-xs font-medium border border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary hover:-translate-y-0.5 transition-all duration-300"
                                >
                                  {tag}
                                </span>
                              ))}
                              {project.techStack.length > 4 && (
                                <button
                                  type="button"
                                  onClick={(e) => toggleTags(e, project.title)}
                                  aria-expanded={!!expandedTags[project.title]}
                                  aria-label={
                                    expandedTags[project.title]
                                      ? "Show fewer tags"
                                      : `Show ${project.techStack.length - 4} more tags`
                                  }
                                  className="px-2.5 py-1 rounded-full bg-surface text-[10px] md:text-xs font-medium border border-primary/40 text-primary hover:border-primary hover:bg-primary/10 transition-all duration-300 cursor-pointer shadow-[0_0_8px_color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
                                >
                                  {expandedTags[project.title]
                                    ? "Show less"
                                    : `+${project.techStack.length - 4}`}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {visibleProjects.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollCarousel(-1)}
                    aria-label="Previous project"
                    className="carousel-nav-arrow group/arrow absolute left-1 sm:left-2 lg:-left-14 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 rounded-full bg-background/60 backdrop-blur-md border border-primary/30 text-primary/80 hover:text-primary hover:border-primary hover:scale-110 hover:bg-primary/10 z-20 flex items-center justify-center transition-all duration-300 shadow-[0_0_12px_color-mix(in_srgb,var(--color-primary)_25%,transparent)] hover:shadow-[0_0_20px_color-mix(in_srgb,var(--color-primary)_55%,transparent)]"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover/arrow:-translate-x-0.5" />
                    <span className="sr-only">Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel(1)}
                    aria-label="Next project"
                    className="carousel-nav-arrow group/arrow absolute right-1 sm:right-2 lg:-right-14 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 rounded-full bg-background/60 backdrop-blur-md border border-primary/30 text-primary/80 hover:text-primary hover:border-primary hover:scale-110 hover:bg-primary/10 z-20 flex items-center justify-center transition-all duration-300 shadow-[0_0_12px_color-mix(in_srgb,var(--color-primary)_25%,transparent)] hover:shadow-[0_0_20px_color-mix(in_srgb,var(--color-primary)_55%,transparent)]"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover/arrow:translate-x-0.5" />
                    <span className="sr-only">Next</span>
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {visibleProjects.length > 1 && (
          <div
            aria-hidden="true"
            className="pointer-events-none mt-6 flex items-center justify-center gap-3 text-xs sm:text-sm tracking-[0.15em] text-primary/70"
          >
            <span
              className="text-primary/80 animate-pulse drop-shadow-[0_0_6px_color-mix(in_srgb,var(--color-primary)_70%,transparent)]"
              style={{ animationDuration: "2.8s" }}
            >
              ◇
            </span>
            <span className="font-medium text-primary/85">Swipe Through Featured Work</span>
            <span
              className="text-primary/80 animate-pulse drop-shadow-[0_0_6px_color-mix(in_srgb,var(--color-primary)_70%,transparent)]"
              style={{ animationDuration: "2.8s", animationDelay: "1.4s" }}
            >
              ◇
            </span>
          </div>
        )}

        <div className="text-center mt-6 animate-fade-in animation-delay-500">
          <Link to="/projects" className="inline-block">
            <AnimatedBorderButton>
              View All Projects
              <ArrowUpRight className="w-5 h-5" />
            </AnimatedBorderButton>
          </Link>
        </div>
      </div>
    </section>
  );
};
