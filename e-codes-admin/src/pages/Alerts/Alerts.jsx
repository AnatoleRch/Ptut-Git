import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import { useStore } from "../../stores";
import H2 from "../../components/H2";
import CreateAlert from "./CreateAlert";
import Button from "../../components/Button";
import SoftPanel from "../../components/SoftPanel";
import { AlertTriangle, ArrowLeft, Info, CheckCircle } from "lucide-react";
import H2light from "../../components/SectionHeader";

const Alerts = () => {
  const { onGoingAlerts, codes, isMobile } = useStore();
  const [view, setView] = useState("main"); // main, create, details
  const [selectedAlert, setSelectedAlert] = useState(null);

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

  const handleResolveAlert = (alertId) => {
    // Implementation would go here
    console.log("Resolving alert:", alertId);
  };

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setView("details");
  };

  return (
    <div>
      <Header className={""}>Active Alerts</Header>

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
              <H2light>Create Alert</H2light>
            </div>

            <CreateAlert className={"space-y-3 grid grid-cols-6 p-7"} />

            <div className="flex justify-between items-center mt-8">
              <H2light>Active Alerts</H2light>
            </div>

            <div className="space-y-4">
              {onGoingAlerts.length > 0 ? (
                onGoingAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id || index}
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <SoftPanel className={`${isMobile ? "p-3" : "p-4"}`}>
                      {/* Header: Code + Time */}
                      <div
                        className={`flex ${
                          isMobile
                            ? "flex-col gap-2"
                            : "justify-between items-center"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className="inline-block rounded-sm border-2 border-stone-500 shadow-md"
                            style={{
                              background: codes[alert.code]?.color || "#999",
                              width: isMobile ? 24 : 40,
                              height: isMobile ? 24 : 40,
                            }}
                          />
                          <div>
                            Code:{" "}
                            <span className="font-bold">{alert.code}</span>
                          </div>
                        </div>
                        <div className="text-stone-600 text-sm sm:text-base">
                          Started:{" "}
                          <span className="font-bold">{alert.initiated}</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="text-sm text-stone-600">
                        Location:{" "}
                        <span className="font-bold">
                          Building {alert.location.building}, Floor{" "}
                          {alert.location.floor}, Room {alert.location.room}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div
                        className={`flex gap-2 ${
                          isMobile
                            ? "flex-col space-y-2"
                            : "justify-end space-x-2"
                        }`}
                      >
                        <Button
                          className={`${
                            isMobile ? "w-full text-sm py-2" : "px-4 py-2"
                          } bg-teal-500/30 hover:bg-teal-500 flex items-center justify-center`}
                          onClick={() => handleResolveAlert(alert.id)}
                        >
                          <CheckCircle
                            size={isMobile ? 16 : 18}
                            className="mr-2"
                          />
                          Resolve
                        </Button>
                        <Button
                          className={`${
                            isMobile ? "w-full text-sm py-2" : "px-4 py-2"
                          } bg-sky-500/30 hover:bg-sky-500 flex items-center justify-center`}
                          onClick={() => handleViewDetails(alert)}
                        >
                          <Info size={isMobile ? 16 : 18} className="mr-2" />
                          More Details
                        </Button>
                      </div>
                    </SoftPanel>
                  </motion.div>
                ))
              ) : (
                <SoftPanel
                  className={`${isMobile ? "p-4" : "p-8"} text-center mx-4`}
                >
                  <div className="flex flex-col items-center justify-center text-stone-500">
                    <AlertTriangle
                      size={isMobile ? 24 : 32}
                      className="text-amber-500 mb-3"
                    />
                    <p className={isMobile ? "text-sm" : ""}>
                      No active alerts at this time
                    </p>
                  </div>
                </SoftPanel>
              )}
            </div>
          </motion.div>
        )}

        {view === "details" && selectedAlert && (
          <motion.div
            key="details"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="space-y-6 py-6 max-w-[900px] justify-self-center w-full"
          >
            <div className="flex justify-between items-center">
              <H2light>Alert Details: {selectedAlert.code}</H2light>
              <Button
                className="bg-stone-50/40 hover:bg-stone-50/80 px-4 flex items-center justify-center"
                onClick={() => {
                  setSelectedAlert(null);
                  setView("main");
                }}
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
            </div>

            <SoftPanel className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-stone-500">Code</div>
                  <div className="flex items-center mt-1">
                    <span
                      className="p-3 mr-3 rounded-sm inline-block"
                      style={{
                        background: codes[selectedAlert.code]?.color || "#999",
                      }}
                    />
                    <span className="text-lg font-bold">
                      {selectedAlert.code}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-stone-500">
                    Initiated
                  </div>
                  <div className="text-lg font-bold mt-1">
                    {selectedAlert.initiated}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="text-sm font-medium text-stone-500">
                    Location
                  </div>
                  <div className="text-lg font-bold mt-1">
                    Building {selectedAlert.location.building}, Floor{" "}
                    {selectedAlert.location.floor}, Room{" "}
                    {selectedAlert.location.room}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="text-sm font-medium text-stone-500">
                    Description
                  </div>
                  <div className="bg-stone-50/80 p-4 rounded-sm mt-1">
                    {codes[selectedAlert.code]?.description ||
                      "Detailed information about this alert type would appear here."}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="text-sm font-medium text-stone-500">
                    Response Protocol
                  </div>
                  <div className="bg-stone-50/80 p-4 rounded-sm mt-1">
                    {codes[selectedAlert.code]?.protocol ||
                      "Follow standard operating procedures for this type of alert."}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-4 pt-4">
                <div className="col-span-4" />
                <Button
                  className="col-span-2 bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center"
                  onClick={() => {
                    handleResolveAlert(selectedAlert.id);
                    setSelectedAlert(null);
                    setView("main");
                  }}
                >
                  <CheckCircle size={18} className="mr-2" />
                  Resolve Alert
                </Button>
              </div>
            </SoftPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Alerts;
