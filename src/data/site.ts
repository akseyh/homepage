export const site = {
  name: "Şems Yılmaz",
  shortName: "sems",
  url: "https://semsyilmaz.com",
  title: "semsyilmaz.com",
  role: "Full-Stack Engineer",
  email: "yilmazsems@gmail.com",
  description:
    "Full-stack engineer focused on backend systems, distributed data, and cloud infrastructure.",
  locale: "en_US",
  twitter: "@akseyh",
} as const;

export interface Social {
  label: string;
  handle: string;
  href: string;
}

export const socials: Social[] = [
  { label: "github", handle: "github.com/akseyh", href: "https://github.com/akseyh" },
  { label: "twitter", handle: "x.com/akseyh", href: "https://x.com/akseyh" },
  { label: "linkedin", handle: "linkedin.com/in/akseyh", href: "https://www.linkedin.com/in/akseyh" },
  { label: "youtube", handle: "youtube.com/@semsyilmaz", href: "https://www.youtube.com/@semsyilmaz" },
];

export const email: Social = {
  label: "email",
  handle: site.email,
  href: `mailto:${site.email}`,
};
