const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function UserSeeder() {
  return new Promise(async (resolve, reject) => {
    let data = [
      {
        name: "Admin",
        email: "admin@admin.com",
        password: await bcrypt.hash("admin123", 10),
        role: "ADMIN",
        is_verified: true,
        profile: {
          create: {
            address: "Jalan admin",
            phone: "1234567890",
            occupation: "Administrator",
            birthdate: new Date('2000-01-01'),
          },
        },
      },
      {
        name: "User",
        email: "user@user.com",
        password: await bcrypt.hash("user123", 10),
        role: "USER",
        is_verified: true,
        profile: {
          create: {
            address: "Jalan user",
            phone: "0987654321",
            occupation: "User",
            birthdate: new Date('2010-10-10'),
          },
        },
      },
    ];
    try {
      const deleteUser = await prisma.user.deleteMany({});

      for (item of data) {
        await prisma.user.create({
          data: item,
          include: {
            profile: true,
          },
        });
      }
      resolve("Success create user seeds");
    } catch (error) {
      reject(error.message);
    }
  });
}

module.exports = UserSeeder;
