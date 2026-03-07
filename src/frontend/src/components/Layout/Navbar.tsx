import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin } from "@/hooks/useQueries";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronDown, GraduationCap, Menu, Shield, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const CLASS_LEVELS = [
  { label: "Nursery", path: "/classes/Nursery" },
  { label: "Class 1", path: "/classes/Class1" },
  { label: "Class 2", path: "/classes/Class2" },
  { label: "Class 3", path: "/classes/Class3" },
  { label: "Class 4", path: "/classes/Class4" },
  { label: "Class 5", path: "/classes/Class5" },
  { label: "Class 6", path: "/classes/Class6" },
  { label: "Class 7", path: "/classes/Class7" },
  { label: "Class 8", path: "/classes/Class8" },
];

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Faculty", path: "/faculty" },
  { label: "Library", path: "/library" },
  { label: "Gallery", path: "/gallery" },
  { label: "Batches", path: "/batches" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { identity, login, clear } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black-base/95 backdrop-blur-md border-b border-[oklch(0.25_0.02_91.7)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[oklch(0.862_0.196_91.7/0.5)] gold-glow-sm">
              <img
                src="/assets/generated/gabbar-logo-transparent.dim_300x300.png"
                alt="Gabbar Classes"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-gold-gradient font-heading font-bold text-sm leading-tight">
                GABBAR CLASSES
              </p>
              <p className="text-[oklch(0.862_0.196_91.7/0.7)] text-[10px] font-body tracking-wider">
                2.0 · CBSE BOARD
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                className={`px-3 py-2 text-sm font-body rounded-md transition-all duration-200 ${
                  isActive(link.path)
                    ? "text-primary bg-[oklch(0.862_0.196_91.7/0.1)]"
                    : "text-muted-foreground hover:text-primary hover:bg-[oklch(0.862_0.196_91.7/0.05)]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Classes Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  data-ocid="nav.classes.dropdown_menu"
                  className="flex items-center gap-1 px-3 py-2 text-sm font-body text-muted-foreground hover:text-primary rounded-md transition-all duration-200 hover:bg-[oklch(0.862_0.196_91.7/0.05)]"
                >
                  Classes <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-[oklch(0.13_0_0)] border-[oklch(0.25_0.02_91.7)] w-40"
                align="center"
              >
                {CLASS_LEVELS.map((cls) => (
                  <DropdownMenuItem key={cls.path} asChild>
                    <Link
                      to={cls.path}
                      className="text-foreground hover:text-primary hover:bg-[oklch(0.862_0.196_91.7/0.1)] cursor-pointer"
                    >
                      <GraduationCap className="h-3 w-3 mr-2 text-primary" />
                      {cls.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {isAdmin && (
              <Link
                to="/admin"
                data-ocid="nav.admin.link"
                className="flex items-center gap-1 px-3 py-2 text-sm font-body text-primary/80 hover:text-primary rounded-md transition-colors"
              >
                <Shield className="h-3 w-3" /> Admin
              </Link>
            )}
          </div>

          {/* Auth Button */}
          <div className="hidden lg:flex items-center gap-2">
            {identity ? (
              <Button
                onClick={clear}
                data-ocid="nav.login.button"
                size="sm"
                className="bg-[oklch(0.18_0_0)] text-primary border border-[oklch(0.862_0.196_91.7/0.4)] hover:bg-[oklch(0.862_0.196_91.7/0.15)] hover:border-primary"
                variant="outline"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={login}
                data-ocid="nav.login.button"
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-gold-light font-heading font-semibold"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lg:hidden text-foreground p-2 rounded-md hover:bg-[oklch(0.18_0_0)]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-[oklch(0.25_0.02_91.7)] py-3"
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    data-ocid={`nav.${link.label.toLowerCase()}.link`}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2.5 text-sm font-body rounded-md transition-colors ${
                      isActive(link.path)
                        ? "text-primary bg-[oklch(0.862_0.196_91.7/0.1)]"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="px-4 py-1">
                  <p className="text-xs text-muted-foreground font-body mb-1">
                    Classes
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    {CLASS_LEVELS.map((cls) => (
                      <Link
                        key={cls.path}
                        to={cls.path}
                        onClick={() => setMobileOpen(false)}
                        className="px-2 py-1.5 text-xs text-primary/80 hover:text-primary bg-[oklch(0.13_0_0)] rounded border border-[oklch(0.25_0.02_91.7)] text-center"
                      >
                        {cls.label}
                      </Link>
                    ))}
                  </div>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    data-ocid="nav.admin.link"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary font-body"
                  >
                    <Shield className="h-4 w-4" /> Admin Panel
                  </Link>
                )}
                <div className="px-4 pt-2">
                  {identity ? (
                    <Button
                      onClick={() => {
                        clear();
                        setMobileOpen(false);
                      }}
                      data-ocid="nav.login.button"
                      className="w-full border border-[oklch(0.862_0.196_91.7/0.4)] text-primary bg-transparent"
                      variant="outline"
                      size="sm"
                    >
                      Logout
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        login();
                        setMobileOpen(false);
                      }}
                      data-ocid="nav.login.button"
                      className="w-full bg-primary text-primary-foreground font-heading font-semibold"
                      size="sm"
                    >
                      Login
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
