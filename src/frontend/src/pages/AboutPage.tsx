import { Badge } from "@/components/ui/badge";
import { Award, Eye, GraduationCap, MapPin, Target, User } from "lucide-react";
import { motion } from "motion/react";

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary/70 font-body text-sm tracking-widest uppercase mb-3">
            About Us
          </p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-gold-gradient section-heading section-heading-center">
            GABBAR CLASSES 2.0
          </h1>
          <p className="text-muted-foreground font-body mt-6 max-w-2xl mx-auto text-lg">
            A premier coaching institute nurturing young minds with quality CBSE
            education from Nursery to Class 8.
          </p>
        </motion.div>

        {/* Director Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="dark-card rounded-2xl p-8 border border-[oklch(0.862_0.196_91.7/0.3)] gold-glow mb-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Director Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[oklch(0.862_0.196_91.7/0.3)] to-[oklch(0.75_0.16_84/0.1)] border-4 border-[oklch(0.862_0.196_91.7/0.5)] flex items-center justify-center">
                <span className="text-primary font-display font-bold text-4xl">
                  KR
                </span>
              </div>
            </div>
            {/* Director Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <Badge className="bg-[oklch(0.862_0.196_91.7/0.15)] text-primary border border-[oklch(0.862_0.196_91.7/0.4)] text-xs">
                  <User className="h-3 w-3 mr-1" /> Director
                </Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-gold-gradient mb-2">
                Kamal Raj Sinha
              </h2>
              <p className="text-primary/70 font-body text-sm tracking-wider mb-4">
                FOUNDER & DIRECTOR · GABBAR CLASSES 2.0
              </p>
              <p className="text-muted-foreground font-body leading-relaxed">
                With years of dedicated teaching experience, Kamal Raj Sinha
                founded GABBAR CLASSES 2.0 with a vision to provide accessible,
                high-quality CBSE education in Sherghati, Gaya. His commitment
                to student excellence has shaped hundreds of young minds and
                continues to inspire the institute's mission every day.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="dark-card rounded-xl p-6 border border-[oklch(0.25_0.02_91.7)] hover:border-[oklch(0.862_0.196_91.7/0.4)] transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[oklch(0.862_0.196_91.7/0.15)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold text-primary">
                Our Mission
              </h3>
            </div>
            <p className="text-muted-foreground font-body leading-relaxed">
              To provide affordable, high-quality CBSE education to every child
              in Sherghati and surrounding areas. We believe every student
              deserves access to expert teaching, quality study materials, and a
              nurturing learning environment.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="dark-card rounded-xl p-6 border border-[oklch(0.25_0.02_91.7)] hover:border-[oklch(0.862_0.196_91.7/0.4)] transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[oklch(0.862_0.196_91.7/0.15)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold text-primary">
                Our Vision
              </h3>
            </div>
            <p className="text-muted-foreground font-body leading-relaxed">
              To be the most trusted coaching institute in Bihar, where students
              from Nursery to Class 8 build strong academic foundations. We
              envision a generation of confident, curious learners prepared for
              a bright future.
            </p>
          </motion.div>
        </div>

        {/* CBSE Affiliation + Institute Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="dark-card rounded-xl p-6 border border-[oklch(0.25_0.02_91.7)] flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[oklch(0.862_0.196_91.7/0.1)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center mb-4">
              <Award className="h-7 w-7 text-primary" />
            </div>
            <Badge className="bg-[oklch(0.862_0.196_91.7/0.15)] text-primary border border-[oklch(0.862_0.196_91.7/0.4)] mb-3 text-sm px-4 py-1">
              CBSE Affiliated
            </Badge>
            <p className="text-muted-foreground font-body text-sm">
              Following the Central Board of Secondary Education curriculum for
              all classes.
            </p>
          </div>

          <div className="dark-card rounded-xl p-6 border border-[oklch(0.25_0.02_91.7)] flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[oklch(0.862_0.196_91.7/0.1)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center mb-4">
              <GraduationCap className="h-7 w-7 text-primary" />
            </div>
            <p className="text-2xl font-display font-bold text-gold-gradient mb-1">
              Nursery – 8
            </p>
            <p className="text-muted-foreground font-body text-sm">
              Complete schooling from early childhood to primary level
              education.
            </p>
          </div>

          <div className="dark-card rounded-xl p-6 border border-[oklch(0.25_0.02_91.7)] flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[oklch(0.862_0.196_91.7/0.1)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center mb-4">
              <MapPin className="h-7 w-7 text-primary" />
            </div>
            <p className="text-primary font-heading font-semibold mb-1">
              Location
            </p>
            <p className="text-muted-foreground font-body text-sm text-center">
              Shanti Nagar, DSP Kothi
              <br />
              Naya Bazar, Sherghati
              <br />
              Gaya, Bihar
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
