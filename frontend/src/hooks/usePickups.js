import { useEffect, useState } from "react";

import {
    createPickup,
    deletePickup,
    getPickups,
    updatePickup,
} from "../services/pickupService";

export default function usePickups() {

    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadPickups() {

        setLoading(true);

        const data = await getPickups();

        setPickups(data);
        setLoading(false);

    }

    useEffect(() => {
        loadPickups();
    }, []);

    async function addPickup(data) {

        await createPickup(data);
        await loadPickups();

    }

    async function editPickup(id, data) {

        await updatePickup(id, data);
        await loadPickups();

    }

    async function removePickup(id) {

        await deletePickup(id);
        await loadPickups();

    }

    return {
        pickups,
        loading,
        addPickup,
        editPickup,
        removePickup,
        refresh: loadPickups,
    };

}