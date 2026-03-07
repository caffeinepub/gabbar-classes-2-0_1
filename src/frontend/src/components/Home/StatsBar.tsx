import { useStats } from "@/hooks/useQueries";
import { BookOpen, GraduationCap, Trophy, Users } from "lucide-react";
import { motion } from "motion/react";

const STATIC_STATS = [
  {
    icon: Users,
    label: "Students Enrolled",
    value: "500+",
    color: "text-primary",
  },
  { icon: GraduationCap, label: "Classes", value: "10", color: "text-primary" },
  {
    icon: BookOpen,
    label: "Study Materials",
    value: "200+",
    color: "text-primary",
  },
  {
    icon: Trophy,
    label: "Years of Excellence",
    value: "5+",
    color: "text-primary",
  },
];

export default function StatsBar() {
  const { data: stats } = useStats();

  const displayStats = [
    {
      icon: Users,
      label: "Students Enrolled",
      value: stats ? `${Number(stats.facultyCount) * 50}+` : "500+",
    },
    {
      icon: GraduationCap,
      label: "Classes Offered",
      value: "Nursery – 8",
    },
    {
      icon: BookOpen,
      label: "Study Materials",
      value: stats ? `${Number(stats.contentCount)}` : "200+",
    },
    {
      icon: Trophy,
      label: "Expert Faculty",
      value: stats ? `${Number(stats.facultyCount)}` : "10+",
    },
  ];

  return (
    <section className="py-12 bg-[oklch(0.1_0.005_91.7)] border-y border-[oklch(0.25_0.02_91.7)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-xl dark-card gold-border-hover"
            >
              <div className="w-12 h-12 rounded-full bg-[oklch(0.862_0.196_91.7/0.1)] flex items-center justify-center mb-3 border border-[oklch(0.862_0.196_91.7/0.3)]">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-gold-gradient">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-sm font-body mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { STATIC_STATS };
