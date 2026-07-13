import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    saveCustomer,
    updateCustomer,
    checkPhoneExists,
    checkGSTExists,
    checkEmailExists
} from "../../services/customerService";
import Input from "../common/Input";
import Button from "../common/Button";
function CustomerForm({
    selectedCustomer,
    refreshCustomers,
    onClose,
}) {

    const [customer, setCustomer] = useState({
        customerName: "",
        contactPerson: "",
        phone: "",
        email: "",
        gst: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [loading, setLoading] = useState(false);

   useEffect(() => {

    if (selectedCustomer) {

        setCustomer(selectedCustomer);

    }

}, [selectedCustomer]);

    const handleChange = (e) => {

    const { name, value } = e.target;

    setCustomer((prev) => ({
        ...prev,
        [name]: typeof value === "string" ? value.trimStart() : value,
    }));

};

    const handleSubmit = async (e) => {

    e.preventDefault();

    if (!customer.customerName.trim()) {

    toast.error("Customer Name is required.");

    return;

}

if (!customer.phone.trim()) {

    toast.error("Phone Number is required.");

    return;

}

if (!/^\d{10}$/.test(customer.phone)) {

    toast.error("Phone Number must contain exactly 10 digits.");

    return;

}

if (
    customer.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)
) {

    toast.error("Please enter a valid email address.");

    return;

}

if (
    customer.gst.trim() &&
    !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        customer.gst.toUpperCase()
    )
) {

    toast.error("Please enter a valid GST number.");

    return;

}

    const phoneExists = await checkPhoneExists(
    customer.phone,
    selectedCustomer?.id
);

if (phoneExists) {

    toast.error("Phone number already exists.");

    return;

}

const gstExists = await checkGSTExists(
    customer.gst,
    selectedCustomer?.id
);

if (gstExists) {

    toast.error("GST number already exists.");

    return;

}

const emailExists = await checkEmailExists(
    customer.email,
    selectedCustomer?.id
);

if (emailExists) {

    toast.error("Email already exists.");

    return;

}

setLoading(true);

    try {

        const customerData = {
    ...customer,
    email: customer.email.toLowerCase().trim(),
    gst: customer.gst.toUpperCase().trim(),
};

if (selectedCustomer) {

    await updateCustomer(
        selectedCustomer.id,
        customerData
    );

} else {

    await saveCustomer(customerData);

}

await refreshCustomers();

toast.success(
    selectedCustomer
        ? "Customer updated successfully."
        : "Customer added successfully."
);

        onClose();

        setLoading(false);

        setCustomer({
            customerName: "",
            contactPerson: "",
            phone: "",
            email: "",
            gst: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
        });

    } catch (error) {

        console.error(error);

        toast.error("Failed to save customer.");

        setLoading(false);

    }

};

    return (

<form
    onSubmit={handleSubmit}
    className="customer-form"
>

    <div className="form-section">

        <h3 className="section-title">
    Business Information
</h3>

        <div className="form-grid">

            <Input
                label="Customer Name"
                name="customerName"
                value={customer.customerName}
                onChange={handleChange}
                required
            />

            <Input
                label="GST Number"
                name="gst"
                value={customer.gst}
                onChange={handleChange}
            />

        </div>

    </div>

    <div className="form-section">

        <h3 className="section-title">Contact Information</h3>

        <div className="form-grid">

            <Input
                label="Contact Person"
                name="contactPerson"
                value={customer.contactPerson}
                onChange={handleChange}
            />

            <Input
    label="Phone Number"
    name="phone"
    value={customer.phone}
    onChange={(e) => {

        const value = e.target.value.replace(/\D/g, "");

        handleChange({
            target: {
                name: "phone",
                value,
            },
        });

    }}
    maxLength={10}
    required
/>

            <Input
    label="Email"
    type="email"
    name="email"
    value={customer.email}
    onChange={handleChange}
    placeholder="example@gmail.com"
/>

        </div>

    </div>

    <div className="form-section">

        <h3 className="section-title">Address</h3>

       <div style={{ gridColumn: "1 / -1" }}>

    <Input
        label="Address"
        name="address"
        value={customer.address}
        onChange={handleChange}
    />

</div>

        <div className="form-grid">

            <Input
                label="City"
                name="city"
                value={customer.city}
                onChange={handleChange}
            />

            <Input
                label="State"
                name="state"
                value={customer.state}
                onChange={handleChange}
            />

            <Input
                label="Pincode"
                name="pincode"
                value={customer.pincode}
                onChange={handleChange}
            />

        </div>

    </div>

   <div className="drawer-footer">

    <Button
        text="Cancel"
        variant="secondary"
    />

   <Button
    text={
        loading
            ? (selectedCustomer
                ? "Updating Customer..."
                : "Saving Customer...")
            : (selectedCustomer
                ? "Update Customer"
                : "Save Customer")
    }
    type="submit"
    loading={loading}
    disabled={
        !customer.customerName.trim() ||
        !customer.phone.trim()
    }
/>

</div>

</form>

);

}

export default CustomerForm;