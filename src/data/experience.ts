export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  description: string;
  techStack: string[];
  current: boolean;
  externalUrl?: string;
}

export const experiences: ExperienceItem[] = [
  {
    period: "Oct 2023 to Present",
    role: "Associate Cloud Applications Consultant",
    company: "OpenText",
    description:
      "Supporting OpenText Exstream environments across server-based and cloud-native deployments. Handling ServiceNow incidents, change requests, and problem tickets within agreed SLAs. Performing platform upgrades and patching, troubleshooting document composition and output workflows, and working hands-on with Exstream Designer and Empower. Continuously learning and improving on multi-cloud setups across AWS, Azure, and GCP.",
    techStack: [
      "OpenText Exstream",
      "Exstream Designer",
      "Exstream Empower",
      "Cloud-Native CCM",
      "AWS",
      "Azure",
      "GCP",
      "ServiceNow",
    ],
    current: true,
    externalUrl: "https://www.opentext.com/",
  },
  {
    period: "Sep 2021 to Oct 2023",
    role: "Junior Engineer",
    company: "Network Labs (India) Pvt Ltd",
    description:
      "Worked across the SDLC supporting enterprise networking and communication solutions. Contributed to deployments and integrations, applied analytical problem solving, and strengthened core networking fundamentals while supporting client-facing rollouts.",
    techStack: ["SDLC", "Networking", "Linux", "Troubleshooting", "Analytical Skills"],
    current: false,
  },
  {
    period: "Jun 2021 to Aug 2021",
    role: "Trainee",
    company: "Network Labs (India) Pvt Ltd",
    description:
      "Apprenticeship focused on hands-on support across networking and system workflows. Built a foundation in enterprise IT operations, gaining early production exposure under guidance.",
    techStack: ["Networking", "Workflows", "Analytical Skills", "Support"],
    current: false,
  },
  {
    period: "Jul 2019 to Aug 2019",
    role: "Student Intern",
    company: "Indian Tech Keys",
    description:
      "Short internship exploring how Embedded C and IoT can be used to build embedded systems for real-world applications. Contributed to small prototypes and learned product development fundamentals.",
    techStack: ["Embedded C", "IoT", "Embedded Systems", "Product Development"],
    current: false,
  },
];
