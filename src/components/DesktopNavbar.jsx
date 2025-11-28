"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import useCurrentUser from "@/hooks/useCurrentUser";

const PUBLIC_LINKS = [
  { name: "Overview", path: "/overview" }, // ✅ changed from "/"
  { name: "About", path: "/about" },
  { name: "Models", path: "/models" },
];

const PRIVATE_LINKS = [
  { name: "User", path: "/user" },
  { name: "Dataset", path: "/dataset-preview" },
  { name: "Train Model", path: "/train" },
];

const ADMIN_LINKS = [{ name: "Admin", path: "/admin" }];

export default function DesktopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loadingUser } = useCurrentUser();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    window.dispatchEvent(new Event("auth-changed"));
    router.replace("/");
  };

  if (loadingUser) return null;

  const finalLinks = [
    ...PUBLIC_LINKS,
    ...(user ? PRIVATE_LINKS : []),
    ...(user?.role === "admin" ? ADMIN_LINKS : []),
  ];

  return (
    <header className="hidden md:block sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="text-lg font-bold tracking-wide text-accent whitespace-nowrap flex gap-0.5 items-center justify-center"
        >
          Ether
          <span className="bg-accent text-background px-0.5 rounded-sm">
            ML
          </span>
        </Link>

        {/* NAV LINKS */}
        <nav className="relative flex items-center gap-6">
          {finalLinks.map((link) => {
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.path}
                href={link.path}
                className="relative py-1 text-sm font-medium text-foreground/80 hover:text-accent transition"
              >
                {link.name}

                {isActive && (
                  <motion.span
                    layoutId="navbar-underline"
                    className="absolute left-0 -bottom-1 h-0.5 w-full bg-accent rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* THEME + AUTH */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1 rounded-full border border-border hover:bg-accent/10 transition cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <Link
                href="/login"
                className="px-3 py-1 rounded-full border border-border hover:bg-accent/10 transition"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="px-3 py-1 rounded-full bg-accent text-background hover:opacity-90 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
