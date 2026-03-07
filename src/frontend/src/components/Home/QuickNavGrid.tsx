import { Link } from "@tanstack/react-router";
import {
  Baby,
  BookOpen,
  Calculator,
  CalendarDays,
  FlaskConical,
  Globe,
  Images,
  Library,
  Lightbulb,
  Music,
  Palette,
  Pencil,
  Phone,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const CLASS_CARDS = [
  {
    level: "Nursery",
    icon: Baby,
    path: "/classes/Nursery",
    color: "from-rose-950/50 to-black-surface",
  },
  {
    level: "Class 1",
    icon: Star,
    path: "/classes/Class1",
    color: "from-amber-950/50 to-black-surface",
  },
  {
    level: "Class 2",
    icon: BookOpen,
    path: "/classes/Class2",
    color: "from-yellow-950/50 to-black-surface",
  },
  {
    level: "Class 3",
    icon: Pencil,
    path: "/classes/Class3",
    color: "from-orange-950/50 to-black-surface",
  },
  {
    level: "Class 4",
    icon: Lightbulb,
    path: "/classes/Class4",
    color: "from-lime-950/50 to-black-surface",
  },
  {
    level: "Class 5",
    icon: Globe,
    path: "/classes/Class5",
    color: "from-emerald-950/50 to-black-surface",
  },
  {
    level: "Class 6",
    icon: Calculator,
    path: "/classes/Class6",
    color: "from-cyan-950/50 to-black-surface",
  },
  {
    level: "Class 7",
    icon: FlaskConical,
    path: "/classes/Class7",
    color: "from-blue-950/50 to-black-surface",
  },
  {
    level: "Class 8",
    icon: Palette,
    path: "/classes/Class8",
    color: "from-violet-950/50 to-black-surface",
  },
];

const SECTION_CARDS = [
  {
    label: "Faculty",
    icon: Users,
    path: "/faculty",
    description: "Meet our expert teachers",
  },
  {
    label: "Gallery",
    icon: Images,
    path: "/gallery",
    description: "Photos from our institute",
  },
  {
    label: "Library",
    icon: Library,
    path: "/library",
    description: "Study materials & resources",
  },
  {
    label: "Batches",
    icon: CalendarDays,
    path: "/batches",
    description: "Schedule & admissions",
  },
  {
    label: "Contact",
    icon: Phone,
    path: "/contact",
    description: "Get in touch with us",
  },
];

export default function QuickNavGrid() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4">
      {/* Classes Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-display font-bold text-gold-gradient section-heading mb-8">
          Our Classes
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {CLASS_CARDS.map((card, i) => (
            <motion.div
              key={card.level}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to={card.path}
                data-ocid={`home.class_${card.level.toLowerCase().replace(/\s/g, "")}.card`}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-b ${card.color} border border-[oklch(0.862_0.196_91.7/0.2)] hover:border-[oklch(0.862_0.196_91.7/0.7)] hover:gold-glow transition-all duration-300 group cursor-pointer`}
              >
                <div className="w-10 h-10 rounded-full bg-[oklch(0.862_0.196_91.7/0.1)] flex items-center justify-center group-hover:bg-[oklch(0.862_0.196_91.7/0.2)] transition-colors">
                  <card.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xs font-body text-muted-foreground group-hover:text-primary text-center leading-tight transition-colors">
                  {card.level}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Explore Sections */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-16"
      >
        <h2 className="text-3xl font-display font-bold text-gold-gradient section-heading mb-8">
          Explore
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {SECTION_CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                to={card.path}
                className="flex flex-col items-center gap-3 p-5 rounded-xl dark-card gold-border-hover group"
              >
                <div className="w-12 h-12 rounded-full bg-[oklch(0.862_0.196_91.7/0.1)] border border-[oklch(0.862_0.196_91.7/0.3)] flex items-center justify-center group-hover:bg-[oklch(0.862_0.196_91.7/0.2)] transition-all group-hover:border-primary">
                  <card.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                    {card.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-body">
                    {card.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
