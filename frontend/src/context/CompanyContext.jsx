import { createContext, useEffect, useState } from "react";
import { getCompany } from "../services/companyService";

export const CompanyContext = createContext();

function CompanyProvider({ children }) {

    const [company, setCompany] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadCompany = async () => {

            try {

                const data = await getCompany();

                setCompany(data);

            } catch (error) {

                console.error("Error loading company:", error);

            } finally {

                setLoading(false);

            }

        };

        loadCompany();

    }, []);

    return (

        <CompanyContext.Provider
            value={{
                company,
                setCompany,
                loading,
            }}
        >

            {children}

        </CompanyContext.Provider>

    );

}

export default CompanyProvider;