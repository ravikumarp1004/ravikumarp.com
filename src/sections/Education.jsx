import { GraduationCap, BookOpen, Award, FileText, ExternalLink } from "lucide-react";
import { education } from "../data/education";

export const Education = () => {
  return (
    <section id="education" className="py-5 md:py-8 relative overflow-hidden">
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
            Academic Background
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 animate-fade-in animation-delay-100 text-secondary-foreground">
            Education &
            <span className="font-serif italic font-normal text-white"> foundations.</span>
          </h2>
          <p className="text-muted-foreground animate-fade-in animation-delay-200">
            The academic journey that shaped my engineering thinking and problem-solving approach.
          </p>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {education.map((edu, idx) => (
            <div
              key={edu.school}
              className="glass rounded-2xl p-5 sm:p-8 animate-fade-in border border-border/50 hover:border-primary/50 transition-all duration-500"
              style={{ animationDelay: `${(idx + 1) * 150}ms` }}
            >
              <div className="flex items-start gap-3 sm:gap-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      {edu.externalUrl ? (
                        <a
                          href={edu.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xl font-semibold hover:text-primary transition-colors"
                        >
                          {edu.school}
                          <ExternalLink className="w-4 h-4 opacity-70" />
                        </a>
                      ) : (
                        <h3 className="text-xl font-semibold">{edu.school}</h3>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">{edu.degree}</p>
                    </div>
                    <span className="text-sm text-primary font-medium whitespace-nowrap">
                      {edu.period}
                    </span>
                  </div>
                </div>
              </div>

              <div className="sm:pl-[76px]">
                {edu.projects.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {edu.projects.map((p) => (
                      <div
                        key={p.title}
                        className="rounded-xl bg-surface/50 border border-border/50 p-4"
                      >
                        <div className="flex items-center gap-2 text-foreground font-medium">
                          <BookOpen className="w-4 h-4 text-primary shrink-0" />
                          {p.title}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{p.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {edu.extras.length > 0 && (
                  <div className="mt-5 flex flex-col gap-2">
                    {edu.extras.map((ex) => {
                      const Icon = ex.type === "paper" ? FileText : Award;
                      const hasUrl = ex.documentUrl && ex.documentUrl !== "#";
                      const content = (
                        <>
                          <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span>{ex.label}</span>
                          {hasUrl && <ExternalLink className="w-3.5 h-3.5 opacity-60 mt-0.5" />}
                        </>
                      );
                      return hasUrl ? (
                        <a
                          key={ex.label}
                          href={ex.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {content}
                        </a>
                      ) : (
                        <div
                          key={ex.label}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          {content}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
