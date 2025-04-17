import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/Button";
import { AlertTriangle, Check, X, Info } from "lucide-react";
import SoftPanel from "../components/SoftPanel";
import { useConfirmStore } from "../stores";

/**
 * ConfirmDialog - A global confirmation dialog component using Zustand store
 *
 * Uses the useConfirmStore for state management
 * This component should only be mounted once, usually in your App component or layout
 *
 * @returns {JSX.Element|null}
 */
const ConfirmDialog = () => {
  // Get state and actions from the store
  const { isOpen, options, confirm, cancel } = useConfirmStore();

  const {
    title = "Confirm Action",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    icon = "warning",
    confirmColor = "teal",
  } = options;

  // Return null if dialog is not open
  if (!isOpen) return null;

  // Animation variants for the modal
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.1,
        delay: 0.05,
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.1 } },
  };

  // Map icon name to JSX element
  const getIcon = () => {
    switch (icon) {
      case "warning":
        return <AlertTriangle size={24} className="text-amber-500" />;
      case "danger":
        return <AlertTriangle size={24} className="text-red-500" />;
      case "success":
        return <Check size={24} className="text-teal-600" />;
      case "info":
        return <Info size={24} className="text-blue-500" />;
      default:
        return null;
    }
  };

  // Map color name to Tailwind classes
  const getConfirmButtonClasses = () => {
    switch (confirmColor) {
      case "red":
        return "bg-red-500/60 hover:bg-red-600/80 text-white";
      case "yellow":
        return "bg-yellow-500/60 hover:bg-yellow-600/80 text-white";
      case "teal":
      default:
        return "bg-teal-600/60 hover:bg-teal-700/80 text-white";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
        >
          <motion.div
            className="relative w-full max-w-md mx-4"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <SoftPanel className="p-6 overflow-hidden shadow-lg">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center space-x-3">
                  {getIcon()}
                  <h3 className="text-lg font-semibold text-stone-700">{title}</h3>
                </div>

                {/* Content */}
                <div className="py-2 text-stone-700">
                  {message}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    className="bg-stone-50/40 hover:bg-stone-50/80 px-4 py-2 rounded-sm flex items-center justify-center text-stone-700"
                    onClick={cancel}
                  >
                    <X size={16} className="mr-2" /> {cancelText}
                  </Button>
                  <Button
                    className={`${getConfirmButtonClasses()} px-4 py-2 rounded-sm flex items-center justify-center text-stone-700 hover:text-stone-50 font-semibold`}
                    onClick={confirm}
                  >
                    <Check size={16} className="mr-2" /> {confirmText}
                  </Button>
                </div>
              </div>
            </SoftPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
