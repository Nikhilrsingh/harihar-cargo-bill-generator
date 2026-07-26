import { useEffect, useState } from "react";
import {
    getBookings,
    addBooking,
    updateBooking,
    deleteBooking,
} from "../services/bookingService";

function useBookings() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        loadBookings();

    }, []);

    async function loadBookings() {

        setLoading(true);

        try {

            const data = await getBookings();

            setBookings(data);

        } finally {

            setLoading(false);

        }

    }

    async function createBooking(data) {

        await addBooking(data);

        await loadBookings();

    }

    async function editBooking(id, data) {

        await updateBooking(id, data);

        await loadBookings();

    }

    async function removeBooking(id) {

        await deleteBooking(id);

        await loadBookings();

    }

    return {

        bookings,

        loading,

        createBooking,

        editBooking,

        removeBooking,

        refreshBookings: loadBookings,

    };

}

export default useBookings;