import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Input from "../common/Input";
import Button from "../common/Button";

import {
    saveDriver,
    updateDriver,
    checkMobileExists,
    checkLicenseExists,
} from "../../services/driverService";

function DriverForm({
    selectedDriver,
    refreshDrivers,
    onClose,
}) {

    const initialState = {

        driverName: "",
        mobileNumber: "",
        alternateMobile: "",
        email: "",
        drivingLicenseNumber: "",
        licenseExpiry: "",
        status: "Active",

    };

    const [driver, setDriver] = useState(initialState);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (selectedDriver) {

            setDriver({

                ...initialState,
                ...selectedDriver,

            });

        } else {

            setDriver(initialState);

        }

    }, [selectedDriver]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setDriver((prev) => ({

            ...prev,

            [name]:
                typeof value === "string"
                    ? value.trimStart()
                    : value,

        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) return;

        if (!driver.driverName.trim()) {

            toast.error("Driver Name is required.");

            return;

        }

        if (!driver.mobileNumber.trim()) {

            toast.error("Mobile Number is required.");

            return;

        }

        if (!/^\d{10}$/.test(driver.mobileNumber)) {

            toast.error("Mobile Number must contain exactly 10 digits.");

            return;

        }

        if (
            driver.alternateMobile &&
            !/^\d{10}$/.test(driver.alternateMobile)
        ) {

            toast.error("Alternate Mobile Number must contain exactly 10 digits.");

            return;

        }

        if (!driver.drivingLicenseNumber.trim()) {

            toast.error("Driving License Number is required.");

            return;

        }

        if (driver.drivingLicenseNumber.length < 10) {

            toast.error("Please enter a valid Driving License Number.");

            return;

        }

        if (!driver.licenseExpiry) {

            toast.error("License Expiry Date is required.");

            return;

        }

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const expiryDate = new Date(driver.licenseExpiry);

        if (expiryDate < today) {

            toast.error("License Expiry Date cannot be in the past.");

            return;

        }

        if (
            driver.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(driver.email)
        ) {

            toast.error("Please enter a valid email address.");

            return;

        }

        const mobileExists = await checkMobileExists(
            driver.mobileNumber,
            selectedDriver?.id
        );

        if (mobileExists) {

            toast.error("Mobile Number already exists.");

            return;

        }

        const licenseExists = await checkLicenseExists(
            driver.drivingLicenseNumber.toUpperCase(),
            selectedDriver?.id
        );

        if (licenseExists) {

            toast.error("Driving License Number already exists.");

            return;

        }

        const driverData = {

            ...driver,

            driverName: driver.driverName.trim(),

            mobileNumber: driver.mobileNumber.trim(),

            alternateMobile: driver.alternateMobile.trim(),

            email: driver.email.toLowerCase().trim(),

            drivingLicenseNumber:
                driver.drivingLicenseNumber.toUpperCase().trim(),

        };

        setLoading(true);

        try {

            if (selectedDriver) {

                await updateDriver(
                    selectedDriver.id,
                    driverData
                );

            } else {

                await saveDriver(driverData);

            }

            await refreshDrivers();

            toast.success(
                selectedDriver
                    ? "Driver updated successfully."
                    : "Driver added successfully."
            );

            setDriver(initialState);

            setLoading(false);

            onClose();

        } catch (error) {

            console.error(error);

            setLoading(false);

            toast.error("Failed to save Driver.");

        }

    };
        return (

            <form
                className="driver-form"
                onSubmit={handleSubmit}
            >

                <div className="form-section">

                    <h3 className="section-title">
                        Driver Information
                    </h3>

                    <div className="form-grid">

                        <Input
                            label="Driver Name"
                            name="driverName"
                            value={driver.driverName}
                            onChange={handleChange}
                            placeholder="Enter Driver Name"
                            required
                            autoComplete="name"
                        />

                        <Input
                            label="Mobile Number"
                            name="mobileNumber"
                            value={driver.mobileNumber}
                            onChange={(e) => {

                                const value = e.target.value.replace(/\D/g, "");

                                handleChange({
                                    target: {
                                        name: "mobileNumber",
                                        value,
                                    },
                                });

                            }}
                            maxLength={10}
                            placeholder="Enter 10-digit Mobile Number"
                            required
                            autoComplete="tel"
                        />

                        <Input
                            label="Alternate Mobile"
                            name="alternateMobile"
                            value={driver.alternateMobile}
                            onChange={(e) => {

                                const value = e.target.value.replace(/\D/g, "");

                                handleChange({
                                    target: {
                                        name: "alternateMobile",
                                        value,
                                    },
                                });

                            }}
                            maxLength={10}
                            placeholder="Optional"
                            autoComplete="tel"
                        />

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={driver.email}
                            onChange={handleChange}
                            placeholder="example@gmail.com"
                            autoComplete="email"
                        />

                        <Input
                            label="Driving License Number"
                            name="drivingLicenseNumber"
                            value={driver.drivingLicenseNumber}
                            onChange={(e) => {

                                handleChange({
                                    target: {
                                        name: "drivingLicenseNumber",
                                        value: e.target.value
                                            .toUpperCase()
                                            .replace(/\s/g, ""),
                                    },
                                });

                            }}
                            placeholder="Enter Driving License Number"
                            required
                            autoComplete="off"
                        />

                        <Input
                            label="License Expiry"
                            type="date"
                            name="licenseExpiry"
                            value={driver.licenseExpiry}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                            required
                        />

                        <div className="input-group">

                            <label>Status</label>

                            <select
                                name="status"
                                value={driver.status}
                                onChange={handleChange}
                            >

                                <option value="Active">Active</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Inactive">Inactive</option>

                            </select>

                        </div>

                    </div>

                </div>

                <div className="drawer-footer">

                    <Button
                        text="Cancel"
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    />

                    <Button
                        text={
                            loading
                                ? (selectedDriver
                                    ? "Updating Driver..."
                                    : "Saving Driver...")
                                : (selectedDriver
                                    ? "Update Driver"
                                    : "Save Driver")
                        }
                        type="submit"
                        loading={loading}
                        disabled={
                            loading ||
                            !driver.driverName.trim() ||
                            !driver.mobileNumber.trim() ||
                            !driver.drivingLicenseNumber.trim()
                        }
                    />

                </div>

            </form>

        );

}
export default DriverForm;