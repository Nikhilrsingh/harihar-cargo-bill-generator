import CustomerForm from "./CustomerForm";

function CustomerDrawer({
    open,
    customer,
    refreshCustomers,
    onClose,
}) {

    if (!open) return null;

    return (

        <div
    className="drawer-overlay"
    onClick={onClose}
>

            <div
    className="drawer"
    onClick={(e) => e.stopPropagation()}
>

                <div className="drawer-header">

                    <div>

    <h2>

    {customer ? "Edit Customer" : "Add Customer"}

</h2>

    <p>Create a new transport customer.</p>

</div>

                    <button
    className="drawer-close"
    onClick={onClose}
>
    ✕
</button>

                </div>

               <CustomerForm
    selectedCustomer={customer}
    refreshCustomers={refreshCustomers}
    onClose={onClose}
/>
            </div>

        </div>

    );

}

export default CustomerDrawer;