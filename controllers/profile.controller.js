const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { addNotification } = require('../libs/notification');

exports.getProfile = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    if (user_id !== req.user_data.id) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to see this profile",
        data: null,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        is_verified: true,
        role: true,
        profile: {
          select: {
            id: true,
            address: true,
            phone: true,
            occupation: true,
            birthdate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Profile not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Successfully get profile data",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.editProfile = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { name, address, phone, occupation, birthdate } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      include: {
        profile: true,
      },
    });

    if (!user || !user.profile) {
      return res.status(404).json({
        status: false,
        message: "Profile not found for this user",
        data: null,
      });
    }

    if (user.id !== req.user_data.id) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to edit this profile",
        data: null,
      });
    }

    const editProfile = await prisma.profile.update({
      where: {
        id: user.profile.id,
      },
      data: {
        address: address,
        phone: phone,
        occupation: occupation,
        birthdate: new Date(birthdate),
      },
    });

    if (!editProfile) {
      return res.status(500).json({
        status: false,
        message: "Failed to update profile",
        data: null
      });
    }

    const editUserName = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        name: name,
      },
    });

    if (!editUserName) {
      return res.status(500).json({
        status: false,
        message: "Failed to update user name",
        data: null
      });
    }

    await addNotification("Edit Profile", "Your profile has been successfully edited", user_id);

    return res.status(200).json({
      status: true,
      message: "Successfully edited profile data",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
