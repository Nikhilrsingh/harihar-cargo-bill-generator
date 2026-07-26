import { useEffect, useState } from "react";

import DocumentHeader from "./DocumentHeader";
import {
    DEFAULT_DOCUMENT,
    DEFAULT_VEHICLE,
} from "../utils/documentFields";
import VehicleTable from "./VehicleTable";
import DocumentActions from "./DocumentActions";

function DocumentForm({
    title,
    initialData,
    onSubmit,
    onCancel,
}) {
    const [form, setForm] = useState(
    structuredClone(initialData)
);

  useEffect(() => {
    setForm(
        structuredClone(
            initialData ?? DEFAULT_DOCUMENT
        )
    );
}, [initialData]);

   function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
        ...prev,
        [name]:
            type === "checkbox"
                ? checked
                : value,
    }));
}

   function setVehicles(cars) {
    setForm((prev) => ({
        ...prev,
        cars: structuredClone(cars),
    }));
}

   async function submit(e) {
    e.preventDefault();

    const payload = structuredClone(form);

    payload.cars = payload.cars.filter((car) =>
        Object.values(car).some(
            (value) => String(value).trim() !== ""
        )
    );

    if (payload.cars.length === 0) {
        payload.cars = [
            structuredClone(DEFAULT_VEHICLE),
        ];
    }

    try {
    await onSubmit(payload);
} catch (error) {
    console.error(error);
    alert(
        error?.message ||
        "Something went wrong."
    );
}
}

    return (
        <form
    onSubmit={submit}
    style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        height: "100%",
    }}
>
            <DocumentHeader
                title={title}
                form={form}
                handleChange={handleChange}
            />

            <VehicleTable
                vehicles={form.cars ?? []}
                setVehicles={setVehicles}
            />

            <div
    style={{
        marginTop: "auto",
        paddingTop: 20,
        borderTop: "1px solid var(--border-color)",
        background: "var(--surface-color)",
        position: "sticky",
        bottom: 0,
    }}
>
    <DocumentActions
        onCancel={onCancel}
        submitText={
            form.id
                ? `Update ${title}`
                : `Create ${title}`
        }
    />
</div>
        </form>
    );
}

export default DocumentForm;