import LibrarianNotification from "../../models/librarianNotification.model.js"

export const createLibrarianNotification = async (message, type) => {
    await LibrarianNotification.create({ message, type });
};