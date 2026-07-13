import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Company from "../pages/Company/Company";
import Users from "../pages/Users/Users";
import Customers from "../pages/Customers/Customers";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
    path="/company"
    element={
        <ProtectedRoute>
            <Company />
        </ProtectedRoute>
    }
/>

<Route
    path="/users"
    element={
        <ProtectedRoute>
            <Users />
        </ProtectedRoute>
    }
/>

<Route
    path="/customers"
    element={
        <ProtectedRoute>
            <Customers />
        </ProtectedRoute>
    }
/>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;