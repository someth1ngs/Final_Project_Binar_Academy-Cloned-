const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function PlaneSeeder() {
  return new Promise(async (resolve, reject) => {
    let data = [
      {
        plane_code: "GD-105",
        airline: "Garuda Indonesia",
        economy_seat: 50,
        premium_economy_seat: 15,
        business_seat: 5,
        first_class_seat: 7,
      },
      {
        plane_code: "LA-202",
        airline: "Lion Air",
        economy_seat: 60,
        premium_economy_seat: 20,
        business_seat: 10,
        first_class_seat: 7,
      },
      {
        plane_code: "SJ-303",
        airline: "Sriwijaya Air",
        economy_seat: 55,
        premium_economy_seat: 15,
        business_seat: 5,
        first_class_seat: 7,
      },
      {
        plane_code: "IA-404",
        airline: "Indonesia AirAsia",
        economy_seat: 70,
        premium_economy_seat: 20,
        business_seat: 10,
        first_class_seat: 7,
      },
      {
        plane_code: "BA-505",
        airline: "Batik Air",
        economy_seat: 60,
        premium_economy_seat: 20,
        business_seat: 10,
        first_class_seat: 7,
      },
      {
        plane_code: "CT-606",
        airline: "Citilink",
        economy_seat: 50,
        premium_economy_seat: 10,
        business_seat: 10,
        first_class_seat: 7,
      },
      {
        plane_code: "TS-707",
        airline: "TransNusa",
        economy_seat: 55,
        premium_economy_seat: 20,
        business_seat: 10,
        first_class_seat: 7,
      },
      {
        plane_code: "SP-808",
        airline: "Susi Air",
        economy_seat: 40,
        premium_economy_seat: 10,
        business_seat: 10,
        first_class_seat: 7,
      },
      {
        plane_code: "MG-909",
        airline: "NAM Air",
        economy_seat: 60,
        premium_economy_seat: 20,
        business_seat: 10,
        first_class_seat: 7,
      },
      {
        plane_code: "KV-1010",
        airline: "Wings Air",
        economy_seat: 50,
        premium_economy_seat: 15,
        business_seat: 5,
        first_class_seat: 7,
      },
      {
        plane_code: "AA-1111",
        airline: "American Airlines",
        economy_seat: 50,
        premium_economy_seat: 15,
        business_seat: 5,
        first_class_seat: 7,
      },
      {
        plane_code: "BA-1212",
        airline: "British Airways",
        economy_seat: 50,
        premium_economy_seat: 20,
        business_seat: 10,
        first_class_seat: 7,
      },
      {
        plane_code: "EM-1313",
        airline: "Emirates",
        economy_seat: 60,
        premium_economy_seat: 20,
        business_seat: 10,
        first_class_seat: 7,
      },
      {
        plane_code: "SQ-1414",
        airline: "Singapore Airlines",
        economy_seat: 50,
        premium_economy_seat: 15,
        business_seat: 5,
        first_class_seat: 7,
      },
      {
        plane_code: "QF-1515",
        airline: "Qantas",
        economy_seat: 55,
        premium_economy_seat: 20,
        business_seat: 10,
        first_class_seat: 7,
      },
      {
        plane_code: "LH-1616",
        airline: "Lufthansa",
        economy_seat: 60,
        premium_economy_seat: 20,
        business_seat: 10,
        first_class_seat: 7,
      },
      {
        plane_code: "AF-1717",
        airline: "Air France",
        economy_seat: 55,
        premium_economy_seat: 15,
        business_seat: 10,
        first_class_seat: 7,
      },
      {
        plane_code: "KE-1818",
        airline: "Korean Air",
        economy_seat: 60,
        premium_economy_seat: 20,
        business_seat: 10,
        first_class_seat: 7,
      },
      {
        plane_code: "JL-1919",
        airline: "Japan Airlines",
        economy_seat: 50,
        premium_economy_seat: 20,
        business_seat: 10,
        first_class_seat: 7,
      },
      {
        plane_code: "CX-2020",
        airline: "Cathay Pacific",
        economy_seat: 55,
        premium_economy_seat: 20,
        business_seat: 10,
        first_class_seat: 7,
      },
    ];

    try {
      const deletePLane = await prisma.plane.deleteMany({});
      const planeCreate = await prisma.plane.createMany({
        data: data,
      });
      resolve("Success create plane seeds");
    } catch (error) {
      reject(error.message);
    }
  });
}

module.exports = PlaneSeeder;
