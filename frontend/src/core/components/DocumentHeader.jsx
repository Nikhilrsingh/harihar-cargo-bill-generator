import Input from "../../components/common/Input";

function DocumentHeader({
    title,
    form,
    handleChange,
}) {
    return (
        <div className="card">
            <h2>{title} Details</h2>

            <div className="form-grid">

                <Input
                    label={`${title} Number`}
                    name="documentNo"
                    value={form.documentNo || ""}
                    readOnly
                />

                <Input
                    label="Date"
                    type="date"
                    name="date"
                    value={form.date || ""}
                    onChange={handleChange}
                />

                <Input
                    label="Customer / Party"
                    name="partyName"
                    value={form.partyName || ""}
                    onChange={handleChange}
                />

                <Input
                    label="Contact Person"
                    name="contactPerson"
                    value={form.contactPerson || ""}
                    onChange={handleChange}
                />

                <Input
                    label="Phone Number"
                    name="phone"
                    value={form.phone || ""}
                    onChange={handleChange}
                />

                <Input
                    label="Pickup Location"
                    name="from"
                    value={form.from || ""}
                    onChange={handleChange}
                />

                <Input
                    label="Delivery Location"
                    name="to"
                    value={form.to || ""}
                    onChange={handleChange}
                />

                <Input
                    label="Remarks"
                    name="remarks"
                    value={form.remarks || ""}
                    onChange={handleChange}
                />

            </div>
        </div>
    );
}

export default DocumentHeader;