const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
function randomNumber(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}
async function AirportSeeder() {
  return new Promise(async (resolve, reject) => {
    let data = [
      {
        name: "Soekarno-Hatta International Airport",
        city: "Jakarta",
        country: "Indonesia",
        airport_code: "CGK",
        image_url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/c3/d2/54/jakarta-amazing-tour.jpg?w=600&h=500&s=1",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Ngurah Rai International Airport",
        city: "Denpasar",
        country: "Indonesia",
        airport_code: "DPS",
        image_url: "https://asset.kompas.com/crops/fhyXeS2borIrSmZbPebufHwNVdQ=/12x8:993x662/750x500/data/photo/2018/09/27/1679906755.jpg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Juanda International Airport",
        city: "Surabaya",
        country: "Indonesia",
        airport_code: "SUB",
        image_url: "https://img2.beritasatu.com/cache/beritasatu/910x580-2/981467356432.jpg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Sultan Hasanuddin International Airport",
        city: "Makassar",
        country: "Indonesia",
        airport_code: "UPG",
        image_url: "https://www.99.co/id/panduan/wp-content/uploads/2022/11/apartemen-di-makassar-1000x630.jpg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Kuala Namu International Airport",
        city: "Medan",
        country: "Indonesia",
        airport_code: "KNO",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Masjid_Raya_Al_Mashun_Medan.jpg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Sultan Aji Muhammad Sulaiman Airport",
        city: "Balikpapan",
        country: "Indonesia",
        airport_code: "BPN",
        image_url: "https://investasiproperti.id/wp-content/uploads/2023/03/alasan-tinggal-di-balikpapan.jpg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Adisucipto International Airport",
        city: "Yogyakarta",
        country: "Indonesia",
        airport_code: "JOG",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Yogyakarta_Indonesia_Tugu-Yogyakarta-02.jpg/1200px-Yogyakarta_Indonesia_Tugu-Yogyakarta-02.jpg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Hang Nadim International Airport",
        city: "Batam",
        country: "Indonesia",
        airport_code: "BTH",
        image_url: "https://investasiproperti.id/wp-content/uploads/2023/04/jembatan-di-batam.jpg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Halim Perdanakusuma International Airport",
        city: "Jakarta",
        country: "Indonesia",
        airport_code: "HLP",
        image_url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/c3/d2/54/jakarta-amazing-tour.jpg?w=600&h=500&s=1",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Ahmad Yani International Airport",
        city: "Semarang",
        country: "Indonesia",
        airport_code: "SRG",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Lawang_Sewu_in_Semarang_City.jpg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Los Angeles International Airport",
        city: "Los Angeles",
        country: "United States",
        airport_code: "LAX",
        image_url: "https://a.travel-assets.com/findyours-php/viewfinder/images/res70/475000/475464-Los-Angeles.jpg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Heathrow Airport",
        city: "London",
        country: "United Kingdom",
        airport_code: "LHR",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/640px-London_Skyline_%28125508655%29.jpeg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Haneda Airport",
        city: "Tokyo",
        country: "Japan",
        airport_code: "HND",
        image_url: "https://media.nomadicmatt.com/2024/tokyothings.jpeg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Charles de Gaulle Airport",
        city: "Paris",
        country: "France",
        airport_code: "CDG",
        image_url: "https://cdn1.sisiplus.co.id/media/sisiplus/asset/uploads/artikel/g2OEbKl2aTEIp1x5hFNYEE9ad615uVenBexDAcVW.jpg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Sydney Kingsford Smith Airport",
        city: "Sydney",
        country: "Australia",
        airport_code: "SYD",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/640px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Dubai International Airport",
        city: "Dubai",
        country: "United Arab Emirates",
        airport_code: "DXB",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Dubai_Skylines_at_night_%28Pexels_3787839%29.jpg/640px-Dubai_Skylines_at_night_%28Pexels_3787839%29.jpg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Frankfurt Airport",
        city: "Frankfurt",
        country: "Germany",
        airport_code: "FRA",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Skyline_Frankfurt_am_Main_2015.jpg/1200px-Skyline_Frankfurt_am_Main_2015.jpg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Changi Airport",
        city: "Singapore",
        country: "Singapore",
        airport_code: "SIN",
        image_url: "https://smansasingaraja.sch.id/wp-content/uploads/2021/09/singapore-1-960x600-1.jpg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Hong Kong International Airport",
        city: "Hong Kong",
        country: "Hong Kong",
        airport_code: "HKG",
        image_url: "https://www.agoda.com/wp-content/uploads/2024/02/Featured-image-Hong-Kong-skyline-from-Kow-Loon-1244x700.jpg",
        visited: randomNumber(200, 1000),
      },
      {
        name: "Incheon International Airport",
        city: "Seoul",
        country: "South Korea",
        airport_code: "ICN",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Seoul_%28175734251%29.jpeg/640px-Seoul_%28175734251%29.jpeg",
        visited: randomNumber(200, 1000),
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
