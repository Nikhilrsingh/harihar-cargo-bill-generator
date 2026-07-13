function ConfirmDialog({
    open,
    title,
    message,
    onCancel,
    onConfirm,
}) {

    if (!open) return null;

    return (

        <div className="confirm-overlay">

            <div className="confirm-dialog">

                <h2>{title}</h2>

                <p>{message}</p>

                <div className="confirm-actions">

                    <button
                        className="btn btn-secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

}

export default ConfirmDialog;