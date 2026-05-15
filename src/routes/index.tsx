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
      { title: "Ravi Kumar P" },
      {
        name: "description",
        content:
          "Portfolio of Ravi Kumar — software engineer specializing in React, Next.js, and TypeScript. Building scalable, performant web applications.",
      },
      { property: "og:title", content: "Ravi Kumar — Software Engineer" },
      {
        property: "og:description",
        content:
          "Crafting digital experiences with precision. React, Next.js, TypeScript specialist.",
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
