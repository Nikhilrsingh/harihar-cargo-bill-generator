import Input from "../common/Input";
import Button from "../common/Button";

function CarCard({
    index,
    car,
    updateCar,
    removeCar,
}) {
    return (
        <div
            className="card"
            style={{ marginBottom: "20px" }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <h3 className="section-title">
                    Car {index + 1}
                </h3>

                <Button
                    variant="danger"
                    text="Remove"
                    onClick={() => removeCar(index)}
                />
            </div>

            <div className="form-grid">

                <Input
                    label="Make"
                    value={car.make}
                    onChange={(e) =>
                        updateCar(index, "make", e.target.value)
                    }
                />

                <Input
                    label="Model"
                    value={car.model}
                    onChange={(e) =>
                        updateCar(index, "model", e.target.value)
                    }
                />

                <Input
                    label="Variant"
                    value={car.variant}
                    onChange={(e) =>
                        updateCar(index, "variant", e.target.value)
                    }
                />

                <Input
                    label="Color"
                    value={car.color}
                    onChange={(e) =>
                        updateCar(index, "color", e.target.value)
                    }
                />

                <Input
                    label="Chassis Number"
                    value={car.chassisNo}
                    onChange={(e) =>
                        updateCar(index, "chassisNo", e.target.value)
                    }
                />

                <Input
                    label="Engine Number"
                    value={car.engineNo}
                    onChange={(e) =>
                        updateCar(index, "engineNo", e.target.value)
                    }
                />

            </div>
        </div>
    );
}

export default CarCard;