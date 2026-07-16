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

const driverCollection = collection(db, "drivers");

export const saveDriver = async (driver) => {

    await addDoc(driverCollection, driver);

};

export const getDrivers = async () => {

    const snapshot = await getDocs(driverCollection);

    return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    }));

};

export const updateDriver = async (id, data) => {

    await updateDoc(
        doc(db, "drivers", id),
        data
    );

};

export const deleteDriver = async (id) => {

    await deleteDoc(
        doc(db, "drivers", id)
    );

};

export const checkRegistrationExists = async (
    registrationNumber,
    excludeId = null
) => {

    const q = query(
        driverCollection,
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



export const checkMobileExists = async (
    mobileNumber,
    excludeId = null
) => {

    const q = query(
        driverCollection,
        where(
            "mobileNumber",
            "==",
            mobileNumber
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


export const checkLicenseExists = async (
    drivingLicenseNumber,
    excludeId = null
) => {

    const q = query(
        driverCollection,
        where(
            "drivingLicenseNumber",
            "==",
            drivingLicenseNumber.toUpperCase()
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