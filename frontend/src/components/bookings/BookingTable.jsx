import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import DataTable from "../common/DataTable";
import ConfirmDialog from "../common/ConfirmDialog";
import { deleteBooking } from "../../services/bookingService";

function BookingTable({
    bookings,
    loading,
    onEdit,
    refreshBookings,
}) {

    const [openDialog, setOpenDialog] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);

    async function handleDelete(id) {

        await deleteBooking(id);

        await refreshBookings();

        setOpenDialog(false);
        setBookingToDelete(null);

        toast.success("Booking deleted successfully.");

    }

    return (
        <>
            <DataTable
                columns={[
                    "Booking No.",
                    "Customer",
                    "Cars",
                    "Status",
                    "Freight",
                    "Actions",
                ]}
            >

                {loading ? (

                    <tr>
                        <td colSpan="6" className="table-message">
                            Loading...
                        </td>
                    </tr>

                ) : bookings.length === 0 ? (

                    <tr>
                        <td colSpan="6" className="table-message">
                            No bookings found.
                        </td>
                    </tr>

                ) : (

                    bookings.map((booking) => (

                        <tr key={booking.id}>

                            <td>{booking.bookingNo}</td>

                            <td>{booking.customerName}</td>

                            <td>{booking.cars?.length || 0}</td>

                            <td>{booking.status}</td>

                            <td>₹ {booking.freight || 0}</td>

                            <td>

                                <div className="table-actions">

                                    <button className="icon-btn">
                                        <Eye size={17} />
                                    </button>

                                    <button
                                        className="icon-btn"
                                        onClick={() => onEdit(booking)}
                                    >
                                        <Pencil size={17} />
                                    </button>

                                    <button
                                        className="icon-btn delete-btn"
                                        onClick={() => {

                                            setBookingToDelete(booking);

                                            setOpenDialog(true);

                                        }}
                                    >
                                        <Trash2 size={17} />
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))

                )}

            </DataTable>

            <ConfirmDialog
                open={openDialog}
                title="Delete Booking"
                message="Are you sure you want to delete this booking? This action cannot be undone."
                onCancel={() => setOpenDialog(false)}
                onConfirm={() => handleDelete(bookingToDelete.id)}
            />

        </>
    );

}

export default BookingTable;