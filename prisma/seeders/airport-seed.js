const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function AirportSeeder() {
  return new Promise(async (resolve, reject) => {
    let data = [
      {
        name: "Soekarno-Hatta International Airport",
        city: "Jakarta",
        country: "Indonesia",
        airport_code: "CGK",
      },
      {
        name: "Ngurah Rai International Airport",
        city: "Denpasar",
        country: "Indonesia",
        airport_code: "DPS",
      },
      {
        name: "Juanda International Airport",
        city: "Surabaya",
        country: "Indonesia",
        airport_code: "SUB",
      },
      {
        name: "Sultan Hasanuddin International Airport",
        city: "Makassar",
        country: "Indonesia",
        airport_code: "UPG",
      },
      {
        name: "Kuala Namu International Airport",
        city: "Medan",
        country: "Indonesia",
        airport_code: "KNO",
      },
      {
        name: "Sultan Aji Muhammad Sulaiman Airport",
        city: "Balikpapan",
        country: "Indonesia",
        airport_code: "BPN",
      },
      {
        name: "Adisucipto International Airport",
        city: "Yogyakarta",
        country: "Indonesia",
        airport_code: "JOG",
      },
      {
        name: "Hang Nadim International Airport",
        city: "Batam",
        country: "Indonesia",
        airport_code: "BTH",
      },
      {
        name: "Halim Perdanakusuma International Airport",
        city: "Jakarta",
        country: "Indonesia",
        airport_code: "HLP",
      },
      {
        name: "Ahmad Yani International Airport",
        city: "Semarang",
        country: "Indonesia",
        airport_code: "SRG",
      },
      {
        name: "Los Angeles International Airport",
        city: "Los Angeles",
        country: "United States",
        airport_code: "LAX",
      },
      {
        name: "Heathrow Airport",
        city: "London",
        country: "United Kingdom",
        airport_code: "LHR",
      },
      {
        name: "Haneda Airport",
        city: "Tokyo",
        country: "Japan",
        airport_code: "HND",
      },
      {
        name: "Charles de Gaulle Airport",
        city: "Paris",
        country: "France",
        airport_code: "CDG",
      },
      {
        name: "Sydney Kingsford Smith Airport",
        city: "Sydney",
        country: "Australia",
        airport_code: "SYD",
      },
      {
        name: "Dubai International Airport",
        city: "Dubai",
        country: "United Arab Emirates",
        airport_code: "DXB",
      },
      {
        name: "Frankfurt Airport",
        city: "Frankfurt",
        country: "Germany",
        airport_code: "FRA",
      },
      {
        name: "Changi Airport",
        city: "Singapore",
        country: "Singapore",
        airport_code: "SIN",
      },
      {
        name: "Hong Kong International Airport",
        city: "Hong Kong",
        country: "Hong Kong",
        airport_code: "HKG",
      },
      {
        name: "Incheon International Airport",
        city: "Seoul",
        country: "South Korea",
        airport_code: "ICN",
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
