import Button from "../common/Button";

function BookingSource({ booking, setBooking }) {
    return (
        <div className="form-section">

            <h3 className="section-title">
                Booking Source
            </h3>

            <div
                style={{
                    display: "flex",
                    gap: "16px",
                    marginTop: "16px",
                }}
            >
                <Button
                    variant={
                        booking.source === "manual"
                            ? "primary"
                            : "secondary"
                    }
                    onClick={() =>
                        setBooking((prev) => ({
                            ...prev,
                            source: "manual",
                        }))
                    }
                    text="Manual Booking"
                />

                <Button
                    variant={
                        booking.source === "quotation"
                            ? "primary"
                            : "secondary"
                    }
                    onClick={() =>
                        setBooking((prev) => ({
                            ...prev,
                            source: "quotation",
                        }))
                    }
                    text="From Quotation"
                />

            </div>

        </div>
    );
}

export default BookingSource;