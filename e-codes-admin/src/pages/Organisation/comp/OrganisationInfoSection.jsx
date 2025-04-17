import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import H3 from "../../../components/H3";
import { useOrg, useConfirmStore } from "../../../stores";
import SoftPanel from "../../../components/SoftPanel";
import Button from "../../../components/Button";
import { updateOrg } from "../../../services/firebase/orgService";
import { Edit, Info, Trash2 } from "lucide-react";

function OrganisationInfoSection() {
  const { org } = useOrg();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });
  const [isMobile, setIsMobile] = useState(false);

  // Import the openConfirm function from the confirm store
  const openConfirm = useConfirmStore((state) => state.openConfirm);

  // Check for mobile screen
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.1 } },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleConfirmSaveChanges = () => {
    // Validate form data
    if (!formData.name.trim()) {
      alert("Organisation name is required");
      return;
    }

    openConfirm({
      title: "Update Organisation",
      message: (
        <p>
          Are you sure you want to update the information for <b>{org.name}</b>?
        </p>
      ),
      confirmText: "Update",
      confirmColor: "teal",
      icon: "info",
      onConfirm: () => {
        // Save changes to store
        updateOrg(org.id, formData);
        setEditMode(false);
      },
    });
  };

  const handleResetOrganisation = () => {
    openConfirm({
      title: "Reset Organisation Information",
      message: (
        <>
          <p>
            Are you sure you want to reset all information for <b>{org.name}</b>
            ?
          </p>
          <p className="mt-2 text-red-600 font-semibold">
            This action cannot be undone.
          </p>
        </>
      ),
      confirmText: "Reset",
      confirmColor: "red",
      icon: "danger",
      onConfirm: () => {
        // Reset org info logic would go here
        // This is just a placeholder - implement according to your application's needs
        updateOrg(org.id, { name: "", address: "" });
        setFormData({ name: "", address: "" });
        setEditMode(false);
      },
    });
  };

  // Initialize form data when component mounts or hospitalInfo changes
  React.useEffect(() => {
    setFormData({
      name: org.name || "",
      address: org.address || "",
    });
  }, [org]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={editMode ? "edit" : "view"}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="space-y-6"
      >
        <SoftPanel className="p-4 relative">
          {/* Responsive header with edit button */}
          {!editMode && (
            <>
              {/* Edit button positioned at top on mobile */}
              {isMobile && (
                <motion.div
                  className="flex justify-end mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                >
                  <Button
                    className="bg-yellow-500/30 hover:bg-yellow-500 px-4 flex items-center justify-center"
                    onClick={() => setEditMode(true)}
                  >
                    <Edit size={16} className="mr-1" /> Edit Info
                  </Button>
                </motion.div>
              )}

              {/* Organization header */}
              <motion.div
                className={`flex ${
                  !isMobile && "items-center justify-between"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <H3 className="py-2 text-2xl text-stone-900/80 font-semibold mb-2">
                  {org.name || "Organisation Name"}
                </H3>

                {/* Edit button on desktop */}
                {!isMobile && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                  >
                    <Button
                      className="bg-yellow-500/30 hover:bg-yellow-500 px-4 flex items-center justify-center"
                      onClick={() => setEditMode(true)}
                    >
                      <Edit size={16} className="mr-1" /> Edit Info
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {!editMode ? (
              <motion.div
                className="pb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Don't repeat the name, it's now in the header */}
                {org.address ? (
                  org.address.split(",").map((x, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 + i * 0.1 }}
                    >
                      <H3 className="text-stone-900/80 font-semibold">
                        {x.trim()}
                      </H3>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    <H3 className="text-stone-900/80 font-semibold">
                      No address available
                    </H3>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-1">
                    Organisation Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter organisation name"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <label className="block text-sm font-medium mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 h-20"
                    placeholder="Enter address (comma separated for multiple lines)"
                  />
                </motion.div>
                <motion.div
                  className="flex justify-between items-center pt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                >
                  {/* Reset button (left side) */}
                  <div
                    className={`bg-red-500/30 hover:bg-red-500 text-stone-900 hover:text-white rounded-sm flex items-center justify-center ${
                      isMobile ? "text-xs flex-grow" : ""
                    }`}
                  ></div>
                  {/* <Button
                    className={`bg-red-500/30 hover:bg-red-500 text-stone-900 hover:text-white px-4 py-2 rounded-sm flex items-center justify-center ${
                      isMobile ? "text-xs flex-grow" : ""
                    }`}
                    onClick={handleResetOrganisation}
                  >
                    <Trash2 size={isMobile ? 12 : 16} className="mr-1" />
                    {isMobile ? "Reset" : "Reset Info"}
                  </Button> */}

                  {/* Save/Cancel buttons (right side) */}
                  <div
                    className={`flex ${
                      isMobile ? "flex-grow justify-end" : "space-x-2"
                    }`}
                  >
                    <Button
                      className={`bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-sm flex items-center justify-center ${
                        isMobile ? "text-xs mr-1" : "m-0 mr-2"
                      }`}
                      onClick={handleConfirmSaveChanges}
                    >
                      <Info size={isMobile ? 12 : 16} className="mr-1" />
                      Save
                    </Button>
                    <Button
                      className={`bg-stone-50/40 hover:bg-stone-50/80 px-4 py-2 rounded-sm ${
                        isMobile ? "text-xs" : ""
                      }`}
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </SoftPanel>
      </motion.div>
    </AnimatePresence>
  );
}

export default OrganisationInfoSection;
