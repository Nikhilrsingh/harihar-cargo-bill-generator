import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase/firebaseConfig";

export async function getAll(collectionName) {
    const snapshot = await getDocs(
        query(
            collection(db, collectionName),
            orderBy("createdAt", "desc")
        )
    );

    return snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
    }));
}

export async function create(collectionName, data) {
    const payload = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const ref = await addDoc(
        collection(db, collectionName),
        payload
    );

    return {
        id: ref.id,
        ...payload,
    };
}

export async function edit(collectionName, id, data) {
    const payload = {
        ...data,
        updatedAt: new Date(),
    };

    await updateDoc(
        doc(db, collectionName, id),
        payload
    );

    return {
        id,
        ...payload,
    };
}

export async function remove(collectionName, id) {
    await deleteDoc(doc(db, collectionName, id));
}