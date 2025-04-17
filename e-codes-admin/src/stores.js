import { create } from "zustand";

// EXAMPLE DATA & STRUCTURES

const HospitalInfo = {
    address: "101 Sample Address, Sample County, United Kingdom, M34-TY1",
    name: "Hospital Hot-Desert",
}

const OnGoingAlerts = [
    { id: Math.random() * 1000, code: "Blue", initiated: "10:23 (3.5 hr ago)", location: { building: "A", floor: "0", room: "1" } },
    { id: Math.random() * 1000, code: "Red", initiated: "14:30 (3 min ago)", location: { building: "A", floor: "0", room: "2" } }
]

const Codes = {
    "Blue": { color: "#0000ff", description: "scurity personnels", departments: ["Security"] },
    "Red": { color: "#ff0000", description: "critical personnels", departments: ["Pediatrics"] }
}

const Departments = {
    "Security": true,
    "Pediatrics": true
}

const Roles = {
    Admin: true,
    RotaAdmin: true,
    User: true
}

const ShiftTypes = {
    "Morning": {
        startTime: "07:00",
        endTime: "15:00",
        splitShift: false,
        splitStartTime: null,
        splitEndTime: null
    },
    "Evening": {
        startTime: "15:00",
        endTime: "23:00",
        splitShift: false,
        splitStartTime: null,
        splitEndTime: null
    },
    // Add any other default shift types as needed
}

// ### buildings/flooor/area/room
const Locations = {
    A: {
        1: {
            pediatrics: {
                "4": true
            },
            theatre: {
                "4": true
            },
        },
        2: {
            security: {
                "2": true
            },
        },
    },
    B: {
        1: {
            pediatrics: {
                "42": true
            },
        },
        2: {
            security: {
                "24": true
            },
        },
        3: {
            IT: {
                "25": true
            },
        },
    },
};

const Buildings = {
    "A": {
        "0": {
            "1": true,
            "2": true
        },
        "1": {
            "1": true,
            "2": true,
            "3": true,
            "4": true,
            "5": true,
            "6": true,
            "7": true,
            "8": true,
            "9": true,
            "10": true,
            "11": true,
            "12": true
        }
    },
    "B": {
        "0": {
            "1": true,
            "2": true
        },
        "1": {
            "1": true,
            "2": true,
            "3": true,
            "4": true
        }
    }
}

const Accounts = [
    {
        id: 1,
        username: "johndoe",
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        jobPost: "Senior Technician",
        phoneNumber: "555-123-4567",
        role: "Admin",
        department: "Security",
    },
    {
        id: 2,
        username: "janedoe",
        email: "jane.doe@example.com",
        firstName: "Jane",
        lastName: "Doe",
        jobPost: "Nurse Practitioner",
        phoneNumber: "555-987-6543",
        role: "User",
        department: "Pediatrics",
    },
]

// STATE STORES

// eslint-disable-next-line no-unused-vars
export const useStore = create((set, get) => ({
    isMobile: false,
    onGoingAlerts: OnGoingAlerts,
    accounts: Accounts,
    codes: Codes,
    locations: Locations,
    hospitalInfo: HospitalInfo,
    buildings: Buildings,
    departments: Departments,
    user: null,
    orgId: null,
    roles: Roles,
    shiftTypes: ShiftTypes,
    setAccounts: (value) => set({ accounts: value }),
    setIsMobile: (value) => set({ isMobile: value }),
    setHospitalInfo: (info) => set({ hospitalInfo: info }),
    setShiftTypes: (newShiftTypes) => set({ shiftTypes: newShiftTypes }),
    setOnGoingAlerts: (oAlerts) => set({ onGoingAlerts: oAlerts }),
    setDepartments: (dept) => set({ departments: dept }),
    setCodes: (codes) => set({ codes: codes }),
    setBuilding: (buildings) => set({ buildings: buildings }),
    setUser: (usercreds) => set({ user: usercreds }),
    setOrgId: (id) => set({ orgId: id })
}))

/**
 * Zustand store for managing confirmation dialog state
 * 
 * Store provides:
 * - isOpen: Whether the dialog is currently open
 * - options: Configuration for the current dialog (title, message, etc)
 * - openConfirm: Function to open the dialog with provided options
 * - confirm: Function to execute the confirmation callback and close the dialog
 * - cancel: Function to execute the cancel callback and close the dialog
 * - close: Function to close the dialog without executing callbacks
 */

export const useConfirmStore = create((set, get) => ({
    // Initial state
    isOpen: false,
    options: {
        title: 'Confirm Action',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        icon: 'warning',
        confirmColor: 'teal',
        onConfirm: () => { },
        onCancel: () => { },
    },

    /**
     * Opens a confirmation dialog with the provided options
     * @param {Object} options - Configuration options for the dialog
     */
    openConfirm: (options) => {
        set({
            isOpen: true,
            options: {
                ...get().options,
                ...options,
            },
        });
    },

    /**
     * Executes the confirm callback and closes the dialog
     */
    confirm: () => {
        // Get current options before closing
        const { onConfirm } = get().options;

        // Close the dialog
        set({ isOpen: false });

        // Execute the callback (after closing to prevent UI lag)
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    },

    /**
     * Executes the cancel callback and closes the dialog
     */
    cancel: () => {
        // Get current options before closing
        const { onCancel } = get().options;

        // Close the dialog
        set({ isOpen: false });

        // Execute the callback (after closing to prevent UI lag)
        if (typeof onCancel === 'function') {
            onCancel();
        }
    },

    /**
     * Closes the dialog without executing any callbacks
     */
    close: () => {
        set({ isOpen: false });
    },
}));

export const useOrg = create((set) => ({
    org: {},
    setOrg: (newOrg) => set({ org: newOrg }),
    buildings: {},
    setBuildings: (newBuildings) => {
        set((state) => (
            { buildings: (typeof newBuildings === "function") ? newBuildings(state.buildings) : newBuildings }
        ))
    },
    departments: {},
    setDepartments: (newDepartments) => set({ departments: newDepartments })
}))

export const useMaps = create((set) => ({
    codes: {},
    setCodes: (newMap) => set({ codes: newMap }),
    departmentUsers: {},
    setDepartmentUsers: (newMap) => set({ departmentUsers: newMap }),
    // users: [],
    // setUsers: (newArray) => set({ users: newArray }),
}))