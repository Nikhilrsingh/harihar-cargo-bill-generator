import { useState } from "react";

import { Pencil, Trash2 } from "lucide-react";

import { toast } from "react-toastify";

import DataTable from "../common/DataTable";
import ConfirmDialog from "../common/ConfirmDialog";

import { deleteDriver } from "../../services/driverService";

function DriverTable({
    drivers,
    loading,
    search,
    onEdit,
    refreshDrivers,
}) {

    const [openDialog, setOpenDialog] = useState(false);

const [DriverToDelete, setDriverToDelete] = useState(null);

const handleDelete = async () => {

    try {

        await deleteDriver(DriverToDelete.id);

        await refreshDrivers();

        toast.success("Driver deleted successfully.");

    } catch (error) {

        console.error(error);

        toast.error("Failed to delete Driver.");

    }

    setOpenDialog(false);

    setDriverToDelete(null);

};

    return (

        <>

        <DataTable
           columns={[
    "Driver Name",
    "Mobile Number",
    "License Number",
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

            ) : drivers.length === 0 ? (

                <tr>

                    <td
                        colSpan="5"
                        className="table-message"
                    >
                        No drivers found.
                    </td>

                </tr>

            ) : (

                drivers
    .filter((Driver) => {

        const value = search.toLowerCase();

        return (

            Driver.registrationNumber
                ?.toLowerCase()
                .includes(value) ||

            Driver.mobileNumber
                ?.toLowerCase()
                .includes(value) ||

            Driver.licenseNumber
                ?.toLowerCase()
                .includes(value)

        );

    })
    .map((Driver) => (

                    <tr key={Driver.id}>

                        <td>{Driver.driverName}</td>

                        <td>{Driver.phone}</td>

                        <td>{Driver.drivingLicenseNumber}</td>

                        <td>{Driver.capacity}</td>

                        <td>{Driver.status}</td>

                        <td>

    <div className="table-actions">

        <button
            className="icon-btn"
            onClick={() => onEdit(Driver)}
        >

            <Pencil size={17} />

        </button>

        <button
    className="icon-btn delete-btn"
    onClick={() => {

        setDriverToDelete(Driver);

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
    title="Delete Driver"
    message="Are you sure you want to delete this Driver?"
    onCancel={() => {

        setOpenDialog(false);

        setDriverToDelete(null);

    }}
    onConfirm={handleDelete}
/>

        </>

    );

}

export default DriverTable;