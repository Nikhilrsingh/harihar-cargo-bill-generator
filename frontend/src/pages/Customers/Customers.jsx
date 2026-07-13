import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import CustomerTable from "../../components/customers/CustomerTable";
import { useState } from "react";
import PageToolbar from "../../components/common/PageToolbar";
import CustomerDrawer from "../../components/customers/CustomerDrawer";
import useCustomers from "../../hooks/useCustomers";

function Customers() {

    const [search, setSearch] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const {
    customers,
    loading,
    refreshCustomers,
} = useCustomers();

const filteredCustomers = customers.filter((customer) => {

    const keyword = search.toLowerCase();

    return (
        customer.customerName?.toLowerCase().includes(keyword) ||
        customer.contactPerson?.toLowerCase().includes(keyword) ||
        customer.phone?.includes(keyword) ||
        customer.city?.toLowerCase().includes(keyword)
    );

});

    return (

        <MainLayout>

            <div className="dashboard">

                <PageHeader
    title="Customers"
    subtitle={`Manage all transport customers • Total Customers: ${customers.length}`}
/>

                <PageToolbar
    search={search}
    setSearch={setSearch}
    buttonText="Add Customer"
    onButtonClick={() => setOpenDrawer(true)}
/>

                <CustomerTable
    customers={filteredCustomers}
    loading={loading}
    refreshCustomers={refreshCustomers}
    onEdit={(customer) => {

        setSelectedCustomer(customer);

        setOpenDrawer(true);

    }}
/>

                <CustomerDrawer
    open={openDrawer}
    customer={selectedCustomer}
    refreshCustomers={refreshCustomers}
    onClose={() => {

        setOpenDrawer(false);

        setSelectedCustomer(null);

    }}
/>

            </div>

        </MainLayout>

    );

}

export default Customers;