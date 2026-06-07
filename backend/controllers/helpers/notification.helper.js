import Notification from "../../models/notification.model.js"

export const createNotification = async (studentId, message, type) => {
    await Notification.create({ student: studentId, message, type });
}