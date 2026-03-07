import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { motion } from "motion/react";

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary/70 font-body text-sm tracking-widest uppercase mb-3">
            Reach Us
          </p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-gold-gradient section-heading section-heading-center">
            Contact Us
          </h1>
          <p className="text-muted-foreground font-body mt-6 max-w-xl mx-auto">
            We're here to help. Reach out to us for admissions, queries, or any
            information about our classes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Cards */}
          <div className="space-y-5">
            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="dark-card rounded-2xl p-6 border border-[oklch(0.862_0.196_91.7/0.3)] hover:border-primary transition-all duration-300 hover:shadow-gold-sm group"
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-[oklch(0.862_0.196_91.7/0.15)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-primary/70 font-body text-xs uppercase tracking-wider mb-1">
                    Phone
                  </p>
                  <a
                    href="tel:8709397378"
                    data-ocid="contact.phone.link"
                    className="text-2xl font-display font-bold text-gold-gradient hover:text-primary transition-colors"
                  >
                    8709397378
                  </a>
                  <p className="text-muted-foreground font-body text-sm mt-1">
                    Call us for admissions and inquiries
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="dark-card rounded-2xl p-6 border border-[oklch(0.862_0.196_91.7/0.3)] hover:border-primary transition-all duration-300 hover:shadow-gold-sm group"
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-[oklch(0.862_0.196_91.7/0.15)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-primary/70 font-body text-xs uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:sinharajkamal2810@gmail.com"
                    data-ocid="contact.email.link"
                    className="text-lg font-heading font-bold text-gold-gradient hover:text-primary transition-colors break-all"
                  >
                    sinharajkamal2810@gmail.com
                  </a>
                  <p className="text-muted-foreground font-body text-sm mt-1">
                    Send us your queries anytime
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="dark-card rounded-2xl p-6 border border-[oklch(0.862_0.196_91.7/0.3)] hover:border-primary transition-all duration-300 hover:shadow-gold-sm group"
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-[oklch(0.862_0.196_91.7/0.15)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-primary/70 font-body text-xs uppercase tracking-wider mb-1">
                    Address
                  </p>
                  <p className="text-foreground font-heading font-semibold leading-relaxed">
                    Shanti Nagar, DSP Kothi
                  </p>
                  <p className="text-foreground font-body">
                    Naya Bazar, Sherghati
                  </p>
                  <p className="text-primary font-body">Gaya, Bihar</p>
                </div>
              </div>
            </motion.div>

            {/* Timings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="dark-card rounded-2xl p-6 border border-[oklch(0.25_0.02_91.7)] hover:border-[oklch(0.862_0.196_91.7/0.4)] transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-[oklch(0.18_0_0)] border border-[oklch(0.25_0.02_91.7)] flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary/70" />
                </div>
                <div>
                  <p className="text-primary/70 font-body text-xs uppercase tracking-wider mb-2">
                    Class Timings
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground font-body text-sm">
                        Morning:
                      </span>
                      <span className="text-foreground font-body text-sm">
                        6:00 AM – 9:00 AM
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground font-body text-sm">
                        Evening:
                      </span>
                      <span className="text-foreground font-body text-sm">
                        4:00 PM – 7:00 PM
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground font-body text-sm">
                        Days:
                      </span>
                      <span className="text-foreground font-body text-sm">
                        Monday – Saturday
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Map Placeholder + Message CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            {/* Map Placeholder */}
            <div className="dark-card rounded-2xl border border-[oklch(0.25_0.02_91.7)] overflow-hidden">
              <div className="h-64 relative bg-gradient-to-br from-[oklch(0.13_0.005_91.7)] to-[oklch(0.1_0_0)] flex flex-col items-center justify-center">
                {/* Grid pattern */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(oklch(0.862 0.196 91.7 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.862 0.196 91.7 / 0.3) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
                <MapPin className="h-12 w-12 text-primary mb-3 animate-float" />
                <p className="text-primary font-heading font-bold text-lg">
                  Gabbar Classes 2.0
                </p>
                <p className="text-muted-foreground font-body text-sm mt-1 text-center px-4">
                  Shanti Nagar, Naya Bazar, Sherghati, Gaya, Bihar
                </p>
                <a
                  href="https://maps.google.com/?q=Sherghati,Gaya,Bihar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-4 py-2 bg-[oklch(0.862_0.196_91.7/0.15)] border border-[oklch(0.862_0.196_91.7/0.4)] rounded-lg text-primary text-sm font-body hover:bg-[oklch(0.862_0.196_91.7/0.25)] transition-colors"
                >
                  Open in Maps
                </a>
              </div>
            </div>

            {/* Quick Contact CTA */}
            <div className="dark-card rounded-2xl p-8 border border-[oklch(0.862_0.196_91.7/0.3)] text-center">
              <div className="w-14 h-14 rounded-full bg-[oklch(0.862_0.196_91.7/0.15)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold text-gold-gradient mb-2">
                Ready to Enroll?
              </h3>
              <p className="text-muted-foreground font-body text-sm mb-6">
                Call or WhatsApp us directly at 8709397378 for instant
                assistance.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="tel:8709397378"
                  className="w-full py-3 bg-primary text-primary-foreground font-heading font-bold rounded-lg hover:bg-gold-light transition-colors text-center"
                >
                  Call Now
                </a>
                <a
                  href="https://wa.me/918709397378"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 border border-[oklch(0.862_0.196_91.7/0.4)] text-primary font-heading font-semibold rounded-lg hover:bg-[oklch(0.862_0.196_91.7/0.1)] transition-colors text-center"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
