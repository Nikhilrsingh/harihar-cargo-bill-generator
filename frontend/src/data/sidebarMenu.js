import {
  MdBusiness,
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
  MdGroup,
  MdRequestQuote,
  MdReceiptLong,
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
      { title: "Quotations", icon: MdRequestQuote, path: "/quotations" },
      { title: "Bookings", icon: MdAssignment, path: "/bookings" },
      { title: "Pickups", icon: MdLocalShipping, path: "/pickups" },
      { title: "Loading", icon: MdInventory, path: "/loading" },
      { title: "Bilties", icon: MdDescription, path: "/bilties" },
      { title: "Invoices", icon: MdReceiptLong, path: "/invoices" },
    ],
  },

  {
    section: "MANAGEMENT",
    items: [
      { title: "Customers", icon: MdPeople, path: "/customers" },
      { title: "Vehicles", icon: MdDirectionsCar, path: "/vehicles" },
      { title: "Trailers", path: "/trailers", icon: MdDirectionsCar, },
      { title: "Drivers", icon: MdPerson, path: "/drivers" },
      { title: "Company", icon: MdBusiness, path: "/company" },
      { title: "Users", icon: MdGroup, path: "/users" },
    ],
  },

  {
    section: "FINANCE",
    items: [
      { title: "Payments", icon: MdPayments, path: "/payments" },
      { title: "Reports", icon: MdAssessment, path: "/reports" },
    ],
  },

  {
    section: "SETTINGS",
    items: [
      { title: "Settings", icon: MdSettings, path: "/settings" },
      { title: "Logout", icon: MdLogout, path: "/logout" },
    ],
  },
];