import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import H2 from "../../components/H2";
import H3 from "../../components/H3";
import { useOrg, useStore } from "../../stores";
import H2light from "../../components/SectionHeader";
import SoftPanel from "../../components/SoftPanel";
import Button from "../../components/Button";
import BuildingsSection from "./comp/BuildingsSection";
import OrganisationInfoSection from "./comp/OrganisationInfoSection";
import DepartmentsSection from "./comp/DepartmentsSection";
import {
  Building2,
  ArrowLeft,
  Info,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import { subscribeToOrg } from "../../services/firebase/orgService";

function Organisation() {
  const [view, setView] = useState("main"); // main, info, buildings, departments
  const { orgId } = useStore();
  const { setOrg, setBuildings, setDepartments } = useOrg();

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.1 } },
  };

  useEffect(() => {
    if (!orgId) {
      return;
    }
    const unsubscribe = subscribeToOrg(orgId, (updatedOrg) => {
      setOrg(updatedOrg);
      setBuildings(updatedOrg.buildingsMap || {})
      setDepartments(updatedOrg.departmentsMap || {})
    });
    // unsubscribe on cleanup/page change
    return () => { unsubscribe(); };
  }, [orgId]);

  return (
    <div>
      <Header>Organisation Setup</Header>

      <AnimatePresence mode="wait">
        {view === "main" && (
          <motion.div
            key="main"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="space-y-4 sm:space-y-6 py-4 sm:py-6 max-w-[900px] justify-self-center w-full px-3 sm:px-0"
          >
            {/* Responsive grid - 1 column on small screens, 2 on medium, 3 on large */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <SoftPanel
                className="flex flex-col items-center justify-center p-4 md:p-8 cursor-pointer hover:bg-stone-50/80 transition-colors"
                onClick={() => setView("info")}
              >
                <Info size={36} className="text-teal-600 mb-3 md:mb-4" />
                <H2 className="text-center">Information</H2>
                <p className="text-stone-500 mt-2 text-center text-sm md:text-base">
                  View and edit organisation details
                </p>
              </SoftPanel>

              <SoftPanel
                className="flex flex-col items-center justify-center p-4 md:p-8 cursor-pointer hover:bg-stone-50/80 transition-colors"
                onClick={() => setView("buildings")}
              >
                <Building2 size={36} className="text-teal-600 mb-3 md:mb-4" />
                <H2>Buildings</H2>
                <p className="text-stone-500 mt-2 text-center text-sm md:text-base">
                  Manage buildings, floors and rooms
                </p>
              </SoftPanel>

              <SoftPanel
                className="flex flex-col items-center justify-center p-4 md:p-8 cursor-pointer hover:bg-stone-50/80 transition-colors col-span-1 md:col-span-2 lg:col-span-1 mx-auto md:mx-0 w-full"
                onClick={() => setView("departments")}
              >
                <Briefcase size={36} className="text-teal-600 mb-3 md:mb-4" />
                <H2>Departments</H2>
                <p className="text-stone-500 mt-2 text-center text-sm md:text-base">
                  Manage organisational departments
                </p>
              </SoftPanel>
            </div>
          </motion.div>
        )}

        {/* The info, buildings, and departments views also need responsive updates */}
        {view === "info" && (
          <motion.div
            key="info-view"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="space-y-4 sm:space-y-6 py-4 sm:py-6 max-w-[900px] justify-self-center w-full px-3 sm:px-0"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
              <H2light>Organisation Information</H2light>
              <Button
                className="bg-stone-50/40 hover:bg-stone-50/80 px-4 flex items-center justify-center w-full sm:w-auto"
                onClick={() => setView("main")}
              >
                <ArrowLeft size={16} className="mr-2" /> Back to Menu
              </Button>
            </div>

            <OrganisationInfoSection />
          </motion.div>
        )}

        {view === "buildings" && (
          <motion.div
            key="buildings-view"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="space-y-4 sm:space-y-6 py-4 sm:py-6 max-w-[900px] justify-self-center w-full px-3 sm:px-0"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
              <H2light>Building Management</H2light>
              <Button
                className="bg-stone-50/40 hover:bg-stone-50/80 px-4 flex items-center justify-center w-full sm:w-auto"
                onClick={() => setView("main")}
              >
                <ArrowLeft size={16} className="mr-2" /> Back to Menu
              </Button>
            </div>

            <BuildingsSection />
          </motion.div>
        )}

        {view === "departments" && (
          <motion.div
            key="departments-view"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="space-y-4 sm:space-y-6 py-4 sm:py-6 max-w-[900px] justify-self-center w-full px-3 sm:px-0"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
              <H2light>Department Management</H2light>
              <Button
                className="bg-stone-50/40 hover:bg-stone-50/80 px-4 flex items-center justify-center w-full sm:w-auto"
                onClick={() => setView("main")}
              >
                <ArrowLeft size={16} className="mr-2" /> Back to Menu
              </Button>
            </div>

            <DepartmentsSection />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Organisation;
