"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- VALIDATION ---------------- */

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getPasswordStrength = (password) => {
    if (password.length < 8) return "weak";
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return "strong";
    return "medium";
  };

  const isEmailValid = validateEmail(form.email);
  const isPasswordValid = form.password.length >= 8;
  const passwordStrength = getPasswordStrength(form.password);
  const isFormValid = isEmailValid && isPasswordValid;

  /* ---------------- SUBMIT ---------------- */

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isPasswordValid) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Invalid email or password");
      }

      window.dispatchEvent(new Event("auth-changed"));
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="
          w-full max-w-md
          glass p-6 sm:p-8
          rounded-2xl
          space-y-5
          border border-border
        "
      >
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-accent">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-muted">
            Log in to your dashboard
          </p>
        </div>

        {/* EMAIL */}
        <div className="space-y-1">
          <label className="text-xs text-muted ml-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`
              w-full px-4 py-3 rounded-lg bg-background text-sm
              focus:outline-none transition
              ${
                form.email && !isEmailValid
                  ? "border border-red-500"
                  : form.email && isEmailValid
                  ? "border border-emerald-500"
                  : "border border-border focus:border focus:border-accent"
              }
            `}
          />

          {form.email && !isEmailValid && (
            <p className="text-[11px] text-red-400 ml-1">
              Invalid email format
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="space-y-1 relative">
          <label className="text-xs text-muted ml-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={`
              w-full px-4 py-3 pr-10 rounded-lg bg-background text-sm
              focus:outline-none transition
              ${
                form.password && !isPasswordValid
                  ? "border border-red-500"
                  : form.password && isPasswordValid
                  ? "border border-emerald-500"
                  : "border border-border focus:border focus:border-accent"
              }
            `}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted hover:text-accent"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          {form.password && (
            <p
              className={`text-[11px] ml-1 ${
                passwordStrength === "weak"
                  ? "text-red-400"
                  : passwordStrength === "medium"
                  ? "text-yellow-400"
                  : "text-emerald-400"
              }`}
            >
              Password strength: {passwordStrength.toUpperCase()}
            </p>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-xs text-center"
          >
            {error}
          </motion.p>
        )}

        {/* BUTTON */}
        <motion.button
          whileHover={{ scale: isFormValid ? 1.03 : 1 }}
          whileTap={{ scale: isFormValid ? 0.95 : 1 }}
          disabled={loading || !isFormValid}
          className="
            w-full py-3 rounded-lg
            bg-accent text-primary-foreground
            font-semibold text-sm
            flex justify-center items-center gap-2
            cursor-pointer
            hover:bg-accent/80 transition
            disabled:opacity-40
            disabled:cursor-not-allowed
          "
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Login"}
        </motion.button>
      </motion.form>
    </div>
  );
}
