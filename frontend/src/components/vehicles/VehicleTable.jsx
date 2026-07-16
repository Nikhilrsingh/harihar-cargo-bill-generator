import { useState } from "react";

import { Pencil, Trash2 } from "lucide-react";

import { toast } from "react-toastify";

import DataTable from "../common/DataTable";
import ConfirmDialog from "../common/ConfirmDialog";

import { deleteVehicle } from "../../services/vehicleService";

function VehicleTable({
    vehicles,
    loading,
    search,
    onEdit,
    refreshVehicles,
}) {

    const [openDialog, setOpenDialog] = useState(false);

const [vehicleToDelete, setVehicleToDelete] = useState(null);

const handleDelete = async () => {

    try {

        await deleteVehicle(vehicleToDelete.id);

        await refreshVehicles();

        toast.success("Vehicle deleted successfully.");

    } catch (error) {

        console.error(error);

        toast.error("Failed to delete vehicle.");

    }

    setOpenDialog(false);

    setVehicleToDelete(null);

};

    return (

        <>

        <DataTable
           columns={[
    "Registration",
    "Vehicle",
    "Type",
    "Capacity",
    "Status",
    "Actions",
]}
        >

            {loading ? (

                <tr>

                    <td
                        colSpan="5"
                        className="table-message"
                    >
                        Loading...
                    </td>

                </tr>

            ) : vehicles.length === 0 ? (

                <tr>

                    <td
                        colSpan="5"
                        className="table-message"
                    >
                        No vehicles found.
                    </td>

                </tr>

            ) : (

                vehicles
    .filter((vehicle) => {

        const value = search.toLowerCase();

        return (

            vehicle.registrationNumber
                ?.toLowerCase()
                .includes(value) ||

            vehicle.vehicleNumber
                ?.toLowerCase()
                .includes(value) ||

            vehicle.vehicleType
                ?.toLowerCase()
                .includes(value)

        );

    })
    .map((vehicle) => (

                    <tr key={vehicle.id}>

                        <td>{vehicle.registrationNumber}</td>

                        <td>{vehicle.vehicleNumber}</td>

                        <td>{vehicle.vehicleType}</td>

                        <td>{vehicle.capacity}</td>

                        <td>{vehicle.status}</td>

                        <td>

    <div className="table-actions">

        <button
            className="icon-btn"
            onClick={() => onEdit(vehicle)}
        >

            <Pencil size={17} />

        </button>

        <button
    className="icon-btn delete-btn"
    onClick={() => {

        setVehicleToDelete(vehicle);

        setOpenDialog(true);

    }}
>

    <Trash2 size={17} />

</button>

    </div>

</td>

                    </tr>

                ))

            )}

        </DataTable>

        <ConfirmDialog
    open={openDialog}
    title="Delete Vehicle"
    message="Are you sure you want to delete this vehicle?"
    onCancel={() => {

        setOpenDialog(false);

        setVehicleToDelete(null);

    }}
    onConfirm={handleDelete}
/>

        </>

    );

}

export default VehicleTable;