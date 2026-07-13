import {
  MdDescription,
  MdReceiptLong,
  MdLocalShipping,
  MdPeople,
  MdDirectionsCar,
  MdPerson,
  MdCurrencyRupee,
  MdAssignment,
} from "react-icons/md";

export const dashboardStats = [
  {
    title: "Total Bilties",
    value: "0",
    icon: MdDescription,
    color: "#2563EB",
    bg: "#DBEAFE",
  },
  {
    title: "Invoices",
    value: "0",
    icon: MdReceiptLong,
    color: "#16A34A",
    bg: "#DCFCE7",
  },
  {
    title: "Today's Loading",
    value: "0",
    icon: MdLocalShipping,
    color: "#EA580C",
    bg: "#FFEDD5",
  },
  {
    title: "Customers",
    value: "0",
    icon: MdPeople,
    color: "#9333EA",
    bg: "#F3E8FF",
  },
  {
    title: "Vehicles",
    value: "0",
    icon: MdDirectionsCar,
    color: "#DC2626",
    bg: "#FEE2E2",
  },
  {
    title: "Drivers",
    value: "0",
    icon: MdPerson,
    color: "#0891B2",
    bg: "#CFFAFE",
  },
  {
    title: "Bookings",
    value: "0",
    icon: MdAssignment,
    color: "#CA8A04",
    bg: "#FEF9C3",
  },
  {
    title: "Revenue",
    value: "₹0",
    icon: MdCurrencyRupee,
    color: "#15803D",
    bg: "#DCFCE7",
  },
];