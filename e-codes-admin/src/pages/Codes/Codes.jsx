import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import H2 from "../../components/H2";
import SoftPanel from "../../components/SoftPanel";
import { useStore, useMaps, useOrg } from "../../stores";
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
import { getOrgById } from "../../services/firebase/orgService";
import {
  getCodes,
  createCode,
  updateCode,
  removeCode,
} from "../../services/firebase/ecodesService";
import { useConfirmStore } from "../../stores";

const Codes = () => {
  const { isMobile } = useStore();
  const { codes, setCodes } = useMaps();
  const { orgId } = useStore();
  const { departments, setDepartments } = useOrg();
  const [view, setView] = useState("main"); // main, list, create, edit
  const [codeEditMode, setCodeEditmode] = useState(null);

  // Import the openConfirm function from the confirm store
  const openConfirm = useConfirmStore((state) => state.openConfirm);

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

  useEffect(() => {
    if (!orgId) {
      return;
    }
    getOrgById(orgId)
      .then((org) => {
        setDepartments(org.departmentsMap || {});
      })
      .catch();
    getCodes(orgId, codes)
      .then((codesMap) => {
        setCodes(codesMap || {});
      })
      .catch((err) => {
        alert("Error fetching codes: " + err.message);
      });

    return () => {
      setCodes({});
    };
  }, [orgId]);

  const handleAddCode = async () => {
    if (!newCode.name.trim()) return alert("Code name is required");
    else if (!newCode.description.trim())
      return alert("Code description is required");
    try {
      const savedCode = await createCode(orgId, newCode, codes);
      const newCodeId = savedCode.id;
      delete savedCode["id"];
      setCodes({ ...codes, [newCodeId]: savedCode });
      resetForm();
      setView("list");
    } catch (err) {
      alert("Failed to add new code: " + err.message);
    }
  };

  const handleUpdateCode = async () => {
    openConfirm({
      title: "Update Code",
      message: (
        <p>
          Are you sure you want to update code <b>{newCode.name}</b> ?
        </p>
      ),
      confirmText: "Update",
      confirmColor: "teal",
      icon: "warning",
      onConfirm: async () => {
        if (!newCode.name.trim()) return alert("Code name is required");
        const codeId = newCode.id;
        delete newCode["id"];
        try {
          await updateCode(orgId, codeId, newCode, codes);
          codes[codeId] = newCode;
          setCodes(codes);
          resetForm();
          setView("list");
        } catch (err) {
          alert("Failed to edit code: " + err.message);
        }
      },
    });
  };

  const handleDeleteCode = async (codeId) => {
    openConfirm({
      title: "Delete Code",
      message: (
        <p>
          Are you sure you want to delete code
          <b> {codes[codeId].name} </b>?
          <p className="mt-2 text-red-600 font-semibold">
            This action cannot be undone.
          </p>
        </p>
      ),
      confirmText: "Delete",
      confirmColor: "red",
      icon: "danger",
      onConfirm: async () => {
        await removeCode(orgId, codeId, codes);
        delete codes[codeId];
        setCodes(codes);
      },
    });
  };

  const handleDepartmentToggle = (deptId, deptName) => {
    const currentDepts = [...newCode.departments];

    //if (currentDepts.includes(dept)) {
    if (currentDepts.find((d) => d.id === deptId)) {
      // Remove department if already selected
      setNewCode({
        ...newCode,
        departments: currentDepts.filter((d) => d.id !== deptId),
      });
    } else {
      // Add department if not selected
      setNewCode({
        ...newCode,
        departments: [...currentDepts, { id: deptId, name: deptName }],
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

  const handleSelectAllDepartments = () => {
    // Check if all departments are currently selected
    const allSelected =
      Object.keys(departments).length === newCode.departments.length &&
      Object.keys(departments).every((deptId) =>
        newCode.departments.some((d) => d.id === deptId)
      );

    if (allSelected) {
      // If all are selected, deselect all
      setNewCode({
        ...newCode,
        departments: [],
      });
    } else {
      // If not all selected, select all departments
      const allDepartments = Object.entries(departments).map(
        ([deptId, dept]) => ({
          id: deptId,
          name: dept.name,
        })
      );

      setNewCode({
        ...newCode,
        departments: allDepartments,
      });
    }
  };

  return (
    <div>
      <Header>Emergency Codes</Header>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <SoftPanel
                className="flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-stone-50/80 transition-colors"
                onClick={() => {
                  resetForm();
                  setCodeEditmode("Create");
                  setView("create");
                }}
              >
                <Bookmark size={48} className="text-teal-600 mb-4" />
                <H2>Create Code</H2>
                <p className="text-stone-500 mt-2 text-center">
                  Add a new emergency code to the system
                </p>
              </SoftPanel>

              <SoftPanel
                className="flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-stone-50/80 transition-colors"
                onClick={() => setView("list")}
              >
                <List size={48} className="text-teal-600 mb-4" />
                <H2>Manage Codes</H2>
                <p className="text-stone-500 mt-2 text-center">
                  View, edit or delete existing emergency codes
                </p>
              </SoftPanel>
            </div>
          </motion.div>
        )}

        {view === "list" && (
          <motion.div
            key="list"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="space-y-6 py-6 max-w-[900px] justify-self-center w-full"
          >
            <div
              className={`flex ${
                isMobile ? "flex-col gap-3" : "justify-between"
              } items-center`}
            >
              <H2light>Emergency Codes</H2light>
              <Button
                className={`bg-stone-50/40 hover:bg-stone-50/80 px-4 flex items-center justify-center ${
                  isMobile ? "w-full py-3" : ""
                }`}
                onClick={() => setView("main")}
              >
                <ArrowLeft size={16} className="mr-2" /> Back
              </Button>
            </div>

            <div
              className={`flex ${
                isMobile ? "flex-col gap-3" : "justify-between"
              } items-center`}
            >
              <H2></H2>
              <Button
                className={`bg-stone-50/40 hover:bg-stone-50/80 px-4 flex items-center justify-center ${
                  isMobile ? "w-full py-3" : ""
                }`}
                onClick={() => {
                  resetForm();
                  setCodeEditmode("Create");
                  setView("create");
                }}
              >
                <Plus size={16} className="mr-2" /> Create Code
              </Button>
            </div>

            <div className="space-y-2">
              {Object.keys(codes).length > 0 ? (
                Object.entries(codes)
                  .sort((a, b) => a[1].name.localeCompare(b[1].name))
                  .map(([k]) => (
                    <motion.div
                      key={k}
                      variants={itemVariants}
                      initial="initial"
                      animate="animate"
                    >
                      <SoftPanel
                        className={`${isMobile ? "p-2" : "py-3 px-4"}`}
                      >
                        <div className="flex justify-between items-center w-full">
                          {/* Code Color and Info */}
                          <div className="flex items-center space-x-4">
                            <span
                              className="rounded-sm border border-stone-400"
                              style={{
                                background: codes[k].color,
                                width: isMobile ? 24 : 40,
                                height: isMobile ? 24 : 40,
                              }}
                            />
                            <div className="flex flex-col text-sm sm:text-base">
                              <div>
                                Code{" "}
                                <span className="font-bold">
                                  {codes[k].name}
                                </span>
                              </div>
                              {codes[k].departments &&
                                codes[k].departments.length > 0 && (
                                  <div className="text-sm text-stone-500 mt-1">
                                    Departments:{" "}
                                    {codes[k].departments
                                      .map((d) => d.name)
                                      .join(", ")}
                                  </div>
                                )}
                            </div>
                          </div>

                          {/* Buttons */}
                          <div className="flex items-center">
                            {!isMobile ? (
                              <>
                                <Button
                                  className="bg-yellow-500/30 hover:bg-yellow-500 px-3 py-1 mr-2 flex items-center justify-center"
                                  onClick={() => {
                                    setCodeEditmode("Edit");
                                    setNewCode({ id: k, ...codes[k] });
                                    setView("edit");
                                  }}
                                >
                                  <Edit size={16} className="mr-1" /> Edit
                                </Button>
                                <Button
                                  className="bg-red-500/30 hover:bg-red-500 px-3 py-1 flex items-center justify-center"
                                  onClick={() => handleDeleteCode(k)}
                                >
                                  <Trash2 size={16} className="mr-1" /> Delete
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  className="bg-yellow-500/30 hover:bg-yellow-500 px-2 py-1 text-xs mr-1 flex items-center justify-center"
                                  onClick={() => {
                                    setCodeEditmode("Edit");
                                    setNewCode({ id: k, ...codes[k] });
                                    setView("edit");
                                  }}
                                >
                                  <Edit size={12} />
                                </Button>
                                <Button
                                  className="bg-red-500/30 hover:bg-red-500 px-2 py-1 text-xs flex items-center justify-center"
                                  onClick={() => handleDeleteCode(k)}
                                >
                                  <Trash2 size={12} />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </SoftPanel>
                    </motion.div>
                  ))
              ) : (
                <SoftPanel
                  className={`${isMobile ? "p-4" : "p-8"} text-center`}
                >
                  <div className="flex flex-col items-center justify-center text-stone-500">
                    <AlertTriangle
                      size={isMobile ? 24 : 32}
                      className="text-amber-500 mb-3"
                    />
                    <p className={isMobile ? "text-sm" : ""}>
                      No emergency codes created yet
                    </p>
                  </div>
                </SoftPanel>
              )}
            </div>
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
              <H2light>{codeEditMode} Code</H2light>
              {/* <Button
                className="bg-stone-50/40 hover:bg-stone-50/80 px-4 flex items-center justify-center"
                onClick={() => {
                  resetForm();
                  setView(view === "create" ? "main" : "list");
                }}
              >
                <ArrowLeft size={16} className="mr-2" /> Back
              </Button> */}
            </div>

            <SoftPanel className="space-y-4 px-6 py-4 m-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Code Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCode.name}
                    onChange={(e) =>
                      setNewCode({ ...newCode, name: e.target.value })
                    }
                    className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g. Purple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Color <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={newCode.color}
                      onChange={(e) =>
                        setNewCode({ ...newCode, color: e.target.value })
                      }
                      className="w-full h-[48px] m-0 p-0 bg-stone-50/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <div
                      className="ml-2 p-4 rounded-sm"
                      style={{ backgroundColor: newCode.color }}
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newCode.description}
                    onChange={(e) =>
                      setNewCode({ ...newCode, description: e.target.value })
                    }
                    className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 h-24"
                    placeholder="Who responds, what this means..."
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Departments
                  </label>

                  {Object.keys(departments).length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div
                        className={`flex items-center p-2 border rounded-sm cursor-pointer ${
                          Object.keys(departments).length > 0 &&
                          Object.keys(departments).length ===
                            newCode.departments.length &&
                          Object.keys(departments).every((deptId) =>
                            newCode.departments.some((d) => d.id === deptId)
                          )
                            ? "bg-teal-50 border-teal-500"
                            : "bg-stone-50/80 border-stone-200"
                        }`}
                        onClick={handleSelectAllDepartments}
                      >
                        <div
                          className={`w-6 h-6 rounded-sm flex items-center justify-center mr-2 ${
                            Object.keys(departments).length > 0 &&
                            Object.keys(departments).length ===
                              newCode.departments.length &&
                            Object.keys(departments).every((deptId) =>
                              newCode.departments.some((d) => d.id === deptId)
                            )
                              ? "bg-teal-500 text-white"
                              : "bg-stone-200"
                          }`}
                        >
                          {Object.keys(departments).length > 0 &&
                            Object.keys(departments).length ===
                              newCode.departments.length &&
                            Object.keys(departments).every((deptId) =>
                              newCode.departments.some((d) => d.id === deptId)
                            ) && <Check size={16} />}
                        </div>
                        <span>ALL</span>
                      </div>

                      {Object.entries(departments).map(([deptId, dept]) => (
                        <div
                          key={deptId}
                          className={`flex items-center p-2 border rounded-sm cursor-pointer ${
                            //newCode.departments.includes({ id: deptId, name: dept.name })
                            newCode.departments.find((d) => d.id === deptId)
                              ? "bg-teal-50 border-teal-500"
                              : "bg-stone-50/80 border-stone-200"
                          }`}
                          onClick={() =>
                            handleDepartmentToggle(deptId, dept.name)
                          }
                        >
                          <div
                            className={`w-6 h-6 rounded-sm flex items-center justify-center mr-2 ${
                              //newCode.departments.includes({ id: deptId, name: dept.name })
                              newCode.departments.find((d) => d.id === deptId)
                                ? "bg-teal-500 text-white"
                                : "bg-stone-200"
                            }`}
                          >
                            {
                              /*newCode.departments.includes({ id: deptId, name: dept.name })*/
                              newCode.departments.find(
                                (d) => d.id === deptId
                              ) && <Check size={16} />
                            }
                          </div>
                          <span>{dept.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-stone-50/80 p-3 text-stone-500 rounded-sm">
                      No departments available. Create departments first.
                    </div>
                  )}

                  {newCode.departments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {newCode.departments.map((dept) => (
                        <div
                          key={dept.id}
                          className="bg-teal-100 text-teal-800 px-2 py-1 rounded-sm flex items-center text-sm"
                        >
                          {dept.name}
                          <X
                            size={16}
                            className="ml-1 cursor-pointer hover:text-red-500"
                            onClick={() =>
                              handleDepartmentToggle(dept.id, dept.name)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-6 gap-4 pt-4">
                <div className="col-span-3" />
                <Button
                  className="col-span-2 m-0 mr-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-sm flex items-center justify-center"
                  onClick={view === "create" ? handleAddCode : handleUpdateCode}
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
                  )}{" "}
                  Code
                </Button>
                <Button
                  className="col-span-1 bg-red-50/20 hover:bg-red-50/50 px-4 py-2 rounded-sm"
                  onClick={() => {
                    resetForm();
                    setView(view === "create" ? "main" : "list");
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

export default Codes;
