import React from "react";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

function SoftPanel({ className, children, onClick, shadow = true }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={twMerge(
        `border-2 border-teal-700/60 items-center p-4 space-y-1 space-x-1 bg-slate-50/80 rounded-sm ${
          shadow ? "shadow-2xl" : ""
        }`,
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

export default SoftPanel;
