import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import H2 from "../../../components/H2";
import H2light from "../../../components/SectionHeader";
import { useOrg, useStore, useConfirmStore } from "../../../stores";
import SoftPanel from "../../../components/SoftPanel";
import Button from "../../../components/Button";
import {
  Building2,
  Layers,
  Home,
  PlusCircle,
  Trash2,
  Edit,
  Plus,
  ChevronDown,
} from "lucide-react";
import {
  createBuilding,
  removeBuilding,
  updateBuilding,
} from "../../../services/firebase/buildingsService";
import {
  createFloor,
  removeFloor,
  updateFloor,
} from "../../../services/firebase/floorsService";

function BuildingsSection() {
  //const { buildings = {}, setBuildings } = useStore();
  const { orgId } = useStore();
  const { buildings, setBuildings, org } = useOrg();
  const [view, setView] = useState("main");
  const [openBuilding, setOpenBuilding] = useState(null);
  const [openFloor, setOpenFloor] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({
    buildingName: "",
    floorNumber: "",
    roomNumber: "",
    oldBuildingName: "",
    oldFloorNumber: "",
    oldRoomNumber: "",
  });
  const { isMobile } = useStore();

  // Import the openConfirm function from the confirm store
  const openConfirm = useConfirmStore((state) => state.openConfirm);

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

  // Delete functions with confirmation dialogs
  const deleteBuilding = async (buildingId) => {
    openConfirm({
      title: "Delete Building",
      message: (
        <div>
          <p>
            Are you sure you want to delete <b>{buildings[buildingId].name}</b>?
          </p>
          <p className="mt-2 text-red-600 font-semibold">
            This will delete all floors and rooms in this building!
          </p>
        </div>
      ),
      confirmText: "Delete",
      confirmColor: "red",
      icon: "danger",
      onConfirm: async () => {
        try {
          await removeBuilding(orgId, buildingId, org);
          if (openBuilding === buildingId) {
            setOpenBuilding(null);
            setOpenFloor(null);
          }
        } catch (err) {
          alert("Failed to delete building: " + err.message);
        }
      },
    });
  };

  const deleteFloor = async (buildingId, floorId) => {
    openConfirm({
      title: "Delete Floor",
      message: (
        <div>
          <p>
            Are you sure you want to delete{" "}
            <b>{buildings[buildingId].floorsMap[floorId].name}</b>?
          </p>
          <p className="mt-2 text-red-600 font-semibold">
            This will delete all rooms on this floor!
          </p>
        </div>
      ),
      confirmText: "Delete",
      confirmColor: "red",
      icon: "danger",
      onConfirm: async () => {
        try {
          await removeFloor(orgId, buildingId, floorId, org);
          if (openFloor === floorId) {
            setOpenFloor(null);
          }
        } catch (err) {
          alert("Failed to delete floor: " + err.message);
        }
      },
    });
  };

  const deleteRoom = (buildingName, floorNumber, roomNumber) => {
    openConfirm({
      title: "Delete Room",
      message: (
        <p>
          Are you sure you want to delete room <b>{roomNumber}</b>?
        </p>
      ),
      confirmText: "Delete",
      confirmColor: "red",
      icon: "danger",
      onConfirm: () => {
        const updated = { ...buildings };
        delete updated[buildingName][floorNumber][roomNumber];
        if (Object.keys(updated[buildingName][floorNumber]).length === 0) {
          delete updated[buildingName][floorNumber];
          // Clear floor selection if this was the last room
          setOpenFloor(null);

          if (Object.keys(updated[buildingName]).length === 0) {
            delete updated[buildingName];
            // Clear building selection if this was the last floor
            setOpenBuilding(null);
          }
        }
        setBuildings(updated);
      },
    });
  };

  // Add functions
  // const addBuilding = () => {
  //   setEditMode("add-building");
  //   setEditData({
  //     buildingName: "",
  //     oldBuildingName: "",
  //   });
  //   setView("edit");
  // };

  // const addFloor = (buildingId) => {
  //   setEditMode("add-floor");
  //   setEditData({
  //     buildingId,
  //     buildingName: buildings[buildingId].name,
  //     floorNumber: "",
  //   });
  //   setView("edit");
  // };

  // const addRoom = (buildingName, floorNumber) => {
  //   setEditMode("add-room");
  //   setEditData({
  //     ...editData,
  //     buildingName,
  //     floorNumber,
  //     roomNumber: "",
  //     oldBuildingName: "",
  //     oldFloorNumber: "",
  //     oldRoomNumber: "",
  //   });
  //   setView("edit");
  // };

  // Add functions with confirmations
  const addBuilding = () => {
    setEditMode("add-building");
    setEditData({
      buildingName: "",
      oldBuildingName: "",
    });
    setView("edit");
  };

  const addFloor = (buildingId) => {
    setEditMode("add-floor");
    setEditData({
      buildingId,
      buildingName: buildings[buildingId].name,
      floorNumber: "",
    });
    setView("edit");
  };

  const addRoom = (buildingName, floorNumber) => {
    setEditMode("add-room");
    setEditData({
      ...editData,
      buildingName,
      floorNumber,
      roomNumber: "",
      oldBuildingName: "",
      oldFloorNumber: "",
      oldRoomNumber: "",
    });
    setView("edit");
  };

  // Edit functions
  const editBuilding = (buildingId) => {
    const buildingName = buildings[buildingId].name;
    setEditMode("edit-building");
    setEditData({
      buildingId,
      buildingName: buildingName,
      oldBuildingName: buildingName,
    });
    setView("edit");
  };

  const editFloor = (buildingId, floorId) => {
    const building = buildings[buildingId];
    const floorNumber = building.floorsMap[floorId].name;
    setEditMode("edit-floor");
    setEditData({
      buildingId,
      buildingName: building.name,
      floorId,
      floorNumber: floorNumber,
      oldFloorNumber: floorNumber,
    });
    setView("edit");
  };

  const editRoom = (buildingName, floorNumber, roomNumber) => {
    setEditMode("edit-room");
    setEditData({
      buildingName: buildingName,
      floorNumber: floorNumber,
      roomNumber: roomNumber,
      oldBuildingName: buildingName,
      oldFloorNumber: floorNumber,
      oldRoomNumber: roomNumber,
    });
    setView("edit");
  };

  // Handle form submission with confirmation
  const handleSubmit = async () => {
    // Validate form data
    if (editMode.includes("building") && !editData.buildingName.trim()) {
      alert("Building name is required");
      return;
    } else if (editMode.includes("floor") && !editData.floorNumber.trim()) {
      alert("Floor number is required");
      return;
    } else if (editMode.includes("room") && !editData.roomNumber.trim()) {
      alert("Room number is required");
      return;
    }

    // Add operations
    // if (editMode === "add-building") {
    //   const newData = {name: editData.buildingName, orgId: orgId};
    //   try {
    //     await createBuilding(orgId, newData, org);
    //     setOpenBuilding(null);
    //     setView("main");
    //     setEditMode(null);
    //   } catch (err) {
    //     alert("Failed to add building: " + err.message);
    //   }
    // } else if (editMode === "add-floor") {
    //   const newData = {name: editData.floorNumber, buildingId: editData.buildingId};
    //   try {
    //     await createFloor(orgId, editData.buildingId, newData, org);
    //     setOpenBuilding(editData.buildingId);
    //     setView("main");
    //     setEditMode(null);
    //   } catch (err) {
    //     alert("Failed to add floor: " + err.message);
    //   }
    // } else if (editMode === "add-room") {
    //   if (
    //     buildings[editData.buildingName][editData.floorNumber][
    //       editData.roomNumber
    //     ]
    //   ) {
    //     alert("Room already exists");
    //     return;
    //   }
    //   setBuildings({
    //     ...buildings,
    //     [editData.buildingName]: {
    //       ...buildings[editData.buildingName],
    //       [editData.floorNumber]: {
    //         ...buildings[editData.buildingName][editData.floorNumber],
    //         [editData.roomNumber]: true,
    //       },
    //     },
    //   });
    //   setView("main");
    //   setEditMode(null);
    // }
    // Handle add operations
    if (editMode === "add-building") {
      const newData = { name: editData.buildingName, orgId: orgId };
      openConfirm({
        title: "Add Building",
        message: (
          <p>
            Are you sure you want to add building <b>{editData.buildingName}</b>
            ?
          </p>
        ),
        confirmText: "Add",
        confirmColor: "teal",
        icon: "info",
        onConfirm: async () => {
          try {
            await createBuilding(orgId, newData, org);
            setOpenBuilding(null);
            setView("main");
            setEditMode(null);
          } catch (err) {
            alert("Failed to add building: " + err.message);
          }
        },
      });
    } else if (editMode === "add-floor") {
      const newData = {
        name: editData.floorNumber,
        buildingId: editData.buildingId,
      };
      openConfirm({
        title: "Add Floor",
        message: (
          <p>
            Are you sure you want to add floor <b>{editData.floorNumber}</b> to
            building <b>{editData.buildingName}</b>?
          </p>
        ),
        confirmText: "Add",
        confirmColor: "teal",
        icon: "info",
        onConfirm: async () => {
          try {
            await createFloor(orgId, editData.buildingId, newData, org);
            setOpenBuilding(editData.buildingId);
            setView("main");
            setEditMode(null);
          } catch (err) {
            alert("Failed to add floor: " + err.message);
          }
        },
      });
    } else if (editMode === "add-room") {
      if (
        buildings[editData.buildingName][editData.floorNumber][
          editData.roomNumber
        ]
      ) {
        alert("Room already exists");
        return;
      }
      openConfirm({
        title: "Add Room",
        message: (
          <p>
            Are you sure you want to add room <b>{editData.roomNumber}</b> to
            floor <b>{editData.floorNumber}</b>?
          </p>
        ),
        confirmText: "Add",
        confirmColor: "teal",
        icon: "info",
        onConfirm: () => {
          setBuildings({
            ...buildings,
            [editData.buildingName]: {
              ...buildings[editData.buildingName],
              [editData.floorNumber]: {
                ...buildings[editData.buildingName][editData.floorNumber],
                [editData.roomNumber]: true,
              },
            },
          });
          setView("main");
          setEditMode(null);
        },
      });
    }

    // Edit operations with confirmation
    else if (editMode === "edit-building") {
      if (editData.buildingName !== editData.oldBuildingName) {
        openConfirm({
          title: "Update Building",
          message: (
            <p>
              Are you sure you want to rename building{" "}
              <b>{editData.oldBuildingName}</b> to{" "}
              <b>{editData.buildingName}</b>?
            </p>
          ),
          confirmText: "Update",
          confirmColor: "teal",
          icon: "info",
          onConfirm: async () => {
            const updatedData = {
              name: editData.buildingName,
              buildingId: editData.buildingId,
            };
            try {
              await updateBuilding(
                orgId,
                editData.buildingId,
                updatedData,
                org
              );
              setView("main");
              setEditMode(null);
            } catch (err) {
              alert("Failed to update building: " + err.message);
            }
          },
        });
      } else {
        setView("main");
        setEditMode(null);
      }
    } else if (editMode === "edit-floor") {
      if (editData.floorNumber !== editData.oldFloorNumber) {
        openConfirm({
          title: "Update Floor",
          message: (
            <p>
              Are you sure you want to rename floor{" "}
              <b>{editData.oldFloorNumber}</b> to <b>{editData.floorNumber}</b>?
            </p>
          ),
          confirmText: "Update",
          confirmColor: "teal",
          icon: "info",
          onConfirm: async () => {
            const updatedData = { name: editData.floorNumber, orgId: orgId };
            try {
              await updateFloor(
                orgId,
                editData.buildingId,
                editData.floorId,
                updatedData,
                org
              );
              setView("main");
              setEditMode(null);
            } catch (err) {
              alert("Failed to update floor: " + err.message);
            }
          },
        });
      } else {
        setView("main");
        setEditMode(null);
      }
    }

    // Edit operations for room
    else if (editMode === "edit-room") {
      if (editData.roomNumber !== editData.oldRoomNumber) {
        if (
          buildings[editData.buildingName][editData.floorNumber][
            editData.roomNumber
          ]
        ) {
          alert("Room number already exists");
          return;
        }

        openConfirm({
          title: "Update Room",
          message: (
            <p>
              Are you sure you want to rename room{" "}
              <b>{editData.oldRoomNumber}</b> to <b>{editData.roomNumber}</b>?
            </p>
          ),
          confirmText: "Update",
          confirmColor: "teal",
          icon: "info",
          onConfirm: () => {
            // Create new object with updated room number
            const newBuildings = { ...buildings };
            newBuildings[editData.buildingName][editData.floorNumber][
              editData.roomNumber
            ] =
              newBuildings[editData.buildingName][editData.floorNumber][
                editData.oldRoomNumber
              ];
            delete newBuildings[editData.buildingName][editData.floorNumber][
              editData.oldRoomNumber
            ];

            setBuildings(newBuildings);
            setView("main");
            setEditMode(null);
          },
        });
      } else {
        setView("main");
        setEditMode(null);
      }
    }

    // else if (editMode === "edit-room") {
    //   if (editData.roomNumber !== editData.oldRoomNumber) {
    //     if (
    //       buildings[editData.buildingName][editData.floorNumber][
    //         editData.roomNumber
    //       ]
    //     ) {
    //       alert("Room number already exists");
    //       return;
    //     }

    //     openConfirm({
    //       title: "Update Room",
    //       message: (
    //         <p>
    //           Are you sure you want to rename room{" "}
    //           <b>{editData.oldRoomNumber}</b> to <b>{editData.roomNumber}</b>?
    //         </p>
    //       ),
    //       confirmText: "Update",
    //       confirmColor: "teal",
    //       icon: "info",
    //       onConfirm: () => {
    //         // Create new object with updated room number
    //         const newBuildings = { ...buildings };
    //         newBuildings[editData.buildingName][editData.floorNumber][
    //           editData.roomNumber
    //         ] =
    //           newBuildings[editData.buildingName][editData.floorNumber][
    //             editData.oldRoomNumber
    //           ];
    //         delete newBuildings[editData.buildingName][editData.floorNumber][
    //           editData.oldRoomNumber
    //         ];

    //         setBuildings(newBuildings);
    //         setView("main");
    //         setEditMode(null);
    //       },
    //     });
    //   } else {
    //     setView("main");
    //     setEditMode(null);
    //   }
    // }
  };

  // Toggle handler for floors - ensures only one floor is open at a time
  const toggleFloor = (buildingName, floorNumber) => {
    if (openFloor === floorNumber) {
      setOpenFloor(null);
    } else {
      setOpenFloor(floorNumber);
    }
  };

  // Back button handler for building/floor view
  const handleBack = () => {
    if (openFloor) {
      // If a floor is open, go back to building view
      setOpenFloor(null);
    } else if (openBuilding) {
      // If a building is open, go back to list view
      setOpenBuilding(null);
    }
  };

  // Render function to show different views based on selection
  const renderContent = () => {
    // If no buildings exist
    if (Object.keys(buildings).length === 0) {
      return (
        <SoftPanel className={`${isMobile ? "p-4" : "p-8"} text-center`}>
          <div className="flex flex-col items-center justify-center text-stone-500">
            <Building2
              size={isMobile ? 24 : 32}
              className="text-teal-500 mb-3"
            />
            <p className={isMobile ? "text-sm" : ""}>
              No buildings created yet
            </p>
          </div>
        </SoftPanel>
      );
    }

    // If a specific floor is open
    if (openBuilding && openFloor) {
      const floor = buildings[openBuilding].floorsMap[openFloor] || {};
      const rooms = {}; //buildings[openBuilding][openFloor];
      return (
        <div className="space-y-2">
          <SoftPanel className={`${isMobile ? "p-2" : "py-3 px-4"}`}>
            <div className="flex justify-between items-center w-full">
              <div
                className="flex items-center cursor-pointer"
                onClick={handleBack}
              >
                <ChevronDown
                  size={isMobile ? 14 : 16}
                  className="mr-2 transition-transform duration-300 hover:rotate-[90deg]"
                />
                <Layers
                  className="text-teal-600 mr-2"
                  size={isMobile ? 14 : 18}
                />
                <span className={`${isMobile ? "text-sm" : "font-bold"}`}>
                  Floor: {floor.name} ({buildings[openBuilding].name})
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-sm text-stone-500 mr-3">
                  {Object.keys(rooms).length} room
                  {Object.keys(rooms).length !== 1 ? "s" : ""}
                </span>

                {!isMobile ? (
                  <>
                    <Button
                      className="bg-green-500/30 hover:bg-green-500 px-3 py-1 mr-2 flex items-center justify-center"
                      onClick={() => addRoom(openBuilding, openFloor)}
                    >
                      <Plus size={16} className="mr-1" /> Add Room
                    </Button>
                    <Button
                      className="bg-yellow-500/30 hover:bg-yellow-500 px-3 py-1 mr-2 flex items-center justify-center"
                      onClick={() => editFloor(openBuilding, openFloor)}
                    >
                      <Edit size={16} className="mr-1" /> Edit
                    </Button>
                    <Button
                      className="bg-red-500/30 hover:bg-red-500 px-3 py-1 flex items-center justify-center"
                      onClick={() => deleteFloor(openBuilding, openFloor)}
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button>
                  </>
                ) : (
                  <div className="flex">
                    <Button
                      className="bg-green-500/30 hover:bg-green-500 px-2 py-1 text-xs mr-1 flex items-center justify-center"
                      onClick={() => addRoom(openBuilding, openFloor)}
                    >
                      <Plus size={12} />
                    </Button>
                    <Button
                      className="bg-yellow-500/30 hover:bg-yellow-500 px-2 py-1 text-xs mr-1 flex items-center justify-center"
                      onClick={() => editFloor(openBuilding, openFloor)}
                    >
                      <Edit size={12} />
                    </Button>
                    <Button
                      className="bg-red-500/30 hover:bg-red-500 px-2 py-1 text-xs flex items-center justify-center"
                      onClick={() => deleteFloor(openBuilding, openFloor)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SoftPanel>

          {isMobile && (
            <div className="flex gap-1 mt-2">
              <Button
                className="w-full bg-yellow-500/30 hover:bg-yellow-500 py-1 text-xs flex items-center justify-center"
                onClick={() => addRoom(openBuilding, openFloor)}
              >
                <Plus size={12} className="mr-0.5" /> Add Room
              </Button>
            </div>
          )}

          <div className={`mt-${isMobile ? "2" : "4"}`}>
            {Object.entries(rooms).length > 0 ? (
              Object.entries(rooms).map(([roomNumber, active]) => (
                <motion.div
                  key={roomNumber}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                  className="my-1 pl-6"
                >
                  <SoftPanel className={`${isMobile ? "p-2" : "py-3 px-4"}`}>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center">
                        <Home
                          className="text-teal-600 mr-2"
                          size={isMobile ? 14 : 16}
                        />
                        <span className={`${isMobile ? "text-sm" : ""}`}>
                          Room:{" "}
                          <span className="font-medium">{roomNumber}</span> -
                          Status:{" "}
                          <span className="font-medium">
                            {active ? "Active" : "Inactive"}
                          </span>
                        </span>
                      </div>

                      <div className="flex">
                        {!isMobile ? (
                          <>
                            <Button
                              className="bg-yellow-500/30 hover:bg-yellow-500 px-3 py-1 mr-2 flex items-center justify-center"
                              onClick={() =>
                                editRoom(openBuilding, openFloor, roomNumber)
                              }
                            >
                              <Edit size={16} className="mr-1" /> Edit
                            </Button>
                            <Button
                              className="bg-red-500/30 hover:bg-red-500 px-3 py-1 flex items-center justify-center"
                              onClick={() =>
                                deleteRoom(openBuilding, openFloor, roomNumber)
                              }
                            >
                              <Trash2 size={16} className="mr-1" /> Delete
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              className="bg-yellow-500/30 hover:bg-yellow-500 px-2 py-1 text-xs mr-1 flex items-center justify-center"
                              onClick={() =>
                                editRoom(openBuilding, openFloor, roomNumber)
                              }
                            >
                              <Edit size={12} />
                            </Button>
                            <Button
                              className="bg-red-500/30 hover:bg-red-500 px-2 py-1 text-xs flex items-center justify-center"
                              onClick={() =>
                                deleteRoom(openBuilding, openFloor, roomNumber)
                              }
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
              <div className="text-center py-2 text-stone-500 text-sm">
                No rooms added to this floor yet
              </div>
            )}
          </div>
        </div>
      );
    }

    // If a specific building is open
    if (openBuilding) {
      const floors = buildings[openBuilding]?.floorsMap || {};
      return (
        <div className="space-y-2">
          <SoftPanel className={`${isMobile ? "p-2" : "py-3 px-4"}`}>
            <div className="flex justify-between items-center w-full">
              <div
                className="flex items-center cursor-pointer"
                onClick={handleBack}
              >
                <ChevronDown
                  size={isMobile ? 14 : 16}
                  className="mr-2 transition-transform duration-300 hover:rotate-[90deg]"
                />
                <Building2
                  className="text-teal-600 mr-2"
                  size={isMobile ? 16 : 20}
                />
                <span className={`${isMobile ? "text-sm" : "font-bold"}`}>
                  {buildings[openBuilding]?.name}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-sm text-stone-500 mr-3">
                  {Object.keys(floors).length} floor
                  {Object.keys(floors).length !== 1 ? "s" : ""}
                </span>

                {!isMobile ? (
                  <>
                    <Button
                      className="bg-green-500/30 hover:bg-green-500 px-3 py-1 mr-2 flex items-center justify-center"
                      onClick={() => addFloor(openBuilding)}
                    >
                      <Plus size={16} className="mr-1" /> Add Floor
                    </Button>
                    <Button
                      className="bg-yellow-500/30 hover:bg-yellow-500 px-3 py-1 mr-2 flex items-center justify-center"
                      onClick={() => editBuilding(openBuilding)}
                    >
                      <Edit size={16} className="mr-1" /> Edit
                    </Button>
                    <Button
                      className="bg-red-500/30 hover:bg-red-500 px-3 py-1 flex items-center justify-center"
                      onClick={() => deleteBuilding(openBuilding)}
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button>
                  </>
                ) : (
                  <div className="flex">
                    <Button
                      className="bg-green-500/30 hover:bg-green-500 px-2 py-1 text-xs mr-1 flex items-center justify-center"
                      onClick={() => addFloor(openBuilding)}
                    >
                      <Plus size={12} />
                    </Button>
                    <Button
                      className="bg-yellow-500/30 hover:bg-yellow-500 px-2 py-1 text-xs mr-1 flex items-center justify-center"
                      onClick={() => editBuilding(openBuilding)}
                    >
                      <Edit size={12} />
                    </Button>
                    <Button
                      className="bg-red-500/30 hover:bg-red-500 px-2 py-1 text-xs flex items-center justify-center"
                      onClick={() => deleteBuilding(openBuilding)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SoftPanel>

          {isMobile && (
            <div className="flex gap-1 mt-2">
              <Button
                className="w-full bg-yellow-500/30 hover:bg-yellow-500 py-1 text-xs flex items-center justify-center"
                onClick={() => addFloor(openBuilding)}
              >
                <Plus size={12} className="mr-0.5" /> Add Floor
              </Button>
            </div>
          )}

          <div className={`mt-${isMobile ? "2" : "4"}`}>
            {Object.keys(floors).length > 0 ? (
              Object.entries(floors).map(([floorId, floor]) => (
                <motion.div
                  key={floorId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                  className="my-1 pl-6"
                >
                  <SoftPanel className={`${isMobile ? "p-2" : "py-3 px-4"}`}>
                    <div className="flex justify-between items-center w-full">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleFloor(openBuilding, floorId)}
                      >
                        <Layers
                          className="text-teal-600 mr-2"
                          size={isMobile ? 14 : 18}
                        />
                        <span
                          className={`${isMobile ? "text-sm" : "font-bold"}`}
                        >
                          Floor: {floor.name}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-sm text-stone-500 mr-3">
                          {Object.keys(/*floor.roomsMap*/ {}).length} room
                          {Object.keys(/*floor.roomsMap*/ {}).length !== 1
                            ? "s"
                            : ""}
                        </span>

                        {!isMobile ? (
                          <>
                            <Button
                              className="bg-yellow-500/30 hover:bg-yellow-500 px-3 py-1 mr-2 flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                editFloor(openBuilding, floorId);
                              }}
                            >
                              <Edit size={16} className="mr-1" /> Edit
                            </Button>
                            <Button
                              className="bg-red-500/30 hover:bg-red-500 px-3 py-1 flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFloor(openBuilding, floorId);
                              }}
                            >
                              <Trash2 size={16} className="mr-1" /> Delete
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              className="bg-yellow-500/30 hover:bg-yellow-500 px-2 py-1 text-xs mr-1 flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                editFloor(openBuilding, floorId);
                              }}
                            >
                              <Edit size={12} />
                            </Button>
                            <Button
                              className="bg-red-500/30 hover:bg-red-500 px-2 py-1 text-xs flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFloor(openBuilding, floorId);
                              }}
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
              <div className="text-center py-2 text-stone-500 text-sm">
                No floors added to this building yet
              </div>
            )}
          </div>
        </div>
      );
    }

    // Default view - list of all buildings
    return (
      <div className="space-y-2">
        {Object.entries(buildings)
          .sort((a, b) => a[1].createdAt - b[1].createdAt)
          .map(([buildingId, building]) => (
            <motion.div
              key={buildingId}
              variants={itemVariants}
              initial="initial"
              animate="animate"
            >
              <SoftPanel className={`${isMobile ? "p-2" : "py-3 px-4"}`}>
                <div className="flex justify-between items-center w-full">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => setOpenBuilding(buildingId)}
                  >
                    <Building2
                      className="text-teal-600 mr-2"
                      size={isMobile ? 16 : 20}
                    />
                    <span className={`${isMobile ? "text-sm" : "font-bold"}`}>
                      {building.name}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-sm text-stone-500 mr-3">
                      {building.floorsMap
                        ? Object.keys(building.floorsMap).length
                        : "0"}{" "}
                      floor
                      {!building.floorsMap ||
                      Object.keys(building.floorsMap).length !== 1
                        ? "s"
                        : ""}
                    </span>

                    {!isMobile ? (
                      <>
                        <Button
                          className="bg-green-500/30 hover:bg-green-500 px-3 py-1 mr-2 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            addFloor(buildingId);
                          }}
                        >
                          <Plus size={16} className="mr-1" /> Add Floor
                        </Button>
                        <Button
                          className="bg-yellow-500/30 hover:bg-yellow-500 px-3 py-1 mr-2 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            editBuilding(buildingId);
                          }}
                        >
                          <Edit size={16} className="mr-1" /> Edit
                        </Button>
                        <Button
                          className="bg-red-500/30 hover:bg-red-500 px-3 py-1 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteBuilding(buildingId);
                          }}
                        >
                          <Trash2 size={16} className="mr-1" /> Delete
                        </Button>
                      </>
                    ) : (
                      <div className="flex">
                        <Button
                          className="bg-green-500/30 hover:bg-green-500 px-2 py-1 text-xs mr-1 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            addFloor(buildingId);
                          }}
                        >
                          <Plus size={12} />
                        </Button>
                        <Button
                          className="bg-yellow-500/30 hover:bg-yellow-500 px-2 py-1 text-xs mr-1 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            editBuilding(buildingId);
                          }}
                        >
                          <Edit size={12} />
                        </Button>
                        <Button
                          className="bg-red-500/30 hover:bg-red-500 px-2 py-1 text-xs flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteBuilding(buildingId);
                          }}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SoftPanel>
            </motion.div>
          ))}
      </div>
    );
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
              <H2></H2>
              <Button
                className={`
                  bg-stone-50/40 hover:bg-stone-50/80 px-4 
                  flex items-center justify-center
                  ${isMobile ? "w-full py-3" : ""}
                `}
                onClick={addBuilding}
              >
                <Plus size={16} className="mr-2" /> Add Building
              </Button>
            </div>

            {renderContent()}
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
                {editMode.includes("add")
                  ? editMode === "add-building"
                    ? "Add New Building"
                    : editMode === "add-floor"
                    ? `Add Floor to Building: ${editData.buildingName}`
                    : `Add Room to Floor: ${editData.floorNumber}`
                  : editMode === "edit-building"
                  ? `Edit Building: ${editData.oldBuildingName}`
                  : editMode === "edit-floor"
                  ? `Edit Floor: ${editData.oldFloorNumber} (${editData.buildingName})`
                  : `Edit Room: ${editData.oldRoomNumber}`}
              </H2light>
            </div>

            <SoftPanel
              className={`space-y-4 ${isMobile ? "px-3 py-3" : "px-6 py-4"}`}
            >
              <div className="grid grid-cols-2 gap-4">
                {editMode.includes("building") && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Building Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editData.buildingName}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          buildingName: e.target.value,
                        })
                      }
                      className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Enter building name"
                    />
                  </div>
                )}

                {editMode.includes("floor") && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Floor Name/Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editData.floorNumber}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          floorNumber: e.target.value,
                        })
                      }
                      className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Enter floor number"
                    />
                  </div>
                )}

                {editMode.includes("room") && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Room Name/Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editData.roomNumber}
                      onChange={(e) =>
                        setEditData({ ...editData, roomNumber: e.target.value })
                      }
                      className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Enter room number"
                    />
                  </div>
                )}
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
                  className={`
                    ${isMobile ? "w-full" : "col-span-1"} 
                    bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-sm 
                    flex items-center justify-center
                  `}
                  onClick={handleSubmit}
                >
                  {editMode.includes("add") ? (
                    <>
                      <PlusCircle size={16} className="mr-1" />
                      Create
                    </>
                  ) : (
                    <>
                      <Edit size={16} className="mr-1" />
                      Save
                    </>
                  )}
                </Button>
                <Button
                  className={`
                    ${isMobile ? "w-full" : "col-span-1"} 
                    bg-red-50/20 hover:bg-red-50/50 px-4 py-2 rounded-sm
                  `}
                  onClick={() => {
                    setEditData({
                      buildingName: "",
                      floorNumber: "",
                      roomNumber: "",
                      oldBuildingName: "",
                      oldFloorNumber: "",
                      oldRoomNumber: "",
                    });
                    setEditMode(null);
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

export default BuildingsSection;
