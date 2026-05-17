import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../layout/Navbar";
import { Footer } from "../layout/Footer";
import { Hero } from "../sections/Hero";
import { About } from "../sections/About";
import { Projects } from "../sections/Projects";
import { Experience } from "../sections/Experience";
import { Education } from "../sections/Education";
import { Certifications } from "../sections/Certifications";
import { Contact } from "../sections/Contact";
import { ChatbotWidget } from "../components/ChatbotWidget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Ravi Kumar P",
      },
      {
        name: "description",
        content:
          "Portfolio of Ravi Kumar P, a CCM Engineer specialising in OpenText Exstream, platform upgrades, cloud-native CCM environments, AI workflow orchestration, and RAG-based systems.",
      },
      {
        property: "og:title",
        content: "Ravi Kumar P | CCM Engineer | AI Workflow Orchestration & Cloud-Native",
      },
      {
        property: "og:description",
        content:
          "Portfolio of Ravi Kumar P, a CCM Engineer specialising in OpenText Exstream, cloud-native platform support, AI workflow orchestration, and RAG-based automation systems.",
      },
      {
        property: "og:image",
        content: "https://ravikumarp.com/favicon.svg",
      },
      {
        property: "og:url",
        content: "https://ravikumarp.com",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),

  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Education />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
