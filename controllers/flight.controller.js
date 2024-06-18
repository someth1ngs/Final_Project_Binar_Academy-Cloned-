const { PrismaClient } = require("@prisma/client");
const { filterFlight, filterOrderFlight } = require("../libs/flights");
const prisma = new PrismaClient();
exports.getFlights = async (req, res, next) => {
  try {
    let orderBy;
    let where;
    try {
      where = await filterFlight(req);
      orderBy = await filterOrderFlight(req);
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        data: null,
      });
    }

    const { page = 1 } = req.query;
    const limit = 5;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [flights, total] = await Promise.all([
      prisma.flight_Class.findMany({
        take: limit,
        skip: skip,
        where: {
          ...where,
        },
        include: {
          flight: {
            include: {
              plane: true,
              from: true,
              to: true,
            },
          },
        },
        orderBy: orderBy,
      }),
      // prisma.flight.findMany({
      //   take: limit,
      //   skip: skip,
      //   where: {
      //     ...where,
      //   },
      //   include: {
      //     flight_classes: {
      //       where: {
      //         name: where.flight_classes.some.name,
      //       },
      //     },
      //     plane: true,
      //     from: true,
      //     to: true,
      //   },
      // }),
      prisma.flight_Class.count({
        where: {
          ...where,
        },
      }),
    ]);

    const totalPage = Math.ceil(total / limit);

    return res.status(200).json({
      status: true,
      message: "Successfully get flights data",
      data: {
        flights,
        page: +page,
        total_pages: totalPage,
        total_items: total,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.getFlightById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const flight = await prisma.flight.findUnique({
      where: {
        id,
      },
      include: {
        from: true,
        to: true,
        plane: true,
        flight_classes: true,
      },
    });

    if (!flight) {
      return res.status(404).json({
        status: false,
        message: "Flight data not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Successfully get flight data",
      data: {
        flight,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getFavoriteDestination = async (req, res, next) => {
  try {
    const { from: from_code } = req.query;

    let whereClause = {};

    if (from_code) {
      whereClause.from_code = from_code;
    }

    // whereClause.departure = {
    //   some: {
    //     from_code: from_code,
    //     departureAt: {
    //       gte: new Date(),
    //     },
    //   },
    // };
    // const flight = await prisma.airport.findMany({
    //   where: {
    //     ...whereClause,
    //   },
    //   orderBy: {
    //     visited: "desc",
    //   },
    //   include: {
    //     arrives: {
    //       skip: 0,
    //       take: 1,
    //       orderBy: {
    //         arriveAt: "desc",
    //       },
    //       include: {
    //         flight_classes: true,
    //       },
    //     },
    //   },
    // });

    const flights = await prisma.flight.findMany({
      skip: 0,
      take: 8,
      where: {
        ...whereClause,
        departureAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        to: {
          visited: "desc",
        },
      },
      include: {
        from: true,
        to: true,
        plane: true,
        flight_classes: true,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Successfully get data",
      data: {
        flights,
      },
    });
  } catch (error) {
    next(error);
  }
};
