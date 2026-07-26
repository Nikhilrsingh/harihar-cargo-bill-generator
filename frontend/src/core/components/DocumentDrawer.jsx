import { useEffect } from "react";

function DocumentDrawer({
    open,
    title,
    children,
    onClose,
}) {
    useEffect(() => {
    if (!open) return;

    const previousOverflow =
        document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
        if (event.key === "Escape") {
            onClose();
        }
    }

    document.addEventListener(
        "keydown",
        handleKeyDown
    );

    return () => {
        document.body.style.overflow =
            previousOverflow;

        document.removeEventListener(
            "keydown",
            handleKeyDown
        );
    };
}, [open, onClose]);

    if (!open) return null;

    return (
        <>
            <div
                className="drawer-overlay"
                onClick={onClose}
            />

            <aside
    className="drawer"
    role="dialog"
    aria-modal="true"
    onClick={(e) => e.stopPropagation()}
    style={{
        width: "min(1100px, 95vw)",
        height: "100vh",
        marginLeft: "auto",
        display: "flex",
        flexDirection: "column",
    }}
>
                <div
    className="drawer-header"
    style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 20px",
        borderBottom: "1px solid var(--border-color)",
        flexShrink: 0,
    }}
>
                    <h2>{title}</h2>

                   <button
    type="button"
    className="drawer-close"
    onClick={onClose}
    style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: 24,
        lineHeight: 1,
    }}
>
    ✕
</button>
                </div>

               <div
    className="drawer-body"
    style={{
        flex: 1,
        overflowY: "auto",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 20,
    }}
>
    {children}
</div>
            </aside>
        </>
    );
}

export default DocumentDrawer;