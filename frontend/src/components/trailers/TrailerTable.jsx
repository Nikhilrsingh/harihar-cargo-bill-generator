import { useState } from "react";

import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import DataTable from "../common/DataTable";
import ConfirmDialog from "../common/ConfirmDialog";

import { deleteTrailer } from "../../services/trailerService";

function TrailerTable({
    trailers = [],
    loading,
    search,
    onEdit,
    refreshTrailers,
}) {

    const [openDialog, setOpenDialog] = useState(false);
    const [trailerToDelete, setTrailerToDelete] = useState(null);

    const handleDelete = async () => {

        try {

            await deleteTrailer(trailerToDelete.id);

            await refreshTrailers();

            toast.success("Trailer deleted successfully.");

        } catch (error) {

            console.error(error);

            toast.error("Failed to delete Trailer.");

        }

        setOpenDialog(false);
        setTrailerToDelete(null);

    };

    const filteredTrailers = trailers.filter((trailer) => {

        const value = search.toLowerCase();

        return (

            trailer.registrationNumber?.toLowerCase().includes(value) ||

            trailer.trailerNumber?.toLowerCase().includes(value) ||

            trailer.trailerType?.toLowerCase().includes(value)

        );

    });

    return (

        <>

            <DataTable
                columns={[
                    "Registration",
                    "Trailer Number",
                    "Trailer Type",
                    "Capacity",
                    "Status",
                    "Actions",
                ]}
            >

                {loading ? (

                    <tr>

                        <td colSpan="6" className="table-message">

                            Loading...

                        </td>

                    </tr>

                ) : filteredTrailers.length === 0 ? (

                    <tr>

                        <td colSpan="6" className="table-message">

                            No Trailers found.

                        </td>

                    </tr>

                ) : (

                    filteredTrailers.map((trailer) => (

                        <tr key={trailer.id}>

                            <td>{trailer.registrationNumber}</td>

                            <td>{trailer.trailerNumber}</td>

                            <td>{trailer.trailerType}</td>

                            <td>{trailer.capacity}</td>

                            <td>{trailer.status}</td>

                            <td>

                                <div className="table-actions">

                                    <button
                                        className="icon-btn"
                                        onClick={() => onEdit(trailer)}
                                    >

                                        <Pencil size={17} />

                                    </button>

                                    <button
                                        className="icon-btn delete-btn"
                                        onClick={() => {

                                            setTrailerToDelete(trailer);

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
                title="Delete Trailer"
                message="Are you sure you want to delete this Trailer?"
                onCancel={() => {

                    setOpenDialog(false);

                    setTrailerToDelete(null);

                }}
                onConfirm={handleDelete}
            />

        </>

    );

}

export default TrailerTable;