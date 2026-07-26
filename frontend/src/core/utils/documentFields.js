export const DEFAULT_VEHICLE = {
    chassisNo: "",
    engineNo: "",
    model: "",
    variant: "",
    color: "",
    from: "",
    to: "",
    remarks: "",
};

export const DEFAULT_DOCUMENT = {
    id: null,

    documentNo: "",
    date: new Date().toISOString().split("T")[0],

    partyName: "",
    contactPerson: "",
    phone: "",

    from: "",
    to: "",

    remarks: "",

    cars: [
        { ...DEFAULT_VEHICLE },
    ],
};

export const DOCUMENT_PREFIX = {
    pickup: "PU",
    loading: "LD",
    bilty: "BL",
    invoice: "INV",
    delivery: "DL",
    pod: "POD",
};

export const DOCUMENT_TYPES = Object.keys(DOCUMENT_PREFIX);