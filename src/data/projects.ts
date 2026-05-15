export interface Project {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export const featuredProjects: Project[] = [
  {
    title: "Contact Message Form",
    description:
      "An AI-powered contact automation workflow built with n8n. It captures user messages from a portfolio contact form, classifies the intent using LLM automation, stores records in Airtable, sends Gmail notifications, generates a professional reply, and updates the response back in Airtable.",
    image: "/projects/contact-message-form.jpg",
    techStack: ["n8n", "LLM Automation", "Airtable", "Email Orchestration", "Workflow Processing"],
    githubUrl: "https://github.com/ravikumarp1004/Contact-Message-Form",
  },
  {
    title: "Portfolio RAG Chatbot",
    description:
      "An AI-powered portfolio assistant built using Retrieval-Augmented Generation (RAG). It intelligently processes user queries, retrieves relevant context from a vector database (Pinecone), and generates accurate, context-aware responses in real time through LLM-driven AI orchestration and vector search.",
    image: "/projects/portfolio-rag-chatbot.jpg",
    techStack: [
      "n8n",
      "RAG",
      "LLM",
      "Pinecone",
      "Vector Search",
      "AI Orchestration",
      "Context Retrieval",
    ],
    githubUrl: "https://github.com/ravikumarp1004/Portfolio-RAG-Chatbot",
  },
  {
    title: "Exstream Cloud-Native Workflows",
    description:
      "A professional enterprise CCM architecture repository documenting OpenText Exstream workflows, communication lifecycle processing, cloud-native orchestration, Empower interactive document creation, fulfillment processing, template lifecycle management, PDF/AFP output generation, and multi-cloud communication platforms across AWS, Azure, and GCP.",
    image: "/projects/exstream-cloud-native-workflows.jpg",
    techStack: [
      "OpenText Exstream",
      "CCM",
      "Empower",
      "Cloud Architecture",
      "AWS",
      "Azure",
      "GCP",
      "Document Composition",
      "PDF/AFP",
      "Enterprise Workflow",
    ],
    githubUrl: "https://github.com/ravikumarp1004/exstream-cloud-native-workflows",
  },
];

export const allProjects: Project[] = [...featuredProjects];
