import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

import { DEFAULT_VEHICLE } from "../utils/documentFields";

function VehicleTable({ vehicles = [], setVehicles }) {
   function update(index, field, value) {
    const list = structuredClone(vehicles);

    list[index][field] = value;

    setVehicles(list);
}

   function addVehicle() {
    setVehicles([
        ...vehicles,
        structuredClone(DEFAULT_VEHICLE),
    ]);
}

   function removeVehicle(index) {
    if (vehicles.length === 1) return;

    setVehicles(
        vehicles.filter((_, i) => i !== index)
    );
}

    return (
        <div className="card">
            <h2>Vehicle Details</h2>

            {vehicles.map((vehicle, index) => (
                <div
                    key={index}
                    className="card"
                    style={{ marginBottom: 20 }}
                >
                    <h3
    style={{
        marginBottom: 16,
    }}
>
    Vehicle {index + 1}
</h3>

<div className="form-grid">

    <Input
        label="Chassis No"
                            value={vehicle.chassisNo || ""}
                            onChange={(e) =>
                                update(index, "chassisNo", e.target.value)
                            }
                        />

                        <Input
                            label="Engine No"
                            value={vehicle.engineNo || ""}
                            onChange={(e) =>
                                update(index, "engineNo", e.target.value)
                            }
                        />

                        <Input
                            label="Model"
                            value={vehicle.model || ""}
                            onChange={(e) =>
                                update(index, "model", e.target.value)
                            }
                        />

                        <Input
                            label="Variant"
                            value={vehicle.variant || ""}
                            onChange={(e) =>
                                update(index, "variant", e.target.value)
                            }
                        />

                       <Input
    label="Color"
    value={vehicle.color || ""}
    onChange={(e) =>
        update(index, "color", e.target.value)
    }
/>

<Input
    label="Pickup From"
    value={vehicle.from || ""}
    onChange={(e) =>
        update(index, "from", e.target.value)
    }
/>

<Input
    label="Delivery To"
    value={vehicle.to || ""}
    onChange={(e) =>
        update(index, "to", e.target.value)
    }
/>

<Input
    label="Remarks"
    value={vehicle.remarks || ""}
    onChange={(e) =>
        update(index, "remarks", e.target.value)
    }
/>

                    </div>

                    <div
                        style={{
                            marginTop: 12,
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        {vehicles.length > 1 && (
                            <Button
                                text="Remove"
                                type="button"
                                variant="danger"
                                onClick={() => removeVehicle(index)}
                            />
                        )}
                    </div>
                </div>
            ))}

            <Button
                text="+ Add Vehicle"
                type="button"
                onClick={addVehicle}
            />
        </div>
    );
}

export default VehicleTable;