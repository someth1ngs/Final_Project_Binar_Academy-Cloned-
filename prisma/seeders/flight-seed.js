// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
// async function FlightSeeder() {
//   return new Promise(async (resolve, reject) => {
//     let data = [
//       {
//         plane_code:'',
//         from_code:"",
//         to_code:"",
//         departureAt:Date.now(),
//         arriveAt:Date.now(),
//         is_return:true,
//         return_departureAt:
//         return_arriveAt:
//         flight_type:"DOMESTIC"
//       },
//       {
//         plane_code:'',
//         from_code:"",
//         to_code:"",
//         departureAt:Date.now(),
//         arriveAt:Date.now(),
//         is_return:true,
//         return_departureAt:
//         return_arriveAt:
//         flight_type:"INTERNATIONAL",
//         flight_classes:{
//             create:[
//                 {
//                     name:"ECONOMY",
//                     price:1500000,
//                     availabe_seats: 50,
//                 }
//             ]
//         }
//       },
//     ];
//     try {
//       const deleteFlight = await prisma.flight.deleteMany({});
//       const flightCreate = await prisma.flight.create({
//         data:{
//             plane:{
//                 create:[
//                     {}
//                 ]
//             }

//         }
//       })
//       resolve("Success create category seeds");
//     } catch (error) {
//       reject(error.message);
//     }
//   });
// }

// module.exports = FlightSeeder;
