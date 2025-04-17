import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import H2 from "../../components/H2";
import SoftPanel from "../../components/SoftPanel";
import { useStore } from "../../stores";
import Button from "../../components/Button";
import { Building2, Edit, Trash2, ArrowLeft, Plus } from "lucide-react";

const Departments = () => {
  const { departments = {}, setDepartments } = useStore();
  const [view, setView] = useState("main"); // main, create, edit
  const [deptMode, setDeptMode] = useState(null);

  // State for new code form
  const [newDept, setNewDept] = useState({
    name: "",
  });

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.1 } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.1 } }
  };

  const handleAddDept = () => {
    const { name } = newDept;

    if (!name.trim()) return alert("Department name is required");

    setDepartments({
      ...departments,
      [name]: true,
    });

    // Reset form
    setNewDept({
      name: "",
    });

    setDeptMode(null);
    setView("main");
  };

  return (
    <div>
      <Header>Departments</Header>

      <AnimatePresence mode="wait">
        {view === "main" && (
          <motion.div
            key="main"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="space-y-6 py-6 max-w-[900px] justify-self-center w-full"
          >
            <div className="flex justify-between items-center">
              <H2>Existing Departments</H2>
            </div>

            <div className="space-y-4">
              {Object.keys(departments).length > 0 ? (
                Object.keys(departments).map((k) => (
                  <motion.div
                    key={k}
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <SoftPanel className="grid grid-cols-6 mx-4 py-3 gap-x-2">
                      <div className="flex col-span-4 pl-4 items-center">
                        <Building2 className="text-teal-600" /> 
                        <span className="font-bold ml-3">{k}</span>
                      </div>

                      <Button
                        className="col-span-1 bg-yellow-500/30 hover:bg-yellow-500 flex items-center justify-center m-0"
                        onClick={() => {
                          setDeptMode(`Edit`);
                          setNewDept({ name: k });
                          setView("edit");
                        }}
                      >
                        <Edit size={16} className="mr-1" /> Edit
                      </Button>

                      <Button
                        className="col-span-1 bg-red-500/30 hover:bg-red-500 flex items-center justify-center m-0"
                        onClick={() => {
                          let newdepartments = structuredClone(departments);
                          delete newdepartments[k];
                          setDepartments({ ...newdepartments });
                        }}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </Button>
                    </SoftPanel>
                  </motion.div>
                ))
              ) : (
                <SoftPanel className="p-8 text-center mx-4">
                  <div className="flex flex-col items-center justify-center text-stone-500">
                    <Building2 size={32} className="text-teal-500 mb-3" />
                    <p>No departments created yet</p>
                  </div>
                </SoftPanel>
              )}
            </div>

            <Button
              className="bg-stone-50/40 hover:bg-stone-50/80 m-4 p-5 font-bold text-stone-900/50 hover:text-stone-900/80 flex items-center justify-center"
              onClick={() => {
                setDeptMode("Create");
                setNewDept({ name: "" });
                setView("create");
              }}
            >
              <Plus size={18} className="mr-2" />
              CREATE DEPARTMENT
            </Button>
          </motion.div>
        )}

        {(view === "create" || view === "edit") && (
          <motion.div
            key="form"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="space-y-6 py-6 max-w-[900px] justify-self-center w-full"
          >
            <div className="flex justify-between items-center">
              <H2>{deptMode} Department</H2>
              {/* <Button
                className="bg-stone-50/40 hover:bg-stone-50/80 px-4 flex items-center justify-center"
                onClick={() => {
                  setNewDept({ name: "" });
                  setDeptMode(null);
                  setView("main");
                }}
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button> */}
            </div>

            <SoftPanel className="space-y-4 px-6 py-4 m-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
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

              <div className="grid grid-cols-6 gap-4 pt-4">
                <div className="col-span-3" />
                <Button
                  className="col-span-2 m-0 mr-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-sm flex items-center justify-center"
                  onClick={handleAddDept}
                >
                  {view === "create" ? (
                    <>
                      <Plus size={16} className="mr-1" />
                      Create
                    </>
                  ) : (
                    <>
                      <Edit size={16} className="mr-1" />
                      Update
                    </>
                  )} Department
                </Button>
                <Button
                  className="col-span-1 bg-red-50/20 hover:bg-red-50/50 px-4 py-2 rounded-sm"
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
};

export default Departments;