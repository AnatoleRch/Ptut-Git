import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import H2 from "../../components/H2";
import SoftPanel from "../../components/SoftPanel";
import { useStore } from "../../stores";
import Button from "../../components/Button";
import {
  AlertTriangle,
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Tag,
  Check,
  X,
  Bookmark,
  List,
} from "lucide-react";
import H2light from "../../components/SectionHeader";

const System = () => {
  const { codes = {}, setCodes, departments = {} } = useStore();
  const [view, setView] = useState("main"); // main, list, create, edit
  const [codeEditMode, setCodeEditmode] = useState(null);

  // State for new code form
  const [newCode, setNewCode] = useState({
    name: "",
    color: "#ffffff",
    description: "",
    departments: [],
  });

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.1 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.1 } },
  };

  const handleAddCode = () => {
    const { name, color, description, departments } = newCode;

    if (!name.trim()) return alert("Code name is required");

    setCodes({
      ...codes,
      [name]: {
        color,
        description,
        departments,
      },
    });

    // Reset form
    setNewCode({
      name: "",
      color: "#ffffff",
      description: "",
      departments: [],
    });

    setCodeEditmode(null);
    setView("list");
  };

  const handleDepartmentToggle = (dept) => {
    const currentDepts = [...newCode.departments];

    if (currentDepts.includes(dept)) {
      // Remove department if already selected
      setNewCode({
        ...newCode,
        departments: currentDepts.filter((d) => d !== dept),
      });
    } else {
      // Add department if not selected
      setNewCode({
        ...newCode,
        departments: [...currentDepts, dept],
      });
    }
  };

  const resetForm = () => {
    setNewCode({
      name: "",
      color: "#ffffff",
      description: "",
      departments: [],
    });
    setCodeEditmode(null);
  };

  return (
    <div>
      <Header>System Reports</Header>

      <AnimatePresence mode="wait">

      </AnimatePresence>
    </div>
  );
};

export default System;
