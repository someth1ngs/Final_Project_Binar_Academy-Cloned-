const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Function to calculate the total pricing of a flight
exports.getTotalPricing = async (req) => {
  try {
    // Destructure parameters from the request body
    const { flight_class_id, total_price, include_return, passengers } = req.body;

    // Fetch flight class details from the database
    const flight_class = await prisma.flight_Class.findUnique({
      where: {
        id: flight_class_id,
      },
      include: {
        flight: true,
      },
    });

    // Check if return flight is included but the flight doesn't have a return flight
    if (include_return == true && flight_class.flight.is_return == false) {
      throw new Error("It's received included return is true but the flight doesn't have return flight");
    }

    // Fetch child discount details from the database
    const child_discount = await prisma.category.findUnique({
      where: {
        type: "child",
      },
    });

    // Fetch tax details from the database
    const tax = await prisma.tax.findFirst();

    // Calculate the number of adult and child passengers
    const adult = passengers.filter((passenger) => passenger.category === "adult").length;
    const child = passengers.filter((passenger) => passenger.category === "child").length;

    // Calculate the price for adult passengers
    const adult_price = adult * flight_class.price;
    // Calculate the price for child passengers with discount
    const child_price = child != 0 ? child * (flight_class.price * ((100 - child_discount.discount) / 100)) : 0;

    // Calculate the ticket tax
    const ticket_tax = (adult_price + child_price) * (tax.percent / 100);

    // Calculate the total price
    const total = adult_price + child_price + ticket_tax;

    // If return flight is included, double the total price
    if (include_return) {
      return total * 2;
    }
    return total;
  } catch (error) {
    // Handle errors
    throw error;
  }
};
