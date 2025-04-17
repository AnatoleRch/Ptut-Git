import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import H2 from "../../components/H2";
import SoftPanel from "../../components/SoftPanel";
import Button from "../../components/Button";
import Dropdown from "../../components/Dropdown";
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Users,
  RotateCcw,
  Check,
} from "lucide-react";
import { useStore } from "../../stores";
import H2light from "../../components/SectionHeader";

// Shift Type Management Component
const ShiftTypesSection = () => {
  const { shiftTypes, setShiftTypes, isMobile } = useStore();
  const [view, setView] = useState("main");
  const [editMode, setEditMode] = useState(null);
  const [shiftCode, setShiftCode] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [splitShift, setSplitShift] = useState(false);
  const [splitStartTime, setSplitStartTime] = useState("");
  const [splitEndTime, setSplitEndTime] = useState("");
  const [selectedShiftCode, setSelectedShiftCode] = useState("");

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

  const resetForm = () => {
    setShiftCode("");
    setStartTime("");
    setEndTime("");
    setSplitShift(false);
    setSplitStartTime("");
    setSplitEndTime("");
    setSelectedShiftCode("");
  };

  const handleAddShiftType = () => {
    if (!shiftCode.trim()) {
      alert("Shift code is required");
      return;
    }

    if (!startTime || !endTime) {
      alert("Start and end times are required");
      return;
    }

    if (splitShift && (!splitStartTime || !splitEndTime)) {
      alert("Split shift times are required");
      return;
    }

    const newShiftType = {
      startTime,
      endTime,
      splitShift,
      splitStartTime: splitShift ? splitStartTime : null,
      splitEndTime: splitShift ? splitEndTime : null,
    };

    setShiftTypes({
      ...shiftTypes,
      [shiftCode]: newShiftType,
    });

    resetForm();
    setView("main");
  };

  const handleDeleteShiftType = (code) => {
    if (window.confirm(`Are you sure you want to delete shift type ${code}?`)) {
      const newShiftTypes = { ...shiftTypes };
      delete newShiftTypes[code];
      setShiftTypes(newShiftTypes);
    }
  };

  const handleEditShiftType = (code) => {
    const shiftType = shiftTypes[code];
    setShiftCode(code);
    setStartTime(shiftType.startTime);
    setEndTime(shiftType.endTime);
    setSplitShift(shiftType.splitShift);
    setSplitStartTime(shiftType.splitStartTime || "");
    setSplitEndTime(shiftType.splitEndTime || "");
    setSelectedShiftCode(code);
    setEditMode("edit");
    setView("edit");
  };

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
              <H2light></H2light>
              <Button
                className={`
          bg-stone-50/40 hover:bg-stone-50/80 px-4 
          flex items-center justify-center
          ${isMobile ? "w-full py-3" : ""}
        `}
                onClick={() => {
                  resetForm();
                  setEditMode("create");
                  setView("edit");
                }}
              >
                <Plus size={16} className="mr-2" /> New Shift Type
              </Button>
            </div>

            <div className="space-y-2">
              {Object.keys(shiftTypes).length > 0 ? (
                Object.entries(shiftTypes).map(([code, shiftType]) => (
                  <motion.div
                    key={code}
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <SoftPanel className={`${isMobile ? "p-2" : "py-3 px-4"}`}>
                      <div className="flex justify-between items-center w-full">
                        {/* Shift Code + Times */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                          <div className="flex items-center">
                            <Clock
                              className="text-teal-600 mr-2"
                              size={isMobile ? 16 : 20}
                            />
                            <span
                              className={isMobile ? "text-sm" : "font-bold"}
                            >
                              {code}
                            </span>
                          </div>
                          <div className="text-stone-600 text-sm sm:text-base">
                            <span className="font-medium">Hours:</span>{" "}
                            {shiftType.startTime} - {shiftType.endTime}
                          </div>
                          {shiftType.splitShift && (
                            <div className="text-stone-500 text-sm sm:text-base">
                              <span className="font-medium">Split:</span>{" "}
                              {shiftType.splitStartTime} -{" "}
                              {shiftType.splitEndTime}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center">
                          {!isMobile ? (
                            <>
                              <Button
                                className="bg-yellow-500/30 hover:bg-yellow-500 px-3 py-1 mr-2 flex items-center justify-center"
                                onClick={() => handleEditShiftType(code)}
                              >
                                <Edit size={16} className="mr-1" /> Edit
                              </Button>
                              <Button
                                className="bg-red-500/30 hover:bg-red-500 px-3 py-1 flex items-center justify-center"
                                onClick={() => handleDeleteShiftType(code)}
                              >
                                <Trash2 size={16} className="mr-1" /> Delete
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                className="bg-yellow-500/30 hover:bg-yellow-500 px-2 py-1 text-xs mr-1 flex items-center justify-center"
                                onClick={() => handleEditShiftType(code)}
                              >
                                <Edit size={12} />
                              </Button>
                              <Button
                                className="bg-red-500/30 hover:bg-red-500 px-2 py-1 text-xs flex items-center justify-center"
                                onClick={() => handleDeleteShiftType(code)}
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
                    <Clock
                      size={isMobile ? 24 : 32}
                      className="text-teal-500 mb-3"
                    />
                    <p className={isMobile ? "text-sm" : ""}>
                      No shift types created yet
                    </p>
                  </div>
                </SoftPanel>
              )}
            </div>
          </motion.div>
        )}

        {view === "edit" && (
          <motion.div
            key="edit"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="space-y-6 pt-4"
          >
            <div className="flex justify-between items-center">
              <H2light>
                {editMode === "create"
                  ? "Create New Shift Type"
                  : "Edit Shift Type"}
              </H2light>
              {/* <Button
                className="bg-stone-50/40 hover:bg-stone-50/80 px-4 flex items-center justify-center"
                onClick={() => {
                  resetForm();
                  setView("main");
                }}
              >
                <ArrowLeft size={16} className="mr-2" /> Back
              </Button> */}
            </div>

            <SoftPanel className="space-y-6 px-6 py-4 mx-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Shift Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shiftCode}
                    onChange={(e) => setShiftCode(e.target.value)}
                    disabled={editMode === "edit"}
                    className={`w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                      editMode === "edit" ? "opacity-70" : ""
                    }`}
                    placeholder="e.g. Morning, Evening, Night"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={splitShift}
                      onChange={() => setSplitShift(!splitShift)}
                      className="h-5 w-5 text-teal-600 rounded focus:ring-teal-500 mr-2"
                    />
                    <span className="text-sm font-medium">Split Shift</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {splitShift && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Split Start Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={splitStartTime}
                        onChange={(e) => setSplitStartTime(e.target.value)}
                        className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Split End Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={splitEndTime}
                        onChange={(e) => setSplitEndTime(e.target.value)}
                        className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-sm flex items-center justify-center mr-4"
                  onClick={handleAddShiftType}
                >
                  {editMode === "create" ? (
                    <>
                      <Plus size={16} className="mr-1" /> Create
                    </>
                  ) : (
                    <>
                      <Check size={16} className="mr-1" /> Update
                    </>
                  )}
                </Button>
                <Button
                  className="bg-red-50/20 hover:bg-red-50/50 px-4 py-2 rounded-sm"
                  onClick={() => {
                    resetForm();
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

// Staff Rota Management Component
const RotaManagementSection = () => {
  const { departments = {}, users = [], shiftTypes = {} } = useStore();
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [rotaEntries, setRotaEntries] = useState([]);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.1 } },
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const currentMonth = selectedDate.toLocaleString("default", {
    month: "long",
  });
  const currentYear = selectedDate.getFullYear();

  // Get all days in the current month
  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const daysInMonth = getDaysInMonth();

  const handleAddToSchedule = () => {
    if (
      !selectedDepartment ||
      !selectedDoctor ||
      !selectedShift ||
      !selectedDate
    ) {
      alert("Please select all required fields");
      return;
    }

    const newEntry = {
      id: Date.now(),
      department: selectedDepartment,
      doctor: selectedDoctor,
      shift: selectedShift,
      date: formatDate(selectedDate),
    };

    setRotaEntries([...rotaEntries, newEntry]);

    // Reset selection
    setSelectedDoctor("");
    setSelectedShift("");
  };

  const handleRemoveFromSchedule = (id) => {
    if (
      window.confirm(
        "Are you sure you want to remove this entry from the schedule?"
      )
    ) {
      setRotaEntries(rotaEntries.filter((entry) => entry.id !== id));
    }
  };

  // Mock data for testing
  const mockDoctors = [
    { id: 1, name: "Dr. John Smith", department: "Pediatrics" },
    { id: 2, name: "Dr. Sarah Johnson", department: "Pediatrics" },
    { id: 3, name: "Dr. Michael Brown", department: "Cardiology" },
  ];

  // Filter doctors by department
  const filteredDoctors = mockDoctors.filter(
    (doctor) => !selectedDepartment || doctor.department === selectedDepartment
  );

  const handleDateChange = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <SoftPanel className="p-4">
          <h3 className="text-lg font-medium mb-4">Schedule Setup</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <Dropdown
                className="bg-white w-full"
                items={Object.keys(departments || {})}
                placeholder={"Select Department"}
                value={selectedDepartment}
                callback={(v) => setSelectedDepartment(v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Doctor</label>
                <Dropdown
                  className="bg-white w-full"
                  items={filteredDoctors.map((d) => d.name)}
                  placeholder={"Select Doctor"}
                  value={selectedDoctor}
                  callback={(v) => setSelectedDoctor(v)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Shift Type
                </label>
                <Dropdown
                  className="bg-white w-full"
                  items={Object.keys(shiftTypes || {})}
                  placeholder={"Select Shift"}
                  value={selectedShift}
                  callback={(v) => setSelectedShift(v)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Select Date
              </label>
              <div className="calendar-container bg-white p-3 rounded-sm shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">
                    {currentMonth} {currentYear}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      className="p-1 rounded-full hover:bg-stone-100"
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(newDate.getMonth() - 1);
                        setSelectedDate(newDate);
                      }}
                    >
                      &lt;
                    </button>
                    <button
                      className="p-1 rounded-full hover:bg-stone-100"
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(newDate.getMonth() + 1);
                        setSelectedDate(newDate);
                      }}
                    >
                      &gt;
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div
                      key={index}
                      className="text-xs font-medium text-stone-500"
                    >
                      {day}
                    </div>
                  ))}

                  {Array.from({ length: daysInMonth[0].getDay() }).map(
                    (_, i) => (
                      <div key={`empty-${i}`} className="h-8"></div>
                    )
                  )}

                  {daysInMonth.map((date) => {
                    const isSelected =
                      date.getDate() === selectedDate.getDate();
                    return (
                      <button
                        key={date.getDate()}
                        className={`h-8 w-full rounded-full flex items-center justify-center text-sm ${
                          isSelected
                            ? "bg-teal-500 text-white"
                            : "hover:bg-stone-100"
                        }`}
                        onClick={() => handleDateChange(date.getDate())}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 flex items-center justify-center"
              onClick={handleAddToSchedule}
            >
              <Plus size={16} className="mr-1" /> Add to Schedule
            </Button>
          </div>
        </SoftPanel>

        <SoftPanel className="p-4">
          <h3 className="text-lg font-medium mb-4">Current Schedule</h3>

          <div className="h-[480px] overflow-y-auto space-y-2">
            {rotaEntries.length > 0 ? (
              rotaEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white p-3 rounded-sm shadow-sm flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{entry.doctor}</div>
                    <div className="text-sm text-stone-500">
                      {entry.department} - {entry.shift} - {entry.date}
                    </div>
                  </div>
                  <Button
                    className="bg-red-500/30 hover:bg-red-500 px-2 py-1 flex items-center justify-center"
                    onClick={() => handleRemoveFromSchedule(entry.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-stone-500">
                <Calendar size={32} className="text-teal-500 mb-3" />
                <p>No shifts scheduled</p>
              </div>
            )}
          </div>
        </SoftPanel>
      </div>
    </div>
  );
};

// Main Shift Management Component
const Schedule = () => {
  const [view, setView] = useState("main"); // main, rota, shifts

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.1 } },
  };

  return (
    <div>
      <Header>Shift Management</Header>

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
                onClick={() => setView("rota")}
              >
                <Calendar size={48} className="text-teal-600 mb-4" />
                <H2>Manage Rotas</H2>
                <p className="text-stone-500 mt-2 text-center">
                  Create and edit staff schedules
                </p>
              </SoftPanel>

              <SoftPanel
                className="flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-stone-50/80 transition-colors"
                onClick={() => setView("shifts")}
              >
                <Clock size={48} className="text-teal-600 mb-4" />
                <H2>Shift Types</H2>
                <p className="text-stone-500 mt-2 text-center">
                  Configure shift patterns and types
                </p>
              </SoftPanel>
            </div>
          </motion.div>
        )}

        {view === "rota" && (
          <motion.div
            key="rota"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="space-y-6 py-6 max-w-[1200px] justify-self-center w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <H2light>Rota Management</H2light>
              <Button
                className="bg-stone-50/40 hover:bg-stone-50/80 px-4 flex items-center justify-center"
                onClick={() => setView("main")}
              >
                <ArrowLeft size={16} className="mr-2" /> Back to Menu
              </Button>
            </div>

            <RotaManagementSection />
          </motion.div>
        )}

        {view === "shifts" && (
          <motion.div
            key="shifts"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="space-y-6 py-6 max-w-[900px] justify-self-center w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <H2light>Shift Type Management</H2light>
              <Button
                className="bg-stone-50/40 hover:bg-stone-50/80 px-4 flex items-center justify-center"
                onClick={() => setView("main")}
              >
                <ArrowLeft size={16} className="mr-2" /> Back to Menu
              </Button>
            </div>

            <ShiftTypesSection />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Schedule;
