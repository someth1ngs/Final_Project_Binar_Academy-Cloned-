const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addNotification = async (title, message, user_id) => {
  try {
    let addNotif = await prisma.notification.create({
      data: {
        title,
        message,
        user_id,
      },
    });

    return {
      status: true,
      message: "Notification add successfull.",
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};
