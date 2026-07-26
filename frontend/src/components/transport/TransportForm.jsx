import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../common/Button";
import TransportStepper from "./TransportStepper";
import BookingSource from "./BookingSource";
import BookingCustomer from "./BookingCustomer";
import BookingCars from "./BookingCars";
import BookingCharges from "./BookingCharges";
import BookingReview from "./BookingReview";

function TransportForm({
    booking: editingBooking,
    createBooking,
    editBooking,
    onClose,
}) {

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

    if (editingBooking) {

        setBooking(editingBooking);

    }

}, [editingBooking]);

    const [booking, setBooking] = useState(
        editingBooking || {

            source: "manual",

            customerId: "",
            customerName: "",
            contactPerson: "",
            phone: "",
            address: "",

            cars: [],

            freight: "",
            advance: "",
            loadingCharges: "",
            otherCharges: "",
            remarks: "",

        }
    );

    const steps = [

        { id: 1, title: "Source" },
        { id: 2, title: "Customer" },
        { id: 3, title: "Cars" },
        { id: 4, title: "Charges" },
        { id: 5, title: "Review" },

    ];

    function nextStep() {

        if (step < steps.length) {

            setStep((prev) => prev + 1);

        }

    }

    function previousStep() {

        if (step > 1) {

            setStep((prev) => prev - 1);

        }

    }

   async function saveBooking() {

    if (!booking.customerId) {

        toast.error("Please select a customer.");
        return;

    }

    if (booking.cars.length === 0) {

        toast.error("Please add at least one car.");
        return;

    }

    if (!booking.freight || Number(booking.freight) <= 0) {

        toast.error("Please enter a valid freight amount.");
        return;

    }

    try {

        setLoading(true);

        if (editingBooking) {

            await editBooking(editingBooking.id, booking);

            toast.success("Booking updated successfully.");

        } else {

            await createBooking(booking);

            toast.success("Booking created successfully.");

        }

        onClose();

    } catch (error) {

        console.error(error);

        toast.error("Failed to save booking.");

    } finally {

        setLoading(false);

    }

}

    return (

        <div className="booking-form">

            <TransportStepper
                steps={steps}
                currentStep={step}
                onStepClick={setStep}
            />

            <div className="booking-content">

                {step === 1 && (
                    <BookingSource
                        booking={booking}
                        setBooking={setBooking}
                    />
                )}

                {step === 2 && (
                    <BookingCustomer
                        booking={booking}
                        setBooking={setBooking}
                    />
                )}

                {step === 3 && (
                    <BookingCars
                        booking={booking}
                        setBooking={setBooking}
                    />
                )}

                {step === 4 && (
                    <BookingCharges
                        booking={booking}
                        setBooking={setBooking}
                    />
                )}

                {step === 5 && (
                    <BookingReview
                        booking={booking}
                    />
                )}

            </div>

            <div className="drawer-footer">

                <Button
                    variant="secondary"
                    onClick={previousStep}
                    disabled={step === 1}
                >
                    Previous
                </Button>

                {step < steps.length ? (

                    <Button onClick={nextStep}>
                        Next
                    </Button>

                ) : (

                   <Button
    onClick={saveBooking}
    loading={loading}
    disabled={loading}
    text={
        loading
            ? (editingBooking ? "Updating..." : "Saving...")
            : (editingBooking ? "Update Booking" : "Save Booking")
    }
/>

                )}

            </div>

        </div>

    );

}

export default TransportForm;