"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";

const PUBLIC_LINKS = [
  { name: "Overview", path: "/overview" }, // ✅ changed from "/"
  { name: "Report", path: "/report" },
  { name: "About", path: "/about" },
  { name: "Models", path: "/models" },
];

const PRIVATE_LINKS = [
  { name: "Dataset", path: "/dataset-preview" },
  { name: "Train Model", path: "/train" },
  { name: "User", path: "/user" },
];

const ADMIN_LINKS = [{ name: "Admin", path: "/admin" }];

export default function MobileNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { user, loadingUser, refreshUser } = useCurrentUser();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });

    await refreshUser();
    window.dispatchEvent(new Event("auth-changed"));

    setOpen(false);
    router.replace("/");
  };

  if (loadingUser) return null;

  const finalLinks = [
    ...PUBLIC_LINKS,
    ...(user ? PRIVATE_LINKS : []),
    ...(user?.role === "admin" ? ADMIN_LINKS : []),
  ];

  return (
    <>
      {/* TOP BAR */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 border-b border-border bg-card/90 backdrop-blur-lg sticky top-0 z-50">
        <Link
          href="/"
          className="text-lg font-bold text-accent flex gap-0.5 items-center justify-center"
        >
          Ether
          <span className="bg-accent text-background px-0.5 rounded-sm">
            ML
          </span>
        </Link>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="p-2 rounded-md border border-border"
          aria-label="Open mobile menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* FULL SCREEN MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="
              fixed inset-0
              z-9999
              bg-background/95
              backdrop-blur-xl
              flex flex-col
              pt-[60px]
            "
          >
            <nav className="flex flex-col gap-2 px-6">
              {finalLinks.map((link) => {
                const isActive = pathname === link.path;

                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-lg text-lg text-center font-medium transition-all ${
                      isActive
                        ? "bg-accent text-primary-foreground"
                        : "text-foreground/80 hover:bg-accent/20"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* THEME + AUTH BELOW LINKS */}
            <div className="mt-8 flex flex-col items-center gap-4 border-t border-border pt-6 px-6">
              <ThemeToggle onSelect={() => setOpen(false)} />

              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-xs px-4 py-2 rounded-full border border-border hover:bg-accent/10"
                >
                  Logout
                </button>
              ) : (
                <div className="flex gap-3 text-xs">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-full border border-border hover:bg-accent/10"
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-full bg-accent text-background hover:opacity-90"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
