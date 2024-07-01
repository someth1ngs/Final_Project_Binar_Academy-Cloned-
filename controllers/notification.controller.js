const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// function get notifications
exports.getNotification = async (req, res, next) => {
  try {
    // Extract pagination parameters from query string
    const { page = 1 } = req.query;
    const limit = 5;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch notifications for the current user based on user_id
    const [notif, total] = await Promise.all([
      prisma.notification.findMany({
        take: limit,
        skip: skip,
        where: {
          user_id: req.user_data.id,
        },
        orderBy: {
          createdAt: "desc", // Order notifications by createdAt in descending order
        },
      }),
      prisma.notification.count({
        where: {
          user_id: req.user_data.id,
        },
      }),
    ]);

    // Calculate total pages based on the pagination limit
    const totalPage = Math.ceil(total / limit);

    // Return a successful response with the retrieved notifications
    return res.status(200).json({
      status: true,
      message: "Get notifications successful.",
      data: notif,
      page: +page,
      total_pages: totalPage,
      total_items: total,
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
      data: { is_read: true }, // Set is_read to true for all matching notifications
    });

    // Return a successful response indicating notifications have been marked as read
    return res.status(200).json({
      status: true,
      message: "Notifications marked as read",
      data: markRead, // Optionally, return the updated notifications or the count of updated notifications
    });
  } catch (error) {
    next(error);
  }
};
