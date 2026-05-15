import { Logo } from "../components/Logo";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";

const navLinks = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTopLogo, setShowTopLogo] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 50);
      // Simple threshold: visible near top, fades out once scrolled past
      setShowTopLogo(y < 120);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }
    const ids = navLinks.map((l) => l.id);

    const computeActive = () => {
      const els = ids.map((id) => ({ id, el: document.getElementById(id) })).filter((x) => x.el);
      if (!els.length) return;

      const viewportH = window.innerHeight;
      const navH = 80; // sticky header offset
      const probeY = navH + 1; // line just below navbar
      const bottomLine = viewportH;

      let best = "";
      let bestArea = 0;

      for (const { id, el } of els) {
        const rect = el.getBoundingClientRect();
        const visibleTop = Math.max(rect.top, probeY);
        const visibleBottom = Math.min(rect.bottom, bottomLine);
        const area = Math.max(0, visibleBottom - visibleTop);
        if (area > bestArea) {
          bestArea = area;
          best = id;
        }
      }

      // Require a meaningful chunk of the section to be visible
      const minVisible = Math.min(160, viewportH * 0.2);
      setActiveSection(bestArea >= minVisible ? best : "");
    };

    computeActive();
    window.addEventListener("scroll", computeActive, { passive: true });
    window.addEventListener("resize", computeActive);
    return () => {
      window.removeEventListener("scroll", computeActive);
      window.removeEventListener("resize", computeActive);
    };
  }, [location.pathname]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate({ to: "/", hash: id });
      // After route change, scroll into view
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 transition-all duration-500 ${
        isScrolled ? "glass-strong py-3" : "bg-transparent py-5"
      } z-50`}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between">
        <div
          aria-hidden={!showTopLogo}
          className={`transition-all duration-500 ease-out ${
            showTopLogo
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <Logo size="md" />
        </div>

        <div className="hidden md:flex items-center gap-1">
          <div className="glass rounded-full px-2 py-1 flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  href={`/#${link.id}`}
                  key={link.id}
                  onClick={(e) => handleNavClick(e, link.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative px-4 py-2 text-sm rounded-full transition-colors duration-500 ease-out ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{
                    transitionProperty: "color, text-shadow",
                  }}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-primary/10 ring-1 ring-primary/20 shadow-[0_0_10px_-3px_var(--color-primary)] animate-fade-in"
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="hidden md:block">
          <a
            href="/#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className="px-5 py-2 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/10 transition-all"
          >
            Contact Me
          </a>
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden glass-strong animate-fade-in">
          <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  href={`/#${link.id}`}
                  key={link.id}
                  onClick={(e) => handleNavClick(e, link.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative text-lg py-2 px-3 rounded-lg transition-colors duration-500 ease-out ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <a
              href="/#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="mt-2 text-center px-5 py-3 text-base font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/10 transition-all"
            >
              Contact Me
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
