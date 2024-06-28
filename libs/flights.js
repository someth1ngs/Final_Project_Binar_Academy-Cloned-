exports.filterFlight = async (req) => {
  // Destructure query parameters from the request
  const { from: from_code, to: to_code, d: departureAt, rt: is_return, rd: return_departureAt, p: passengers = 1, sc: seat_class } = req.query;

  // Check for required fields: from_code and seat_class
  if (!from_code || !seat_class) {
    // Throw an error if required fields are missing
    throw {
      statusCode: 400,
      status: false,
      message: "Missing required field",
      data: null,
    };
  }

  // Initialize the filtering conditions with from_code, seat_class, and available seats
  const where = {
    flight: {
      from_code: from_code,
    },
    name: seat_class,
    available_seats: {
      gte: +passengers,
    },
  };

  // If a destination code is provided, add it to the filter conditions
  if (to_code) {
    where.flight = {
      to_code: to_code,
      ...where.flight,
    };
  }

  // If a departure date is provided, add it to the filter conditions
  if (departureAt) {
    // Set the start and end of the departure day
    const startOfDay = new Date(departureAt);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(departureAt);
    endOfDay.setHours(23, 59, 59, 999);

    // Add the departure date range to the filter conditions
    where.flight = {
      departureAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
      ...where.flight,
    };
  }

  // If it's a return flight, validate and add the return date to the filter conditions
  if (is_return == "true") {
    // Check if the return departure date is provided
    if (!return_departureAt) {
      // Throw an error if the return date is missing
      throw {
        statusCode: 400,
        status: false,
        message: "Please include return date",
        data: null,
      };
    }

    // Set the start and end of the return departure day
    const startOfDay = new Date(return_departureAt);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(return_departureAt);
    endOfDay.setHours(23, 59, 59, 999);

    // Add the return date range and return flag to the filter conditions
    where.flight = {
      is_return: true,
      return_departureAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
      ...where.flight,
    };
  }

  // Return the filter conditions
  return where;
};

exports.filterOrderFlight = async (req) => {
  // Destructure query parameters from the request with default values
  const { type = "price", order = "asc" } = req.query;
  let orderBy;

  // Check if the order value is either 'desc' or 'asc'
  if (order !== "desc" && order !== "asc") {
    // Throw an error if the order value is invalid
    throw {
      statusCode: 400,
      status: false,
      message: "Order must be desc or asc",
      data: null,
    };
  }

  // Determine the order by type and set the corresponding field for ordering
  switch (type) {
    case "price":
      // Set order by price
      orderBy = [
        {
          price: order,
        },
      ];
      break;
    case "arrive_at":
      // Set order by arrival time
      orderBy = [
        {
          flight: {
            arriveAt: order,
          },
        },
      ];
      break;
    case "departure_at":
      // Set order by departure time
      orderBy = [
        {
          flight: {
            departureAt: order,
          },
        },
      ];
      break;
    default:
      // No action for unspecified types
      break;
  }

  // Return the order by conditions
  return orderBy;
};
