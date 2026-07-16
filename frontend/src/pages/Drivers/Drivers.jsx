import { useState } from "react";

import MainLayout from "../../layouts/MainLayout";

import PageHeader from "../../components/common/PageHeader";
import PageToolbar from "../../components/common/PageToolbar";

import DriverDrawer from "../../components/drivers/DriverDrawer";
import DriverTable from "../../components/drivers/DriverTable";

import useDrivers from "../../hooks/useDrivers";

function Drivers() {

    const { drivers, loading, refreshDrivers } = useDrivers();

    const [search, setSearch] = useState("");

    const [openDrawer, setOpenDrawer] = useState(false);

    const [selectedDriver, setSelectedDriver] = useState(null);

    return (

        <MainLayout>

            <div className="dashboard">

                <PageHeader
                    title="Drivers"
                    subtitle="Manage all transport Drivers."
                />

                <PageToolbar
                    search={search}
                    setSearch={setSearch}
                    buttonText="Add Driver"
                    onButtonClick={() => {

                        setSelectedDriver(null);

                        setOpenDrawer(true);

                    }}
                />

                <DriverTable
    drivers={drivers}
    loading={loading}
    search={search}
    refreshDrivers={refreshDrivers}
   onEdit={(driver) => {
    setSelectedDriver(driver);

        setOpenDrawer(true);

    }}
/>

               <DriverDrawer
    open={openDrawer}
    onClose={() => setOpenDrawer(false)}
    refreshDrivers={refreshDrivers}
    Driver={selectedDriver}
/>

            </div>

        </MainLayout>

    );

}

export default Drivers;