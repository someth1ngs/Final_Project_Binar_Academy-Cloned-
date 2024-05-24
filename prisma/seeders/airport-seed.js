const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function AirportSeeder() {
  return new Promise(async (resolve, reject) => {
    let data = [
      {
        name: "Soekarno-Hatta International Airport",
        city: "Jakarta",
        country: "Indonesia",
      },
      {
        name: "Ngurah Rai International Airport",
        city: "Denpasar",
        country: "Indonesia",
      },
      {
        name: "Juanda International Airport",
        city: "Surabaya",
        country: "Indonesia",
      },
      {
        name: "Sultan Hasanuddin International Airport",
        city: "Makassar",
        country: "Indonesia",
      },
      {
        name: "Kuala Namu International Airport",
        city: "Medan",
        country: "Indonesia",
      },
      {
        name: "Sultan Aji Muhammad Sulaiman Airport",
        city: "Balikpapan",
        country: "Indonesia",
      },
      {
        name: "Adisucipto International Airport",
        city: "Yogyakarta",
        country: "Indonesia",
      },
      {
        name: "Hang Nadim International Airport",
        city: "Batam",
        country: "Indonesia",
      },
      {
        name: "Halim Perdanakusuma International Airport",
        city: "Jakarta",
        country: "Indonesia",
      },
      {
        name: "Ahmad Yani International Airport",
        city: "Semarang",
        country: "Indonesia",
      },
      {
        name: "Los Angeles International Airport",
        city: "Los Angeles",
        country: "United States",
      },
      {
        name: "Heathrow Airport",
        city: "London",
        country: "United Kingdom",
      },
      {
        name: "Haneda Airport",
        city: "Tokyo",
        country: "Japan",
      },
      {
        name: "Charles de Gaulle Airport",
        city: "Paris",
        country: "France",
      },
      {
        name: "Sydney Kingsford Smith Airport",
        city: "Sydney",
        country: "Australia",
      },
      {
        name: "Dubai International Airport",
        city: "Dubai",
        country: "United Arab Emirates",
      },
      {
        name: "Frankfurt Airport",
        city: "Frankfurt",
        country: "Germany",
      },
      {
        name: "Changi Airport",
        city: "Singapore",
        country: "Singapore",
      },
      {
        name: "Hong Kong International Airport",
        city: "Hong Kong",
        country: "Hong Kong",
      },
      {
        name: "Incheon International Airport",
        city: "Seoul",
        country: "South Korea",
      },
    ];

    try {
      const deleteAirport = await prisma.airport.deleteMany({});
      const airportCreate = await prisma.airport.createMany({
        data: data,
      });
      resolve("Success create airport seeds");
    } catch (error) {
      reject(error.message);
    }
  });
}

module.exports = AirportSeeder;
