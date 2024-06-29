const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { JWT_SECRET } = process.env;

// Exports an asynchronous function named 'getAirports'
exports.getAirports = async (req, res, next) => {
  try {
    // Retrieves all airport data from the Prisma 'airport' model
    const airportData = await prisma.airport.findMany({});

    // Sends a successful response with status 200 and the retrieved airport data
    return res.status(200).json({
      status: true,
      message: "Successfully get airports data",
      data: airportData,
    });
  } catch (error) {
    next(error);
  }
};

// Exports an asynchronous function named 'getAirportByIdCode'
exports.getAirportByIdCode = async (req, res, next) => {
  try {
    // Destructures the 'id_code' from the request parameters
    const { id_code } = req.params;

    // Retrieves the first airport data that matches the 'id_code' or 'airport_code'
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

    // If no airport data is found, send a 404 response with an error message
    if (!airportData) {
      return res.status(404).json({
        status: false,
        message: "Airport not found",
        data: null,
      });
    }

    // Sends a successful response with status 200 and the retrieved airport data
    return res.status(200).json({
      status: true,
      message: "Successfully get airport data",
      data: airportData,
    });
  } catch (error) {
    next(error);
  }
};


