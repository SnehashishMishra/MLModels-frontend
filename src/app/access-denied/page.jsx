"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function AccessDenied() {
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
          className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/20"
        >
          <ShieldAlert className="w-9 h-9 text-accent" />
        </motion.div>

        {/* TITLE */}
        <h1
          className="
            text-2xl sm:text-3xl font-bold
            text-accent
          "
        >
          Access Denied
        </h1>

        {/* MESSAGE */}
        <p className="text-sm text-muted leading-relaxed max-w-sm">
          {!user ? (
            <>
              You are not logged in. Please log in or create an account to
              access this page.
            </>
          ) : (
            <>
              You are logged in as:
              <br />
              <span className="font-semibold text-accent block mt-1">
                {user.email}
              </span>
              <br />
              <span className="flex items-center justify-center gap-1">
                <Lock size={14} />
                This page is restricted to <b>ADMIN</b> users only.
              </span>
            </>
          )}
        </p>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-4 justify-center">
          {!user && (
            <>
              <Link
                href="/login"
                className="
                  px-6 py-2
                  bg-accent text-background
                  rounded-full
                  font-semibold text-sm
                  hover:opacity-90
                  transition
                "
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="
                  px-6 py-2
                  border border-border
                  rounded-full
                  font-semibold text-sm
                  hover:bg-accent/10
                  transition
                "
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Always show back button */}
          <Link
            href="/"
            className="
              px-6 py-2
              border border-accent/40
              rounded-full
              text-accent
              text-sm
              flex items-center gap-2
              hover:bg-accent/10
              transition
            "
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
