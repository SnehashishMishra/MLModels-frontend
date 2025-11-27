"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function PulseOnView({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          setVisible(true);

          // ✅ Auto hide after 3 seconds
          setTimeout(() => {
            setShow(false);
          }, 3000);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [visible]);

  if (!show) return null;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ scale: 1 }}
      animate={
        visible
          ? {
              scale: [1, 1.05, 1],
            }
          : {}
      }
      transition={{
        repeat: visible ? Infinity : 0,
        duration: 0.8,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
