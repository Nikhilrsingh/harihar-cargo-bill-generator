import BookingForm from "./BookingForm";

function BookingDrawer({
    open,
    booking,
    createBooking,
    editBooking,
    refreshBookings,
    onClose,
}){

    if (!open) return null;

    return (

        <div
            className="drawer-overlay"
            onClick={onClose}
        >

            <div
                className="drawer"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="drawer-header">

                    <div>

                        <h2>

                            {booking ? "Edit Booking" : "Add Booking"}

                        </h2>

                        <p>

                            Create a new transport booking.

                        </p>

                    </div>

                    <button
                        className="drawer-close"
                        onClick={onClose}
                    >
                        ✕

                    </button>

                </div>

                <BookingForm
    booking={booking}
    createBooking={createBooking}
    editBooking={editBooking}
    onClose={onClose}
/>

            </div>

        </div>

    );

}

export default BookingDrawer;