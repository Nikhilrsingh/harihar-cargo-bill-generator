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

const vehicleCollection = collection(db, "vehicles");

export const saveVehicle = async (vehicle) => {

    await addDoc(vehicleCollection, vehicle);

};

export const getVehicles = async () => {

    const snapshot = await getDocs(vehicleCollection);

    return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    }));

};

export const updateVehicle = async (id, data) => {

    await updateDoc(
        doc(db, "vehicles", id),
        data
    );

};

export const deleteVehicle = async (id) => {

    await deleteDoc(
        doc(db, "vehicles", id)
    );

};

export const checkRegistrationExists = async (
    registrationNumber,
    excludeId = null
) => {

    const q = query(
        vehicleCollection,
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