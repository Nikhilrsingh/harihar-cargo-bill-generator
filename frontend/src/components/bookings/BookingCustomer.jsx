import { useEffect, useState } from "react";
import Input from "../common/Input";
import { getCustomers } from "../../services/customerService";

function BookingCustomer({ booking, setBooking }) {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        loadCustomers();
    }, []);

    async function loadCustomers() {
        const data = await getCustomers();
        setCustomers(data);
    }

    function handleCustomerChange(e) {
        const customer = customers.find(
            (item) => item.id === e.target.value
        );

        setBooking((prev) => ({
            ...prev,
            customerId: customer?.id || "",
            customerName: customer?.customerName || "",
            contactPerson: customer?.contactPerson || "",
            phone: customer?.phone || "",
            address: customer?.address || "",
        }));
    }

    return (
        <div className="form-section">

            <h3 className="section-title">
                Customer Information
            </h3>

            <div className="form-grid">

                <div className="input-group">
                    <label>
                        Customer
                        <span className="required">*</span>
                    </label>

                    <select
                        value={booking.customerId}
                        onChange={handleCustomerChange}
                    >
                        <option value="">
                            Select Customer
                        </option>

                        {customers.map((customer) => (
                            <option
                                key={customer.id}
                                value={customer.id}
                            >
                                {customer.customerName}
                            </option>
                        ))}
                    </select>
                </div>

                <Input
                    label="Contact Person"
                    value={booking.contactPerson}
                    disabled
                />

                <Input
                    label="Phone Number"
                    value={booking.phone}
                    disabled
                />

                <Input
                    label="Address"
                    value={booking.address}
                    disabled
                />

            </div>

        </div>
    );
}

export default BookingCustomer;