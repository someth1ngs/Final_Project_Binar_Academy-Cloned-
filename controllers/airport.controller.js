const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { JWT_SECRET } = process.env;

exports.getAirports = async (req, res, next) => {
  try {
    const airportData = await prisma.airport.findMany({});

    return res.status(200).json({
      status: true,
      message: "Successfully get airports data",
      data: airportData,
    });
  } catch (error) {
    next(error);
  }
};
exports.getAirportByIdCode = async (req, res, next) => {
  try {
    const { id_code } = req.params;

    const airportData = await prisma.airport.findFirst({
      where: {
        OR: [
          {
            id: id_code,
          },
          {
            airport_code: id_code,
          },
        ],
      },
    });

    if (!airportData) {
      return res.status(404).json({
        status: false,
        message: "Airport not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Successfully get airport data",
      data: airportData,
    });
  } catch (error) {
    next(error);
  }
};
