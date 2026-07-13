import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

const customerCollection = collection(db, "customers");

export const saveCustomer = async (customer) => {

    await addDoc(customerCollection, customer);

};

export const getCustomers = async () => {

    const snapshot = await getDocs(customerCollection);

    return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
}));

};

export const deleteCustomer = async (id) => {

    await deleteDoc(doc(db, "customers", id));

};

export const updateCustomer = async (id, data) => {

    await updateDoc(
        doc(db, "customers", id),
        data
    );

};

export const checkPhoneExists = async (phone, excludeId = null) => {

    const q = query(
        customerCollection,
        where("phone", "==", phone)
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

export const checkGSTExists = async (gst, excludeId = null) => {

    if (!gst.trim()) return false;

    const q = query(
        customerCollection,
        where("gst", "==", gst.toUpperCase())
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

export const checkEmailExists = async (email, excludeId = null) => {

    if (!email.trim()) return false;

    const q = query(
        customerCollection,
        where("email", "==", email.toLowerCase())
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