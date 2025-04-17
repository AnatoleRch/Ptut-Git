import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import H2 from "../../components/H2";
import SoftPanel from "../../components/SoftPanel";
import Button from "../../components/Button";
import Dropdown from "../../components/Dropdown";
import {
  Users,
  UserPlus,
  User,
  Edit,
  Trash2,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { useStore, useConfirmStore } from "../../stores";
import H2light from "../../components/SectionHeader";
import { useOrg } from "../../stores";
import { getOrgById } from "../../services/firebase/orgService";
import { subscribeToDepartmentUsersMap } from "../../services/firebase/usersService";
import { getFunctions, httpsCallable, /*connectFunctionsEmulator*/ } from "firebase/functions";
import { passwordResetEmail } from "../../services/firebase/authService";

const functions = getFunctions();
// Uncomment to use emulators for development
//connectFunctionsEmulator(functions, 'localhost', 5001);

function Accounts() {
  const {
    orgId,
    roles,
    isMobile,
    //accounts: users,
    //setAccounts: setUsers,
  } = useStore();
  const { departments, setDepartments } = useOrg();
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("main"); // main, create, edit
  // Import the openConfirm function from the confirm store
  const openConfirm = useConfirmStore((state) => state.openConfirm);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    jobPost: "",
    phoneNumber: "",
    role: null,
    department: {},
  });

  useEffect(() => {
    if (!orgId) {
      return;
    }
    getOrgById(orgId).then((org) => {
      setDepartments(org.departmentsMap || {})
    })
    .catch((err) => {
      alert("Error fetching departments: " + err.message)
    })
    const unsubscribe = subscribeToDepartmentUsersMap(orgId, (updatedMap) => {
      let usersMap = {};
      Object.values(updatedMap).forEach(department => {
        usersMap = { ...usersMap, ...department.usersMap };
      });
      const users = Object.entries(usersMap).map(([userId, user]) => ({ id: userId, ...user }));
      setUsers(users);
    })
    return () => unsubscribe();
  }, [orgId]);

  const resetForm = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      jobPost: "",
      phoneNumber: "",
      role: null,
      department: {},
    });
  };

  const validateEmail = (email) => {
    return email.match(/^[0-9a-z]+(?:\.[0-9a-z]+)*@[a-z0-9]{1,}(?:\.[a-z]{2,})+$/);
  }

  const handleEditUser = (user) => {
    setFormData({
      ...user,
    });
    setView("create");
  };

  const handleDeleteUser = (userId) => {
    openConfirm({
      title: "Delete Account",
      message: (
        <>
          <p>
            Are you sure you want to DELETE account:
            <b>
              <br />
              {users.find((x) => x.id === userId).email}
              <br />
              {users.find((x) => x.id === userId).username} <br />
            </b>
          </p>
          <p className="mt-2 text-red-600 font-semibold">
            This action cannot be undone.
          </p>
        </>
      ),
      confirmText: "Delete",
      confirmColor: "red",
      icon: "danger",
      onConfirm: async () => {
        const deleteUser = httpsCallable(functions, 'deleteUser');
        const reqData = { id: userId, orgId };
        try {
          await deleteUser(reqData);
        } catch (err) {
          return alert("Failed to delete user: " + err.message);
        }
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const { email, firstName, lastName, role, department } = formData;

    if (
      !email.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !role ||
      !department
    ) {
      return alert("Please fill all required fields");
    }
    if (!validateEmail(email)) {
      return alert("Invalid email address");
    }

    formData.orgId = orgId;
    if (formData.id) {
      // Update existing user
      const updateUser = httpsCallable(functions, 'updateUser');
      try {
        await updateUser(formData);
      } catch (err) {
        return alert("Failed to update user: " + err.message);
      }
    } else {
      // Create new user
      const createUser = httpsCallable(functions, 'createUser');
      try {
        await createUser(formData);
        await passwordResetEmail(formData.email);
      } catch (err) {
        return alert("Failed to create new user: " + err.message);
      }
    }
    resetForm();
    setView("list");
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.1 } },
  };

  return (
    <div>
      <Header>User Management</Header>

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
                  setView("create");
                }}
              >
                <UserPlus size={48} className="text-teal-600 mb-4" />
                <H2>Create Account</H2>
                <p className="text-stone-500 mt-2 text-center">
                  Add a new user to the system
                </p>
              </SoftPanel>

              <SoftPanel
                className="flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-stone-50/80 transition-colors"
                onClick={() => setView("list")}
              >
                <Users size={48} className="text-teal-600 mb-4" />
                <H2>Manage Accounts</H2>
                <p className="text-stone-500 mt-2 text-center">
                  Edit or delete existing user accounts
                </p>
              </SoftPanel>
            </div>
          </motion.div>
        )}

        {view === "create" && (
          <motion.div
            key="create"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="space-y-6 py-6 max-w-[900px] justify-self-center w-full"
          >
            <div className="flex justify-between items-center">
              <H2light>{formData.id ? "Edit Account" : "Create Account"}</H2light>
              <Button
                  className="bg-stone-50/40 hover:bg-stone-50/80 px-4 flex items-center justify-center"
                  onClick={() => {
                    setView("main");
                  }}
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back
              </Button>
            </div>
            <SoftPanel className="space-y-6 px-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* <div>
                  <label className="block text-sm font-medium mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="username"
                  />
                </div> */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="555-123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    className="bg-white w-full"
                    items={departments ? Object.keys(departments)
                      .map((key) => ({ id: key, name: departments[key].name })) : []
                    }
                    placeholder={"Select Department"}
                    value={formData.department.name}
                    callback={(v) =>
                      setFormData({ ...formData, department: v })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Job Post
                  </label>
                  <input
                    type="text"
                    name="jobPost"
                    value={formData.jobPost}
                    onChange={handleInputChange}
                    className="w-full bg-stone-50/80 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Position title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    className="bg-white w-full"
                    items={Object.keys(roles || {})}
                    placeholder={"Select Role"}
                    value={formData.role}
                    callback={(v) => setFormData({ ...formData, role: v })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-4 pt-4">
                <div className="col-span-4" />
                <Button
                  className="col-span-1 bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={handleSubmit}
                >
                  {formData.id ? "Update" : "Create"}
                </Button>
                <Button
                  className="col-span-1 bg-red-50/20 hover:bg-red-50/50"
                  onClick={() => {
                    resetForm();
                    setView("list");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </SoftPanel>
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
            <div className="flex justify-between items-center">
              <H2light>Manage User Accounts</H2light>
              <Button
                className="bg-stone-50/40 hover:bg-stone-50/80 px-4 flex items-center justify-center"
                onClick={() => {
                  setView("main");
                }}
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <H2></H2>
              <Button
                className="bg-stone-50/40 hover:bg-stone-50/80 px-4 flex items-center justify-center"
                onClick={() => {
                  resetForm();
                  setView("create");
                }}
              >
                <Plus size={16} className="mr-2" /> Create User
              </Button>
            </div>

            {/* <Button
              className="bg-stone-50/40 hover:bg-stone-50/80 p-5 font-bold text-stone-900/50 hover:text-stone-900/80"
              onClick={() => {
                resetForm();
                setView("create");
              }}
            >
              CREATE NEW ACCOUNT
            </Button> */}

            <div className="space-y-4">
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <SoftPanel className={`${isMobile ? "p-2" : "py-3 px-4"}`}>
                    <div className="flex justify-between items-center w-full">
                      {/* Left side: username and name */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                        <div className="flex items-center">
                          <User
                            className="text-teal-600 mr-2"
                            size={isMobile ? 16 : 20}
                          />
                          {/* <span
                            className={`${isMobile ? "text-sm" : "font-bold"}`}
                          >
                            {user.username}
                          </span> */}
                        </div>
                        <div className="text-stone-600 text-sm sm:text-base">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-stone-500 text-sm sm:text-base">
                          {user.department?.name}
                        </div>
                      </div>

                      {/* Right side: action buttons */}
                      <div className="flex items-center">
                        {!isMobile ? (
                          <>
                            <Button
                              className="bg-yellow-500/30 hover:bg-yellow-500 px-3 py-1 mr-2 flex items-center justify-center"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit size={16} className="mr-1" /> Edit
                            </Button>
                            <Button
                              className="bg-red-500/30 hover:bg-red-500 px-3 py-1 flex items-center justify-center"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 size={16} className="mr-1" /> Delete
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              className="bg-yellow-500/30 hover:bg-yellow-500 px-2 py-1 text-xs mr-1 flex items-center justify-center"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit size={12} />
                            </Button>
                            <Button
                              className="bg-red-500/30 hover:bg-red-500 px-2 py-1 text-xs flex items-center justify-center"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 size={12} />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </SoftPanel>
                </motion.div>
              ))}

              {users.length === 0 && (
                <SoftPanel className="p-8 text-center">
                  <p className="text-stone-500">No users found</p>
                </SoftPanel>
              )}
            </div>

            {/* <SoftPanel className="grid grid-cols-1 bg-transparent border-transparent" shadow="false"> */}
            {/* <Button
              className="bg-stone-50/40 hover:bg-stone-50/80 p-5 font-bold text-stone-900/50 hover:text-stone-900/80"
              onClick={() => {
                resetForm();
                setView("create");
              }}
            >
              CREATE NEW ACCOUNT
            </Button> */}
            {/* </SoftPanel> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accounts;
