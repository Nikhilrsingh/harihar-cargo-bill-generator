import {
  MdDashboard,
  MdDescription,
  MdAssignment,
  MdLocalShipping,
  MdInventory,
  MdPeople,
  MdDirectionsCar,
  MdPerson,
  MdPayments,
  MdAssessment,
  MdSettings,
  MdLogout,
} from "react-icons/md";

export const sidebarMenu = [
  {
    section: "MAIN",
    items: [
      { title: "Dashboard", icon: MdDashboard, path: "/dashboard" },
    ],
  },

  {
    section: "OPERATIONS",
    items: [
      { title: "Quotation", icon: MdDescription, path: "#" },
      { title: "Booking", icon: MdAssignment, path: "#" },
      { title: "Pickup", icon: MdLocalShipping, path: "#" },
      { title: "Loading", icon: MdInventory, path: "#" },
      { title: "Bilty", icon: MdDescription, path: "#" },
    ],
  },

  {
    section: "MANAGEMENT",
    items: [
      { title: "Customers", icon: MdPeople, path: "#" },
      { title: "Vehicles", icon: MdDirectionsCar, path: "#" },
      { title: "Drivers", icon: MdPerson, path: "#" },
    ],
  },

  {
    section: "FINANCE",
    items: [
      { title: "Payments", icon: MdPayments, path: "#" },
    ],
  },

  {
    section: "REPORTS",
    items: [
      { title: "Reports", icon: MdAssessment, path: "#" },
    ],
  },

  {
    section: "SETTINGS",
    items: [
      { title: "Settings", icon: MdSettings, path: "#" },
      { title: "Logout", icon: MdLogout, path: "#" },
    ],
  },
];