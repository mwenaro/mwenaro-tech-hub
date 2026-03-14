export interface NavLink {
  name: string;
  href: string;
  active?: string | boolean;
}

export const ecosystem = {
  hub: "https://mwenaro.com",
  academy: "https://academy.mwenaro.com",
  talent: "https://talent.mwenaro.com",
  labs: "https://labs.mwenaro.com",
};

export const SITE_LINKS: Record<string, NavLink[]> = {
  hub: [
    { name: "Home", href: "/", active: "hub" },
    { name: "Academy", href: ecosystem.academy },
    { name: "Talent", href: ecosystem.talent },
    { name: "Labs", href: ecosystem.labs },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ],
  talent: [
    { name: "Home", href: "/", active: "talent" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Hub", href: ecosystem.hub },
  ],
  labs: [
    { name: "Home", href: "/", active: "labs" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Hub", href: ecosystem.hub },
  ],
  academy: [
    { name: "Home", href: "/", active: "academy" },
    { name: "Courses", href: "/courses" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Hub", href: ecosystem.hub },
  ],
}