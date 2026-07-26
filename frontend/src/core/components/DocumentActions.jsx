import Button from "../../components/common/Button";

function DocumentActions({
    onCancel,
    submitText = "Save",
}) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 24,
            }}
        >
            <Button
                type="button"
                variant="secondary"
                text="Cancel"
                onClick={onCancel}
            />

            <Button
                type="submit"
                text={submitText}
            />
        </div>
    );
}

export default DocumentActions;