function BookingReview({ booking }) {
    return (
        <div className="form-section">

            <h3 className="section-title">
                Review Booking
            </h3>

            <div className="card">

                <table className="data-table">

                    <tbody>

                        <tr>
                            <td><strong>Booking Source</strong></td>
                            <td>{booking.source}</td>
                        </tr>

                        <tr>
                            <td><strong>Customer</strong></td>
                            <td>{booking.customerName}</td>
                        </tr>

                        <tr>
                            <td><strong>Contact Person</strong></td>
                            <td>{booking.contactPerson}</td>
                        </tr>

                        <tr>
                            <td><strong>Phone</strong></td>
                            <td>{booking.phone}</td>
                        </tr>

                        <tr>
                            <td><strong>Cars</strong></td>
                            <td>{booking.cars.length}</td>
                        </tr>

                        <tr>
                            <td><strong>Freight</strong></td>
                            <td>₹ {booking.freight || 0}</td>
                        </tr>

                        <tr>
                            <td><strong>Advance</strong></td>
                            <td>₹ {booking.advance || 0}</td>
                        </tr>

                        <tr>
                            <td><strong>Loading Charges</strong></td>
                            <td>₹ {booking.loadingCharges || 0}</td>
                        </tr>

                        <tr>
                            <td><strong>Other Charges</strong></td>
                            <td>₹ {booking.otherCharges || 0}</td>
                        </tr>

                        <tr>
                            <td><strong>Remarks</strong></td>
                            <td>{booking.remarks || "-"}</td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default BookingReview;