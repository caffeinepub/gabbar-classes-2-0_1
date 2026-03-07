import { Link } from "@tanstack/react-router";
import {
  Baby,
  BookOpen,
  Calculator,
  ClipboardList,
  FileText,
  FlaskConical,
  Globe,
  Lightbulb,
  MessageSquare,
  Palette,
  PenTool,
  Pencil,
  Star,
  Video,
} from "lucide-react";
import { motion } from "motion/react";

const CLASS_LIBRARY = [
  {
    level: "Nursery",
    path: "/classes/Nursery",
    icon: Baby,
    description: "Foundation learning materials",
  },
  {
    level: "Class 1",
    path: "/classes/Class1",
    icon: Star,
    description: "Beginning academics",
  },
  {
    level: "Class 2",
    path: "/classes/Class2",
    icon: BookOpen,
    description: "Core concepts",
  },
  {
    level: "Class 3",
    path: "/classes/Class3",
    icon: Pencil,
    description: "Advanced basics",
  },
  {
    level: "Class 4",
    path: "/classes/Class4",
    icon: Lightbulb,
    description: "Conceptual learning",
  },
  {
    level: "Class 5",
    path: "/classes/Class5",
    icon: Globe,
    description: "Expanding horizons",
  },
  {
    level: "Class 6",
    path: "/classes/Class6",
    icon: Calculator,
    description: "Secondary preparation",
  },
  {
    level: "Class 7",
    path: "/classes/Class7",
    icon: FlaskConical,
    description: "Advanced studies",
  },
  {
    level: "Class 8",
    path: "/classes/Class8",
    icon: Palette,
    description: "Board preparation",
  },
];

const CONTENT_TYPES = [
  {
    icon: FileText,
    label: "PDFs",
    description: "Downloadable study notes and books",
    color: "text-rose-400",
  },
  {
    icon: PenTool,
    label: "Worksheets",
    description: "Practice sheets and exercises",
    color: "text-amber-400",
  },
  {
    icon: MessageSquare,
    label: "Messages",
    description: "Important notices and updates",
    color: "text-emerald-400",
  },
  {
    icon: Video,
    label: "Videos",
    description: "Video lessons and tutorials",
    color: "text-blue-400",
  },
  {
    icon: ClipboardList,
    label: "Tests",
    description: "Practice tests and assessments",
    color: "text-purple-400",
  },
];

export default function LibraryPage() {
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
            Resources
          </p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-gold-gradient section-heading section-heading-center">
            Digital Library
          </h1>
          <p className="text-muted-foreground font-body mt-6 max-w-2xl mx-auto">
            Access PDFs, worksheets, videos, tests and messages for all classes.
          </p>
        </motion.div>

        {/* Content Type Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-16"
        >
          {CONTENT_TYPES.map((type) => (
            <div
              key={type.label}
              className="dark-card rounded-xl p-4 border border-[oklch(0.25_0.02_91.7)] flex flex-col items-center text-center hover:border-[oklch(0.862_0.196_91.7/0.4)] transition-colors"
            >
              <type.icon className={`h-7 w-7 ${type.color} mb-2`} />
              <p className="text-foreground font-heading font-semibold text-sm">
                {type.label}
              </p>
              <p className="text-muted-foreground/70 text-xs font-body mt-1 leading-tight">
                {type.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Classes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-display font-bold text-gold-gradient section-heading mb-8">
            Browse by Class
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CLASS_LIBRARY.map((cls, i) => (
              <motion.div
                key={cls.level}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  to={cls.path}
                  className="flex items-center gap-4 p-5 dark-card rounded-xl border border-[oklch(0.25_0.02_91.7)] hover:border-[oklch(0.862_0.196_91.7/0.7)] hover:shadow-gold-sm transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[oklch(0.862_0.196_91.7/0.1)] border border-[oklch(0.862_0.196_91.7/0.3)] flex items-center justify-center flex-shrink-0 group-hover:bg-[oklch(0.862_0.196_91.7/0.2)] transition-colors">
                    <cls.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-heading font-bold group-hover:text-primary transition-colors">
                      {cls.level}
                    </p>
                    <p className="text-muted-foreground text-sm font-body">
                      {cls.description}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-8 h-8 rounded-full border border-[oklch(0.25_0.02_91.7)] flex items-center justify-center group-hover:border-primary group-hover:bg-[oklch(0.862_0.196_91.7/0.1)] transition-all">
                      <BookOpen className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
