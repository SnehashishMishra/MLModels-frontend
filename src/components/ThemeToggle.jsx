"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Sun, Moon, MonitorCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function ThemeToggle({ onSelect }) {
  const { theme, setTheme, systemTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    position: "top",
  });

  const ref = useRef(null);
  const btnRef = useRef(null);
  const holdTimer = useRef(null);

  useEffect(() => setMounted(true), []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  const themes = [
    { name: "light", icon: <Sun size={16} /> },
    { name: "dark", icon: <Moon size={16} /> },
    { name: "system", icon: <MonitorCheck size={16} /> },
  ];

  const currentIcon =
    themes.find((t) => t.name === theme)?.icon ||
    themes.find((t) => t.name === currentTheme)?.icon;

  /* ✅ SMART TOOLTIP POSITION */
  const setTooltipPosition = () => {
    if (!btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const showBelow = rect.top < 80;

    // Clamp inside viewport
    const safeLeft = Math.min(
      Math.max(rect.left + rect.width / 2, 60),
      window.innerWidth - 60
    );

    setCoords({
      top: showBelow ? rect.bottom + 12 : rect.top - 12,
      left: safeLeft,
      position: showBelow ? "bottom" : "top",
    });

    setShowTooltip(true);
  };

  // DESKTOP
  const handleMouseEnter = () => setTooltipPosition();
  const handleMouseLeave = () => setShowTooltip(false);

  // MOBILE — long press
  const handleTouchStart = () => {
    holdTimer.current = setTimeout(() => {
      setTooltipPosition();
    }, 350); // ✅ Faster / better UX
  };

  const handleTouchEnd = () => {
    clearTimeout(holdTimer.current);
    setShowTooltip(false);
  };

  const handleSelect = (value) => {
    setTheme(value);
    setOpen(false);

    // ✅ CLOSE HAMBURGER IF PROVIDED
    if (onSelect) onSelect();
  };

  return (
    <div ref={ref} className="relative">
      {/* MAIN BUTTON */}
      <button
        ref={btnRef}
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="
          w-10 h-10 sm:w-9 sm:h-9
          flex items-center justify-center
          rounded-full
          border border-border
          bg-card text-foreground
          hover:bg-accent hover:text-background
          transition-all duration-300
          cursor-pointer
        "
      >
        <AnimatePresence mode="wait">
          {theme === "system" ? (
            <motion.span
              key="system"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center"
            >
              {currentIcon}
            </motion.span>
          ) : (
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -180, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              whileHover={{ rotate: 20, scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="flex items-center justify-center"
            >
              {currentIcon}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* ✅ PREMIUM TOOLTIP */}
      {showTooltip &&
        createPortal(
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="
              fixed px-3 py-1 rounded-md
              text-xs font-semibold
              bg-black text-white
              shadow-2xl z-9999
              pointer-events-none
              whitespace-nowrap
            "
            style={{
              top: coords.top + "px",
              left: coords.left + "px",
              transform:
                coords.position === "bottom"
                  ? "translate(-50%, 0%)"
                  : "translate(-50%, -100%)",
            }}
          >
            Theme:{" "}
            {theme === "system"
              ? `System (${currentTheme})`
              : theme.charAt(0).toUpperCase() + theme.slice(1)}
          </motion.div>,
          document.body
        )}

      {/* DROPDOWN */}
      <div
        className={`
          absolute right-0 mt-2 w-36
          max-w-[90vw]
          rounded-lg border border-border
          bg-card shadow-lg backdrop-blur-md
          transition-all duration-200 origin-top-right
          ${
            open
              ? "scale-100 opacity-100 translate-y-0 pointer-events-auto"
              : "scale-95 opacity-0 -translate-y-2 pointer-events-none"
          }
        `}
      >
        {themes.map((item) => (
          <button
            key={item.name}
            onClick={() => handleSelect(item.name)}
            className={`
              flex items-center gap-2 w-full
              px-3 py-2 text-sm rounded-md
              transition cursor-pointer
              hover:bg-accent hover:text-background
              ${
                theme === item.name
                  ? "text-primary font-semibold"
                  : "text-foreground"
              }
            `}
          >
            {item.icon}
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
