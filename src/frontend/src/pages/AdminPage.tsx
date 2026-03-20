import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useStats } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  ChevronRight,
  FileText,
  GraduationCap,
  Images,
  Lock,
  MessageSquare,
  Shield,
  Users,
  Users2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function AdminPage() {
  const { isAdminAuthenticated, login, logout, changePassword } =
    useAdminAuth();
  const { data: stats, isLoading: statsLoading } = useStats();

  // Login form state
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Change password form state
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const ok = login(mobile, password);
    if (!ok) setLoginError("Mobile number ya password galat hai");
  }

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");
    if (newPwd.length < 6) {
      setPwdError("New password kam se kam 6 characters ka hona chahiye");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError("New password aur confirm password match nahi karte");
      return;
    }
    const ok = changePassword(currentPwd, newPwd);
    if (!ok) {
      setPwdError("Current password galat hai");
    } else {
      setPwdSuccess("Password successfully badal gaya!");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    }
  }

  // ── Admin Login Gate ──────────────────────────────────────────────────
  if (!isAdminAuthenticated) {
    return (
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="dark-card rounded-2xl border border-[oklch(0.862_0.196_91.7/0.3)] p-8 space-y-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[oklch(0.862_0.196_91.7/0.1)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-display font-bold text-gold-gradient">
                  Admin Login
                </h1>
                <p className="text-muted-foreground font-body text-sm mt-1">
                  Sirf authorized admin hi andar aa sakte hain
                </p>
              </div>
            </div>

            <form
              onSubmit={handleLogin}
              className="space-y-4"
              data-ocid="admin.login.modal"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="admin-mobile"
                  className="text-foreground font-body text-sm"
                >
                  Mobile Number
                </Label>
                <Input
                  id="admin-mobile"
                  type="tel"
                  placeholder="Mobile number daalen"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  data-ocid="admin.mobile.input"
                  className="bg-[oklch(0.13_0_0)] border-[oklch(0.25_0.02_91.7)] text-foreground focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="admin-password"
                  className="text-foreground font-body text-sm"
                >
                  Password
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Password daalen"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-ocid="admin.password.input"
                  className="bg-[oklch(0.13_0_0)] border-[oklch(0.25_0.02_91.7)] text-foreground focus:border-primary"
                  required
                />
              </div>

              {loginError && (
                <p
                  className="text-red-400 text-sm font-body"
                  data-ocid="admin.login.error_state"
                >
                  {loginError}
                </p>
              )}

              <Button
                type="submit"
                data-ocid="admin.login.submit_button"
                className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-heading font-bold h-12"
              >
                Admin Panel Kholen
              </Button>
            </form>
          </div>
        </motion.div>
      </main>
    );
  }

  // ── Full Admin Dashboard ──────────────────────────────────────────────
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
    {
      label: "Total Students",
      value: stats ? Number(stats.studentCount) : "—",
      icon: GraduationCap,
      color: "text-cyan-400",
      bg: "bg-cyan-950/30",
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
      label: "Manage Photos",
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
    {
      label: "Manage Students",
      path: "/admin/students",
      icon: Users2,
      ocid: "admin.students.link",
    },
  ];

  return (
    <main className="min-h-screen pt-24 pb-16" data-ocid="admin.panel">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center gap-4">
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
          </div>
          <Button
            onClick={logout}
            data-ocid="admin.logout.button"
            variant="outline"
            size="sm"
            className="border-[oklch(0.862_0.196_91.7/0.4)] text-primary bg-transparent hover:bg-[oklch(0.862_0.196_91.7/0.1)]"
          >
            Logout
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {STAT_CARDS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="dark-card rounded-xl p-5 border border-[oklch(0.25_0.02_91.7)] hover:border-[oklch(0.862_0.196_91.7/0.4)] transition-colors"
              data-ocid={`admin.stats.item.${i + 1}`}
            >
              <>
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-display font-bold text-gold-gradient">
                  {statsLoading ? "..." : stat.value}
                </p>
                <p className="text-muted-foreground text-xs font-body mt-1">
                  {stat.label}
                </p>
              </>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
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

        {/* Change Password Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="dark-card rounded-2xl border border-[oklch(0.862_0.196_91.7/0.2)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[oklch(0.862_0.196_91.7/0.1)] border border-[oklch(0.862_0.196_91.7/0.3)] flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-gold-gradient">
                  Password Badlein
                </h2>
                <p className="text-muted-foreground font-body text-xs">
                  Admin panel ka password yahan se badal sakte hain
                </p>
              </div>
            </div>

            <form
              onSubmit={handleChangePassword}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
              data-ocid="admin.change_password.panel"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="current-pwd"
                  className="text-foreground font-body text-sm"
                >
                  Current Password
                </Label>
                <Input
                  id="current-pwd"
                  type="password"
                  placeholder="Purana password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  data-ocid="admin.current_password.input"
                  className="bg-[oklch(0.13_0_0)] border-[oklch(0.25_0.02_91.7)] text-foreground focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="new-pwd"
                  className="text-foreground font-body text-sm"
                >
                  New Password
                </Label>
                <Input
                  id="new-pwd"
                  type="password"
                  placeholder="Naya password (min 6)"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  data-ocid="admin.new_password.input"
                  className="bg-[oklch(0.13_0_0)] border-[oklch(0.25_0.02_91.7)] text-foreground focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirm-pwd"
                  className="text-foreground font-body text-sm"
                >
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-pwd"
                  type="password"
                  placeholder="Password confirm karein"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  data-ocid="admin.confirm_password.input"
                  className="bg-[oklch(0.13_0_0)] border-[oklch(0.25_0.02_91.7)] text-foreground focus:border-primary"
                  required
                />
              </div>
              <div className="sm:col-span-3 flex flex-col gap-2">
                {pwdError && (
                  <p
                    className="text-red-400 text-sm font-body"
                    data-ocid="admin.change_password.error_state"
                  >
                    {pwdError}
                  </p>
                )}
                {pwdSuccess && (
                  <p
                    className="text-green-400 text-sm font-body"
                    data-ocid="admin.change_password.success_state"
                  >
                    {pwdSuccess}
                  </p>
                )}
                <Button
                  type="submit"
                  data-ocid="admin.change_password.submit_button"
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-gold-light font-heading font-semibold"
                >
                  Password Badlein
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
