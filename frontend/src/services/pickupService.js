import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

const COLLECTION = "pickups";

export async function getPickups() {

    const snapshot = await getDocs(collection(db, COLLECTION));

    return snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
    }));

}

export async function createPickup(data) {

    return await addDoc(
        collection(db, COLLECTION),
        {
            ...data,
            createdAt: serverTimestamp(),
        }
    );

}

export async function updatePickup(id, data) {

    return await updateDoc(
        doc(db, COLLECTION, id),
        data
    );

}

export async function deletePickup(id) {

    return await deleteDoc(
        doc(db, COLLECTION, id)
    );

}

export async function getNextPickupNumber() {

    const pickups = await getPickups();

    if (!pickups.length) {
        return "PU-" + new Date().getFullYear() + "-0001";
    }

    let max = 0;

    pickups.forEach((pickup) => {

        const number = pickup.pickupNo || "";
        const last = parseInt(number.split("-").pop(), 10);

        if (!isNaN(last) && last > max) {
            max = last;
        }

    });

    const next = String(max + 1).padStart(4, "0");

    return `PU-${new Date().getFullYear()}-${next}`;

}