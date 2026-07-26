import TransportForm from "./TransportForm";

function TransportDrawer({
    open,
    title = "Transport",
    document,
    createDocument,
    editDocument,
    refreshDocuments,
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
                            {document
                                ? `Edit ${title}`
                                : `Add ${title}`}
                        </h2>

                        <p>
                            Create or update a transport document.
                        </p>
                    </div>

                    <button
                        className="drawer-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <TransportForm
                    document={document}
                    createDocument={createDocument}
                    editDocument={editDocument}
                    refreshDocuments={refreshDocuments}
                    onClose={onClose}
                    title={title}
                />
            </div>
        </div>
    );
}

export default TransportDrawer;