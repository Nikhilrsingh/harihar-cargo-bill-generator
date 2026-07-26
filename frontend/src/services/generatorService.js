export const GENERATOR_TYPES = [
    "manual",
    "quotation",
    "booking",
    "pickup",
    "loading",
    "bilty",
];

export function getGeneratorOptions(type, data) {

    return data.map((item) => ({

        id: item.id,

        type,

        number:
            item.quotationNo ||
            item.bookingNo ||
            item.pickupNo ||
            item.loadingNo ||
            item.biltyNo ||
            item.billNo ||
            "-",

        name:
            item.customerName ||
            item.partyName ||
            "Unknown",

        data: item,

    }));

}