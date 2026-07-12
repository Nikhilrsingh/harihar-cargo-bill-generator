import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const saveCompany = async (companyData) => {

    await setDoc(
        doc(db, "companies", "company-profile"),
        companyData
    );

};

import { getDoc } from "firebase/firestore";

export const getCompany = async () => {

    const docRef = doc(db, "companies", "company-profile");

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    }

    return null;
};