import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin, useStats } from "@/hooks/useQueries";
import { storeSessionParameter } from "@/utils/urlParams";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  ChevronRight,
  FileText,
  GraduationCap,
  Images,
  KeyRound,
  Loader2,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

function AdminSetupForm() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { actor } = useActor();
  const { identity, login } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError("Please enter the admin token.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (!actor) {
        setError("Not connected. Please log in first.");
        setLoading(false);
        return;
      }
      // Store token so it persists in session and is used on next actor init
      storeSessionParameter("caffeineAdminToken", token.trim());
      // Re-initialize access control with the provided token
      await actor._initializeAccessControlWithSecret(token.trim());
      // Invalidate all queries so isAdmin re-fetches
      await queryClient.invalidateQueries();
      await queryClient.refetchQueries();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initialize. The token may be incorrect.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="dark-card rounded-2xl border border-[oklch(0.862_0.196_91.7/0.3)] p-8 space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-[oklch(0.862_0.196_91.7/0.1)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center mx-auto mb-4">
              <KeyRound className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gold-gradient">
              Admin Setup
            </h1>
            <p className="text-muted-foreground font-body text-sm mt-2">
              Enter the Caffeine admin token to claim admin privileges.
            </p>
          </div>

          {!identity ? (
            <div className="space-y-4" data-ocid="admin.error_state">
              <p className="text-muted-foreground font-body text-sm text-center">
                You must be logged in to claim admin access.
              </p>
              <Button
                onClick={login}
                data-ocid="admin.login.button"
                className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-heading font-bold h-12"
              >
                Login First
              </Button>
            </div>
          ) : (
            <form onSubmit={handleClaim} className="space-y-4">
              <div>
                <Label className="text-foreground text-sm font-body mb-1 block">
                  Admin Token
                </Label>
                <Input
                  data-ocid="admin.token.input"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your Caffeine admin token"
                  className="bg-[oklch(0.1_0_0)] border-[oklch(0.862_0.196_91.7/0.3)] focus:border-primary text-foreground placeholder:text-muted-foreground h-12"
                  autoFocus
                />
              </div>
              {error && (
                <p
                  className="text-destructive text-sm font-body"
                  data-ocid="admin.token.error_state"
                >
                  {error}
                </p>
              )}
              <Button
                type="submit"
                data-ocid="admin.token.submit_button"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-heading font-bold h-12"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying…
                  </>
                ) : (
                  "Claim Admin Access"
                )}
              </Button>
              <p className="text-muted-foreground/60 text-xs font-body text-center">
                The admin token is provided in your Caffeine project dashboard.
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </main>
  );
}

export default function AdminPage() {
  const { data: stats, isLoading } = useStats();
  const { data: isAdmin } = useIsAdmin();

  if (isAdmin === undefined) {
    return (
      <main
        className="min-h-screen pt-24 pb-16 flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary/60 mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground font-body text-sm tracking-wide">
            Verifying admin access…
          </p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return <AdminSetupForm />;
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
      ocid: "admin.faculty.link",
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
