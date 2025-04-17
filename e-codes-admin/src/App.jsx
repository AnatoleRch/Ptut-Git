import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate, Navigate } from "react-router-dom";
import { logoutUser } from "./services/firebase/authService";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  Users,
  Building2,
  QrCode,
  HospitalIcon,
  Siren,
  User,
  ClipboardList,
  Menu,
  ChevronLeft,
  LogOut,
  LogOutIcon,
} from "lucide-react";

// Import your components
import Alerts from "./pages/Alerts/Alerts";
import Accounts from "./pages/Accounts/Accounts";
import Schedule from "./pages/Schedule/Schedule";
import Organisation from "./pages/Organisation/Organisation";
import Codes from "./pages/Codes/Codes";
import { useStore } from "./stores";
import Login from "./pages/Login/Login";
import { AuthProvider, useAuth } from "./services/AuthContext";
import Header from "./components/Header";
import System from "./pages/System/System";

const navItems = [
  { name: "Organisation Setup", path: "/organisation", icon: HospitalIcon },
  { name: "User Management", path: "/accounts", icon: Users },
  { name: "Shift Management", path: "/schedule", icon: Calendar },
  { name: "Emergency Codes", path: "/ecodes", icon: AlertTriangle },
  { name: "System Reports", path: "/system", icon: ClipboardList },
  { name: "Active Alerts", path: "/", icon: Siren },
];

// Protected route component
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" />;
};

const LoginRoute = () => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/" /> : <PrivateRoute />;
}

function App() {
  const { user, setUser } = useStore();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const [key, setKey] = useState(Math.random());

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setKey(Math.random());
  }, [isMobile]);

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);

      if (mobileView) {
        setIsSidebarExpanded(false);
      } else {
        setIsSidebarExpanded(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar function
  const toggleSidebar = () => {
    if (isMobile) {
      // For mobile, when the menu button is clicked,
      // we'll show a full-screen modal sidebar
      document.body.style.overflow = !isSidebarExpanded ? "hidden" : "";
    }
    setIsSidebarExpanded(!isSidebarExpanded);
  };


  //useEffect(() => console.log(user), [user]);

  // Add this hook at the component level where your NavLink is defined
  const navigate = useNavigate();

  // Then create this handleLogout function
  const handleLogout = async () => {
    try {
      await logoutUser();
      // You might want to clear any user state in your store as well
      setUser(null);
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Failed to log out:", error);
      // Optionally show an error message to the user
    }
  };

  return (
    <div key={key} className="flex h-screen bg-blue-100 text-gray-800">
      <div className="bg-gradient-to-br from-teal-700/80 via-teal-600/60 to-teal-300/60 w-screen h-screen fixed" />

      <AuthProvider>
        {user ? (
          <>
            {/* Sidebar - Full screen modal on mobile when expanded */}
            <motion.nav
              initial={false}
              animate={{
                x: isMobile && !isSidebarExpanded ? "-100%" : 0,
                opacity: isMobile && !isSidebarExpanded ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
              className={`
    z-30 text-white
    ${isMobile ? "bg-teal-700 fixed inset-0 w-full h-full" : "bg-teal-700/30"}
    ${
      !isMobile && isSidebarExpanded
        ? "w-[280px] border-r-4 border-r-teal-700/40"
        : !isMobile
        ? "w-[80px] border-r-4 border-r-teal-700/40"
        : ""
    }
  `}
              style={{
                pointerEvents: isMobile && !isSidebarExpanded ? "none" : "auto",
              }}
            >
              <div className="p-6 h-[100vh] overflow-y-auto">
                <div className="flex items-center mt-6 mb-8">
                  {isSidebarExpanded ? (
                    <>
                      <motion.h1
                        className="text-2xl font-semibold text-white tracking-tight"
                        initial={isMobile && { opacity: 0, y: -20 }}
                        animate={
                          isMobile && isSidebarExpanded
                            ? { opacity: 1, y: 0 }
                            : {}
                        }
                        transition={{ delay: 0.1 }}
                      >
                        E-Codes Admin
                      </motion.h1>
                      <motion.button
                        onClick={toggleSidebar}
                        className="text-white hover:text-teal-200 transition-colors cursor-pointer ml-auto"
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <ChevronLeft size={24} />
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      onClick={toggleSidebar}
                      className="text-white hover:text-teal-200 transition-colors mx-auto cursor-pointer"
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Menu size={24} />
                    </motion.button>
                  )}
                </div>

                {/* <div className="flex items-center mt-6 mb-8">
                  {isSidebarExpanded ? (
                    <>
                      <motion.h1
                        className="text-2xl font-semibold text-white tracking-tight"
                        initial={isMobile && { opacity: 0, y: -20 }}
                        animate={
                          isMobile && isSidebarExpanded
                            ? { opacity: 1, y: 0 }
                            : {}
                        }
                        transition={{ delay: 0.1 }}
                      >
                        E-Codes Admin
                      </motion.h1>
                      <motion.button
                        onClick={toggleSidebar}
                        className="text-white hover:text-teal-200 transition-colors mr-3 cursor-pointer right-2 fixed md:right-0 md:relative"
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <ChevronLeft size={24} />
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      onClick={toggleSidebar}
                      className="text-white hover:text-teal-200 transition-colors mx-auto cursor-pointer"
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Menu size={24} />
                    </motion.button>
                  )}
                </div> */}

                <ul className="space-y-2">
                  {navItems.map((Item) => (
                    <motion.li
                      key={Item.path}
                      className="flex justify-center"
                      initial={isMobile && { x: -50, opacity: 0 }}
                      animate={
                        isMobile && isSidebarExpanded
                          ? { x: 0, opacity: 1 }
                          : {}
                      }
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <NavLink
                        to={Item.path}
                        className={({ isActive }) => `
                          flex items-center ${
                            isSidebarExpanded
                              ? "px-4 w-full"
                              : "px-2 w-12 h-12 justify-center"
                          } 
                          py-3 rounded-sm transition-all duration-300 group
                          ${
                            isActive
                              ? "bg-white text-teal-700 shadow-md"
                              : "bg-teal-700/50 text-white hover:bg-white/50 hover:text-teal-700"
                          }
                        `}
                        title={!isSidebarExpanded ? Item.name : ""}
                        onClick={() => isMobile && toggleSidebar()} // Close menu when item is clicked on mobile
                      >
                        <Item.icon
                          className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                          style={{
                            marginRight: isSidebarExpanded ? "16px" : "0",
                          }}
                        />
                        {isSidebarExpanded && (
                          <span className="font-medium">{Item.name}</span>
                        )}
                      </NavLink>
                    </motion.li>
                  ))}

                  <motion.li className="flex justify-center mt-8">
                    <NavLink
                      className={({ isActive }) => `
                          flex items-center ${
                            isSidebarExpanded
                              ? "px-4 w-full"
                              : "px-2 w-12 h-12 justify-center"
                          } 
                          py-3 rounded-sm transition-all duration-300 group
                          ${
                            isActive
                              ? "bg-white/50 hover:bg-white text-teal-700 shadow-md"
                              : "bg-teal-700/50 text-white hover:bg-white/50 hover:text-teal-700"
                          }
                        `}
                      title={!isSidebarExpanded ? "asdasdasd" : ""}
                      onClick={handleLogout} // Close menu when item is clicked on mobile
                    >
                      <LogOutIcon
                        className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                        style={{
                          marginRight: isSidebarExpanded ? "16px" : "0",
                        }}
                      />
                      {isSidebarExpanded && (
                        <span className="font-medium">Logout</span>
                      )}
                    </NavLink>
                  </motion.li>
                </ul>
              </div>
            </motion.nav>

            {/* Mobile Bottom Navigation Bar */}
            {isMobile && (
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 bg-teal-700 h-16 z-20 flex justify-between items-center px-6 shadow-lg"
              >
                <div className="flex-1 flex justify-center">
                  <NavLink
                    to="/"
                    className={({ isActive }) => `
                      flex flex-col items-center justify-center p-2 rounded-md
                      ${
                        isActive
                          ? "text-white"
                          : "text-teal-200 hover:text-white transition-colors"
                      }
                    `}
                  >
                    <Siren size={24} />
                    <span className="text-xs mt-1">Alerts</span>
                  </NavLink>
                </div>

                <div className="flex-1 flex justify-center">
                  <button
                    onClick={toggleSidebar}
                    className="flex flex-col items-center justify-center p-2 rounded-md text-teal-200 hover:text-white transition-colors"
                  >
                    <Menu size={24} />
                    <span className="text-xs mt-1">Menu</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Main Content Area */}
            <main
              className={`
  flex-1 overflow-auto z-10 bg-transparent flex justify-center
  transition-all duration-300 ${isMobile && "h-[calc(100vh-64px)]"}
  ${
    isMobile
      ? "pb-24" // Increased padding-bottom to prevent overlap with the bottom nav
      : isSidebarExpanded
      ? "w-[calc(100vw-280px)]"
      : "w-[calc(100vw-80px)]"
  }
`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className="bg-transparent max-w-[1600px] w-full px-2"
              >
                <Routes>
                  <Route path="/" element={<Alerts />} />
                  <Route path="/accounts" element={<Accounts />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/ecodes" element={<Codes />} />
                  <Route path="/organisation" element={<Organisation />} />
                  <Route path="/system" element={<System />} />
                  <Route path="*" element={<LoginRoute />} />
                </Routes>
              </motion.div>
            </main>
          </>
        ) : (
          //<Login />
          <>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<LoginRoute />} />
          </Routes>
          <LoginRoute />
          {/* <PrivateRoute>
            <Login />
          </PrivateRoute> */}
          </>
        )}
      </AuthProvider>
    </div>
  );
}

export default App;
