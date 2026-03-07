import { Link } from "@tanstack/react-router";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";

const currentYear = new Date().getFullYear();

export default function Footer() {
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer className="bg-[oklch(0.07_0_0)] border-t border-[oklch(0.25_0.02_91.7)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[oklch(0.862_0.196_91.7/0.4)] gold-glow-sm">
                <img
                  src="/assets/generated/gabbar-logo-transparent.dim_300x300.png"
                  alt="Gabbar Classes"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-gold-gradient font-heading font-bold text-lg">
                  GABBAR CLASSES 2.0
                </p>
                <p className="text-[oklch(0.55_0_0)] text-xs font-body">
                  Excellence in Education | CBSE Board
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-body leading-relaxed max-w-sm">
              Nurturing young minds from Nursery to Class 8 with quality CBSE
              education. Under the guidance of Director Kamal Raj Sinha.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground font-body">
                CBSE Affiliated | Nursery – Class 8
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-primary font-heading font-semibold text-sm mb-4 tracking-wider uppercase">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              {[
                { label: "About Us", path: "/about" },
                { label: "Faculty", path: "/faculty" },
                { label: "Gallery", path: "/gallery" },
                { label: "Batches & Admission", path: "/batches" },
                { label: "Library", path: "/library" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-muted-foreground hover:text-primary text-sm font-body transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-primary font-heading font-semibold text-sm mb-4 tracking-wider uppercase">
              Contact
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href="tel:8709397378"
                data-ocid="contact.phone.link"
                className="flex items-start gap-2 text-muted-foreground hover:text-primary transition-colors group"
              >
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm font-body">8709397378</span>
              </a>
              <a
                href="mailto:sinharajkamal2810@gmail.com"
                data-ocid="contact.email.link"
                className="flex items-start gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm font-body break-all">
                  sinharajkamal2810@gmail.com
                </span>
              </a>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm font-body leading-relaxed">
                  Shanti Nagar, DSP Kothi
                  <br />
                  Naya Bazar, Sherghati
                  <br />
                  Gaya, Bihar
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[oklch(0.2_0_0)] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs font-body text-center">
            © {currentYear} GABBAR CLASSES 2.0. All rights reserved.
          </p>
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary text-xs font-body transition-colors"
          >
            Built with ♥ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
