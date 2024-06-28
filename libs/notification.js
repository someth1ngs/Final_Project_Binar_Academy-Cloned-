const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addNotification = async (title, message, user_id) => {
  try {
    // Created a notification to user based by argument given
    let addNotif = await prisma.notification.create({
      data: {
        title,
        message,
        user_id,
      },
    });

    // Return when success
    return {
      status: true,
      message: "Notification add successfull.",
    };
  } catch (error) {
    // Return error if error occured
    console.log(error);
    return error;
  }
};
