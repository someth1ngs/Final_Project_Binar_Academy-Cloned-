const { PrismaClient } = require("@prisma/client");
const { addingDays } = require("../../libs/date-fns");
const prisma = new PrismaClient();
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
exports.FlightSeeder = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const deleteFlight = await prisma.flight.deleteMany({});
      let flightData;

      const planeData = await prisma.plane.findMany({});
      const airportData = await prisma.airport.findMany({});

      for (let i = 0; i <= 30; i + 2) {
        flightData = generateFlightData(planeData, airportData, i);
      }

      for (item of flightData) {
        const flightCreate = await prisma.flight.create({
          data: {
            ...item,
          },
        });
      }
      resolve("Success create flight seeds");
    } catch (error) {
      reject(error.message);
    }
  });
};

exports.GenerateFlight = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let flightData;

      const planeData = await prisma.plane.findMany({});
      const airportData = await prisma.airport.findMany({});

      for (let i = 0; i <= 30; i + 2) {
        flightData = generateFlightData(planeData, airportData, i);
      }

      for (item of flightData) {
        const flightCreate = await prisma.flight.create({
          data: {
            ...item,
          },
        });
      }
      resolve("Success create flight seeds");
    } catch (error) {
      reject(error.message);
    }
  });
};

const generateFlightData = (planeData, airportData, addDays) => {
  const flightData = [];
  planeData.forEach((plane) => {
    const hour = randomNumber(1, 23);
    const hour2 = randomNumber(1, 23);
    const minute = randomNumber(1, 60);
    const minute2 = randomNumber(1, 60);
    const departureAt = addingDays(7 + addDays, hour, minute);
    const arriveAt = addingDays(7 + addDays, hour + randomNumber(1, 23), minute + randomNumber(1, 60));
    const return_departureAt = addingDays(37 + addDays, hour2, minute2);
    const return_arriveAt = addingDays(37 + addDays, hour2 + randomNumber(1, 23), minute2 + randomNumber(1, 60));
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
      flight_classes: {
        create: [
          {
            name: "ECONOMY",
            price: Math.floor(randomNumber(10, 20)) * 100000,
            available_seats: plane.economy_seat,
          },
          {
            name: "PREMIUM_ECONOMY",
            price: Math.floor(randomNumber(20, 40)) * 100000,
            available_seats: plane.premium_economy_seat,
          },
          {
            name: "BUSINESS",
            price: Math.floor(randomNumber(50, 70)) * 100000,
            available_seats: plane.business_seat,
          },
          {
            name: "FIRST_CLASS",
            price: Math.floor(randomNumber(80, 100)) * 100000,
            available_seats: plane.first_class_seat,
          },
        ],
      },
    });
    return flightData;
  });

  return;
};
