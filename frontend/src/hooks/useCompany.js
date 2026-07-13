import { useContext } from "react";
import { CompanyContext } from "../context/CompanyContext";

function useCompany() {
    return useContext(CompanyContext);
}

export default useCompany;