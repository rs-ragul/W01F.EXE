import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://w01fexe.vercel.app";
const SITE_NAME = "w0lf.exe";
const ORGANIZATION_NAME = "w0lf.exe";
const DEFAULT_TITLE = "w0lf.exe | Engineering • Cybersecurity • Hackathons • Tech Events";
const DEFAULT_DESCRIPTION =
  "w0lf.exe is a multidisciplinary team exploring cybersecurity, engineering, hackathons, software development, research, and hands-on innovation.";
const KEYWORDS =
  "cybersecurity, engineering, hackathons, tech events, software development, CTF, capture the flag, red team, blue team, penetration testing, reverse engineering, digital forensics, security research, bug bounty, exploit development, open source, innovation, w0lf.exe";
const SOCIAL_IMAGE = `${SITE_URL}/social-preview.png`;
const LOGO_URL = `${SITE_URL}/favicon-512x512.png`;

const routeMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  "/projects": {
    title: "Projects | w0lf.exe",
    description:
      "Explore w0lf.exe projects spanning cybersecurity, engineering, software development, research, hackathons, and technical experimentation.",
  },
  "/achievements": {
    title: "Achievements | w0lf.exe",
    description:
      "Track w0lf.exe achievements across CTFs, hackathons, tech events, security research, and engineering competitions.",
  },
  "/members": {
    title: "Members | w0lf.exe",
    description:
      "Meet the builders, researchers, and problem-solvers behind w0lf.exe.",
  },
  "/auth": {
    title: "Member Login | w0lf.exe",
    description: "Secure member access for the w0lf.exe Cybersecurity Team dashboard.",
  },
};

function setMeta(selector: string, attribute: "content" | "href", value: string) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

function canonicalPath(pathname: string) {
  if (pathname === "/") return SITE_URL;
  return `${SITE_URL}${pathname.replace(/\/$/, "")}`;
}

export function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = routeMeta[pathname] ?? {
      title: `${SITE_NAME} | Cybersecurity Research`,
      description: DEFAULT_DESCRIPTION,
    };
    const canonical = canonicalPath(pathname);

    document.documentElement.lang = "en";
    document.title = meta.title;

    setMeta('meta[name="description"]', "content", meta.description);
    setMeta('meta[name="keywords"]', "content", KEYWORDS);
    setMeta('meta[property="og:title"]', "content", meta.title);
    setMeta('meta[property="og:description"]', "content", meta.description);
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[property="og:image"]', "content", SOCIAL_IMAGE);
    setMeta('meta[property="og:site_name"]', "content", SITE_NAME);
    setMeta('meta[name="twitter:title"]', "content", meta.title);
    setMeta('meta[name="twitter:description"]', "content", meta.description);
    setMeta('meta[name="twitter:image"]', "content", SOCIAL_IMAGE);
    setMeta('link[rel="canonical"]', "href", canonical);

    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: SITE_URL,
      logo: LOGO_URL,
      sameAs: [
        "https://github.com/w0lfexe",
        "https://www.linkedin.com/company/w0lfexe",
        "https://x.com/w0lfexe",
      ],
      description: DEFAULT_DESCRIPTION,
      keywords: KEYWORDS,
      additionalType: "Organization",
      slogan: "Building, researching, and competing across engineering and cybersecurity.",
    };

    const schemaNode = document.getElementById("organization-schema");
    if (schemaNode) schemaNode.textContent = JSON.stringify(schema);
  }, [pathname]);

  return null;
}
