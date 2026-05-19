export interface Project {
  title: string;
  description: string;
  url?: string;
  github?: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    title: "Project Alpha",
    description:
      "A full-stack web application built with modern tooling. Features real-time collaboration and a clean, responsive interface.",
    url: "https://example.com",
    github: "https://github.com/username/project-alpha",
    tags: ["TypeScript", "React", "Node.js", "PostgreSQL"],
  },
  {
    title: "Project Beta",
    description:
      "An open-source CLI tool that automates development workflows. Written in Rust for maximum performance.",
    github: "https://github.com/username/project-beta",
    tags: ["Rust", "CLI"],
  },
  {
    title: "Project Gamma",
    description:
      "A mobile-first design system with accessible components. Used across multiple production applications.",
    url: "https://example.com/gamma",
    tags: ["CSS", "Storybook", "Accessibility"],
  },
  {
    title: "Project Delta",
    description:
      "Data pipeline and analytics dashboard processing millions of events per day. Built for scalability.",
    tags: ["Python", "Apache Kafka", "React", "D3.js"],
  },
];
