import {
    create,
    edit,
    remove,
    getAll,
} from "../core";

const COLLECTION = "pickups";

export const getPickups = () => getAll(COLLECTION);

export const addPickup = (data) =>
    create(COLLECTION, data);

export const updatePickup = (id, data) =>
    edit(COLLECTION, id, data);

export const deletePickup = (id) =>
    remove(COLLECTION, id);