const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { JWT_SECRET } = process.env;

exports.getPlanes = async (req, res, next) => {
  try {
    const planeData = await prisma.plane.findMany({});

    return res.status(200).json({
      status: true,
      message: "Successfully get planes data",
      data: planeData,
    });
  } catch (error) {
    next(error);
  }
};
exports.getPlaneByIdCode = async (req, res, next) => {
  try {
    const { id_code } = req.params;

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

    if (!planeData) {
      return res.status(404).json({
        status: false,
        message: "Plane not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Successfully get plane data",
      data: planeData,
    });
  } catch (error) {
    next(error);
  }
};
