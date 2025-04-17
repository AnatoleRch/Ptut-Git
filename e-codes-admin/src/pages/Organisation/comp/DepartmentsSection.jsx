import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import H2light from "../../../components/SectionHeader";
import { useOrg, useStore, useConfirmStore } from "../../../stores";
import SoftPanel from "../../../components/SoftPanel";
import Button from "../../../components/Button";
import { PlusCircle, Trash2, Edit, Briefcase, Plus } from "lucide-react";
import {
  createDepartment,
  updateDepartment,
  removeDepartment,
} from "../../../services/firebase/departmentsService";
import { getUsersByDepartment } from "../../../services/firebase/usersService";

function DepartmentsSection() {
  const { orgId } = useStore();
  const { departments, org } = useOrg();
  const [view, setView] = useState("main");
  const [deptMode, setDeptMode] = useState(null);
  const [newDept, setNewDept] = useState({ name: "" });

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.1 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.1 } },
  };

  const addDept = async () => {
    const { name } = newDept;

    if (!name.trim()) return alert("Department name is required");

    const newData = { name: name, orgId: orgId };
    try {
      await createDepartment(orgId, newData, org);
      setNewDept({ name: "" });
      setDeptMode(null);
      setView("main");
    } catch (err) {
      alert("Failed to add department: " + err.message);
    }
  };

  const updateDept = async () => {
    const { name, deptId } = newDept;
    if (!name.trim()) return alert("Department name is required");
    const updatedData = { name: name, orgId: orgId };
    try {
      await updateDepartment(orgId, deptId, updatedData, org);
      setNewDept({ name: "" });
      setDeptMode(null);
      setView("main");
    } catch (err) {
      alert("Failed to edit department: " + err.message);
    }
  };

  const deleteDept = async (deptId) => {
    try {
      const deptUsers = await getUsersByDepartment(orgId, deptId);
      if (deptUsers.length > 0) {
        throw new Error("Department has users associated with it. Move users to other departments before delete");
      }
      await removeDepartment(orgId, deptId, org);
    } catch (err) {
      alert("Failed to delete department: " + err.message);
    }
  }

  const openConfirm = useConfirmStore((state) => state.openConfirm);

  return (
    <div>
      <AnimatePresence mode="wait">
        {view === "main" && (
          <motion.div
            key="main"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="space-y-6"
          >
            <div
              className={`flex ${
                isMobile ? "flex-col gap-4" : "justify-between"
              } items-center`}
            >
              <h2 className="text-lg font-semibold"></h2>
              <Button
                className={`
                  bg-stone-50/40 hover:bg-stone-50/80 px-4 
                  flex items-center justify-center
                  ${isMobile ? "w-full py-3" : ""}
                `}
                onClick={() => {
                  setDeptMode("Create");
                  setNewDept({ name: "" });
                  setView("create");
                }}
              >
                <Plus size={16} className="mr-2" /> Add Department
              </Button>
            </div>

            {Object.keys(departments).length === 0 ? (
              <SoftPanel className={`${isMobile ? "p-4" : "p-8"} text-center`}>
                <div className="flex flex-col items-center justify-center text-stone-500">
                  <Briefcase
                    size={isMobile ? 24 : 32}
                    className="text-teal-500 mb-3"
                  />
                  <p className={isMobile ? "text-sm" : ""}>
                    No departments created yet
                  </p>
                </div>
              </SoftPanel>
            ) : (
              <div className="space-y-2">
                {Object.entries(departments).map(([deptId, dept]) => (
                  <motion.div
                    key={deptId}
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <SoftPanel className={`${isMobile ? "p-2" : "py-3 px-4"}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Briefcase
                            className="text-teal-600 mr-2"
                            size={isMobile ? 16 : 20}
                          />
                          <span className={isMobile ? "text-sm" : "font-bold"}>
                            {dept.name}
                          </span>
                        </div>

                        <div className="flex">
                          <Button
                            className={`${
                              isMobile
                                ? "bg-yellow-500/30 hover:bg-yellow-500 px-2 py-1 text-xs mr-1"
                                : "bg-yellow-500/30 hover:bg-yellow-500 px-3 py-1 mr-2"
                            } flex items-center justify-center`}
                            onClick={() => {
                              setDeptMode(`Edit`);
                              setNewDept({ name: dept.name, deptId });
                              setView("edit");
                            }}
                          >
                            <Edit
                              size={isMobile ? 12 : 16}
                              className={isMobile ? "" : "mr-1"}
                            />
                            {!isMobile && "Edit"}
                          </Button>

                          <Button
                            className={`${
                              isMobile
                                ? "bg-red-500/30 hover:bg-red-500 px-2 py-1 text-xs"
                                : "bg-red-500/30 hover:bg-red-500 px-3 py-1"
                            } flex items-center justify-center`}
                            onClick={() =>
                              openConfirm({
                                title: "Delete Department",
                                message: (
                                  <div>
                                    <p>
                                      Are you sure to delete department
                                      <b> {dept.name}</b> ?
                                    </p>
                                    <p className="mt-2 text-red-600 font-semibold">
                                      This will delete the department but NOT
                                      its associations!
                                    </p>
                                  </div>
                                ),
                                confirmText: "Delete",
                                confirmColor: "red",
                                icon: "danger",
                                onConfirm: () => {
                                  deleteDept(deptId);
                                },
                              })
                            }
                          >
                            <Trash2
                              size={isMobile ? 12 : 16}
                              className={isMobile ? "" : "mr-1"}
                            />
                            {!isMobile && "Delete"}
                          </Button>
                        </div>
                      </div>
                    </SoftPanel>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {(view === "create" || view === "edit") && (
          <motion.div
            key="form"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="space-y-6 pt-4"
          >
            <div className="flex justify-between items-center">
              <H2light>{deptMode} Department</H2light>
            </div>

            <SoftPanel
              className={`space-y-4 ${isMobile ? "px-3 py-3" : "px-6 py-4"}`}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Department Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newDept.name}
                    onChange={(e) =>
                      setNewDept({ ...newDept, name: e.target.value })
                    }
                    className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter department name"
                  />
                </div>
              </div>

              <div
                className={`${
                  isMobile
                    ? "flex flex-col space-y-2"
                    : "grid grid-cols-6 gap-4"
                } pt-4`}
              >
                {!isMobile && <div className="col-span-4" />}
                <Button
                  className={`${
                    isMobile ? "w-full" : "col-span-1"
                  } bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-sm flex items-center justify-center`}
                  onClick={view === "create" ? addDept : updateDept}
                >
                  {view === "create" ? (
                    <>
                      <PlusCircle size={16} className="mr-1" />
                      Create
                    </>
                  ) : (
                    <>
                      <Edit size={16} className="mr-1" />
                      Update
                    </>
                  )}
                </Button>
                <Button
                  className={`${
                    isMobile ? "w-full" : "col-span-1"
                  } bg-red-50/20 hover:bg-red-50/50 px-4 py-2 rounded-sm`}
                  onClick={() => {
                    setNewDept({ name: "" });
                    setDeptMode(null);
                    setView("main");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </SoftPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DepartmentsSection;
