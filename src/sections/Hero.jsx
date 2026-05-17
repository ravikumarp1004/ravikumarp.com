import { useState } from "react";
import { Button } from "../components/Button";
import { ArrowRight, ChevronDown, ChevronUp, Download } from "lucide-react";
import { AnimatedBorderButton } from "../components/AnimatedBorderButton";
import { profile } from "../data/profile";
import { socialLinks, openExternal } from "../data/socialLinks";

const allTechnologies = [
  // Exstream Core
  "Exstream Design Manager & Designer",
  "Communications (Exstream) Cloud-Native",
  "Document Composition",

  // Cloud & Infrastructure
  "Multi-Cloud Architecture",
  "Platform Upgrades & Patches",

  // ITSM & Operations
  "Incident Management",
  "ServiceNow/SM9/Jira",
  "Managed Services",

  // AI & Automation
  "Workflow Automation (n8n)",
  "LLM Integration",
  "RAG (Retrieval-Augmented Generation)",
  "AI Orchestration",
  "Pinecone (Vector Database)",
  "Vector Search",
  "Airtable",
  "Email Orchestration",
];

const scrollToContact = () => {
  document.getElementById("contact")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const scrollToSkills = () => {
  document.getElementById("skills")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

export const Hero = () => {
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  const handleScrollClick = () => {
    setSkillsExpanded(true);
    setTimeout(() => {
      document.getElementById("skills-list")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  };
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={profile.heroBg} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full opacity-60"
            style={{
              backgroundColor: "#20B2A6",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `slow-drift ${15 + Math.random() * 20}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 pt-24 pb-8 relative z-10">
        <div className="grid md:grid-cols-[1.7fr_1fr] lg:grid-cols-[1.75fr_1fr] gap-8 md:gap-6 lg:gap-10 xl:gap-12 items-center max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="animate-fade-in">
              <span className="inline-flex items-start gap-2 px-4 py-2 rounded-full glass text-xs sm:text-sm text-primary max-w-full">
                <span className="w-2 h-2 mt-1.5 bg-primary rounded-full animate-pulse flex-shrink-0" />
                <span className="break-words">{profile.title}</span>
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-[4.25rem] font-bold leading-[1.1] animate-fade-in animation-delay-100 max-w-[760px]">
                Driven to <span className="text-primary glow-text">solve</span> real problems
                <br className="hidden md:block" />
                <span> with </span>
                <span className="font-serif italic font-normal text-white">
                  simple, scalable solutions.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-[640px] animate-fade-in animation-delay-200">
                {profile.bio}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 animate-fade-in animation-delay-300">
              <AnimatedBorderButton
                onClick={() =>
                  window.open("https://form.ravikumarp.com", "_blank", "noopener,noreferrer")
                }
                className="px-5 py-2.5 text-sm"
                aria-label="Get in Touch — opens contact form in a new tab"
              >
                Get in Touch <ArrowRight className="w-4 h-4" />
              </AnimatedBorderButton>
              <a
                href={profile.cvUrl}
                download={profile.cvFilename}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AnimatedBorderButton className="px-5 py-2.5 text-sm">
                  <Download className="w-4 h-4" />
                  Download CV
                </AnimatedBorderButton>
              </a>
            </div>

            <div className="flex items-center gap-3 animate-fade-in animation-delay-400">
              {socialLinks.map((social) => (
                <button
                  type="button"
                  key={social.label}
                  onClick={() => openExternal(social.href)}
                  aria-label={social.label}
                  className="p-2 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in animation-delay-300 mt-8 md:mt-0 md:justify-self-start lg:justify-self-center w-full">
            <div className="relative w-[60%] sm:w-[48%] md:w-full max-w-[240px] sm:max-w-[260px] md:max-w-[260px] lg:max-w-[290px] mx-auto md:ml-0 md:mr-auto lg:mx-auto">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-primary/10 blur-3xl animate-pulse" />
              <div className="relative rounded-2xl p-px bg-gradient-to-br from-primary/40 via-border/40 to-primary/20 shadow-[0_0_40px_-10px_rgba(32,178,166,0.35)]">
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-full aspect-[4/5] object-cover object-top rounded-2xl bg-[#0f1418]"
                />

                {profile.available && (
                  <div className="absolute -bottom-2 -right-2 glass rounded-md px-2 py-1 animate-float">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[9px] sm:text-[10px] font-medium">
                        {profile.availableLabel || "Available for work"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="absolute -top-2 -left-2 glass rounded-md px-2 py-1 animate-float animation-delay-500">
                  <div className="text-sm font-bold text-primary leading-tight">
                    {profile.yearsExperience}
                  </div>
                  <div className="text-[8px] sm:text-[9px] text-muted-foreground leading-tight">
                    Years Exp.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="skills"
          className="mt-12 md:mt-14 scroll-mt-24 animate-fade-in animation-delay-600"
        >
          <p className="text-sm text-muted-foreground mb-6 text-center">Technologies I work with</p>
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
            <div className="flex animate-marquee w-max">
              {[...profile.skills, ...profile.skills].map((skill, idx) => (
                <div key={idx} className="flex-shrink-0 px-8 py-4">
                  <span className="text-xl font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Toggle button — only one visible at a time */}
          {!skillsExpanded && (
            <div className="mt-10 flex justify-center animate-fade-in animation-delay-800">
              <button
                type="button"
                onClick={handleScrollClick}
                aria-label="Show all technologies"
                aria-expanded={skillsExpanded}
                className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer p-3 -m-3"
              >
                <span className="text-xs tracking-wider">View More</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
              </button>
            </div>
          )}

          {/* Expanded full technologies list */}
          {skillsExpanded && (
            <div id="skills-list" className="mt-10 scroll-mt-24 animate-fade-in">
              <div className="glass rounded-2xl p-6 sm:p-8">
                <div className="mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-center">
                    Technologies I Work With
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allTechnologies.map((tech) => (
                    <div
                      key={tech}
                      className="px-4 py-3 rounded-lg bg-secondary/40 border border-border/40 text-sm text-foreground/90 hover:border-primary/50 hover:text-primary transition-colors text-center"
                    >
                      {tech}
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setSkillsExpanded(false)}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-2"
                  >
                    Show Less <ChevronUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
