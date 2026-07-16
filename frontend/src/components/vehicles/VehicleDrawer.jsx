import VehicleForm from "./VehicleForm";

function VehicleDrawer({
    open,
    vehicle,
    refreshVehicles,
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

                            {vehicle ? "Edit Vehicle" : "Add Vehicle"}

                        </h2>

                        <p>Create a new transport vehicle.</p>

                    </div>

                    <button
                        className="drawer-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <VehicleForm
    selectedVehicle={vehicle}
    refreshVehicles={refreshVehicles}
    onClose={onClose}
/>

            </div>

        </div>

    );

}

export default VehicleDrawer;