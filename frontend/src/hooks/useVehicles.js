import { useEffect, useState } from "react";

import { getVehicles } from "../services/vehicleService";

function useVehicles() {

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshVehicles = async () => {

        setLoading(true);

        try {

            const data = await getVehicles();

            setVehicles(data);

        } catch (error) {

            console.error(error);

        }

        setLoading(false);

    };

    useEffect(() => {

        refreshVehicles();

    }, []);

    return {
        vehicles,
        loading,
        refreshVehicles,
    };

}

export default useVehicles;