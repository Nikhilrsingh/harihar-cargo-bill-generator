import DriverForm from "./DriverForm";

function DriverDrawer({
    open,
    Driver,
    refreshDrivers,
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

                            {Driver ? "Edit Driver" : "Add Driver"}

                        </h2>

                        <p>Create a new transport Driver.</p>

                    </div>

                    <button
                        className="drawer-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <DriverForm
    selectedDriver={Driver}
    refreshDrivers={refreshDrivers}
    onClose={onClose}
/>

            </div>

        </div>

    );

}

export default DriverDrawer;