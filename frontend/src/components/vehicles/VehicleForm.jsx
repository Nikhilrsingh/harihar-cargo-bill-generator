import { useEffect, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { toast } from "react-toastify";
import {
    saveVehicle,
    updateVehicle,
    checkRegistrationExists,
} from "../../services/vehicleService";

function VehicleForm({
    selectedVehicle,
    refreshVehicles,
    onClose,
}) {

    const [vehicle, setVehicle] = useState({

        registrationNumber: "",
        vehicleNumber: "",
        vehicleType: "",
        capacity: "",
        status: "Available",

    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {

    if (selectedVehicle) {

        setVehicle(selectedVehicle);

    } else {

        setVehicle({
            registrationNumber: "",
            vehicleNumber: "",
            vehicleType: "",
            capacity: "",
            status: "Available",
        });

    }

}, [selectedVehicle]);

    const handleChange = (e) => {

    const { name, value } = e.target;

    setVehicle((prev) => ({

        ...prev,

        [name]:
            name === "registrationNumber"
                ? value.toUpperCase().trimStart()
                : value.trimStart(),

    }));

};

    const handleSubmit = async (e) => {

    e.preventDefault();

    if (!vehicle.registrationNumber.trim()) {

    toast.error("Registration Number is required.");

    return;

}

if (
    !/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(
        vehicle.registrationNumber.toUpperCase()
    )
) {

    toast.error("Enter a valid Registration Number.");

    return;

}

if (!vehicle.vehicleNumber.trim()) {

    toast.error("Vehicle Number is required.");

    return;

}

if (!vehicle.vehicleType.trim()) {

    toast.error("Vehicle Type is required.");

    return;

}

if (!vehicle.capacity.trim()) {

    toast.error("Capacity is required.");

    return;

}

    if (!vehicle.registrationNumber.trim()) {

        toast.error("Registration Number is required.");

        return;

    }

    setLoading(true);

    try {

      const registrationExists = await checkRegistrationExists(
    vehicle.registrationNumber.toUpperCase(),
    selectedVehicle?.id
);

if (registrationExists) {

    toast.error("Registration Number already exists.");

    return;

}

if (selectedVehicle) {

    await updateVehicle(
        selectedVehicle.id,
        vehicle
    );

    toast.success("Vehicle updated successfully.");
    setLoading(false);

} else {

    await saveVehicle(vehicle);

    toast.success("Vehicle added successfully.");
    setLoading(false);

}

await refreshVehicles();

        onClose();

        setVehicle({
            registrationNumber: "",
            vehicleNumber: "",
            vehicleType: "",
            capacity: "",
            status: "Available",
        });

    } catch (error) {

        setLoading(false);

        console.error(error);

        toast.error("Failed to save vehicle.");

    }

};

    return (

    <form
    className="vehicle-form"
    onSubmit={handleSubmit}
>

        <div className="form-section">

            <h3 className="section-title">
                Basic Information
            </h3>

            <div className="form-grid">

               <Input
    label="Registration Number"
    name="registrationNumber"
    value={vehicle.registrationNumber}
    onChange={(e) => {

        handleChange({
            target: {
                name: "registrationNumber",
                value: e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, ""),
            },
        });

    }}
    maxLength={10}
/>

                <Input
    label="Vehicle Number"
    name="vehicleNumber"
    value={vehicle.vehicleNumber}
    onChange={(e) => {

        handleChange({
            target: {
                name: "vehicleNumber",
                value: e.target.value.toUpperCase(),
            },
        });

    }}
/>

                <Input
                    label="Vehicle Type"
                    name="vehicleType"
                    value={vehicle.vehicleType}
                    onChange={handleChange}
                />

                <Input
    label="Capacity"
    name="capacity"
    value={vehicle.capacity}
    onChange={(e) => {

        const value = e.target.value.replace(/\D/g, "");

        handleChange({
            target: {
                name: "capacity",
                value,
            },
        });

    }}
    maxLength={2}
/>

                <div className="input-group">

    <label>Status</label>

    <select
        name="status"
        value={vehicle.status}
        onChange={handleChange}
    >

        <option value="Available">Available</option>

        <option value="On Trip">On Trip</option>

        <option value="Maintenance">Maintenance</option>

        <option value="Inactive">Inactive</option>

    </select>

</div>

            </div>

        </div>

        <div className="drawer-footer">

    <Button
    text="Cancel"
    variant="secondary"
    type="button"
    onClick={onClose}
/>

  <Button
    text={loading ? "Saving Vehicle..." : "Save Vehicle"}
    type="submit"
    loading={loading}
    disabled={
        loading ||
        !vehicle.registrationNumber.trim() ||
        !vehicle.vehicleNumber.trim() ||
        !vehicle.vehicleType.trim() ||
        !vehicle.capacity.trim()
    }
/>

</div>

    </form>

);

}

export default VehicleForm;