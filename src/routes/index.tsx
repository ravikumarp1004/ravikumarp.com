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
          "Portfolio of Ravi Kumar P, a CCM Consultant specializing in OpenText Exstream, enterprise customer communications, AI workflow orchestration, RAG solutions, and cloud-native environments.",
      },
      {
        property: "og:title",
        content: "Ravi Kumar P | CCM Consultant & Cloud-Native Solutions",
      },
      {
        property: "og:description",
        content:
          "Explore Ravi Kumar P's portfolio featuring OpenText Exstream, enterprise CCM support, AI workflow orchestration, RAG-powered assistant, cloud-native solutions, certifications, and projects.",
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
