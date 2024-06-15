const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getTotalPricing = async (req) => {
  try {
    const { flight_class_id, total_price, include_return, passengers } = req.body;
    const flight_class = await prisma.flight_Class.findUnique({
      where: {
        id: flight_class_id,
      },
      include: {
        flight: true,
      },
    });

    if (include_return == true && flight_class.flight.is_return == false) {
      throw new Error("Its received included return is true but the flight doesnt have return flight");
    }

    const child_discount = await prisma.category.findUnique({
      where: {
        type: "child",
      },
    });

    const tax = await prisma.tax.findFirst();

    const adult = passengers.filter((passenger) => passenger.category === "adult").length;
    const child = passengers.filter((passenger) => passenger.category === "child").length;

    const adult_price = adult * flight_class.price;
    const child_price = child != 0 ? child * (flight_class.price * ((100 - child_discount.discount) / 100)) : 0;

    const ticket_tax = (adult_price + child_price) * (tax.percent / 100);

    const total = adult_price + child_price + ticket_tax;

    if (include_return) {
      return total * 2;
    }
    return total;
  } catch (error) {
    throw error;
  }
};
