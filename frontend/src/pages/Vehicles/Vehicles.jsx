import { useState } from "react";

import MainLayout from "../../layouts/MainLayout";

import PageHeader from "../../components/common/PageHeader";
import PageToolbar from "../../components/common/PageToolbar";

import VehicleDrawer from "../../components/vehicles/VehicleDrawer";
import VehicleTable from "../../components/vehicles/VehicleTable";

import useVehicles from "../../hooks/useVehicles";

function Vehicles() {

    const { vehicles, loading, refreshVehicles } = useVehicles();

    const [search, setSearch] = useState("");

    const [openDrawer, setOpenDrawer] = useState(false);

    const [selectedVehicle, setSelectedVehicle] = useState(null);

    return (

        <MainLayout>

            <div className="dashboard">

                <PageHeader
                    title="Vehicles"
                    subtitle="Manage all transport vehicles."
                />

                <PageToolbar
                    search={search}
                    setSearch={setSearch}
                    buttonText="Add Vehicle"
                    onButtonClick={() => {

                        setSelectedVehicle(null);

                        setOpenDrawer(true);

                    }}
                />

                <VehicleTable
    vehicles={vehicles}
    loading={loading}
    search={search}
    refreshVehicles={refreshVehicles}
    onEdit={(vehicle) => {

        setSelectedVehicle(vehicle);

        setOpenDrawer(true);

    }}
/>

               <VehicleDrawer
    open={openDrawer}
    onClose={() => setOpenDrawer(false)}
    refreshVehicles={refreshVehicles}
    vehicle={selectedVehicle}
/>

            </div>

        </MainLayout>

    );

}

export default Vehicles;