import { Github, Linkedin, Mail } from "lucide-react";

export const socialLinks = [
  {
    icon: Mail,
    href: "mailto:ravi@ravikumarp.com",
    label: "Email",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/ravi-kumar-p1004",
    label: "LinkedIn",
  },
  {
    icon: Github,
    href: "https://github.com/ravikumarp1004",
    label: "Github",
  },
];

export const openExternal = (href: string) => {
  window.open(href, "_blank", "noopener,noreferrer");
};
