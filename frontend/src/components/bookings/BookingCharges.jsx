import Input from "../common/Input";

function BookingCharges({ booking, setBooking }) {

    function updateField(field, value) {
        setBooking((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    return (
        <div className="form-section">

            <h3 className="section-title">
                Charges
            </h3>

            <div className="form-grid">

                <Input
                    label="Freight Amount"
                    type="number"
                    value={booking.freight}
                    onChange={(e) =>
                        updateField("freight", e.target.value)
                    }
                />

                <Input
                    label="Advance Amount"
                    type="number"
                    value={booking.advance}
                    onChange={(e) =>
                        updateField("advance", e.target.value)
                    }
                />

                <Input
                    label="Loading Charges"
                    type="number"
                    value={booking.loadingCharges}
                    onChange={(e) =>
                        updateField("loadingCharges", e.target.value)
                    }
                />

                <Input
                    label="Other Charges"
                    type="number"
                    value={booking.otherCharges}
                    onChange={(e) =>
                        updateField("otherCharges", e.target.value)
                    }
                />

                <div
                    className="input-group"
                    style={{ gridColumn: "1 / -1" }}
                >
                    <label>Remarks</label>

                    <textarea
                        rows={4}
                        value={booking.remarks}
                        onChange={(e) =>
                            updateField("remarks", e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "14px 16px",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            outline: "none",
                            resize: "vertical",
                            fontSize: "15px",
                        }}
                    />
                </div>

            </div>

        </div>
    );
}

export default BookingCharges;