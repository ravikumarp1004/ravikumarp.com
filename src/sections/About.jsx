import { FileText, Cloud, Workflow, Users } from "lucide-react";

const highlights = [
  {
    icon: FileText,
    title: "Enterprise CCM Support",
    description:
      "Working on real-world customer communication systems and ensuring they run reliably.",
  },
  {
    icon: Cloud,
    title: "Cloud-Native Environments",
    description: "Supporting CCM platforms across AWS, Azure, and GCP environments.",
  },
  {
    icon: Workflow,
    title: "Incident & Issue Resolution",
    description: "Resolving incidents and workflow issues through SM9, Jira, and ServiceNow for enterprise Exstream environments.",
  },
  {
    icon: Users,
    title: "Continuous Learning",
    description:
      "Continuously improving across Exstream, cloud platforms, and AI automation-building real workflows using n8n, LLM integration, and RAG-based systems.",
  },
];

export const About = () => {
  return (
    <section id="about" className="py-5 md:py-8 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="animate-fade-in">
              <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase">
                About Me
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in animation-delay-100 text-secondary-foreground">
              Supporting enterprise
              <span className="font-serif italic font-normal text-white"> communication.</span>
            </h2>

            <div className="space-y-4 text-muted-foreground animate-fade-in animation-delay-200">
              <p>
                CCM Engineer with 4+ years at OpenText, specialising in Exstream server-based and cloud-native platform support across AWS, Azure, and GCP.
              </p>
              <p>
                I manage platform upgrades, patching, incident resolution, and workflow troubleshooting for enterprise clients-maintaining high availability of Exstream environments and handling incidents through SM9, Jira, and ServiceNow.
              </p>
              <p>
                Certified AWS Cloud Practitioner with hands-on exposure to multi-cloud CCM environments and modernisation projects.
              </p>
              <p>
                Outside my core role, I build AI-powered automation workflows using n8n, LLM integration, and RAG-based systems-applying modern tooling to real problems.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 glow-border animate-fade-in animation-delay-300">
              <p className="text-lg font-medium italic text-foreground">
                "Building reliability into systems, one solution at a time."
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {highlights.map((item, idx) => (
              <div
                key={item.title}
                className="glass p-6 rounded-2xl animate-fade-in"
                style={{ animationDelay: `${(idx + 1) * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
