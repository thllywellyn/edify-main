import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Notification } from "../models/notification.model.js";

const getNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const userType = req.user.type + 's'; // Convert to plural form (student -> students, teacher -> teachers)

    const notifications = await Notification.find({
        recipient: userId,
        recipientModel: userType
    })
    .sort({ createdAt: -1 })
    .limit(20);

    const unreadCount = await Notification.countDocuments({
        recipient: userId,
        recipientModel: userType,
        read: false
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { notifications, unreadCount }, "Notifications fetched successfully"));
});

const markNotificationRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    const userId = req.user._id;
    const userType = req.user.type + 's';

    const notification = await Notification.findOneAndUpdate(
        {
            _id: notificationId,
            recipient: userId,
            recipientModel: userType
        },
        { read: true },
        { new: true }
    );

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, notification, "Notification marked as read"));
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const userType = req.user.type + 's';

    await Notification.updateMany(
        {
            recipient: userId,
            recipientModel: userType,
            read: false
        },
        { read: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "All notifications marked as read"));
});

// Helper function to create notifications
const createNotification = async (recipientId, recipientModel, title, message, type = 'info', link = null) => {
    try {
        const notification = await Notification.create({
            recipient: recipientId,
            recipientModel,
            title,
            message,
            type,
            link
        });
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
};

export {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    createNotification
};