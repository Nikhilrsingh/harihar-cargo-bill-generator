import DataTable from "../common/DataTable";
import {
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";

import { deleteCustomer } from "../../services/customerService";

import { useState } from "react";
import ConfirmDialog from "../common/ConfirmDialog";

import { toast } from "react-toastify";

function CustomerTable({
    customers,
    loading,
    onEdit,
    refreshCustomers,
}){

    const [openDialog, setOpenDialog] = useState(false);

const [customerToDelete, setCustomerToDelete] = useState(null);

   const handleDelete = async (id) => {

    await deleteCustomer(id);

    await refreshCustomers();

    setOpenDialog(false);

    setCustomerToDelete(null);

    setCustomerToDelete(null);

    toast.success("Customer deleted successfully.");

};

    return (

    <>

        <DataTable
        columns={[
            "Customer",
            "Contact",
            "Phone",
            "GST",
            "City",
            "Actions",
        ]}
    >

        {loading ? (

            <tr>

                <td
                    colSpan="6"
                    className="table-message"
                >
                    Loading...
                </td>

            </tr>

        ) : customers.length === 0 ? (

            <tr>

                <td
                    colSpan="6"
                    className="table-message"
                >
                    No customers found.
                </td>

            </tr>

        ) : (

            customers.map((customer) => (

                <tr key={customer.id}>

                    <td>

    <div className="customer-info">

        <div className="customer-avatar">

            {customer.customerName
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()}

        </div>

        <div className="customer-details">

            <h4>

                {customer.customerName}

            </h4>

            <p>

                {customer.email || "No email"}

            </p>

        </div>

    </div>

</td>

                    <td>{customer.contactPerson}</td>

                    <td>{customer.phone}</td>

                    <td>{customer.gst}</td>

                    <td>{customer.city}</td>

                    <td>

    <div className="table-actions">

        <button className="icon-btn">

            <Eye size={17} />

        </button>

        <button
    className="icon-btn"
    onClick={() => onEdit(customer)}
>

    <Pencil size={17} />

</button>

        <button
    className="icon-btn delete-btn"
    onClick={() => {

    setCustomerToDelete(customer);

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
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        onCancel={() => setOpenDialog(false)}
        onConfirm={() => handleDelete(customerToDelete.id)}
    />

    </>

);

}

export default CustomerTable;