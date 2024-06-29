const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { JWT_SECRET } = process.env;

// Controller to get all planes
exports.getPlanes = async (req, res, next) => {
  try {
    // Fetch all plane records from the database
    const planeData = await prisma.plane.findMany({});

    // Send response with plane data
    return res.status(200).json({
      status: true,
      message: "Successfully get planes data",
      data: planeData,
    });
  } catch (error) {
    // Pass error to the next middleware
    next(error);
  }
};

// Controller to get a plane by its ID or plane code
exports.getPlaneByIdCode = async (req, res, next) => {
  try {
    const { id_code } = req.params;

    // Fetch plane record by ID or plane code
    const planeData = await prisma.plane.findFirst({
      where: {
        OR: [
          {
            id: id_code,
          },
          {
            plane_code: id_code,
          },
        ],
      },
    });

    // If no plane found, send a 404 response
    if (!planeData) {
      return res.status(404).json({
        status: false,
        message: "Plane not found",
        data: null,
      });
    }

    // Send response with plane data
    return res.status(200).json({
      status: true,
      message: "Successfully get plane data",
      data: planeData,
    });
  } catch (error) {
    // Pass error to the next middleware
    next(error);
  }
};
