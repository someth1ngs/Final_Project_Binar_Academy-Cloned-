const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { addNotification } = require("../libs/notification");

// Controller to get user profile
exports.getProfile = async (req, res, next) => {
  try {
    // Check if user ID is present in the request
    if (!req.user_data.id) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to see this profile",
        data: null,
      });
    }

    // Fetch user profile data from the database
    const user = await prisma.user.findUnique({
      where: { id: req.user_data.id },
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

    // If user profile not found, return 404 response
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Profile not found",
        data: null,
      });
    }

    // Send response with user profile data
    return res.status(200).json({
      status: true,
      message: "Successfully get profile data",
      data: user,
    });
  } catch (error) {
    // Pass error to the next middleware
    next(error);
  }
};

// Controller to edit user profile
exports.editProfile = async (req, res, next) => {
  try {
    const { name, address, phone, occupation, birthdate } = req.body;

    // Fetch user and profile data from the database
    const user = await prisma.user.findUnique({
      where: {
        id: req.user_data.id,
      },
      include: {
        profile: true,
      },
    });

    // If user or profile not found, return 404 response
    if (!user || !user.profile) {
      return res.status(404).json({
        status: false,
        message: "Profile not found for this user",
        data: null,
      });
    }

    // Check if user ID is present in the request
    if (!req.user_data.id) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to edit this profile",
        data: null,
      });
    }

    // Update profile data
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

    // If profile update fails, return 500 response
    if (!editProfile) {
      return res.status(500).json({
        status: false,
        message: "Failed to update profile",
        data: null,
      });
    }

    // Update user name
    const editUserName = await prisma.user.update({
      where: {
        id: req.user_data.id,
      },
      data: {
        name: name,
      },
    });

    // If user name update fails, return 500 response
    if (!editUserName) {
      return res.status(500).json({
        status: false,
        message: "Failed to update user name",
        data: null,
      });
    }

    // Add notification for profile edit
    await addNotification(
      "Edit Profile",
      "Your profile has been successfully edited",
      req.user_data.id
    );

    // Send response indicating successful profile edit
    return res.status(200).json({
      status: true,
      message: "Successfully edited profile data",
      data: null,
    });
  } catch (error) {
    // Pass error to the next middleware
    next(error);
  }
};
