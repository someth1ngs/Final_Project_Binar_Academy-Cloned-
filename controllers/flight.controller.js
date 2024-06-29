const { PrismaClient } = require("@prisma/client");
const { filterFlight, filterOrderFlight } = require("../libs/flights");
const { GenerateFlight } = require("../prisma/seeders/flight-seed");
const prisma = new PrismaClient();

// function get flights
exports.getFlights = async (req, res, next) => {
  try {
    let orderBy;
    let where;

    // Attempt to filter flights based on request parameters
    try {
      where = await filterFlight(req); // Apply filtering conditions
      orderBy = await filterOrderFlight(req); // Determine sorting order
    } catch (error) {
      console.log(error);
      // If an error occurs during filtering or sorting, return an error response
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        data: null,
      });
    }

    // Extract pagination parameters from query string
    const { page = 1 } = req.query;
    const limit = 5;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch flights data and total count concurrently
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
      prisma.flight_Class.count({
        where: {
          ...where,
        },
      }),
    ]);

    // Calculate total pages based on the pagination limit
    const totalPage = Math.ceil(total / limit);

    // Return the flights data with pagination information
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
    next(error); // Pass any errors to the error handling middleware
  }
};


// function get flights by id
exports.getFlightById = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract the flight ID from request parameters

    // Retrieve the flight data including related entities (from, to, plane, flight classes)
    const flight = await prisma.flight.findUnique({
      where: {
        id,
      },
      include: {
        from: true, // Include the origin airport details
        to: true, // Include the destination airport details
        plane: true, // Include the plane model details
        flight_classes: true, // Include all flight classes associated with this flight
      },
    });

    // If no flight data is found, return a 404 Not Found response
    if (!flight) {
      return res.status(404).json({
        status: false,
        message: "Flight data not found",
        data: null,
      });
    }

    // Return the flight data with a success message
    return res.status(200).json({
      status: true,
      message: "Successfully get flight data",
      data: {
        flight,
      },
    });
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};


// function get favorite destination
exports.getFavoriteDestination = async (req, res, next) => {
  try {
    const { from: from_code } = req.query; // Extract 'from' code from query parameters

    let whereClause = {}; // Initialize an empty object for where clause conditions

    if (from_code) {
      whereClause.from_code = from_code; // If 'from' code is provided, add it to the where clause
    }

    // Retrieve flights that match the conditions
    const flights = await prisma.flight.findMany({
      skip: 0, // Start from the first record
      take: 8, // Limit the result to 8 flights
      where: {
        ...whereClause, // Spread the where clause conditions
        departureAt: {
          gte: new Date(), // Filter flights departing from the current date and time onwards
        },
      },
      orderBy: {
        to: {
          visited: "desc", // Order flights by the number of visits to the destination ('to' airport)
        },
      },
      include: {
        from: true, // Include details of the origin airport ('from')
        to: true, // Include details of the destination airport ('to')
        plane: true, // Include details of the plane used for the flight
        flight_classes: true, // Include all flight classes associated with each flight
      },
    });

    // Return the retrieved flights with a success message
    return res.status(200).json({
      status: true,
      message: "Successfully get data",
      data: {
        flights,
      },
    });
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};

// function generate flights
exports.generateFlights = async (req, res) => {
  try {
    const { counter, start } = req.body;

    // Calling GenerateFlight function with parsed integer values of counter and start
    const generateFlight = await GenerateFlight(+counter, +start);

    // Logging the result of the GenerateFlight function call
    console.log(generateFlight);

    // Sending a success response with status 200
    return res.status(200).json({
      status: true,
      message: "OK",
      data: null, // Modify if data is expected to be returned
    });
  } catch (error) {
    // Logging any caught errors for debugging purposes
    console.log(error);

    // Sending an error response with status 400
    return res.status(400).json({
      status: false,
      message: "Failed",
      data: null,
    });
  }
};

