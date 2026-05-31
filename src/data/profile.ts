export interface Project {
  title: string;
  description: string;
  image: string;
  images?: string[];
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
}

const inventoryManagementSystem: Project = {
  title: "Inventory Management System",
  description:
    "A production-ready AI-powered Inventory Management System built using n8n, API integrations, and AI orchestration - reducing manual inventory operations from 90–120 minutes/week to under 15 minutes through natural language commands, real-time Google Sheets sync, and automatic audit logging.",
  image: "/projects/inventory/04-dashboard.png",
  images: [
    "/projects/inventory/01-workflow.png",
    "/projects/inventory/02-architecture.png",
    "/projects/inventory/03-loading.png",
    "/projects/inventory/04-dashboard.png",
    "/projects/inventory/05-assistant.png",
    "/projects/inventory/06-add.png",
    "/projects/inventory/07-sheet-added.png",
    "/projects/inventory/08-remove.png",
    "/projects/inventory/09-sheet-removed.png",
  ],
  techStack: [
    "n8n",
    "API Integration",
    "AI Orchestration",
    "LLM",
    "Inventory Processing",
    "Real-Time Sync",
  ],
  liveUrl: "https://paint-inventory-ai-hub.lovable.app",
  githubUrl: "https://github.com/ravikumarp1004/Inventory-Management-System",
};

const contactMessageForm: Project = {
  title: "Contact Message Form",
  description:
    "An AI-powered contact automation workflow built with n8n, LLM classification, Airtable, and Gmail - cutting manual response time from 12-24 hours to under 60 seconds by automatically classifying, logging, and replying to every inquiry with zero manual effort.",
  image: "/projects/contact-message-form.jpg",
  techStack: ["n8n", "LLM Automation", "API Integration", "Airtable", "Email Orchestration", "Workflow Processing"],
  githubUrl: "https://github.com/ravikumarp1004/Contact-Message-Form",
};

const portfolioRagChatbot: Project = {
  title: "Portfolio RAG Chatbot",
  description:
    "An AI-powered portfolio assistant built using Retrieval-Augmented Generation (RAG), Pinecone, and LLM orchestration - delivering context-aware answers in seconds by intelligently retrieving relevant information from a vector database in real time.",
  image: "/projects/portfolio-rag-chatbot.jpg",
  techStack: [
    "n8n",
    "RAG",
    "LLM",
    "API Integration",
    "Pinecone",
    "Vector Search",
    "AI Orchestration",
    "Context Retrieval",
  ],
  githubUrl: "https://github.com/ravikumarp1004/Portfolio-RAG-Chatbot",
};

const exstreamCloudNative: Project = {
  title: "Exstream Cloud-Native Workflows",
  description:
    "A professional enterprise CCM architecture repository documenting OpenText Exstream workflows across AWS, Azure, and GCP - capturing real-world process knowledge from hands-on production support experience, covering cloud-native orchestration, document composition, and PDF/AFP output generation.",
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
};

export const featuredProjects: Project[] = [
  inventoryManagementSystem,
  contactMessageForm,
  portfolioRagChatbot,
  exstreamCloudNative,
];

export const allProjects: Project[] = [
  inventoryManagementSystem,
  portfolioRagChatbot,
  contactMessageForm,
  exstreamCloudNative,
];
