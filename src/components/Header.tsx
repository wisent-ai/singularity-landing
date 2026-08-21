import Link from "next/link";

import PrimaryAction from "@/components/PrimaryAction";
import site from "@/content/site.json";
import type { SiteContent } from "@/content/types";

const content = site as SiteContent;

export default function Header() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link className="wordmark" href="/">
          {content.product}
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {content.nav.map((link) => (
            <a key={link.href} href={link.href} className="site-nav__optional">
              {link.label}
            </a>
          ))}
          <PrimaryAction action={content.primaryAction} variant="secondary" className="site-nav__cta" />
        </nav>
      </div>
    </header>
  );
}
