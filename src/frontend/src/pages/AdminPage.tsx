import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin, useStats } from "@/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CalendarDays,
  ChevronRight,
  FileText,
  GraduationCap,
  Images,
  Loader2,
  LogIn,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

function NotAdminView() {
  const { identity, login } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [claiming, setClaiming] = useState(false);
  const [claimFailed, setClaimFailed] = useState(false);
  const [claimSucceeded, setClaimSucceeded] = useState(false);

  useEffect(() => {
    if (!identity || !actor) return;
    setClaiming(true);
    actor
      .claimFirstAdmin()
      .then((success) => {
        if (success) {
          // Invalidate all queries so isAdmin re-fetches with fresh data
          queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
          queryClient.refetchQueries({ queryKey: ["isAdmin"] });
          setClaimSucceeded(true);
          setClaiming(false);
        } else {
          setClaiming(false);
          setClaimFailed(true);
        }
      })
      .catch(() => {
        setClaiming(false);
        setClaimFailed(true);
      });
  }, [identity, actor, queryClient]);

  if (!identity) {
    return (
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md text-center"
        >
          <div className="dark-card rounded-2xl border border-[oklch(0.862_0.196_91.7/0.3)] p-8 space-y-6">
            <div className="w-14 h-14 rounded-full bg-[oklch(0.862_0.196_91.7/0.1)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center mx-auto">
              <LogIn className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-gold-gradient">
                Login Required
              </h1>
              <p className="text-muted-foreground font-body text-sm mt-2">
                Admin panel ke liye pehle login karein.
              </p>
            </div>
            <Button
              onClick={login}
              data-ocid="admin.login.button"
              className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-heading font-bold h-12"
            >
              Login with Internet Identity
            </Button>
          </div>
        </motion.div>
      </main>
    );
  }

  if (claiming || claimSucceeded) {
    return (
      <main
        className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4"
        data-ocid="admin.claiming.loading_state"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[oklch(0.862_0.196_91.7/0.1)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <h2 className="text-xl font-display font-bold text-gold-gradient mb-2">
            Admin Access Set Ho Raha Hai...
          </h2>
          <p className="text-muted-foreground font-body text-sm">
            Bas ek second, admin panel khul raha hai.
          </p>
        </motion.div>
      </main>
    );
  }

  if (claimFailed) {
    return (
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md text-center"
          data-ocid="admin.claim.error_state"
        >
          <div className="dark-card rounded-2xl border border-[oklch(0.862_0.196_91.7/0.3)] p-8 space-y-6">
            <div className="w-14 h-14 rounded-full bg-amber-950/40 border border-amber-700/50 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-7 w-7 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-gold-gradient">
                Admin Access Unavailable
              </h1>
              <p className="text-muted-foreground font-body text-sm mt-3 leading-relaxed">
                Admin access pahle hi kisi ne le liya hai. Sirf pehla login
                karne wala admin ban sakta hai.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[oklch(0.862_0.196_91.7/0.05)] border border-[oklch(0.862_0.196_91.7/0.15)]">
              <p className="text-xs font-body text-muted-foreground">
                Agar aap hi app ke owner hain to please app creator se contact
                karein.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  return null;
}

export default function AdminPage() {
  const { data: stats, isLoading } = useStats();
  const {
    data: isAdmin,
    isLoading: isAdminLoading,
    isFetching: isAdminFetching,
  } = useIsAdmin();
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  // Show loading only when actor is ready but admin check is in progress
  const showLoading =
    (actorFetching || isAdminLoading || isAdminFetching) &&
    !!identity &&
    !!actor;

  if (showLoading) {
    return (
      <main
        className="min-h-screen pt-24 pb-16 flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary/60 mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground font-body text-sm tracking-wide">
            Admin access verify ho raha hai...
          </p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return <NotAdminView />;
  }

  const STAT_CARDS = [
    {
      label: "Faculty Members",
      value: stats ? Number(stats.facultyCount) : "—",
      icon: Users,
      color: "text-amber-400",
      bg: "bg-amber-950/30",
    },
    {
      label: "Gallery Photos",
      value: stats ? Number(stats.galleryCount) : "—",
      icon: Images,
      color: "text-blue-400",
      bg: "bg-blue-950/30",
    },
    {
      label: "Content Items",
      value: stats ? Number(stats.contentCount) : "—",
      icon: FileText,
      color: "text-rose-400",
      bg: "bg-rose-950/30",
    },
    {
      label: "Active Batches",
      value: stats ? Number(stats.batchCount) : "—",
      icon: CalendarDays,
      color: "text-emerald-400",
      bg: "bg-emerald-950/30",
    },
    {
      label: "Inquiries",
      value: stats ? Number(stats.inquiryCount) : "—",
      icon: MessageSquare,
      color: "text-purple-400",
      bg: "bg-purple-950/30",
    },
  ];

  const QUICK_LINKS = [
    {
      label: "Manage Faculty",
      path: "/faculty",
      icon: Users,
      ocid: "admin.faculty.link",
    },
    {
      label: "Manage Gallery",
      path: "/gallery",
      icon: Images,
      ocid: "admin.gallery.link",
    },
    {
      label: "Manage Batches",
      path: "/batches",
      icon: CalendarDays,
      ocid: "admin.batches.link",
    },
    {
      label: "View Inquiries",
      path: "/admin/inquiries",
      icon: MessageSquare,
      ocid: "admin.inquiries.link",
    },
    {
      label: "Class Content",
      path: "/library",
      icon: GraduationCap,
      ocid: "admin.library.link",
    },
  ];

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="w-12 h-12 rounded-full bg-[oklch(0.862_0.196_91.7/0.15)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-primary/70 font-body text-xs tracking-widest uppercase">
              Admin
            </p>
            <h1 className="text-3xl font-display font-bold text-gold-gradient">
              Dashboard
            </h1>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {STAT_CARDS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="dark-card rounded-xl p-5 border border-[oklch(0.25_0.02_91.7)] hover:border-[oklch(0.862_0.196_91.7/0.4)] transition-colors"
            >
              {isLoading ? (
                <Skeleton
                  className="h-20 bg-[oklch(0.18_0_0)]"
                  data-ocid="admin.stats.loading_state"
                />
              ) : (
                <>
                  <div
                    className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}
                  >
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-display font-bold text-gold-gradient">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground text-xs font-body mt-1">
                    {stat.label}
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-display font-bold text-gold-gradient section-heading mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_LINKS.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  to={link.path}
                  data-ocid={link.ocid}
                  className="flex items-center gap-4 p-5 dark-card rounded-xl border border-[oklch(0.25_0.02_91.7)] hover:border-[oklch(0.862_0.196_91.7/0.6)] hover:shadow-gold-sm transition-all duration-300 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[oklch(0.862_0.196_91.7/0.1)] border border-[oklch(0.862_0.196_91.7/0.3)] flex items-center justify-center flex-shrink-0 group-hover:bg-[oklch(0.862_0.196_91.7/0.2)] transition-colors">
                    <link.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-foreground font-heading font-semibold group-hover:text-primary transition-colors flex-1">
                    {link.label}
                  </p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
