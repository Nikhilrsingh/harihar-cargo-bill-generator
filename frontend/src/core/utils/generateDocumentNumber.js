export function extractLastNumber(documentNo = "") {
    const match = documentNo.match(/(\d+)$/);

    return match ? Number(match[1]) : 0;
}

export function generateDocumentNumber(
    prefix,
    documents = []
) {
    let max = 0;

    documents.forEach((doc) => {
        max = Math.max(
            max,
            extractLastNumber(doc.documentNo)
        );
    });

    return `${prefix}-${String(max + 1).padStart(5, "0")}`;
}