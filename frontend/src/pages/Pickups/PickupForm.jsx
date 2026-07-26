import { DocumentForm } from "../../core";

function PickupForm({ initialData, onSubmit, onCancel }) {
  return (
    <DocumentForm
      title="Pickup"
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}

export default PickupForm;