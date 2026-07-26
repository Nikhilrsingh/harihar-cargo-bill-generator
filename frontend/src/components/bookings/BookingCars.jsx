import Button from "../common/Button";
import CarCard from "./CarCard";

function BookingCars({ booking, setBooking }) {

    function addCar() {
        setBooking((prev) => ({
            ...prev,
            cars: [
                ...prev.cars,
                {
                    make: "",
                    model: "",
                    variant: "",
                    color: "",
                    chassisNo: "",
                    engineNo: "",
                },
            ],
        }));
    }

    function updateCar(index, field, value) {
        const cars = [...booking.cars];
        cars[index][field] = value;

        setBooking((prev) => ({
            ...prev,
            cars,
        }));
    }

    function removeCar(index) {
        setBooking((prev) => ({
            ...prev,
            cars: prev.cars.filter((_, i) => i !== index),
        }));
    }

    return (
        <div className="form-section">

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <h3 className="section-title">
                    Vehicle Details
                </h3>

                <Button
                    text="+ Add Car"
                    onClick={addCar}
                />
            </div>

            {booking.cars.length === 0 ? (
                <p>No cars added.</p>
            ) : (
                booking.cars.map((car, index) => (
                    <CarCard
                        key={index}
                        index={index}
                        car={car}
                        updateCar={updateCar}
                        removeCar={removeCar}
                    />
                ))
            )}

        </div>
    );
}

export default BookingCars;