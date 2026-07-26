import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

const bookingRef = collection(db, "bookings");

export async function getBookings() {

    const q = query(
        bookingRef,
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

}

export async function addBooking(data) {

    const snapshot = await getDocs(bookingRef);

    const bookingNo = `BK-${new Date().getFullYear()}-${String(
        snapshot.size + 1
    ).padStart(5, "0")}`;

    await addDoc(bookingRef, {
        ...data,
        bookingNo,
        status: "Draft",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

}

export async function updateBooking(id, data) {

    await updateDoc(doc(db, "bookings", id), {
        ...data,
        updatedAt: serverTimestamp(),
    });

}

export async function deleteBooking(id) {

    await deleteDoc(doc(db, "bookings", id));

}