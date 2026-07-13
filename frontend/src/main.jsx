import "@fontsource/inter";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./styles/global.css";
import "./styles/variables.css";
import "./styles/components.css";
import "./styles/layout.css";
import "./styles/dashboard.css";

import "./styles/form.css";
import "./styles/table.css";
import "./styles/modal.css";
import CompanyProvider from "./context/CompanyContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(

    <React.StrictMode>

        <CompanyProvider>

            <App />

        </CompanyProvider>

        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="light"
        />

    </React.StrictMode>

);