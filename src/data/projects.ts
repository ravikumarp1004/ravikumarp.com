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
    "A production-ready AI-powered Inventory Management System built using n8n workflow automation, Google Sheets, API integrations, and AI orchestration. It manages inventory operations through a modern web dashboard integrated with an AI Assistant that performs real-time inventory actions using natural language commands. The app automatically synchronizes frontend inventory data with Google Sheets and enables intelligent operations such as product updates, inventory analytics, stock management, product deletion, and audit tracking.",
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
    "Google Sheets",
    "API Integration",
    "AI Orchestration",
    "OpenAI",
    "React",
    "Inventory Automation",
    "Workflow Automation",
  ],
  liveUrl: "https://paint-inventory-ai-hub.lovable.app",
  githubUrl: "https://github.com/ravikumarp1004/Inventory-Management-System",
};

const contactMessageForm: Project = {
  title: "Contact Message Form",
  description:
    "An AI-powered contact automation workflow built with n8n. It captures user messages from a portfolio contact form, classifies the intent using LLM automation, stores records in Airtable, sends Gmail notifications, generates a professional reply, and updates the response back in Airtable.",
  image: "/projects/contact-message-form.jpg",
  techStack: ["n8n", "LLM Automation", "Airtable", "Email Orchestration", "Workflow Processing"],
  githubUrl: "https://github.com/ravikumarp1004/Contact-Message-Form",
};

const portfolioRagChatbot: Project = {
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
};

const exstreamCloudNative: Project = {
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
