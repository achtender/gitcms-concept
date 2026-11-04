export type NavItem = {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
};

export type NavColumn = {
  title: string;
  items: NavItem[];
};

export type SiteMeta = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
};
