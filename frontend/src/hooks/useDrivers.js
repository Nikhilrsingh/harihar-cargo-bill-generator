import { useEffect, useState } from "react";

import { getDrivers } from "../services/driverService";

function useDrivers() {

    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshDrivers = async () => {

        setLoading(true);

        try {

            const data = await getDrivers();

            setDrivers(data);

        } catch (error) {

            console.error(error);

        }

        setLoading(false);

    };

    useEffect(() => {

        refreshDrivers();

    }, []);

    return {

        drivers,
        loading,
        refreshDrivers,

    };

}

export default useDrivers;