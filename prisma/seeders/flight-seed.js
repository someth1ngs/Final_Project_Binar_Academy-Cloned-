const { PrismaClient } = require("@prisma/client");
const { addingDays } = require("../../libs/date-fns");
const prisma = new PrismaClient();
async function FlightSeeder() {
  return new Promise(async (resolve, reject) => {
    const departureAt = addingDays(30, 10, 5);
    const arriveAt = addingDays(30, 11, 20);
    const return_departureAt = addingDays(37, 12, 10);
    const return_arriveAt = addingDays(37, 13, 5);
    try {
      const deleteFlight = await prisma.flight.deleteMany({});
      const generateFlightData = (planeData, airportData) => {
        const flightData = [];

        planeData.forEach((plane) => {
          // Choose random airports
          const fromAirport = airportData[Math.floor(Math.random() * airportData.length)];
          let toAirport;
          do {
            toAirport = airportData[Math.floor(Math.random() * airportData.length)];
          } while (toAirport.airport_code === fromAirport.airport_code);

          // Determine if it's a return flight
          const isReturn = Math.random() < 0.5; // 50% chance of being a return flight

          // Determine flight type
          const flightType = fromAirport.country === toAirport.country ? "DOMESTIC" : "INTERNATIONAL";

          flightData.push({
            plane_code: plane.plane_code,
            from_code: fromAirport.airport_code,
            to_code: toAirport.airport_code,
            departureAt: departureAt,
            arriveAt: arriveAt,
            is_return: isReturn,
            return_departureAt: isReturn ? return_departureAt : null,
            return_arriveAt: isReturn ? return_arriveAt : null,
            flight_type: flightType,
          });
        });

        return flightData;
      };
      const planeData = await prisma.plane.findMany({});
      const airportData = await prisma.airport.findMany({});
      const flightData = generateFlightData(planeData, airportData);

      for (item of flightData) {
        const getPlaneData = await prisma.plane.findUnique({
          where: {
            plane_code: item.plane_code,
          },
        });
        const flightCreate = await prisma.flight.create({
          data: {
            ...item,
            flight_classes: {
              create: [
                {
                  name: "ECONOMY",
                  price: 1000000,
                  available_seats: getPlaneData.economy_seat,
                },
                {
                  name: "PREMIUM_ECONOMY",
                  price: 2000000,
                  available_seats: getPlaneData.premium_economy_seat,
                },
                {
                  name: "BUSINESS",
                  price: 5000000,
                  available_seats: getPlaneData.business_seat,
                },
                {
                  name: "FIRST_CLASS",
                  price: 10000000,
                  available_seats: getPlaneData.first_class_seat,
                },
              ],
            },
          },
        });
      }
      resolve("Success create flight seeds");
    } catch (error) {
      reject(error.message);
    }
  });
}

module.exports = FlightSeeder;
