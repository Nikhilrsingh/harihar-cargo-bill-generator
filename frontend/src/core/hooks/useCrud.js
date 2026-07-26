import { db } from '../../firebase/firebaseConfig';
import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const useCrud = (collectionName) => {
  const colRef = collection(db, collectionName);

  const create = async (data) => {
    return await addDoc(colRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  };

  const update = async (id, data) => {
    const docRef = doc(db, collectionName, id);
    return await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  };

  const remove = async (id) => {
    const docRef = doc(db, collectionName, id);
    return await deleteDoc(docRef);
  };

  return { create, update, remove };
};

export default useCrud;