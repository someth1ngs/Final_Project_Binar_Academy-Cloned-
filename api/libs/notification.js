const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addNotification = async (req, res) => {
    try {
        const { title, message, user_id } = req.body;

        if (!title || !message | !user_id) {
            return res.status(401).json({
                status: false,
                message: 'Missing required field',
                data: null
            });
        };

        let addNotif = await prisma.notification.create({
            data: {
                title,
                message,
                user_id
            }
        });

        return res.status(201).json({
            status: true,
            message: 'Notification add successfull.',
            data: addNotif
        });

    } catch (error) {
        res.status(500).json({ error: 'Error creating notification' });
    }
};

// function get notifications
exports.getNotification = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(404).json({
                status: true,
                message: 'Notifications not found.'
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
        res.status(500).json({ error: 'Error fetching notifications' });
    }
};

// function notification is_read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        let markRead = await prisma.notification.update({
            where: { id },
            data: { is_read: true }
        });

        return res.status(200).json({
            status: true,
            message: 'Notification marked as read',
            data: markRead
        });

    } catch (error) {
        res.status(500).json({ error: 'Error marking notification as read' });
    }
};
