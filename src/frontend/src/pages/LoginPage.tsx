import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Shield, Smartphone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SiGoogle } from "react-icons/si";

export default function LoginPage() {
  const { login, isLoggingIn, isLoginSuccess, isLoginError, loginError } =
    useInternetIdentity();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"mobile" | "google" | null>(
    null,
  );

  // Redirect to admin panel on successful login
  if (isLoginSuccess) {
    navigate({ to: "/admin" });
  }

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length === 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate OTP verification → trigger real II login
    login();
  };

  const handleGoogleLogin = () => {
    setLoginMethod("google");
    login();
  };

  const inputClass =
    "bg-[oklch(0.1_0_0)] border-[oklch(0.862_0.196_91.7/0.3)] focus:border-primary text-foreground placeholder:text-muted-foreground text-base h-12";

  return (
    <main className="min-h-screen pt-20 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[oklch(0.06_0_0)]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.862 0.196 91.7 / 0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[oklch(0.862_0.196_91.7/0.5)] gold-glow mx-auto mb-4">
            <img
              src="/assets/generated/gabbar-logo-transparent.dim_300x300.png"
              alt="Gabbar Classes"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-display font-bold text-gold-gradient">
            GABBAR CLASSES 2.0
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            Sign in to access your learning portal
          </p>
        </div>

        {/* Card */}
        <div className="dark-card rounded-2xl border border-[oklch(0.862_0.196_91.7/0.3)] p-8 space-y-6">
          {/* Error */}
          {isLoginError && (
            <div
              data-ocid="login.error_state"
              className="bg-destructive/10 border border-destructive/40 rounded-lg p-3 text-destructive text-sm font-body"
            >
              {loginError?.message || "Login failed. Please try again."}
            </div>
          )}

          {/* Mobile Login */}
          <div>
            <button
              type="button"
              className="flex items-center gap-3 mb-4 cursor-pointer w-full text-left"
              onClick={() =>
                setLoginMethod(loginMethod === "mobile" ? null : "mobile")
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  setLoginMethod(loginMethod === "mobile" ? null : "mobile");
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-[oklch(0.862_0.196_91.7/0.15)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <p className="text-foreground font-heading font-semibold">
                Login with Mobile
              </p>
            </button>

            {loginMethod === "mobile" && !otpSent && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                onSubmit={handleSendOtp}
                className="space-y-3"
              >
                <div>
                  <Label className="text-foreground text-sm font-body">
                    Mobile Number
                  </Label>
                  <Input
                    data-ocid="login.mobile.input"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter 10-digit mobile"
                    className={inputClass}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  data-ocid="login.mobile.submit_button"
                  className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-heading font-bold h-12"
                >
                  Send OTP
                </Button>
              </motion.form>
            )}

            {loginMethod === "mobile" && otpSent && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                onSubmit={handleVerifyOtp}
                className="space-y-3"
              >
                <div>
                  <Label className="text-foreground text-sm font-body">
                    Enter OTP
                  </Label>
                  <Input
                    data-ocid="login.otp.input"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit OTP"
                    className={inputClass}
                    maxLength={6}
                    autoFocus
                  />
                </div>
                <p className="text-muted-foreground text-xs font-body">
                  OTP sent to +91 {mobile}
                </p>
                <Button
                  type="submit"
                  data-ocid="login.mobile.submit_button"
                  disabled={isLoggingIn}
                  className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-heading font-bold h-12"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                      Verifying...
                    </>
                  ) : (
                    "Verify & Login"
                  )}
                </Button>
              </motion.form>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[oklch(0.25_0.02_91.7)]" />
            <span className="text-muted-foreground text-xs font-body">or</span>
            <div className="flex-1 h-px bg-[oklch(0.25_0.02_91.7)]" />
          </div>

          {/* Google Login */}
          <Button
            data-ocid="login.google.button"
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            variant="outline"
            className="w-full border-[oklch(0.862_0.196_91.7/0.4)] text-foreground hover:bg-[oklch(0.862_0.196_91.7/0.1)] hover:border-primary h-12 font-heading font-semibold"
          >
            {isLoggingIn && loginMethod === "google" ? (
              <Loader2 className="h-5 w-5 mr-3 animate-spin text-primary" />
            ) : (
              <SiGoogle className="h-5 w-5 mr-3 text-primary" />
            )}
            Login with Google / Internet Identity
          </Button>

          <p className="text-muted-foreground/60 text-xs font-body text-center">
            Authentication is secured via Internet Identity (ICP)
          </p>
        </div>

        {/* Security note */}
        <div className="mt-4 flex items-center gap-2 justify-center">
          <Shield className="h-3.5 w-3.5 text-primary/50" />
          <p className="text-muted-foreground/50 text-xs font-body">
            Secured by Internet Computer Protocol
          </p>
        </div>
      </motion.div>
    </main>
  );
}
