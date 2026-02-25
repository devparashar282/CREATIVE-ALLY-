import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/internships", label: "Internships" },
  { href: "/contact", label: "Contact Us" }
];

const companyAddress = "Mirzamurad, 23 KM, Varanasi - Allahabad Rd, Uttar Pradesh 221307";
const mapQuery = encodeURIComponent(companyAddress);
const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <section className="footer-block">
          <h3 className="footer-title">Creative Ally</h3>
          <p className="small">
            Career-focused courses and internships with practical projects, mentorship, and certification support.
          </p>
          <a href={mapSearchUrl} target="_blank" rel="noreferrer" className="footer-link">
            Open Location in Google Maps
          </a>
        </section>

        <section className="footer-block">
          <h4 className="footer-heading">Quick Links</h4>
          <nav className="footer-links" aria-label="Footer quick links">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className="footer-link">
                {item.label}
              </Link>
            ))}
          </nav>
        </section>

        <section className="footer-block">
          <h4 className="footer-heading">Contact</h4>
          <a href="tel:+918084232902" className="footer-link">+91 8084232902</a>
          <a href="mailto:creativeally2811@gmail.com" className="footer-link">creativeally2811@gmail.com</a>
          <p className="small footer-address">{companyAddress}</p>
        </section>

        <section className="footer-block">
          <h4 className="footer-heading">Live Location</h4>
          <div className="footer-map-frame">
            <iframe
              src={mapEmbedUrl}
              title="Creative Ally Location Map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </div>

      <div className="site-footer-bottom">
        <div className="container small">
          {`Copyright ${currentYear} Creative Ally. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}
