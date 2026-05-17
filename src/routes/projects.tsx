import { useEffect } from "react";
import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { Navbar } from "../layout/Navbar";
import { Footer } from "../layout/Footer";
import { allProjects } from "../data/projects";

const PROJECTS_PAGE_TITLE = "All Projects | Ravi Kumar P";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: PROJECTS_PAGE_TITLE },
      {
        name: "description",
        content:
          "A complete collection of projects by Ravi Kumar P - featuring AI-powered automation workflows and RAG-based chatbot built on n8n, Pinecone, and cloud-native platforms.",
      },
      { property: "og:title", content: PROJECTS_PAGE_TITLE },
      {
        property: "og:description",
        content: "Production-deployed projects by Ravi Kumar P - AI workflow orchestration, RAG chatbot, and Exstream cloud-native solutions.",
      },
    ],
  }),
  component: AllProjectsPage,
});

function AllProjectsPage() {
  const location = useLocation();

  // Always assert the correct title on mount, route change, and bfcache restore
  // (browser tab duplication / back-forward navigation can serve stale HTML).
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = PROJECTS_PAGE_TITLE;
    }
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePageShow = () => {
      if (window.location.pathname === "/projects") {
        document.title = PROJECTS_PAGE_TITLE;
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && window.location.pathname === "/projects") {
        document.title = PROJECTS_PAGE_TITLE;
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-6 relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            <div className="max-w-3xl mb-16">
              <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
                Complete Portfolio
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
                All <span className="font-serif italic font-normal text-white">projects.</span>
              </h1>
              <p className="text-muted-foreground animate-fade-in animation-delay-200">
                A showcase of my production-ready systems - spanning AI-powered automation and
                scalable cloud-native solutions
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {allProjects.map((project, idx) => {
                const hasLive =
                  project.liveUrl && project.liveUrl !== "#" && project.liveUrl !== "";
                const hasGithub =
                  project.githubUrl && project.githubUrl !== "#" && project.githubUrl !== "";
                const isLastOdd = idx === allProjects.length - 1 && allProjects.length % 2 === 1;
                return (
                  <div
                    key={project.title + idx}
                    className={`group glass rounded-2xl overflow-hidden animate-fade-in ${
                      isLastOdd
                        ? "md:col-span-2 md:max-w-[calc(50%-1rem)] md:mx-auto md:w-full"
                        : ""
                    }`}
                    style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                  >
                    <div className="relative overflow-hidden aspect-video">
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

                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                      </div>
                      <p className="text-muted-foreground text-sm">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tag) => (
                          <span
                            key={tag}
                            className="px-4 py-1.5 rounded-full bg-surface text-xs font-medium border border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
