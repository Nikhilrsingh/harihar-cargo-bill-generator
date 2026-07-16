import TrailerForm from "./TrailerForm";

function TrailerDrawer({
    open,
    Trailer,
    refreshTrailers,
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

                            {Trailer ? "Edit Trailer" : "Add Trailer"}

                        </h2>

                        <p>Manage trailer details.</p>

                    </div>

                    <button
                        className="drawer-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <TrailerForm
                    selectedTrailer={Trailer}
                    refreshTrailers={refreshTrailers}
                    onClose={onClose}
                />

            </div>

        </div>

    );

}

export default TrailerDrawer;