import { useEffect, useState } from "react";
import { socialLinks, openExternal } from "../data/socialLinks";
import { profile } from "../data/profile";
import { Logo } from "../components/Logo";

const footerLinks = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/#education", label: "Education" },
  { href: "/#certifications", label: "Certifications" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showFloatingLogo, setShowFloatingLogo] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const pastTop = y >= 120;
      const footerEl = document.getElementById("site-footer");
      let footerVisible = false;
      if (footerEl) {
        const rect = footerEl.getBoundingClientRect();
        footerVisible = rect.top < window.innerHeight - 40;
      }
      setShowFloatingLogo(pastTop && !footerVisible);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      {/* Floating bottom-left logo — fades in on scroll, hides when footer visible */}
      <div
        aria-hidden={!showFloatingLogo}
        className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 transition-all duration-500 ease-out ${
          showFloatingLogo
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <div className="rounded-2xl p-1.5 sm:p-2 bg-transparent shadow-none backdrop-blur-none">
          <Logo size="sm" />
        </div>
      </div>

      <footer id="site-footer" className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <Logo size="md" />
              <p className="text-sm text-muted-foreground mt-3">
                © {currentYear} {profile.name}. Designed & built with care.
              </p>
            </div>

            <nav className="flex flex-wrap justify-center gap-6">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {socialLinks
                .filter((s) => s.label !== "Email")
                .map((social) => (
                  <button
                    type="button"
                    key={social.label}
                    onClick={() => openExternal(social.href)}
                    aria-label={social.label}
                    className="p-2 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <social.icon className="w-5 h-5" />
                  </button>
                ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
