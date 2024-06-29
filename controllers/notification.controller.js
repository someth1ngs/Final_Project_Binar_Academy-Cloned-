const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// function get notifications
exports.getNotification = async (req, res, next) => {
    try {
        // Fetch notifications for the current user based on user_id
        const getNotif = await prisma.notification.findMany({
            where: {
                user_id: req.user_data.id
            },
            orderBy: {
                createdAt: 'desc' // Order notifications by createdAt in descending order
            },
        });

        // Return a successful response with the retrieved notifications
        return res.status(200).json({
            status: true,
            message: 'Get notifications successful.',
            data: getNotif
        });

    } catch (error) {
        next(error);
    }
};


// function notification is_read
exports.markAsRead = async (req, res, next) => {
    try {
        // Update notifications for the current user to mark them as read
        const markRead = await prisma.notification.updateMany({
            where: { user_id: req.user_data.id }, // Filter notifications by user_id
            data: { is_read: true } // Set is_read to true for all matching notifications
        });

        // Return a successful response indicating notifications have been marked as read
        return res.status(200).json({
            status: true,
            message: 'Notifications marked as read',
            data: markRead // Optionally, return the updated notifications or the count of updated notifications
        });

    } catch (error) {
        next(error);
    }
};
