"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function NotFound() {
  const { user } = useCurrentUser();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        min-h-[80vh] 
        flex items-center justify-center 
        px-4 text-center
      "
    >
      <div
        className="
          glass
          p-6 sm:p-10
          rounded-2xl
          max-w-xl w-full
          flex flex-col gap-6
          items-center
        "
      >
        {/* ICON */}
        <motion.div
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="
            flex items-center justify-center
            w-16 h-16
            rounded-full
            bg-destructive/15
          "
        >
          <AlertTriangle className="w-9 h-9 text-destructive" />
        </motion.div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-accent">404 — Not Found</h1>

        {/* MESSAGE */}
        <p className="text-sm text-muted leading-relaxed max-w-sm">
          The page you’re trying to reach doesn’t exist, has been removed,
          renamed, or is temporarily unavailable.
          <br />
          {user ? (
            <span className="block mt-2">
              You are currently logged in as:
              <b className="text-accent ml-1">{user.email}</b>
            </span>
          ) : (
            <span className="block mt-2">You are not currently logged in.</span>
          )}
        </p>

        {/* ACTIONS */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            href="/"
            className="
              flex items-center gap-2
              px-6 py-2
              rounded-full
              bg-accent text-background
              font-semibold text-sm
              hover:opacity-90
              transition
            "
          >
            <Home size={14} />
            Go to Home
          </Link>

          <Link
            href="/models"
            className="
              px-6 py-2
              border border-accent/40
              rounded-full
              text-accent
              text-sm
              hover:bg-accent/10
              transition
            "
          >
            Explore Models
          </Link>

          <Link
            href=".."
            className="
              flex items-center gap-2
              px-6 py-2
              border border-border
              rounded-full
              text-foreground/70
              text-sm
              hover:bg-card
              transition
            "
          >
            <ArrowLeft size={14} />
            Go Back
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
