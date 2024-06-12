exports.filterFlight = async (req) => {
  const { from: from_code, to: to_code, d: departureAt, rt: is_return, rd: return_departureAt, p: passengers = 1, sc: seat_class } = req.query;

  if (!from_code || !seat_class) {
    throw {
      statusCode: 400,
      status: false,
      message: "Missing required field",
      data: null,
    };
  }

  const where = {
    flight: {
      from_code: from_code,
    },
    name: seat_class,
    available_seats: {
      gte: +passengers,
    },
  };
  if (to_code) {
    where.flight = {
      to_code: to_code,
      ...where.flight,
    };
  }

  if (departureAt) {
    const startOfDay = new Date(departureAt);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(departureAt);
    endOfDay.setHours(23, 59, 59, 999);
    where.flight = {
      departureAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
      ...where.flight,
    };
  }

  if (is_return == "true") {
    if (!return_departureAt) {
      throw {
        statusCode: 400,
        status: false,
        message: "Please include return date",
        data: null,
      };
    }
    const startOfDay = new Date(return_departureAt);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(return_departureAt);
    endOfDay.setHours(23, 59, 59, 999);

    where.flight = {
      is_return: true,
      return_departureAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
      ...where.flight,
    };
  }

  return where;
};

exports.filterOrderFlight = async (req) => {
  const { type = "price", order = "asc" } = req.query;
  let orderBy;

  if (order !== "desc" && order !== "asc") {
    throw {
      statusCode: 400,
      status: false,
      message: "Order must be desc or asc",
      data: null,
    };
  }

  switch (type) {
    case "price":
      orderBy = [
        {
          price: order,
        },
      ];
      break;
    case "arrive_at":
      orderBy = [
        {
          flight: {
            arriveAt: order,
          },
        },
      ];
      break;
    case "departure_at":
      orderBy = [
        {
          flight: {
            departureAt: order,
          },
        },
      ];
      break;
    default:
      break;
  }
  return orderBy;
};
