export interface EducationProject {
  title: string;
  description: string;
  documentUrl?: string;
}

export interface EducationExtra {
  type: "paper" | "certificate";
  label: string;
  documentUrl?: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
  externalUrl?: string;
  publishedPaperUrl?: string;
  certificateUrl?: string;
  projects: EducationProject[];
  extras: EducationExtra[];
}

export const education: EducationItem[] = [
  {
    school: "REVA University",
    degree: "B.Tech, Electronics and Communication Engineering",
    period: "Aug 2017 to Jul 2021",
    externalUrl: "https://www.reva.edu.in/",
    publishedPaperUrl: "/documents/ICECIM-2021-Defence-Entrance-Security-Framework.pdf",
    certificateUrl: "/documents/Certificate-of-Appreciation-ICECIM-2021.jpg",
    projects: [
      {
        title: "ATM for Visually Impaired People",
        description:
          "Pre-final year project: an accessible ATM interface designed to help users with visual impairment, low vision, and low literacy interact with electronic banking machines.",
      },
      {
        title: "Defence Entrance Security Framework",
        description:
          "Final year project: a 24/7 surveillance and access control system for armed forces operations. Research published at the ICECIM Conference 2021.",
      },
    ],
    extras: [
      {
        type: "paper",
        label: "Published paper, ICECIM 2021: Defence Entrance Security Framework",
        documentUrl: "/documents/ICECIM-2021-Defence-Entrance-Security-Framework.pdf",
      },
      {
        type: "certificate",
        label: "Certificate of Appreciation, School of Electronics & Communication Engineering",
        documentUrl: "/documents/Certificate-of-Appreciation-ICECIM-2021.jpg",
      },
    ],
  },
  {
    school: "Presidency College, Bengaluru",
    degree: "Pre-University, Physics, Chemistry, Mathematics & Electronics",
    period: "Jun 2015 to May 2017",
    externalUrl: "https://www.presidencycollege.ac.in/",
    projects: [],
    extras: [],
  },
];
