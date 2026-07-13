import { useEffect, useState } from "react";
import { getCustomers } from "../services/customerService";

function useCustomers() {

    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadCustomers = async () => {

        const data = await getCustomers();

        setCustomers(data);

        setLoading(false);

    };

    useEffect(() => {

        loadCustomers();

    }, []);

    return {
        customers,
        loading,
        refreshCustomers: loadCustomers,
    };

}

export default useCustomers;