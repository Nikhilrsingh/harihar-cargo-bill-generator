import { useEffect, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { toast } from "react-toastify";

import {
    saveTrailer,
    updateTrailer,
    checkRegistrationExists,
} from "../../services/trailerService";

function TrailerForm({
    selectedTrailer,
    refreshTrailers,
    onClose,
}) {

    const [trailer, setTrailer] = useState({

        registrationNumber: "",
        trailerNumber: "",
        trailerType: "",
        capacity: "",
        status: "Available",

    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (selectedTrailer) {

            setTrailer(selectedTrailer);

        } else {

            setTrailer({

                registrationNumber: "",
                trailerNumber: "",
                trailerType: "",
                capacity: "",
                status: "Available",

            });

        }

    }, [selectedTrailer]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setTrailer((prev) => ({

            ...prev,

            [name]:
                name === "registrationNumber"
                    ? value.toUpperCase().trimStart()
                    : value.trimStart(),

        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!trailer.registrationNumber.trim()) {

            toast.error("Registration Number is required.");

            return;

        }

        if (
            !/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(
                trailer.registrationNumber.toUpperCase()
            )
        ) {

            toast.error("Enter a valid Registration Number.");

            return;

        }

        if (!trailer.trailerNumber.trim()) {

            toast.error("Trailer Number is required.");

            return;

        }

        if (!trailer.trailerType.trim()) {

            toast.error("Trailer Type is required.");

            return;

        }

        if (!trailer.capacity.trim()) {

            toast.error("Capacity is required.");

            return;

        }

        setLoading(true);

        try {

            const registrationExists = await checkRegistrationExists(
                trailer.registrationNumber.toUpperCase(),
                selectedTrailer?.id
            );

            if (registrationExists) {

                toast.error("Registration Number already exists.");

                setLoading(false);

                return;

            }

            if (selectedTrailer) {

                await updateTrailer(
                    selectedTrailer.id,
                    trailer
                );

                toast.success("Trailer updated successfully.");

            } else {

                await saveTrailer(trailer);

                toast.success("Trailer added successfully.");

            }

            await refreshTrailers();

            setTrailer({

                registrationNumber: "",
                trailerNumber: "",
                trailerType: "",
                capacity: "",
                status: "Available",

            });

            setLoading(false);

            onClose();

        } catch (error) {

            console.error(error);

            setLoading(false);

            toast.error("Failed to save Trailer.");

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
                        value={trailer.registrationNumber}
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
                        label="Trailer Number"
                        name="trailerNumber"
                        value={trailer.trailerNumber}
                        onChange={(e) => {

                            handleChange({
                                target: {
                                    name: "trailerNumber",
                                    value: e.target.value.toUpperCase(),
                                },
                            });

                        }}
                    />

                    <Input
                        label="Trailer Type"
                        name="trailerType"
                        value={trailer.trailerType}
                        onChange={handleChange}
                    />

                    <Input
                        label="Capacity"
                        name="capacity"
                        value={trailer.capacity}
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
                            value={trailer.status}
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
                    text={loading ? "Saving Trailer..." : "Save Trailer"}
                    type="submit"
                    loading={loading}
                    disabled={
                        loading ||
                        !trailer.registrationNumber.trim() ||
                        !trailer.trailerNumber.trim() ||
                        !trailer.trailerType.trim() ||
                        !trailer.capacity.trim()
                    }
                />

            </div>

        </form>

    );

}

export default TrailerForm;