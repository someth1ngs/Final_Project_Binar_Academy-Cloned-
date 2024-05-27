const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// function get notifications
exports.getNotification = async (req, res, next) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(404).json({
                status: false,
                message: 'Notifications not found.',
                data: null
            })
        }

        const getNotif = await prisma.notification.findMany({
            where: {
                user_id
            },
            orderBy: {
                createdAt: 'desc'
            },
        })

        return res.status(200).json({
            status: true,
            message: 'Get notifications successfull.',
            data: getNotif
        });

    } catch (error) {
        next(error);
    }
};

// function notification is_read
exports.markAsRead = async (req, res, next) => {
    try {
        const { user_id } = req.params;

        let markRead = await prisma.notification.updateMany({
            where: { user_id },
            data: { is_read: true }
        });

        return res.status(200).json({
            status: true,
            message: 'Notification marked as read',
            data: markRead
        });

    } catch (error) {
        next(error);
    }
};