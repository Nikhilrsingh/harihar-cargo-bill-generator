import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

const trailerCollection = collection(db, "trailers");

export const saveTrailer = async (trailer) => {

    await addDoc(trailerCollection, trailer);

};

export const getTrailers = async () => {

    const snapshot = await getDocs(trailerCollection);

    return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    }));

};

export const updateTrailer = async (id, data) => {

    await updateDoc(
        doc(db, "trailers", id),
        data
    );

};

export const deleteTrailer = async (id) => {

    await deleteDoc(
        doc(db, "trailers", id)
    );

};

export const checkRegistrationExists = async (
    registrationNumber,
    excludeId = null
) => {

    const q = query(
        trailerCollection,
        where(
            "registrationNumber",
            "==",
            registrationNumber.toUpperCase()
        )
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return false;

    if (
        excludeId &&
        snapshot.docs[0].id === excludeId
    ) {
        return false;
    }

    return true;

};