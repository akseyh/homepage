export interface Project {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  url?: string;
  repo?: string;
  status: "live" | "in progress" | "archived";
  period: string;
  role: string;
}

export const projects: Project[] = [
  {
    name: "Gezerken Al",
    tagline: "Travel price comparison across flights, hotels, and experiences.",
    description:
      "A travel discovery platform that pulls live prices from several providers and shows them side by side in a single currency. Google sign-in, saved travel plans, multi-currency conversion, and an admin panel for content and provider sync — designed, built, and deployed end to end.",
    stack: [
      "Nuxt 4",
      "Nitro",
      "Vue 3",
      "Prisma",
      "PostgreSQL",
      "Supabase",
      "Netlify",
    ],
    url: "https://gezerkenal.com",
    status: "live",
    period: "2026",
    role: "Solo — design, full-stack, deployment",
  },
];
