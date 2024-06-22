const { PrismaClient } = require("@prisma/client");
const UserSeeder = require("./user-seed");
const CategorySeeder = require("./category-seed");
const TaxSeeder = require("./tax-seed");
const AirportSeeder = require("./airport-seed");
const PlaneSeeder = require("./plane-seed");
const { FlightSeeder } = require("./flight-seed");
const prisma = new PrismaClient();

async function main() {
  const createUser = await UserSeeder();
  const createCategory = await CategorySeeder();
  const createTax = await TaxSeeder();
  const createAirport = await AirportSeeder();
  const createPlane = await PlaneSeeder();
  const createFlight = await FlightSeeder();

  console.log(createUser);
  console.log(createCategory);
  console.log(createTax);
  console.log(createAirport);
  console.log(createPlane);
  console.log(createFlight);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
