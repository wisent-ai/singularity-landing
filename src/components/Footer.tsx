import site from "@/content/site.json";
import type { SiteContent } from "@/content/types";

const content = site as SiteContent;

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <p>
          {content.product} — {content.description}
        </p>
        <nav aria-label="Footer">
          {content.footer.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
