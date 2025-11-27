"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, CheckCircle } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function UserPage() {
  const { user, loadingUser } = useCurrentUser();

  if (loadingUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted animate-pulse text-sm">
          Loading user profile...
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4 sm:p-6"
    >
      <div className="glass rounded-2xl p-6 sm:p-10 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
          {/* Avatar */}
          <div
            className="
            flex items-center justify-center
            w-20 h-20 rounded-full
            bg-accent/20 text-accent
          "
          >
            <User size={36} />
          </div>

          {/* User Info */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-accent">
              {user.name}
            </h1>

            <p className="flex items-center gap-2 text-sm text-muted">
              <Mail size={14} /> {user.email}
            </p>

            {/* Role */}
            <div className="flex items-center gap-2 mt-1">
              <Shield size={14} className="text-accent" />
              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold 
                ${
                  user.role === "admin"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {user.role.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* USER ID CARD */}
          <div className="glass p-4 rounded-xl space-y-2">
            <p className="text-xs text-muted">User ID</p>
            <p className="text-sm break-all font-medium text-foreground">
              {user._id}
            </p>
          </div>

          {/* STATUS CARD */}
          <div className="glass p-4 rounded-xl space-y-2">
            <p className="text-xs text-muted">Status</p>

            <div className="flex items-center gap-2 text-sm text-emerald-400 font-semibold">
              <CheckCircle size={16} />
              Active account
            </div>
          </div>
        </div>

        {/* FOOTER NOTE */}
        <div className="pt-2 text-center text-xs text-muted">
          You can now access model training, dataset preview and advanced
          features based on your role.
        </div>
      </div>
    </motion.div>
  );
}
