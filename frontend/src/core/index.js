export { default as DocumentDrawer } from "./components/DocumentDrawer";
export { default as DocumentForm } from "./components/DocumentForm";
export { default as DocumentHeader } from "./components/DocumentHeader";
export { default as DocumentActions } from "./components/DocumentActions";
export { default as VehicleTable } from "./components/VehicleTable";

export { default as useCrud } from "./hooks/useCrud";

export * from "./services/firestoreCrud";

export {
    DEFAULT_DOCUMENT,
    DEFAULT_VEHICLE,
    DOCUMENT_PREFIX,
    DOCUMENT_TYPES,
} from "./utils/documentFields";

export {
    generateDocumentNumber,
    extractLastNumber,
} from "./utils/generateDocumentNumber";